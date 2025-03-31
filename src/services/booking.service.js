const { status: httpStatus } = require("http-status");
const { Room, Booking } = require("../models");
const { ApiError, logger, helpers } = require("../utils");
const { constants } = require("../config");

const createBooking = async (bookingBody) => {
  const { name, email, checkIn, checkOut } = bookingBody;
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (checkInDate >= checkOutDate) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Check-out date must be after check-in date");
  }

  // Find existing bookings that overlap with the requested dates
  const allRooms = await Room.find();
  const existingBookings = await Booking.find({
    $or: [
      {
        checkInDate: { $lt: checkOutDate },
        checkOutDate: { $gt: checkInDate },
        status: constants.bookingStatus.CONFIRMED,
      },
    ],
  });

  const existingGuestBooking = existingBookings.filter((booking) => booking.email === email);
  if (existingGuestBooking.length) {
    const roomIds = existingBookings.map((booking) => booking.roomId.toString());
    const bookedRooms = await Room.find({ _id: { $in: roomIds } });
    const bookedRoomNumbers = [...new Set(bookedRooms.map((room) => room.roomNumber))].join(", ");
    throw new ApiError(httpStatus.BAD_REQUEST, `Room ${bookedRoomNumbers} already booked`);
  }

  // Find an available room
  const bookedRoomIds = existingBookings.map((booking) => booking.roomId.toString());
  const availableRoom = allRooms.find((room) => !bookedRoomIds.includes(room.id.toString()));

  if (!availableRoom) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No rooms available for the selected dates");
  }

  // Create booking
  const booking = new Booking({
    roomId: availableRoom.id,
    name,
    email,
    checkInDate,
    checkOutDate,
  });

  await booking.save();
  logger.info(`Booking ${booking.id} created for ${availableRoom.roomNumber}`);

  // Calculate stay duration in days
  const oneDayInMs = 1000 * 60 * 60 * 24;
  const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
  const stayDuration = Math.ceil(timeDiff / oneDayInMs);
  const stayDurationStringified = `${stayDuration} day${stayDuration === 1 ? "" : "s"}`;

  return {
    bookingId: booking.id,
    roomNumber: availableRoom.roomNumber,
    name,
    email,
    checkInDate,
    checkOutDate,
    stayDuration: stayDurationStringified,
  };
};

const getBookings = async (bookingQuery) => {
  const { email } = bookingQuery;

  const bookings = await Booking.find({ email });
  if (!bookings.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No Bookings found!");
  }

  const bookedRoomIds = bookings.map((booking) => booking.roomId.toString());
  const bookedRooms = await Room.find({ _id: { $in: bookedRoomIds } });

  const constructedBooking = bookings.map((booking) => {
    const { roomId, name, email, checkInDate, checkOutDate, status } = booking;

    // Calculate stay duration in days
    const oneDayInMs = 1000 * 60 * 60 * 24;
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const stayDuration = Math.ceil(timeDiff / oneDayInMs);
    const stayDurationStringified = `${stayDuration} day${stayDuration === 1 ? "" : "s"}`;

    const bookedRoom = bookedRooms.find((room) => room._id.toString() === roomId.toString());
    return {
      bookingId: booking.id,
      roomNumber: bookedRoom.roomNumber,
      name,
      email,
      checkInDate,
      checkOutDate,
      status,
      stayDuration: stayDurationStringified,
    };
  });

  return constructedBooking;
};

const getOngoingBookings = async () => {
  const today = new Date();
  const bookings = await Booking.find({ checkInDate: { $lte: today }, checkOutDate: { $gt: today } });
  if (!bookings.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No Bookings found!");
  }

  const bookedRoomIds = bookings.map((booking) => booking.roomId.toString());
  const bookedRooms = await Room.find({ _id: { $in: bookedRoomIds } });

  const constructedBooking = bookings.map((booking) => {
    const { roomId, name, email, checkInDate, checkOutDate, status } = booking;

    // Calculate stay duration in days
    const oneDayInMs = 1000 * 60 * 60 * 24;
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const stayDuration = Math.ceil(timeDiff / oneDayInMs);
    const stayDurationStringified = `${stayDuration} day${stayDuration === 1 ? "" : "s"}`;

    const bookedRoom = bookedRooms.find((room) => room._id.toString() === roomId.toString());
    return {
      bookingId: booking.id,
      roomNumber: bookedRoom.roomNumber,
      name,
      email,
      checkInDate,
      checkOutDate,
      status,
      stayDuration: stayDurationStringified,
    };
  });

  return constructedBooking;
};

const cancelBooking = async (bookingBody) => {
  const { email, roomNumber } = bookingBody;
  const today = new Date();
  const bookings = await Booking.find({
    status: constants.bookingStatus.CONFIRMED,
    checkInDate: { $lte: today },
    checkOutDate: { $gt: today },
  });

  const room = await Room.findOne({ roomNumber });
  const booking = await Booking.findOne({ email, roomId: room.id });

  const isOngoingBooking = bookings.filter((b) => b.id.toString() === booking.id.toString()).length > 0;
  if (isOngoingBooking) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Can't cancel ongoing booking");
  }

  booking.status = constants.bookingStatus.CANCELLED;
  await booking.save();

  const responseMessage = `Booking for room number ${room.roomNumber} cancelled by ${booking.email}`;
  logger.info(responseMessage);
  return { message: responseMessage };
};

const modifyBooking = async (bookingBody) => {
  const { email, roomNumber, checkIn, checkOut } = bookingBody;
  const checkInDate = checkIn ? new Date(checkIn) : null;
  const checkOutDate = checkOut ? new Date(checkOut) : null;

  const room = await Room.findOne({ roomNumber });
  if (!room) {
    throw new ApiError(httpStatus.NOT_FOUND, `Room ${roomNumber} not found`);
  }

  const booking = await Booking.findOne({ email, roomId: room.id });
  if (!booking) {
    throw new ApiError(httpStatus.NOT_FOUND, "Booking not found");
  }

  const today = new Date();

  if (booking.checkInDate <= today && booking.checkOutDate > today) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Can't modify an ongoing booking");
  }

  const conflictingBooking = await Booking.findOne({
    roomId: room.id,
    checkInDate: { $lt: checkOutDate || booking.checkOutDate },
    checkOutDate: { $gt: checkInDate || booking.checkInDate },
    status: constants.bookingStatus.CONFIRMED,
    _id: { $ne: booking.id }, // Exclude the current booking
  });

  if (conflictingBooking) {
    const allRooms = await Room.find();
    const bookedRoomIds = (
      await Booking.find({
        checkInDate: { $lt: checkOutDate || booking.checkOutDate },
        checkOutDate: { $gt: checkInDate || booking.checkInDate },
        status: constants.bookingStatus.CONFIRMED,
      })
    ).map((b) => b.roomId.toString());

    const availableRoom = allRooms.find((r) => !bookedRoomIds.includes(r.id.toString()));

    if (!availableRoom) {
      throw new ApiError(httpStatus.BAD_REQUEST, "No available rooms for the selected dates");
    }

    booking.roomId = availableRoom.id;
  }

  if (checkInDate) booking.checkInDate = checkInDate;
  if (checkOutDate) booking.checkOutDate = checkOutDate;
  await booking.save();

  let responseMessage = `Booking updated`;
  logger.info(responseMessage);
  return { message: responseMessage };
};

module.exports = {
  createBooking,
  getBookings,
  getOngoingBookings,
  cancelBooking,
  modifyBooking,
};

const { status: httpStatus } = require("http-status");
const { bookingService } = require("../services");
const { ApiError, helpers } = require("../utils");

const createBooking = helpers.catchAsync(async (req, res) => {
  const booking = await bookingService.createBooking(req.body);
  return res.status(httpStatus.CREATED).send(booking);
});

const getBookings = helpers.catchAsync(async (req, res) => {
  const bookings = await bookingService.getBookings(req.query);
  return res.status(httpStatus.FOUND).send(bookings);
});

const getOngoingBookings = helpers.catchAsync(async (req, res) => {
  const bookings = await bookingService.getOngoingBookings(req.query);
  return res.status(httpStatus.FOUND).send(bookings);
});

const cancelBooking = helpers.catchAsync(async (req, res) => {
  const bookings = await bookingService.cancelBooking(req.body);
  return res.status(httpStatus.FOUND).send(bookings);
});

const modifyBooking = helpers.catchAsync(async (req, res) => {
  const bookings = await bookingService.modifyBooking(req.body);
  return res.status(httpStatus.FOUND).send(bookings);
});

module.exports = {
  createBooking,
  getBookings,
  getOngoingBookings,
  cancelBooking,
  modifyBooking,
};

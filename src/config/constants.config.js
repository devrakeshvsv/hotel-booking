const bookingStatus = {
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
};

const enums = {
  bookingStatus: Object.values(bookingStatus),
};

module.exports = {
  bookingStatus,
  enums,
};

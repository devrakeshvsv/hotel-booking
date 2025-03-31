const Joi = require("joi");

const createBooking = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    checkIn: Joi.date().required(),
    checkOut: Joi.date().required(),
  }),
};

const getBookings = {
  query: Joi.object().keys({
    email: Joi.string().required().email(),
  }),
};

const cancelBooking = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    roomNumber: Joi.number().required(),
  }),
};

const modifyBooking = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    roomNumber: Joi.number().required(),
    checkIn: Joi.date().optional(),
    checkOut: Joi.date().optional(),
  }),
};

module.exports = {
  createBooking,
  getBookings,
  cancelBooking,
  modifyBooking,
};

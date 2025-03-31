const mongoose = require("mongoose");
const { constants } = require("../config");
const { toJSON } = require("./plugins");

const bookingSchema = new mongoose.Schema(
  {
    roomId: { type: mongoose.Types.ObjectId, ref: "Room", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    status: {
      type: String,
      enum: constants.enums.bookingStatus,
      default: constants.bookingStatus.CONFIRMED,
    },
  },
  { timestamps: true }
);

bookingSchema.plugin(toJSON);

const Booking = mongoose.model("Booking", bookingSchema, "bookings");
module.exports = Booking;

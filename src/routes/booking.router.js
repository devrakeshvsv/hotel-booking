const router = require("express").Router();
const { validatorMiddleware } = require("../middlewares");
const { bookingSchema } = require("../validation-schemas");
const { bookingController } = require("../controllers");

router.post("/", validatorMiddleware.validate(bookingSchema.createBooking), bookingController.createBooking);

router.get("/", validatorMiddleware.validate(bookingSchema.getBookings), bookingController.getBookings);

router.get("/ongoing-bookings", bookingController.getOngoingBookings);

router.patch("/cancel", validatorMiddleware.validate(bookingSchema.cancelBooking), bookingController.cancelBooking);

router.patch("/modify", validatorMiddleware.validate(bookingSchema.modifyBooking), bookingController.modifyBooking);

module.exports = router;

const router = require("express").Router();

const roomRouter = require("./room.router");
router.use("/rooms", roomRouter);

const bookingRouter = require("./booking.router");
router.use("/bookings", bookingRouter);

module.exports = router;

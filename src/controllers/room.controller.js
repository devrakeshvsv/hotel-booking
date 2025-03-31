const { status: httpStatus } = require("http-status");
const { roomService } = require("../services");
const { helpers } = require("../utils");

const initializeDummyRooms = helpers.catchAsync(async (req, res) => {
  const booking = await roomService.initializeDummyRooms(req.body);
  return res.status(httpStatus.CREATED).send(booking);
});

module.exports = {
  initializeDummyRooms,
};

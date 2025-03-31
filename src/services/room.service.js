const { Room } = require("../models");
const dummyRooms = require("../../dummyRooms.json");

const initializeDummyRooms = async () => {
  const rooms = await Room.insertMany(dummyRooms);
  return { message: "Rooms created succcessfully", data: rooms };
};

module.exports = {
  initializeDummyRooms,
};

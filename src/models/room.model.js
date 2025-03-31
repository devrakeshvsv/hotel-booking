const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: Number, required: true },
    description: { type: String },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
roomSchema.plugin(toJSON);

const Room = mongoose.model("Room", roomSchema, "rooms");
module.exports = Room;

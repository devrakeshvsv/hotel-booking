const router = require("express").Router();
const { roomController } = require("../controllers");

router.post("/init-rooms", roomController.initializeDummyRooms);

module.exports = router;

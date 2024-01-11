const express = require("express");
const router = express.Router();

const {
    getRooms,
    getRoomById,
    createRoom,
    editRoom,
} = require("../controllers/roomController.js");

router.get("/", getRooms);

router.get("/:roomID", getRoomById);

router.post("/", createRoom);

router.put("/:roomID", editRoom);

module.exports = router;

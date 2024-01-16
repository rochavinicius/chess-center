const express = require("express");
const router = express.Router();

const {
    getRooms,
    getRoomById,
    createRoom,
    editRoom,
    commandRoom,
} = require("../controllers/roomController.js");

router.get("/", getRooms);

router.get("/:roomId", getRoomById);

router.post("/", createRoom);

router.post("/:roomId", commandRoom);

router.put("/:roomId", editRoom);

export default router

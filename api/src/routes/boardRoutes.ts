const express = require("express");
const router = express.Router();

const {
    getBoards,
    getBoardById,
} = require("../controllers/boardController.js");

router.get("/", getBoards);

router.get("/:boardId", getBoardById);

export default router;

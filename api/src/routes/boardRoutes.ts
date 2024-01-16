const express = require("express");
const router = express.Router();

const {
    getBoard,
} = require("../controllers/boardController.js");

router.get("/", getBoard);

export default router;

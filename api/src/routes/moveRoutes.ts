const express = require("express");
const router = express.Router();

const {
    addMove,
    getMovesByBoardId,
    getMoveById,
} = require("../controllers/moveController.js");

router.post("/", addMove);
router.get("/board/:boardId", getMovesByBoardId);
router.get("/:moveId", getMoveById);

export default router;

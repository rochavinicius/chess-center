const express = require("express");
const router = express.Router();

const {
    addMove,
    getMovesByBoardId,
    getMoveById,
} = require("../controllers/moveController.js");

router.post("/", addMove);
router.get("/:boardId", getMovesByBoardId);
router.get("/:id", getMoveById);

export default router;

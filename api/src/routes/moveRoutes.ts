import router from "./router"

const {
    addMove,
    getMovesByBoardId,
    getMoveById,
} = require("../controllers/moveController.js");

router.post("/", addMove);
router.get("/:boardId", getMovesByBoardId);
router.get("/:id", getMoveById);

module.exports = router;

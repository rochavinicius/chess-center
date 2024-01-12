import router from "./router"

const {
    getBoard,
} = require("../controllers/boardController.js");

router.get("/", getBoard);

module.exports = router;

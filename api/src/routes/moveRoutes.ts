import router from "./router"

const {
    getMoves,
} = require("../controllers/moveController.js");

router.get("/", getMoves);

module.exports = router;

import router from "./router";

const {
    getMatches,
    getMatchById,
    createMatch,
} = require("../controllers/matchController.js");

router.get("/", getMatches);

router.get("/:matchId", getMatchById);

router.post("/", createMatch);

module.exports = router;

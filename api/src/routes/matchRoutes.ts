import router from "./router"

const {
    getMatches,
    getMatchById,
    createMatch,
    editMatch,
} = require("../controllers/matchController.js");

router.get("/", getMatches);

router.get("/:matchId", getMatchById);

router.post("/", createMatch);

router.put("/:matchId", editMatch);

module.exports = router;

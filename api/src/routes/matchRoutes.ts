const {
    getMatches,
    getMatchesById,
    createMatch,
    editMatch,
} = require("../controllers/matchController.js");

router.get("/", getMatches);

router.get("/:matchID", getMatchesById);

router.post("/", createMatch);

router.put("/:matchID", editMatch);

module.exports = router;

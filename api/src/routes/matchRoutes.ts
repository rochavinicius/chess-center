// import router from "./router"
const express = require("express");
const router = express.Router();

const {
    getMatches,
    getMatchById,
    createMatch,
    commandMatch,
} = require("../controllers/matchController.js");

router.get("/", getMatches);

router.get("/:matchId", getMatchById);

router.post("/", createMatch);

router.post("/:matchId", commandMatch);

// module.exports = router;
export default router;

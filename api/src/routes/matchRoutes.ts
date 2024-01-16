// import router from "./router"
const express = require("express");
const router = express.Router();

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

// module.exports = router;
export default router;

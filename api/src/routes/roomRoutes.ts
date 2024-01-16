import router from "./router"

const {
    getRooms,
    getRoomById,
    createRoom,
    editRoom,
} = require("../controllers/roomController.js");

router.get("/", getRooms);

router.get("/:roomId", getRoomById);

router.post("/", createRoom);

router.put("/:roomId", editRoom);

module.exports = router;

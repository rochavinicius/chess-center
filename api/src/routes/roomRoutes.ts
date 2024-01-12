const {
    getRooms,
    getRoomById,
    createRoom,
    editRoom,
} = require("../controllers/roomController.js");

router.get("/", getRooms);

router.get("/:roomID", getRoomById);

router.post("/", createRoom);

router.put("/:roomID", editRoom);

module.exports = router;

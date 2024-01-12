// api/app.ts
import express from "express";

const app = express();
const room_routes = require('./routes/roomRoutes.js')
const match_routes = require('./routes/matchRoutes.js')
const board_routes = require('./routes/boardRoutes.js')
const move_routes = require('./routes/moveRoutes.js')

app.use(express.json())
app.use('/api/room', room_routes)
app.use('/api/match', match_routes)
app.use('/api/board', board_routes)
app.use('/api/move', move_routes)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`app listening on port ${PORT}`));
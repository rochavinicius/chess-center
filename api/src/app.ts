// api/app.ts
import express from "express";

const app = express();
const room_routes = require('./routes/roomRoutes.js')

app.use(express.json())
app.use('/api/room', room_routes)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`app listening on port ${PORT}`));
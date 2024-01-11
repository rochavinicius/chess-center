// api/server.ts
import express, { Request, Response } from "express";

const app = express();
const room_routes = require('./routes/roomRoutes.js')

app.get("/", function (req: Request, res: Response) {
  res.send({ name: "Jane Doe" });
});

app.listen(3000, () => {
  console.log("app listening on port 3000");
});

app.listen(5000, () => {
    console.log('server is listening on port 5000')
})

app.use(express.json())
app.use('/api/room', room_routes)
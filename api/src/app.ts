// api/app.ts
import express, { Request, Response, NextFunction } from "express";
import prisma from "../prisma/prisma";
import { exit } from "process";

const app = express();
const cors = require("cors");
const room_routes = require("./routes/roomRoutes.js");
const match_routes = require("./routes/matchRoutes.js");
const board_routes = require("./routes/boardRoutes.js");
const move_routes = require("./routes/moveRoutes.js");

async function main() {
    app.use(express.json());
    app.use(cors());
    app.use("/api/room", room_routes);
    app.use("/api/match", match_routes);
    app.use("/api/board", board_routes);
    app.use("/api/move", move_routes);

    // Catch unregistered routes
    app.all("*", (req: Request, res: Response, next: NextFunction) => {
        //var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        res.status(404).json({ error: `Route ${req.originalUrl} not found` });
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`app listening on port ${PORT}`));
}

main()
    .then(async () => {
        await prisma.$connect();
        console.log("db connected");
    })
    .catch(async (e) => {
        console.error("unpextected error: ", e);
        await prisma.$disconnect();
        exit(1);
    });

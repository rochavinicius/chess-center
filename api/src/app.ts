// api/app.ts
import express, { NextFunction, Request, Response } from "express";
import { exit } from "process";
import prisma from "../prisma/prisma";
import BoardRoutes from "./routes/boardRoutes";
import MatchRoutes from "./routes/matchRoutes";
import MoveRoutes from "./routes/moveRoutes";
import RoomRoutes from "./routes/roomRoutes";

const app = express();
const cors = require("cors");

async function main() {
    app.use(express.json());
    app.use(cors());
    app.use("/api/room", RoomRoutes);
    app.use("/api/match", MatchRoutes);
    app.use("/api/board", BoardRoutes);
    app.use("/api/move", MoveRoutes);

    // Catch unregistered routes
    app.all("*", (req: Request, res: Response, next: NextFunction) => {
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

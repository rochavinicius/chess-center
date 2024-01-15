import { Request, Response, NextFunction } from "express";
import { RoomModel } from "../models/roomModel";
import { MatchModel } from "../models/matchModel";
// import { MatchStatus } from "../models/enums";
import { MatchStatus } from "@prisma/client";
import { ReturnObj, isBlank } from "../util/utils";

const asyncHandler = require("express-async-handler");
const roomService = require("../services/roomService");
const matchService = require("../services/matchService");

exports.getRooms = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        res.send("NOT IMPLEMENTED: Site Home Page");
    }
);

exports.getRoomById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        res.send("NOT IMPLEMENTED: Book list");
    }
);

exports.createRoom = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            //res.send(JSON.parse(req.body));
            let room: RoomModel = req.body;

            let returnObj: ReturnObj = roomService.addRoom(room, req);

            if (!returnObj.status) {
                console.log('status false: '+returnObj.message);
                res.statusCode = returnObj.code;
                res.json(returnObj);
                next();
                return;
            }

            if (!returnObj.obj) {
                res.statusCode = returnObj.code;
                res.json(returnObj);
                return;
            }

            let createdRoom = returnObj.obj;

            // let match: MatchModel = {
            //     roomId: createdRoom.id,
            //     status: MatchStatus.READY,
            //     whiteName: createdRoom.playerOne,
            //     blackName: createdRoom.playerTwo,
            // };

            // match = matchService.addMatch(match);

            // room.matches = [match];

            res.statusCode = 201;
            res.json(room);
        } catch (e) {
            return new Error("error");
        }
    }
);

exports.editRoom = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        res.send(`NOT IMPLEMENTED: Book detail: ${req.params.id}`);
    }
);

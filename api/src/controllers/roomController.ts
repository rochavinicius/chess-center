import { NextFunction, Request, Response } from "express";
import { RoomModel } from "../models/roomModel";
import { ReturnObj } from "../util/utils";

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
            let room: RoomModel = req.body;
            let returnObj: ReturnObj = await roomService.addRoom(room, req);

            if (!returnObj.status || !returnObj.obj) {
                res.statusCode = 400;
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
            res.json(createdRoom);
        } catch (e) {
            res.statusCode = 500;
            let response = {
                "message": "Unexpected error occurred."
            }
            res.json(response);
            console.error(e);
        }
    }
);

exports.editRoom = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        res.send(`NOT IMPLEMENTED: Book detail: ${req.params.id}`);
    }
);

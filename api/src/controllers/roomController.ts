import { NextFunction, Request, Response } from "express";
import { ReturnObj } from "../util/utils";
import { MatchStatus } from "@prisma/client";
import { BoardModel } from "../models/boardModel";
import { MatchModel } from "../models/matchModel";
import { RoomModel } from "../models/roomModel";
import { RoomCommand } from "../models/roomCommands";

const asyncHandler = require("express-async-handler");
const boardService = require("../services/boardService");
const matchService = require("../services/matchService");
const roomService = require("../services/roomService");

exports.getRooms = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            let roomsResult = await roomService.getRooms();

            if (!roomsResult.success || !roomsResult.obj) {
                res.statusCode = 400;
                res.json(roomsResult);
                return;
            }

            res.statusCode = 201;
            res.json(roomsResult);
        } catch (e) {
            res.statusCode = 500;
            let response = {
                message: "Unexpected error occurred.",
            };
            res.json(response);
            console.error(e);
        }
    }
);

exports.getRoomById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            let roomResult = await roomService.getRoomById(req.params.roomId);

            if (!roomResult.success || !roomResult.obj) {
                res.statusCode = 400;
                res.json(roomResult);
                return;
            }

            res.statusCode = 201;
            res.json(roomResult);
        } catch (e) {
            res.statusCode = 500;
            let response = {
                message: "Unexpected error occurred.",
            };
            res.json(response);
            console.error(e);
        }
    }
);

exports.createRoom = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            let room: RoomModel = req.body;

            // TODO: Colocar as operacoes de banco dentro de uma transaction
            let roomResult: ReturnObj = await roomService.addRoom(room, req);

            if (!roomResult.success || !roomResult.obj) {
                res.statusCode = 400;
                res.json(roomResult);
                return;
            }

            let createdRoom = roomResult.obj;

            let match: MatchModel = {
                roomId: createdRoom.id,
                status: MatchStatus.READY,
                whiteName: createdRoom.playerOne,
                blackName: createdRoom.playerTwo,
            };

            let matchResult: ReturnObj = await matchService.addMatch(match);

            if (!matchResult.success || !matchResult.obj) {
                res.statusCode = 400;
                res.json(matchResult);
                return;
            }

            createdRoom.matches = [matchResult.obj];

            let board: BoardModel = {
                matchId: matchResult.obj.id,
                state: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR", // FEN string of the initial chess state
            };

            let boardResult: ReturnObj = await boardService.addBoard(board);

            if (!boardResult.success || !boardResult.obj) {
                res.statusCode = 400;
                res.json(boardResult);
                return;
            }

            createdRoom.matches[0].board = boardResult.obj;

            res.statusCode = 201;
            res.json(createdRoom);
        } catch (e) {
            res.statusCode = 500;
            let response = {
                message: "Unexpected error occurred.",
            };
            res.json(response);
            console.error(e);
        }
    }
);

exports.editRoom = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            let roomResult = await roomService.editRoom(
                req.params.roomId,
                req.body
            );

            if (!roomResult.success || !roomResult.obj) {
                res.statusCode = 400;
                res.json(roomResult);
                return;
            }

            res.statusCode = 200;
            res.json(roomResult.obj);
        } catch (e) {
            res.statusCode = 500;
            let response = {
                message: "Unexpected error occurred.",
            };
            res.json(response);
            console.error(e);
        }
    }
);

exports.commandRoom = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            let result = await roomService.commandRoom(
                req.params.roomId,
                req.body["command"]
            );

            if (!result.success || !result.obj) {
                res.statusCode = 400;
                res.json(result);
                return;
            }

            res.statusCode = 200;
            res.send();
        } catch (e) {
            res.statusCode = 500;
            let response = {
                message: "Unexpected error occurred.",
            };
            res.json(response);
            console.error(e);
        }
    }
);

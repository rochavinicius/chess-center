import { NextFunction, Request, Response } from "express";
import { ReturnObj } from "../util/utils";
import { MatchStatus } from "@prisma/client";
import { BoardModel } from "../models/boardModel";
import { MatchModel } from "../models/matchModel";
import { RoomModel } from "../models/roomModel";
import prisma from "../../prisma/prisma";

const asyncHandler = require("express-async-handler");
const boardService = require("../services/boardService");
const matchService = require("../services/matchService");
const roomService = require("../services/roomService");

exports.getRooms = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            let roomList = await prisma.room.findMany({
                include: {
                    match: {
                        include: {
                            board: {
                                include: {
                                    move: true
                                }
                            }
                        }
                    }
                }
            });

            if (!roomList) {
                res.statusCode = 400;
                res.json('Error getting the room list');
                return;
            }

            res.statusCode = 201;
            res.json(roomList);
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
            let room = await prisma.room.findUnique({
                include: {
                    match: {
                        include: {
                            board: {
                                include: {
                                    move: true
                                }
                            }
                        }
                    }
                },
                where: {
                    id: req.params.roomId
                }
            });

            if (!room) {
                res.statusCode = 400;
                res.json('Room not found');
                return;
            }

            res.statusCode = 201;
            res.json(room);
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

            if (!roomResult.status || !roomResult.obj) {
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

            if (!matchResult.status || !matchResult.obj) {
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

            if (!boardResult.status || !boardResult.obj) {
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
        res.send(`NOT IMPLEMENTED: Book detail: ${req.params.id}`);
    }
);

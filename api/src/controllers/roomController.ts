import { MatchStatus } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import prisma from "../../prisma/prisma";
import { BOARD_INITIAL_STATE, BoardModel } from "../models/boardModel";
import { MatchModel } from "../models/matchModel";
import { RoomModel } from "../models/roomModel";
import { ReturnObj } from "../util/utils";
import { DecodedIdToken } from "firebase-admin/auth";

const asyncHandler = require("express-async-handler");
const boardService = require("../services/boardService");
const matchService = require("../services/matchService");
const roomService = require("../services/roomService");

exports.commandRoom = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        let result: ReturnObj | null = null;
        try {
            const resultTx = await prisma.$transaction(async (tx) => {
                result = await roomService.commandRoom(
                    req.params.roomId,
                    req.body["command"],
                    tx
                );

                if (!result?.success) {
                    throw new Error();
                }
            });

            if (result !== null) {
                res.statusCode = 200;
                res.send();
            }
        } catch (e) {
            if (result !== null) {
                res.statusCode = 400;
                res.json((result as ReturnObj).message);
                return;
            }

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
        let result: ReturnObj | null = null;

        try {
            let createdRoom = null;
            let room: RoomModel = req.body;
            let token: DecodedIdToken = req.body["token"];

            let resultTx = await prisma.$transaction(async (tx) => {
                let roomResult: ReturnObj = await roomService.addRoom(
                    room,
                    req,
                    tx,
                    token
                );

                if (!roomResult?.success) {
                    result = {
                        message: roomResult.message,
                        success: roomResult.success,
                    };

                    throw new Error();
                }

                createdRoom = roomResult.obj;

                let match: MatchModel = {
                    roomId: createdRoom.id,
                    status: MatchStatus.READY,
                    whiteName: createdRoom.playerOne,
                    blackName: createdRoom.playerTwo,
                };

                let matchResult: ReturnObj = await matchService.addMatch(
                    match,
                    tx,
                    token
                );

                if (!matchResult?.success) {
                    result = {
                        message: matchResult.message,
                        success: matchResult.success,
                    };

                    throw new Error();
                }

                createdRoom.matches = [matchResult.obj];

                let board: BoardModel = {
                    matchId: matchResult.obj.id,
                    state: BOARD_INITIAL_STATE,
                };

                let boardResult: ReturnObj = await boardService.addBoard(
                    board,
                    tx
                );

                if (!boardResult?.success) {
                    result = {
                        message: boardResult.message,
                        success: boardResult.success,
                    };

                    throw new Error();
                }

                createdRoom.matches[0].board = boardResult.obj;

                result = {
                    message: "Room created",
                    success: true,
                    obj: createdRoom,
                };
            });

            if (result !== null) {
                res.statusCode = 201;
                res.json((result as ReturnObj).obj);
            }
        } catch (e) {
            if (result !== null) {
                res.statusCode = 400;
                res.json((result as ReturnObj).message);
                return;
            }

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
        let result: ReturnObj | null = null;
        try {
            const resultTx = await prisma.$transaction(async (tx) => {
                result = await roomService.editRoom(
                    req.params.roomId,
                    req.body,
                    tx
                );

                if (!result?.success) {
                    throw new Error();
                }
            });

            if (result !== null) {
                res.statusCode = 200;
                res.json((result as ReturnObj).obj);
            }
        } catch (e) {
            if (result !== null) {
                res.statusCode = 400;
                res.json((result as ReturnObj).message);
                return;
            }

            res.statusCode = 500;
            let response = {
                message: "Unexpected error occurred.",
            };
            res.json(response);
            console.error(e);
        }
    }
);

/**
 * Funtion to get a list of rooms
 *
 * @param req, res, next
 * @returns json
 *
 */
exports.getRooms = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            let roomsResult = await roomService.getRooms();

            if (!roomsResult.success || !roomsResult.obj) {
                res.statusCode = 400;
                res.json(roomsResult);
                return;
            }

            res.statusCode = 200;
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

            res.statusCode = 200;
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

exports.invite = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        let result: ReturnObj | null = null;

        try {
            const resultTx = await prisma.$transaction(async (tx) => {
                let token: DecodedIdToken = req.body["token"];

                result = await roomService.invite(req.params.roomId, tx, token);

                if (!result?.success) {
                    throw new Error();
                }
            });

            if (result !== null) {
                res.statusCode = 200;
                res.json((result as ReturnObj).message);
            }
        } catch (e) {
            if (result !== null) {
                res.statusCode = 400;
                res.json((result as ReturnObj).message);
                return;
            }

            res.statusCode = 500;
            let response = {
                message: "Unexpected error occurred.",
            };
            res.json(response);
            console.error(e);
        }
    }
);

import { NextFunction, Request, Response } from "express";
import prisma from "../../prisma/prisma";
import { ReturnObj } from "../util/utils";

const asyncHandler = require("express-async-handler");
const moveService = require("../services/moveService");

exports.addMove = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        let result: ReturnObj | null = null;

        try {
            const resultTx = await prisma.$transaction(async (tx) => {
                let newMove = req.body;

                result = await moveService.addMove(newMove, tx);

                if (result && !result.success) {
                    throw new Error();
                }
            });

            if (result !== null) {
                let createdMove = (result as ReturnObj).obj;
                res.statusCode = 201;
                res.json(createdMove);
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

exports.getMovesByBoardId = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            let boardId = req.params.boardId;

            let boardMoves: ReturnObj = await moveService.getMovesByBoardId(
                boardId
            );

            if (!boardMoves.success) {
                res.statusCode = 400;
                res.json(boardMoves.message);
                return;
            }

            res.statusCode = 200;
            res.json(boardMoves.obj);
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

exports.getMoveById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            let moveId = req.params.moveId;

            let move: ReturnObj = await moveService.getMoveById(moveId);

            if (!move.success) {
                res.statusCode = 400;
                res.json(move.message);
                return;
            }

            res.statusCode = 200;
            res.json(move.obj);
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

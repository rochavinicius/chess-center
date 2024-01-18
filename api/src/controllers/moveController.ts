import { Request, Response, NextFunction } from "express";
import prisma from "../../prisma/prisma";
import { ReturnObj } from "../util/utils";

const asyncHandler = require("express-async-handler");
const moveService = require("../services/moveService");

exports.addMove = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        let moveResult: ReturnObj | null = null;

        try {
            const result = await prisma.$transaction(async (tx) => {
                let newMove = req.body;

                moveResult = await moveService.addMove(newMove, tx);

                if (!moveResult?.success) {
                    throw new Error("error");
                }
            });

            if (moveResult !== null) {
                let createdMove = (moveResult as ReturnObj).obj;
                res.statusCode = 400;
                res.json(createdMove);
            }
        } catch (e) {
            if (moveResult !== null) {
                res.statusCode = 400;
                res.json(moveResult);
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

            const boardMoves = await moveService.getMovesByBoardId(boardId);

            res.statusCode = 200;
            res.json(boardMoves);
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
            let moveId = req.params.id;

            const move = await moveService.getMoveById(moveId);

            res.statusCode = 200;
            res.json(move);
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

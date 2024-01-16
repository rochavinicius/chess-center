import { Request, Response, NextFunction } from "express";

const asyncHandler = require("express-async-handler");
const moveService = require("../services/moveService");

exports.addMove = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            let newMove = req.body;

            const moveResult = await moveService.addMove(newMove);

            if (!moveResult.success || !moveResult.obj) {
                res.statusCode = 400;
                res.json(moveResult);
            }
            
            res.statusCode = 201;
            res.json(moveResult);
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
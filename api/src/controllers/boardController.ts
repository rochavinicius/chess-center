import { NextFunction, Request, Response } from "express";
import { ReturnObj } from "../util/utils";

const asyncHandler = require("express-async-handler");
const boardService = require("../services/boardService");

exports.getBoards = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const boards: ReturnObj = await boardService.getBoards();

            res.statusCode = 200;
            res.json(boards?.obj);
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

exports.getBoardById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            let boardId = req.params.boardId;

            const board: ReturnObj = await boardService.getBoardById(boardId);

            if (!board.success) {
                res.statusCode = 400;
                res.json(board?.message);
                return;
            }

            res.statusCode = 200;
            res.json(board?.obj);
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
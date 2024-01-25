import { NextFunction, Request, Response } from "express";
import { ReturnObj } from "../util/utils";

const asyncHandler = require("express-async-handler");
const boardService = require("../services/boardService");

exports.getBoards = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            let boardsResult: ReturnObj = await boardService.getBoards();

            res.statusCode = 200;
            res.json(boardsResult.obj);
        } catch (e) {
            res.statusCode = 500;
            let response = {
                message: "Unexpected error occurred.",
            };
            console.error(e);
            res.json(response);
        }
    }
);

exports.getBoardById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            let boardId = req.params.boardId;

            let boardResult: ReturnObj = await boardService.getBoardById(
                boardId
            );

            if (!boardResult.success) {
                res.statusCode = 400;
                res.json(boardResult.message);
                return;
            }

            res.statusCode = 200;
            res.json(boardResult.obj);
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

import { Request, Response, NextFunction } from "express";

const asyncHandler = require("express-async-handler");
const matchService = require("../services/matchService");

exports.getMatches = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log('getMatches');
            let matchResult = await matchService.getMatches();

            if (!matchResult.status || !matchResult.obj) {
                res.statusCode = 400;
                res.json(matchResult);
                return;
            }

            res.statusCode = 201;
            res.json(matchResult);
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

exports.getMatchById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            let matchResult = await matchService.getMatchById(
                req.params.roomId
            );

            if (!matchResult.status || !matchResult.obj) {
                res.statusCode = 400;
                res.json(matchResult);
                return;
            }

            res.statusCode = 201;
            res.json(matchResult);
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

exports.createMatch = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        res.send(`NOT IMPLEMENTED: Book detail: ${req.params.id}`);
    }
);

exports.editMatch = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        res.send(`NOT IMPLEMENTED: Book detail: ${req.params.id}`);
    }
);

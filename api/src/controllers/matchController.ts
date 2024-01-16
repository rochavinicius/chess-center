import { Request, Response, NextFunction } from "express";
import { MatchModel } from "../models/matchModel";
import { ReturnObj } from "../util/utils";

const asyncHandler = require("express-async-handler");
const matchService = require("../services/matchService");

exports.getMatches = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log("getMatches");
            let matchResult = await matchService.getMatches();

            if (!matchResult.success || !matchResult.obj) {
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

            if (!matchResult.success || !matchResult.obj) {
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
        try {
            let match: MatchModel = req.body;

            let matchResult: ReturnObj = await matchService.addMatch(match);

            if (!matchResult.success || !matchResult.obj) {
                res.statusCode = 400;
                res.json(matchResult);
                return;
            }

            let createdMatch = matchResult.obj;

            res.statusCode = 201;
            res.json(createdMatch);
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

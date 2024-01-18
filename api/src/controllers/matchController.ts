import { Request, Response, NextFunction } from "express";
import { MatchModel } from "../models/matchModel";
import { ReturnObj } from "../util/utils";
import prisma from "../../prisma/prisma";

const asyncHandler = require("express-async-handler");
const matchService = require("../services/matchService");

exports.commandMatch = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await prisma.$transaction(async (tx) => {
                let result = await matchService.commandMatch(
                    req.params.matchId,
                    req.body["command"],
                    req.body["user"],
                    tx
                );

                if (!result.success || !result.obj) {
                    res.statusCode = 400;
                    res.json(result);
                    return;
                }

                res.statusCode = 200;
                res.send();
            });
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
            const result = await prisma.$transaction(async (tx) => {
                let match: MatchModel = req.body;

                let matchResult: ReturnObj = await matchService.addMatch(match, tx);

                if (!matchResult.success || !matchResult.obj) {
                    res.statusCode = 400;
                    res.json(matchResult);
                    return;
                }

                let createdMatch = matchResult.obj;

                res.statusCode = 201;
                res.json(createdMatch);
            });
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


exports.getMatches = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
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
                req.params.matchId
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

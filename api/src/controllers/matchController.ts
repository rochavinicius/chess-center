import { NextFunction, Request, Response } from "express";
import prisma from "../../prisma/prisma";
import { MatchModel } from "../models/matchModel";
import { ReturnObj } from "../util/utils";
import { DecodedIdToken } from "firebase-admin/auth";

const asyncHandler = require("express-async-handler");
const matchService = require("../services/matchService");

exports.commandMatch = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        let result: ReturnObj | null = null;
        try {
            let token: DecodedIdToken = req.body["token"];

            const resultTx = await prisma.$transaction(async (tx) => {
                result = await matchService.commandMatch(
                    req.params.matchId,
                    req.body["command"],
                    tx,
                    token
                );

                if (!result?.success || !result.obj) {
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

exports.createMatch = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        let result: ReturnObj | null = null;
        try {
            const resultTx = await prisma.$transaction(async (tx) => {
                let match: MatchModel = req.body;
                let token: DecodedIdToken = req.body["token"];

                result = await matchService.addMatch(match, tx, token);

                if (!result?.success || !result.obj) {
                    throw new Error();
                }
            });

            if (result !== null) {
                res.statusCode = 201;
                res.json((result as ReturnObj).obj);
            }
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

            res.statusCode = 200;
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
                res.json(matchResult.message);
                return;
            }

            res.statusCode = 201;
            res.json(matchResult.obj);
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

import { Request, Response, NextFunction } from "express";

const asyncHandler = require("express-async-handler");

exports.getMatches = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        res.send("NOT IMPLEMENTED: Site Home Page");
    }
);

exports.getMatchesById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        res.send("NOT IMPLEMENTED: Book list");
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

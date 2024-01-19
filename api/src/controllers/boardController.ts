import { NextFunction, Request, Response } from "express";

const asyncHandler = require("express-async-handler");

exports.getBoard = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        res.send("NOT IMPLEMENTED: Site Home Page");
    }
);
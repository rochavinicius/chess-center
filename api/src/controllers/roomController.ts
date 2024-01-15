import { Request, Response, NextFunction } from "express";
import { RoomModel } from "../models/roomModel";

const asyncHandler = require("express-async-handler");
//const roomModel = require("../models/roomModel");

exports.getRooms = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        res.send("NOT IMPLEMENTED: Site Home Page");
    }
);

exports.getRoomById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        res.send("NOT IMPLEMENTED: Book list");
    }
);

exports.createRoom = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            let room: RoomModel = req.body;

            

        } catch (e) {

        }
    }
);

exports.editRoom = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        res.send(`NOT IMPLEMENTED: Book detail: ${req.params.id}`);
    }
);

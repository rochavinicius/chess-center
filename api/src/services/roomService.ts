import { Mode, PrivacyLevel, RoomStatus } from "@prisma/client";
import { randomUUID } from "crypto";
import { Request } from "express";
import prisma from "../../prisma/prisma";
import { RoomModel } from "../models/roomModel";
import { ReturnObj, isBlank } from "../util/utils";

const addRoom = async (newRoom: RoomModel, req: Request) => {
    let returnObj: ReturnObj = {
        message: "Room not created",
        status: false,
    };

    if (isBlank(newRoom.name)) {
        returnObj.message = "Invalid Name";
        return returnObj;
    }

    if (!(newRoom.status in RoomStatus)) {
        returnObj.message = "Invalid Status";
        return returnObj;
    }

    if (!(newRoom.mode in Mode)) {
        returnObj.message = "Invalid Mode";
        return returnObj;
    }

    if (!(newRoom.chatMode in PrivacyLevel)) {
        returnObj.message = "Invalid Chat Mode";
        return returnObj;
    }

    if (!(newRoom.visibility in PrivacyLevel)) {
        returnObj.message = "Invalid Visibility";
        return returnObj;
    }

    if (isBlank(newRoom.playerOne)) {
        returnObj.message = "Invalid Player One";
        return returnObj;
    }

    if (isBlank(newRoom.playerTwo)) {
        returnObj.message = "Invalid Player Two";
        return returnObj;
    }

    if (newRoom.playerOne === newRoom.playerTwo) {
        returnObj.message = "Cannot play against youserlf";
        return returnObj;
    }

    let roomId = randomUUID();
    let room = await prisma.room.create({
        data: {
            id: roomId,
            name: newRoom.name,
            status: newRoom.status,
            mode: newRoom.mode,
            chat_mode: newRoom.chatMode,
            visibility: newRoom.visibility,
            room_url:
                req.protocol +
                "://" +
                req.get("host") +
                req.originalUrl +
                "/" +
                roomId,
            player_one: newRoom.playerOne,
            player_two: newRoom.playerTwo,
            player_one_score: 0,
            player_two_score: 0,
            viewers: 0,
        },
    });

    if (room) {
        newRoom.id = room.id;
        newRoom.roomUrl = room.room_url;
        newRoom.playerOneScore = room.player_one_score;
        newRoom.playerTwoScore = room.player_two_score;
        newRoom.viewers = room.viewers;
        newRoom.createdAt = room.created_at;

        returnObj = {
            message: "Room created",
            obj: newRoom,
            status: true,
        };

        return returnObj;
    }

    return returnObj;
};

module.exports = { addRoom };

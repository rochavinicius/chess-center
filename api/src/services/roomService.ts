import {
    MatchStatus,
    Mode,
    PrismaClient,
    PrivacyLevel,
    RoomStatus,
} from "@prisma/client";
import { randomUUID } from "crypto";
import { Request } from "express";
import { DecodedIdToken } from "firebase-admin/auth";
import prisma from "../../prisma/prisma";
import { RoomCommand } from "../models/roomCommands";
import { RoomModel, roomModelFromPrisma } from "../models/roomModel";
import { ReturnObj, isBlank } from "../util/utils";

const addRoom = async (
    newRoom: RoomModel,
    req: Request,
    tx: PrismaClient,
    token: DecodedIdToken
) => {
    let returnObj: ReturnObj = {
        message: "Room not created",
        success: false,
    };

    const tokenName: string = token.name;

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

    if (isBlank(tokenName)) {
        returnObj.message = "Invalid Player One";
        return returnObj;
    }

    if (isBlank(newRoom.playerTwo)) {
        returnObj.message = "Invalid Player Two";
        return returnObj;
    }

    if (tokenName === newRoom.playerTwo) {
        returnObj.message = "Cannot play against youserlf";
        return returnObj;
    }

    let roomId = randomUUID();
    let room = await tx.room.create({
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
            created_by: tokenName,
            player_one: tokenName,
            player_two: newRoom.playerTwo,
            player_one_score: 0,
            player_two_score: 0,
            viewers: 0,
        },
    });

    if (room) {
        newRoom.id = room.id;
        newRoom.roomUrl = room.room_url;
        newRoom.createdBy = room.created_by;
        newRoom.playerOneScore = room.player_one_score;
        newRoom.playerTwoScore = room.player_two_score;
        newRoom.viewers = room.viewers;
        newRoom.createdAt = room.created_at;

        returnObj = {
            message: "Room created",
            obj: newRoom,
            success: true,
        };

        return returnObj;
    }

    return returnObj;
};

const commandRoom = async (
    roomId: string,
    roomCommand: string,
    tx: PrismaClient
) => {
    let returnObj: ReturnObj = {
        message: "Room not found",
        success: false,
    };

    let command = RoomCommand[roomCommand as keyof typeof RoomCommand];

    let room = await tx.room.findUnique({
        include: {
            match: {
                include: {
                    board: {
                        include: {
                            move: true,
                        },
                    },
                },
            },
        },
        where: {
            id: roomId,
        },
    });

    if (!room) {
        return returnObj;
    }

    if (!(command in RoomCommand)) {
        returnObj.message = "Invalid command";
        return returnObj;
    }

    switch (command) {
        case RoomCommand.CLOSE:
            let roomResult = await prisma.room.update({
                where: {
                    id: room.id,
                },
                data: {
                    status: RoomStatus.CLOSED,
                },
            });

            if (!roomResult) {
                returnObj.message = "Error closing room";
                return returnObj;
            }

            let lastMatchList = room.match.filter(
                (match) =>
                    match.status === MatchStatus.STARTED ||
                    match.status === MatchStatus.READY
            );

            if (lastMatchList.length > 0) {
                let lastMatch = lastMatchList[0];

                let matchResult = await prisma.match.update({
                    where: {
                        id: lastMatch.id,
                    },
                    data: {
                        status: MatchStatus.FINISHED,
                    },
                });

                if (!matchResult) {
                    returnObj.message = "Error closing match";
                    return returnObj;
                }
            }

            returnObj = {
                message: "Success",
                success: true,
            };

            return returnObj;
        default:
            break;
    }
};

const editRoom = async (
    roomId: string,
    roomData: RoomModel,
    tx: PrismaClient
) => {
    let returnObj: ReturnObj = {
        message: "Room not found",
        success: false,
    };

    let room = await tx.room.findUnique({
        where: {
            id: roomId,
        },
    });

    if (!room) {
        return returnObj;
    }

    if (!(roomData.visibility in PrivacyLevel)) {
        returnObj.message = "Invalid visibility";
        return returnObj;
    }

    let roomResult = await tx.room.update({
        where: {
            id: room.id,
        },
        data: {
            visibility: roomData.visibility,
        },
    });

    if (!roomResult) {
        returnObj.message = "Error editing room";
        return returnObj;
    }

    returnObj = {
        message: "Room edited with success",
        obj: roomResult,
        success: true,
    };

    return returnObj;
};

/**
 * Function that returns a list of rooms
 *
 * @returns ReturnObj
 *
 */
const getRooms = async () => {
    let returnObj: ReturnObj = {
        message: "Rooms not found",
        success: false,
    };
    let roomList = await prisma.room.findMany({
        include: {
            match: {
                include: {
                    board: {
                        include: {
                            move: true,
                        },
                    },
                },
            },
        },
    });

    if (!roomList) {
        return returnObj;
    }

    let parsedRooms: RoomModel[] = [];
    for (const room of roomList) {
        parsedRooms.push(roomModelFromPrisma(room));
    }

    returnObj = {
        message: "Rooms found",
        obj: parsedRooms,
        success: true,
    };

    return returnObj;
};

const getRoomById = async (roomId: string) => {
    let returnObj: ReturnObj = {
        message: "Room not found",
        success: false,
    };

    let room = await prisma.room.findUnique({
        include: {
            match: {
                include: {
                    board: {
                        include: {
                            move: true,
                        },
                    },
                },
            },
        },
        where: {
            id: roomId,
        },
    });

    if (!room) {
        return returnObj;
    }

    returnObj = {
        message: "Room found",
        obj: roomModelFromPrisma(room),
        success: true,
    };

    return returnObj;
};

const invite = async (
    roomId: string,
    tx: PrismaClient,
    token: DecodedIdToken
) => {
    let returnObj: ReturnObj = {
        message: "Error using the invite",
        success: false,
    };

    let tokenName: string = token.name;
    let data: any = {
        player_two: null,
    };

    let room = await tx.room.findUnique({
        where: {
            id: roomId,
        },
    });

    if (!room) {
        return returnObj;
    }

    if (room.status === RoomStatus.CLOSED) {
        returnObj.message = "Room closed";
        return returnObj;
    }

    if (room.mode === Mode.SINGLE_PLAYER) {
        returnObj.message = "Room is in mode single player";
        return returnObj;
    }

    if (!tokenName) {
        returnObj.message = "Username not found";
        return returnObj;
    }

    if (room.player_one === tokenName) {
        returnObj.message = "Player cannot have the same name";
        return returnObj;
    }

    if (!room.player_two) {
        data.player_two = tokenName;
    }

    // TODO: if you can't enter as player, enter as viewer
    if (room.player_two !== tokenName) {
        returnObj.message = "Invite link alreay used";
        return returnObj;
    }

    if (room.player_two === tokenName) {
        data.player_two = tokenName;
    }

    if (data.player_two) {
        let roomResult = await tx.room.update({
            where: {
                id: room.id,
            },
            data: data,
        });

        if (!roomResult) {
            returnObj.message = "Error updating the room";
            return returnObj;
        }

        let match = await prisma.match.findFirst({
            include: {
                board: {
                    include: {
                        move: true,
                    },
                },
            },
            where: {
                room_id: room.id,
                status: MatchStatus.READY,
            },
        });

        if (!match) {
            returnObj.message = "Match not found";
            return returnObj;
        }

        let matchResult = await tx.match.update({
            where: {
                id: match.id,
            },
            data: {
                black_name: data.player_two,
            },
        });

        if (!matchResult) {
            returnObj.message = "Error updating the match";
            return returnObj;
        }
    }

    returnObj = {
        message: "Success",
        success: true,
    };

    return returnObj;
};

module.exports = {
    getRooms,
    getRoomById,
    addRoom,
    editRoom,
    commandRoom,
    invite,
};

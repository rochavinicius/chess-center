import { MatchStatus, Prisma, RoomStatus } from "@prisma/client";
import prisma from "../../prisma/prisma";
import { MatchModel } from "../models/matchModel";
import { ReturnObj, isBlank } from "../util/utils";
import { randomUUID } from "crypto";

const getMatches = async () => {
    let returnObj: ReturnObj = {
        message: "Matches not found",
        success: false,
    };

    let mathcesList = await prisma.match.findMany({
        include: {
            board: {
                include: {
                    move: true,
                },
            },
        },
    });

    if (!mathcesList) {
        return returnObj;
    }

    returnObj.message = "Matches found";
    returnObj.obj = mathcesList;
    returnObj.success = true;

    return returnObj;
};

const getMatchById = async (matchId: string) => {
    let returnObj: ReturnObj = {
        message: "Match not found",
        success: false,
    };

    let match = await prisma.match.findUnique({
        include: {
            board: {
                include: {
                    move: true,
                },
            },
        },
        where: {
            id: matchId,
        },
    });

    if (!match) {
        return returnObj;
    }

    returnObj.message = "Match found";
    returnObj.obj = match;
    returnObj.success = true;

    return returnObj;
};

const addMatch = async (newMatch: MatchModel) => {
    let returnObj: ReturnObj = {
        message: "Match not created",
        success: false,
    };

    let room = await prisma.room.findUnique({
        where: {
            id: newMatch.roomId,
        },
    });

    if (!room) {
        returnObj.message = "Invalid Room";
        return returnObj;
    }

    if (room.status == RoomStatus.CLOSED) {
        returnObj.message = "Room Closed";
        return returnObj;
    }

    if (!(newMatch.status in MatchStatus)) {
        returnObj.message = "Invalid match status";
        return returnObj;
    }

    if (isBlank(newMatch.whiteName)) {
        returnObj.message = "Invalid white piece player name";
        return returnObj;
    }

    if (isBlank(newMatch.blackName)) {
        returnObj.message = "Invalid black piece player name";
        return returnObj;
    }

    if (newMatch.whiteName === newMatch.blackName) {
        returnObj.message = "White and black player names are the same";
        return returnObj;
    }

    let matchId = randomUUID();
    let match = await prisma.match.create({
        data: {
            id: matchId,
            room_id: room.id,
            status: newMatch.status,
            white_name: newMatch.whiteName,
            black_name: newMatch.blackName,
        },
    });

    if (match) {
        newMatch.id = match.id;

        returnObj = {
            message: "Match created",
            obj: newMatch,
            success: true,
        };

        return returnObj;
    }
};

module.exports = { getMatches, getMatchById, addMatch };

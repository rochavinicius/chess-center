import { Color, MatchStatus, Prisma, RoomStatus } from "@prisma/client";
import prisma from "../../prisma/prisma";
import { MatchModel } from "../models/matchModel";
import { ReturnObj, isBlank } from "../util/utils";
import { randomUUID } from "crypto";
import { MatchCommand } from "../models/matchCommands";
import { BoardModel } from "../models/boardModel";

const boardService = require("../services/boardService");

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

    returnObj = {
        message: "Matches found",
        obj: mathcesList,
        success: true,
    };

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

    returnObj = {
        message: "Match found",
        obj: match,
        success: true,
    };

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

    if (!match) {
        returnObj.message = "Error trying to create match";
        return returnObj;
    }

    newMatch.id = match.id;
    returnObj = {
        message: "Match created",
        obj: newMatch,
        success: true,
    };

    return returnObj;
};

const commandMatch = async (
    matchId: string,
    matchCommand: string,
    user: string
) => {
    let returnObj: ReturnObj = {
        message: "Match not found",
        success: false,
    };

    let command = MatchCommand[matchCommand as keyof typeof MatchCommand];

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

    if (!(command in MatchCommand)) {
        returnObj.message = "Invalid command";
        return returnObj;
    }

    switch (command) {
        case MatchCommand.FORFEITH:
            if (match.status == MatchStatus.FINISHED) {
                returnObj.message = "Match is already over";
                return returnObj;
            }

            if (isBlank(user)) {
                returnObj.message = "Invalid user";
                return returnObj;
            }

            if (user != match.white_name && user != match.black_name) {
                returnObj.message = "User not a player";
                return returnObj;
            }

            let matchForfeith = await prisma.match.update({
                where: {
                    id: match.id,
                },
                data: {
                    status: MatchStatus.FINISHED,
                    winner:
                        user == match.white_name ? Color.BLACK : Color.WHITE,
                },
            });

            if (!matchForfeith) {
                returnObj.message = "Error trying to finish the match";
                return returnObj;
            }

            returnObj = {
                message: "Success",
                success: true,
            };

            return returnObj;

        case MatchCommand.REMAKE:
            // TODO: verify if the match is the last match from this room
            let matchRemake = await prisma.match.update({
                where: {
                    id: match.id,
                },
                data: {
                    status: MatchStatus.READY,
                    winner: null
                },
            });

            if (!matchRemake) {
                returnObj.message = "Error trying to remake the match";
                return returnObj;
            }

            let boardRemake = await prisma.board.update({
                where: {
                    match_id: match.id,
                },
                data: {
                    state: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
                    move: undefined
                },
            });

            if (!boardRemake) {
                returnObj.message = "Error trying to remake the board";
                return returnObj;
            }

            // TODO: do we need to delete all saved moves from the table?

            returnObj = {
                message: "Success",
                success: true,
            };

            return returnObj;

        case MatchCommand.REMATCH:
            if (match.status != MatchStatus.FINISHED) {
                returnObj.message = "Current match not finished";
                return returnObj;
            }

            let matchRematch: MatchModel = {
                roomId: match.room_id,
                status: MatchStatus.READY,
                whiteName: match.black_name,
                blackName: match.white_name,
            };

            let matchRematchResult: ReturnObj = await addMatch(matchRematch);

            if (!matchRematchResult.success || !matchRematchResult.obj) {
                returnObj.message = "Error trying to create new match";
                return returnObj;
            }

            let board: BoardModel = {
                matchId: matchRematchResult.obj.id,
                state: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR", // FEN string of the initial chess state
            };

            let boardResult: ReturnObj = await boardService.addBoard(board);

            if (!boardResult.success || !boardResult.obj) {
                returnObj.message = "Error trying to create new board";
                return returnObj;
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

module.exports = { getMatches, getMatchById, addMatch, commandMatch };

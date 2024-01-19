import { Color, MatchStatus, PrismaClient, RoomStatus } from "@prisma/client";
import { randomUUID } from "crypto";
import { DecodedIdToken } from "firebase-admin/auth";
import prisma from "../../prisma/prisma";
import auth from "../auth/firebase";
import { BOARD_INITIAL_STATE, BoardModel } from "../models/boardModel";
import { MatchCommand } from "../models/matchCommands";
import { MatchModel, matchModelFromPrisma } from "../models/matchModel";
import { ReturnObj, isBlank } from "../util/utils";

const boardService = require("../services/boardService");

const addMatch = async (newMatch: MatchModel, tx: PrismaClient, token: DecodedIdToken) => {
    let returnObj: ReturnObj = {
        message: "Match not created",
        success: false,
    };

    let room = await tx.room.findUnique({
        where: {
            id: newMatch.roomId,
        },
    });

    if (!room) {
        returnObj.message = "Invalid Room";
        return returnObj;
    }

    if (room.status === RoomStatus.CLOSED) {
        returnObj.message = "Room Closed";
        return returnObj;
    }

    if (!(newMatch.status in MatchStatus)) {
        returnObj.message = "Invalid match status";
        return returnObj;
    }

    const tokenName = token.name;

    if (tokenName !== newMatch.whiteName && tokenName !== newMatch.blackName) {
        returnObj.message = "Cannot create match for another players";
        return returnObj;
    }

    if (newMatch.whiteName === newMatch.blackName) {
        returnObj.message = "White and black player names are the same";
        return returnObj;
    }

    const usersList = await auth.listUsers();
    const whiteUser = usersList.users.filter((u) => u.displayName === newMatch.whiteName);
    const blackUser = usersList.users.filter((u) => u.displayName === newMatch.blackName);

    if (!whiteUser) {
        returnObj.message = "White user does not exists";
        return returnObj;
    }
    if (!blackUser) {
        returnObj.message = "Black user does not exists";
        return returnObj;
    }

    let matchId = randomUUID();
    let match = await tx.match.create({
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
    tx: PrismaClient,
    token: DecodedIdToken
) => {
    let returnObj: ReturnObj = {
        message: "Match not found",
        success: false,
    };

    const user: string = token.name;
    let command = MatchCommand[matchCommand as keyof typeof MatchCommand];

    let match = await tx.match.findUnique({
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
            if (match.status === MatchStatus.FINISHED) {
                returnObj.message = "Match is already over";
                return returnObj;
            }

            if (isBlank(user)) {
                returnObj.message = "Invalid user";
                return returnObj;
            }

            if (user !== match.white_name && user !== match.black_name) {
                returnObj.message = "User not a player";
                return returnObj;
            }

            let matchForfeith = await tx.match.update({
                where: {
                    id: match.id,
                },
                data: {
                    status: MatchStatus.FINISHED,
                    winner:
                        user === match.white_name ? Color.BLACK : Color.WHITE,
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
            if (match.status === MatchStatus.FINISHED) {
                returnObj.message = "Match is already over";
                return returnObj;
            }

            let matchRemake = await tx.match.update({
                where: {
                    id: match.id,
                },
                data: {
                    status: MatchStatus.READY,
                    winner: null,
                    start_timestamp: null,
                },
            });

            if (!matchRemake) {
                returnObj.message = "Error trying to remake the match";
                return returnObj;
            }

            let boardRemake = await tx.board.update({
                where: {
                    match_id: match.id,
                },
                data: {
                    state: BOARD_INITIAL_STATE,
                },
            });

            if (!boardRemake) {
                returnObj.message = "Error trying to remake the board";
                return returnObj;
            }

            await tx.move.deleteMany({
                where: {
                    board_id: boardRemake.id,
                },
            });

            returnObj = {
                message: "Success",
                success: true,
            };

            return returnObj;
        case MatchCommand.REMATCH:
            if (match.status !== MatchStatus.FINISHED) {
                returnObj.message = "Current match not finished";
                return returnObj;
            }

            let matchRematch: MatchModel = {
                roomId: match.room_id,
                status: MatchStatus.READY,
                whiteName: match.black_name,
                blackName: match.white_name,
            };

            let matchRematchResult: ReturnObj = await addMatch(matchRematch, tx, token);

            if (!matchRematchResult.success || !matchRematchResult.obj) {
                returnObj.message = "Error trying to create new match";
                return returnObj;
            }

            let board: BoardModel = {
                matchId: matchRematchResult.obj.id,
                state: BOARD_INITIAL_STATE, // FEN string of the initial chess state
            };

            let boardResult: ReturnObj = await boardService.addBoard(board, tx);

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

    let parsedMatches: MatchModel[] = [];
    for (const match of mathcesList) {
        parsedMatches.push(matchModelFromPrisma(match));
    }

    returnObj = {
        message: "Matches found",
        obj: parsedMatches,
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
        obj: matchModelFromPrisma(match),
        success: true,
    };

    return returnObj;
};

const updateMatch = async (newMatch: MatchModel, tx: PrismaClient) => {
    let returnObj: ReturnObj = {
        message: "Match not updated",
        success: false,
    };

    let currentMatch = await tx.match.findUnique({
        where: {
            id: newMatch.id,
        },
    });

    if (!currentMatch) {
        returnObj.message = "Match not found";
        return returnObj;
    }

    let data: any = {
        status: newMatch.status,
    };

    if (newMatch.startTimestamp) {
        data.start_timestamp = newMatch.startTimestamp;
    }

    if (newMatch.endTimestamp) {
        data.end_timestamp = newMatch.endTimestamp;
    }

    if (newMatch.winner) {
        data.winner = newMatch.winner;
    }

    let matchResult = await tx.match.update({
        where: {
            id: currentMatch.id,
        },
        data: data,
    });

    if (!matchResult) {
        returnObj.message = "Error at updating match";
        return returnObj;
    }

    returnObj = {
        message: "Match updated",
        success: true,
    };
    return returnObj;
};

module.exports = {
    addMatch,
    commandMatch,
    getMatches,
    getMatchById,
    updateMatch,
};

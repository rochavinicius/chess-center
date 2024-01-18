import { Color, MatchStatus, Move, PrismaClient } from "@prisma/client";
import { Chess, Move as ChessJsMove } from "chess.js";
import prisma from "../../prisma/prisma";
import { BoardModel } from "../models/boardModel";
import { MatchModel } from "../models/matchModel";
import { MoveModel, moveModelFromPrisma } from "../models/moveModel";
import { ReturnObj } from "../util/utils";

const boardService = require("./boardService");
const matchService = require("./matchService");

const addMove = async (newMove: MoveModel, tx: PrismaClient) => {
    let returnObj: ReturnObj = {
        message: "Match not created",
        success: false,
    };

    let board = await tx.board.findUnique({
        include: {
            move: true,
        },
        where: {
            id: newMove.boardId,
        },
    });

    if (!board) {
        returnObj.message = "Invalid boardID";
        return returnObj;
    }

    if (!(newMove.color in Color)) {
        returnObj.message = "Invalid move color";
        return returnObj;
    }

    // validate last move color
    let firstMove = false;
    if (board.move && board.move.length !== 0) {
        const lastMove = board.move.sort(
            (m1: Move, m2: Move) =>
                m1.created_at?.getTime() - m2.created_at?.getTime()
        )[board.move.length - 1];
        if (lastMove.color === newMove.color) {
            returnObj.message = "Invalid move (same color)";
            return returnObj;
        }
    } else {
        firstMove = true;
    }

    // create board
    const chess = new Chess();
    chess.load(board.state);

    let chessJsMove: ChessJsMove;
    try {
        chessJsMove = chess.move(newMove.movement);
    } catch (e) {
        returnObj.message = "Illegal move (error chess.move)";
        return returnObj;
    }

    if (!chessJsMove) {
        returnObj.message = "Illegal move (move not created)";
        return returnObj;
    }

    // add move to db
    let createdMove = await tx.move.create({
        data: {
            board_id: newMove.boardId,
            color: newMove.color,
            movement: newMove.movement,
        },
    });

    if (createdMove) {
        newMove.id = createdMove.id;
        newMove.createdAt = createdMove.created_at;

        returnObj = {
            message: "Move created",
            obj: moveModelFromPrisma(createdMove),
            success: false
        };
    }

    // update board
    const boardModel: BoardModel = {
        id: board.id,
        matchId: board.match_id,
        state: chess.fen(),
    };
    let updatedBoard = await boardService.updateBoard(boardModel, tx);
    if (!updatedBoard.success) {
        returnObj.message = "Error while updating board";
        return returnObj;
    }

    if (firstMove) {
        let match = await tx.match.findUnique({
            where: {
                id: board.match_id,
            },
        });

        if (!match) {
            returnObj.message = "Match not found";
            return returnObj;
        }

        const matchModel: MatchModel = {
            id: match?.id,
            roomId: match.room_id,
            status: MatchStatus.STARTED,
            whiteName: match.white_name,
            blackName: match.black_name,
            startTimestamp: new Date(),
        };

        let updatedMatch = await matchService.updateMatch(matchModel, tx);
        if (!updatedMatch.success) {
            returnObj.message = "Error while updating match";
            return returnObj;
        }
    }

    if (chess.isGameOver()) {
        // finish match
        let match = await tx.match.findUnique({
            where: {
                id: '111',
            },
        });

        if (!match) {
            returnObj.message = "Match not found";
            return returnObj;
        }

        if (match.status === MatchStatus.FINISHED) {
            returnObj.message = "Match already finished";
            return returnObj;
        }

        const matchModel: MatchModel = {
            id: match?.id,
            roomId: match.room_id,
            status: MatchStatus.FINISHED,
            whiteName: match.white_name,
            blackName: match.black_name,
            endTimestamp: new Date(),
        };

        if (chess.isCheckmate()) {
            matchModel.winner = newMove.color;
        }

        let updatedMatch = await matchService.updateMatch(matchModel, tx);
        if (!updatedMatch.success) {
            returnObj.message = "Error while updating match";
            return returnObj;
        }
    }

    returnObj.success = true;
    return returnObj;
};

const getMovesByBoardId = async (boardId: string) => {
    let board = await prisma.board.findUnique({
        include: {
            move: {
                orderBy: {
                    created_at: "asc",
                },
            },
        },
        where: {
            id: boardId,
        },
    });

    return {
        message: "",
        success: true,
        obj: board?.move,
    } as ReturnObj;
};

const getMoveById = async (moveId: string) => {
    let move = await prisma.move.findUnique({
        where: {
            id: moveId,
        },
    });

    return {
        message: "",
        success: true,
        obj: moveModelFromPrisma(move)
    } as ReturnObj;
};

module.exports = { addMove, getMoveById, getMovesByBoardId };

import { Move } from "@prisma/client";
import prisma from "../../prisma/prisma";
import { Color } from "../models/enums";
import { MoveModel } from "../models/moveModel";
import { ReturnObj } from "../util/utils";

const addMove = async (newMove: MoveModel) => {
    let returnObj: ReturnObj = {
        message: "Match not created",
        status: false,
    };

    let board = await prisma.board.findUnique({
        include: {
            move: true
        },
        where: {
            id: newMove.boardId
        }
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
    if (!board.move || board.move.length !== 0) {
        const lastMove = board.move.sort((m1: Move, m2: Move) => m1.created_at?.getTime() - m2.created_at?.getTime())[board.move.length - 1];
        if (lastMove.color === newMove.color) {
            returnObj.message = "Invalid move";
            return returnObj;
        }
    }

    // validate if move is possible
    //TODO

    let createdMove = await prisma.move.create({
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
            obj: createdMove,
            status: true,
        };
    }

    return returnObj;
};

const getMovesByBoardId = async (boardId: string) => {
    let board = await prisma.board.findUnique({
        include: {
            move: {
                orderBy: {
                    created_at: 'asc'
                }
            }
        },
        where: {
            id: boardId
        },
    });

    return {
        message: "",
        status: true,
        obj: board?.move
    } as ReturnObj;
}

const getMoveById = async (moveId: string) => {
    let move = await prisma.move.findUnique({
        where: {
            id: moveId
        }
    });

    return {
        message: "",
        status: true,
        obj: move
    } as ReturnObj;
}

module.exports = { addMove, getMoveById, getMovesByBoardId };
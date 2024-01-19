import { PrismaClient } from '@prisma/client';
import { Chess } from 'chess.js';
import { randomUUID } from "crypto";
import prisma from '../../prisma/prisma';
import { BoardModel, boardModelFromPrisma } from "../models/boardModel";
import { ReturnObj } from "../util/utils";

const addBoard = async (newBoard: BoardModel, tx: PrismaClient) => {
    let returnObj: ReturnObj = {
        message: "Board not created",
        success: false,
    };

    let match = await tx.match.findUnique({
        where: {
            id: newBoard.matchId,
        },
    });

    if (!match) {
        returnObj.message = "Invalid match";
        return returnObj;
    }

    let boardID = randomUUID();
    let board = await tx.board.create({
        data: {
            id: boardID,
            match_id: match.id,
            state: newBoard.state,
        },
    });

    if (board) {
        newBoard.id = board.id;

        const chess = new Chess();
        chess.load(board.state);
        newBoard.board = chess.board();

        returnObj = {
            message: "Board created",
            obj: newBoard,
            success: true,
        };

        return returnObj;
    }
};

const updateBoard = async (newBoard: BoardModel, tx: PrismaClient) => {
    let returnObj: ReturnObj = {
        message: "Board not updated",
        success: false,
    };

    let currentBoard = await tx.board.findUnique({
        where: {
            id: newBoard.id,
        },
    });

    if (!currentBoard) {
        returnObj.message = "Board not found";
        return returnObj;
    }

    let boardResult = await tx.board.update({
        where: {
            id: currentBoard.id,
        },
        data: {
            state: newBoard.state,
        },
    });

    if (!boardResult) {
        returnObj.message = "Error at updating board";
        return returnObj;
    }

    returnObj = {
        message: "Board updated",
        success: true,
    };

    return returnObj;
};

const getBoardById = async (boardId: string) => {
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
        obj: boardModelFromPrisma(board),
    } as ReturnObj;
}

const getBoards = async () => {
    let boards = await prisma.board.findMany({
        include: {
            move: {
                orderBy: {
                    created_at: "asc",
                },
            },
        },
    });

    let parsedBoards: BoardModel[] = [];
    for (const board of boards) {
        parsedBoards.push(boardModelFromPrisma(board));
    }

    return {
        message: "",
        success: true,
        obj: parsedBoards,
    } as ReturnObj;
}

module.exports = { addBoard, updateBoard, getBoardById, getBoards };

import { Chess } from 'chess.js';
import { randomUUID } from "crypto";
import prisma from "../../prisma/prisma";
import { BoardModel } from "../models/boardModel";
import { ReturnObj } from "../util/utils";
import { PrismaClient } from '@prisma/client';

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

module.exports = { addBoard, updateBoard };

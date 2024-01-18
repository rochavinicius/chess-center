import { Chess } from 'chess.js';
import { randomUUID } from "crypto";
import prisma from "../../prisma/prisma";
import { BoardModel } from "../models/boardModel";
import { ReturnObj } from "../util/utils";

const addBoard = async (newBoard: BoardModel) => {
    let returnObj: ReturnObj = {
        message: "Board not created",
        success: false,
    };

    let match = await prisma.match.findUnique({
        where: {
            id: newBoard.matchId,
        },
    });

    if (!match) {
        returnObj.message = "Invalid match";
        return returnObj;
    }

    let boardID = randomUUID();
    let board = await prisma.board.create({
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

const updateBoard = async (newBoard: BoardModel) => {
    let returnObj: ReturnObj = {
        message: "Board not updated",
        success: false,
    };

    let currentBoard = await prisma.board.findUnique({
        where: {
            id: newBoard.id,
        },
    });

    if (!currentBoard) {
        returnObj.message = "Board not found";
        return returnObj;
    }

    let boardResult = await prisma.board.update({
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

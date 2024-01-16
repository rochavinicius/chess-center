import { randomUUID } from "crypto";
import prisma from "../../prisma/prisma";
import { BoardModel } from "../models/boardModel";
import { ReturnObj } from "../util/utils";

const addBoard = async (newBoard: BoardModel) => {
    let returnObj: ReturnObj = {
        message: "Match not created",
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

        returnObj = {
            message: "Board created",
            obj: newBoard,
            success: true,
        };

        return returnObj;
    }
};

module.exports = { addBoard };

import { Color, MatchStatus } from "@prisma/client";
import { BoardModel, boardModelFromPrisma } from "./boardModel";

export interface MatchModel {
    id?: string;
    roomId: string;
    status: MatchStatus;
    whiteName: string;
    blackName: string;
    winner?: Color;
    startTimestamp?: Date;
    endTimestamp?: Date;
    createdAt?: Date;
    board?: BoardModel;
}

export const matchModelFromPrisma = (prismaMatch: any) => {
    const match: MatchModel = {
        id: prismaMatch.id,
        roomId: prismaMatch.room_id,
        status: prismaMatch.status,
        whiteName: prismaMatch.white_name,
        blackName: prismaMatch.black_name,
        winner: prismaMatch.winner,
        startTimestamp: prismaMatch.start_timestamp,
        endTimestamp: prismaMatch.end_timestamp,
        createdAt: prismaMatch.created_at,
    }

    if (prismaMatch.board) {
        match.board = boardModelFromPrisma(prismaMatch.board);
    }
    
    return match;
}

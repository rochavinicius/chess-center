import { MatchStatus } from "@prisma/client";
import { BoardModel } from "./boardModel";

export interface MatchModel {
    id?: string;
    roomId: string;
    status: MatchStatus;
    whiteName: string;
    blackName: string;
    winner?: string;
    startTimestamp?: Date;
    endTimestamp?: Date;
    createdAt?: Date;
    board?: BoardModel;
}

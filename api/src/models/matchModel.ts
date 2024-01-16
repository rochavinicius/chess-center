import { Color, MatchStatus } from "@prisma/client";
import { BoardModel } from "./boardModel";

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

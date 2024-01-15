//import { MatchStatus } from "./enums";
import { MatchStatus } from "@prisma/client";

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
}

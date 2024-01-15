import { MatchStatus } from "./enums";

export interface MatchModel {
    id: string,
    roomId: string,
    status: MatchStatus,
    whiteName: string,
    blackName: string,
    winner: string,
    startTimestamp: Date,
    endTimestamp: Date,
    createdAt: Date,
}
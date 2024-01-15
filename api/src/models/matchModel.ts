import { MatchStatus } from "./enums";

export interface RoomModel {
    id: String,
    roomId: string,
    status: MatchStatus,
    whiteName: string,
    blackName: string,
    winner: string,
    startTimestamp: Date,
    endTimestamp: Date,
    createdAt: Date,
}
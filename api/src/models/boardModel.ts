import { MoveModel } from "./moveModel";

export interface BoardModel {
    id: string,
    matchId: string,
    state: string,
    createdAt: Date,
    moves?: MoveModel[]
}
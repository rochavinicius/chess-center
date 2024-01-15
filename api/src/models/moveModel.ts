import { Color } from "./enums";

export interface MoveModel {
    id: String,
    boardId: String,
    color: Color,
    movement: string,
    createdAt: Date,
}
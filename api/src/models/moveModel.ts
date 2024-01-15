import { Color } from "./enums";

export interface MoveModel {
    id: string,
    boardId: string,
    color: Color,
    movement: string,
    createdAt: Date,
}
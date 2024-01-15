import { Color } from "./enums";

export interface RoomModel {
    id: String,
    boardId: String,
    color: Color,
    movement: string,
    createdAt: Date,
}
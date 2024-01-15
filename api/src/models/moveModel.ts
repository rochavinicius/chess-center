// import { Color } from "./enums";
import { Color } from '@prisma/client';

export interface MoveModel {
    id: string,
    boardId: string,
    color: Color,
    movement: string,
    createdAt: Date,
}
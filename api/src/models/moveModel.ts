import { Color } from '@prisma/client';

export interface MoveModel {
    id?: string,
    boardId: string,
    color: Color,
    movement: string,
    createdAt?: Date,
}

export const moveModelFromPrisma = (prismaMove: any) => {
    const move: MoveModel = {
        id: prismaMove.id,
        boardId: prismaMove.board_id,
        color: prismaMove.color,
        movement: prismaMove.movement,
        createdAt: prismaMove.created_at,
    }
    return move;
}
import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { MoveModel, moveModelFromPrisma } from "./moveModel";

export interface BoardModel {
    id?: string;
    matchId: string;
    state: string;
    createdAt?: Date;
    moves?: MoveModel[];
    board?: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null) [][];
}

export const boardModelFromPrisma = (prismaBoard: any) => {
    const board: BoardModel = {
        id: prismaBoard.id,
        matchId: prismaBoard.match_id,
        state: prismaBoard.state,
        createdAt: prismaBoard.created_at,
    }

    if (prismaBoard.move) {
        board.moves = [];
        for (let prismaMove of prismaBoard.move) {
            board.moves.push(moveModelFromPrisma(prismaMove));
        }
    }
    
    const chess = new Chess();
    chess.load(board.state);
    board.board = chess.board();
    
    return board;
}

// FEN string of the initial chess state
export const BOARD_INITIAL_STATE: string =
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"; 

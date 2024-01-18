import { Color, PieceSymbol, Square } from "chess.js";
import { MoveModel } from "./moveModel";

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

// FEN string of the initial chess state
export const BOARD_INITIAL_STATE: string =
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"; 

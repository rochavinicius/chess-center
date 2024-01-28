import { Move, MatchStatus } from "@prisma/client";
import { Chess } from "chess.js";
import { BOARD_INITIAL_STATE, BoardModel } from "../../src/models/boardModel";
import { ReturnObj } from "../../src/util/utils";
import { prismaMock } from "../singleton";

const moveService = require("../../src/services/moveService");

const defaultDate = new Date();

let boardState = "rnbqkbnr/ppppp2p/8/5PpQ/8/8/PPPP1PPP/RNB1KBNR b KQkq - 1 3";

let mockFirstBoard = {
    id: "4311e874-b593-456b-809e-9d712deaf161",
    match_id: "1ff056a7-dac4-4b00-a747-ddbe356e7204",
    state: boardState,
    created_at: defaultDate,
    move: [],
};

let mockBoard = {
    id: "4311e874-b593-456b-809e-9d712deaf161",
    match_id: "1ff056a7-dac4-4b00-a747-ddbe356e7204",
    state: boardState,
    created_at: defaultDate,
    move: [
        {
            id: "c8f6cff3-77cc-4020-adee-7c63172a3dca",
            board_id: "894d8905-cd2d-49ee-a6a8-57cf61c06203",
            color: "WHITE",
            movement: "e4",
            created_at: new Date("January 28, 2024 03:24:00"),
        },
        {
            id: "06ebb856-20bf-4754-8070-4f2c88714292",
            board_id: "894d8905-cd2d-49ee-a6a8-57cf61c06203",
            color: "BLACK",
            movement: "f5",
            created_at: new Date("January 28, 2024 03:25:00"),
        },
        {
            id: "0255004c-bf2d-43f1-98df-cfa124d656ed",
            board_id: "894d8905-cd2d-49ee-a6a8-57cf61c06203",
            color: "WHITE",
            movement: "exf5",
            created_at: new Date("January 28, 2024 03:26:00"),
        },
        {
            id: "09383429-5af0-4299-9d0b-70a9a23557f4",
            board_id: "894d8905-cd2d-49ee-a6a8-57cf61c06203",
            color: "BLACK",
            movement: "g5",
            created_at: new Date("January 28, 2024 03:27:00"),
        },
    ],
};

let moves = [
    {
        id: "c8f6cff3-77cc-4020-adee-7c63172a3dca",
        boardId: "894d8905-cd2d-49ee-a6a8-57cf61c06203",
        color: "WHITE",
        movement: "e4",
        createdAt: new Date("January 28, 2024 03:24:00"),
    },
    {
        id: "06ebb856-20bf-4754-8070-4f2c88714292",
        boardId: "894d8905-cd2d-49ee-a6a8-57cf61c06203",
        color: "BLACK",
        movement: "f5",
        createdAt: new Date("January 28, 2024 03:25:00"),
    },
    {
        id: "0255004c-bf2d-43f1-98df-cfa124d656ed",
        boardId: "894d8905-cd2d-49ee-a6a8-57cf61c06203",
        color: "WHITE",
        movement: "exf5",
        createdAt: new Date("January 28, 2024 03:26:00"),
    },
    {
        id: "09383429-5af0-4299-9d0b-70a9a23557f4",
        boardId: "894d8905-cd2d-49ee-a6a8-57cf61c06203",
        color: "BLACK",
        movement: "g5",
        createdAt: new Date("January 28, 2024 03:27:00"),
    },
];

let mockMatch = {
    id: "1",
    room_id: "1",
    status: MatchStatus.READY,
    white_name: "white",
    black_name: "black",
    winner: null,
    start_timestamp: null,
    end_timestamp: null,
    created_at: defaultDate,
};

let mockFinalMatch = {
    id: "1",
    room_id: "1",
    status: MatchStatus.FINISHED,
    white_name: "white",
    black_name: "black",
    winner: null,
    start_timestamp: null,
    end_timestamp: null,
    created_at: defaultDate,
};

let mockUpdateBoard = jest.fn().mockReturnValue({
    message: "",
    success: true,
    obj: [],
});

jest.mock("../../src/services/boardService", () => {
    return {
        updateBoard: () => mockUpdateBoard(),
    };
});

let mockUpdateMatch = jest.fn().mockReturnValue({
    message: "",
    success: true,
    obj: [],
});

jest.mock("../../src/services/matchService", () => {
    return {
        updateMatch: () => mockUpdateMatch(),
    };
});

describe("moveService", () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test("Should not create move for board that does not exist", async () => {
        let expectedRet: ReturnObj = {
            message: "Board not found",
            success: false,
        };

        let newMove = {
            boardId: "5d3cbbb5-9ac0-477d-9661-653054b4fb53",
            color: "WHITE",
            movement: "e4",
        };

        prismaMock.board.findUnique.mockResolvedValue(null);

        let result = await moveService.addMove(newMove, prismaMock);

        expect(result).toStrictEqual(expectedRet);
    });

    test("Should not create move with invalid color", async () => {
        let expectedRet: ReturnObj = {
            message: "Invalid move color",
            success: false,
        };

        let newMove = {
            boardId: "5d3cbbb5-9ac0-477d-9661-653054b4fb53",
            color: "dawdad",
            movement: "e4",
        };

        prismaMock.board.findUnique.mockResolvedValue(mockBoard);

        let result = await moveService.addMove(newMove, prismaMock);

        expect(result).toStrictEqual(expectedRet);
    });

    test("Should not create move with same color", async () => {
        let expectedRet: ReturnObj = {
            message: "Invalid move (same color)",
            success: false,
        };

        let newMove = {
            boardId: "5d3cbbb5-9ac0-477d-9661-653054b4fb53",
            color: "BLACK",
            movement: "e4",
        };

        prismaMock.board.findUnique.mockResolvedValue(mockBoard);

        let result = await moveService.addMove(newMove, prismaMock);

        expect(result).toStrictEqual(expectedRet);
    });

    test("Should not create move with illegal move", async () => {
        let expectedRet: ReturnObj = {
            message: "Illegal move (error chess.move)",
            success: false,
        };

        let newMove = {
            boardId: "5d3cbbb5-9ac0-477d-9661-653054b4fb53",
            color: "WHITE",
            movement: "e4",
        };

        boardState =
            "rnbqkbnr/ppppp1pp/8/5P2/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 2";
        mockBoard["state"] = boardState;

        prismaMock.board.findUnique.mockResolvedValue(mockBoard);

        let result = await moveService.addMove(newMove, prismaMock);

        expect(result).toStrictEqual(expectedRet);
    });

    test("Should not create move when occurs error while updating board", async () => {
        let expectedRet: ReturnObj = {
            message: "Error while updating board",
            success: false
        };

        let newMove = {
            boardId: "5d3cbbb5-9ac0-477d-9661-653054b4fb53",
            color: "WHITE",
            movement: "g5",
        };

        boardState =
            "rnbqkbnr/ppppp1pp/8/5P2/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 2";
        mockBoard["state"] = boardState;

        mockUpdateBoard = jest.fn().mockReturnValue({
            message: "Board not updated",
            success: false,
        });

        prismaMock.board.findUnique.mockResolvedValue(mockBoard);

        let result = await moveService.addMove(newMove, prismaMock);

        expect(result).toStrictEqual(expectedRet);
    });

    test("Should not create move for match that does not exist when first move", async () => {
        let expectedRet: ReturnObj = {
            message: "Match not found",
            success: false,
        };

        let newMove = {
            boardId: "4311e874-b593-456b-809e-9d712deaf161",
            color: "WHITE",
            movement: "e4",
        };

        boardState = BOARD_INITIAL_STATE;
        mockFirstBoard["state"] = boardState;

        mockUpdateBoard = jest.fn().mockReturnValue({
            message: "Board updated",
            success: true,
            obj: mockFirstBoard,
        });

        prismaMock.board.findUnique.mockResolvedValue(mockFirstBoard);
        prismaMock.match.findUnique.mockResolvedValue(null);

        let result = await moveService.addMove(newMove, prismaMock);

        expect(result).toStrictEqual(expectedRet);
    });

    test("Should not create move when occurs error while updating match when first move", async () => {
        let expectedRet: ReturnObj = {
            message: "Error while updating match",
            success: false,
        };

        let newMove = {
            boardId: "4311e874-b593-456b-809e-9d712deaf161",
            color: "WHITE",
            movement: "e4",
        };

        boardState = BOARD_INITIAL_STATE;
        mockFirstBoard["state"] = boardState;

        mockUpdateBoard = jest.fn().mockReturnValue({
            message: "Board updated",
            success: true,
            obj: mockFirstBoard,
        });

        mockUpdateMatch = jest.fn().mockReturnValue({
            message: "Match not update",
            success: false,
        });

        prismaMock.board.findUnique.mockResolvedValue(mockFirstBoard);
        prismaMock.match.findUnique.mockResolvedValue(mockMatch);

        let result = await moveService.addMove(newMove, prismaMock);

        expect(result).toStrictEqual(expectedRet);
    });

    test("Should not create move for match that does not exist when game over", async () => {
        let expectedRet: ReturnObj = {
            message: "Match not found",
            success: false,
        };

        let newMove = {
            boardId: "4311e874-b593-456b-809e-9d712deaf161",
            color: "WHITE",
            movement: "Qh5",
        };

        boardState =
            "rnbqkbnr/ppppp2p/8/5Pp1/8/8/PPPP1PPP/RNBQKBNR w KQkq g6 0 3";
        mockBoard["state"] = boardState;

        mockUpdateBoard = jest.fn().mockReturnValue({
            message: "Board updated",
            success: true,
            obj: mockFirstBoard,
        });

        prismaMock.board.findUnique.mockResolvedValue(mockBoard);
        prismaMock.match.findUnique.mockResolvedValue(null);

        let result = await moveService.addMove(newMove, prismaMock);

        expect(result).toStrictEqual(expectedRet);
    });

    test("Should not create move for match that is already over", async () => {
        let expectedRet: ReturnObj = {
            message: "Match already finished",
            success: false,
        };

        let newMove = {
            boardId: "4311e874-b593-456b-809e-9d712deaf161",
            color: "WHITE",
            movement: "Qh5",
        };

        boardState =
            "rnbqkbnr/ppppp2p/8/5Pp1/8/8/PPPP1PPP/RNBQKBNR w KQkq g6 0 3";
        mockBoard["state"] = boardState;

        mockUpdateBoard = jest.fn().mockReturnValue({
            message: "Board updated",
            success: true,
            obj: mockFirstBoard,
        });

        prismaMock.board.findUnique.mockResolvedValue(mockBoard);
        prismaMock.match.findUnique.mockResolvedValue(mockFinalMatch);

        let result = await moveService.addMove(newMove, prismaMock);

        expect(result).toStrictEqual(expectedRet);
    });

    test("Should not create move when occurs error while updating match when game over", async () => {
        let expectedRet: ReturnObj = {
            message: "Error while updating match",
            success: false,
        };

        let newMove = {
            boardId: "4311e874-b593-456b-809e-9d712deaf161",
            color: "WHITE",
            movement: "Qh5",
        };

        boardState =
            "rnbqkbnr/ppppp2p/8/5Pp1/8/8/PPPP1PPP/RNBQKBNR w KQkq g6 0 3";
        mockBoard["state"] = boardState;

        mockUpdateBoard = jest.fn().mockReturnValue({
            message: "Board updated",
            success: true,
            obj: mockFirstBoard,
        });

        mockUpdateMatch = jest.fn().mockReturnValue({
            message: "Match not update",
            success: false,
        });

        prismaMock.board.findUnique.mockResolvedValue(mockBoard);
        prismaMock.match.findUnique.mockResolvedValue(mockMatch);

        let result = await moveService.addMove(newMove, prismaMock);

        expect(result).toStrictEqual(expectedRet);
    });

    test("Should create move", async () => {
        let expectedRet: ReturnObj = {
            message: "Move created",
            success: true,
            obj: {
                boardId: "894d8905-cd2d-49ee-a6a8-57cf61c06203",
                color: "WHITE",
                createdAt: new Date("January 28, 2024 03:24:00"),
                id: "c8f6cff3-77cc-4020-adee-7c63172a3dca",
                movement: "e4",
            }
        };

        let newMove = {
            boardId: "4311e874-b593-456b-809e-9d712deaf161",
            color: "WHITE",
            movement: "Qh5",
        };

        boardState =
            "rnbqkbnr/ppppp2p/8/5Pp1/8/8/PPPP1PPP/RNBQKBNR w KQkq g6 0 3";
        mockBoard["state"] = boardState;

        mockUpdateBoard = jest.fn().mockReturnValue({
            message: "Board updated",
            success: true,
            obj: mockFirstBoard,
        });

        mockUpdateMatch = jest.fn().mockReturnValue({
            message: "Match updated",
            success: true,
            obj: mockMatch
        });

        prismaMock.board.findUnique.mockResolvedValue(mockBoard);
        prismaMock.move.create.mockResolvedValue({
            id: "c8f6cff3-77cc-4020-adee-7c63172a3dca",
            board_id: "894d8905-cd2d-49ee-a6a8-57cf61c06203",
            color: "WHITE",
            movement: "e4",
            created_at: new Date("January 28, 2024 03:24:00"),
        });
        prismaMock.match.findUnique.mockResolvedValue(mockMatch);

        let result = await moveService.addMove(newMove, prismaMock);

        expect(result).toStrictEqual(expectedRet);
    });

    test("Should not get moves by board id when board not found", async () => {
        let expectedRet: ReturnObj = {
            message: "Board not found",
            success: false,
        };

        prismaMock.board.findUnique.mockResolvedValue(null);

        let boardId = "5d3cbbb5-9ac0-477d-9661-653054b4fb53";
        let result = await moveService.getMovesByBoardId(boardId);

        expect(result).toStrictEqual(expectedRet);
    });

    test("Should get moves by board id", async () => {
        let expectedRet: ReturnObj = {
            message: "",
            success: true,
            obj: moves
        };

        prismaMock.board.findUnique.mockResolvedValue(mockBoard);

        let boardId = "5d3cbbb5-9ac0-477d-9661-653054b4fb53";
        let result = await moveService.getMovesByBoardId(boardId);

        expect(result).toStrictEqual(expectedRet);
    });

    test("Should not get move when move not found", async () => {
        let expectedRet: ReturnObj = {
            message: "Move not found",
            success: false,
        };

        prismaMock.move.findUnique.mockResolvedValue(null);

        let moveId = "5d3cbbb5-9ac0-477d-9661-653054b4fb53";
        let result = await moveService.getMoveById(moveId);

        expect(result).toStrictEqual(expectedRet);
    });

    test("Should get move by id", async () => {
        let expectedRet: ReturnObj = {
            message: "",
            success: true,
            obj: {
                id: "09383429-5af0-4299-9d0b-70a9a23557f4",
                boardId: "894d8905-cd2d-49ee-a6a8-57cf61c06203",
                color: "BLACK",
                movement: "g5",
                createdAt: new Date("January 28, 2024 03:27:00"),
            }
        };

        prismaMock.move.findUnique.mockResolvedValue(
            {
                id: "09383429-5af0-4299-9d0b-70a9a23557f4",
                board_id: "894d8905-cd2d-49ee-a6a8-57cf61c06203",
                color: "BLACK",
                movement: "g5",
                created_at: new Date("January 28, 2024 03:27:00"),
            }
        );

        let moveId = "5d3cbbb5-9ac0-477d-9661-653054b4fb53";
        let result = await moveService.getMoveById(moveId);

        expect(result).toStrictEqual(expectedRet);
    });
});

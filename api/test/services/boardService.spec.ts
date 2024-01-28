import { Match, MatchStatus } from "@prisma/client";
import { Chess } from "chess.js";
import { BOARD_INITIAL_STATE, BoardModel } from "../../src/models/boardModel";
import { ReturnObj } from "../../src/util/utils";
import { prismaMock } from "../singleton";

const boardService = require("../../src/services/boardService");

const defaultDate = new Date();

const defaultMatch: Match = {
    id: "1",
    room_id: "1",
    status: MatchStatus.READY,
    white_name: "white",
    black_name: "black",
    winner: null,
    start_timestamp: null,
    end_timestamp: null,
    created_at: defaultDate,
}

describe("boardService", () => {
    test("Should not create board with invalid match", async () => {
        const expectedRet: ReturnObj = {
            message: "Invalid match",
            success: false,
        }

        const boardModel: BoardModel = {
            matchId: "1",
            state: BOARD_INITIAL_STATE,
        };

        const matchSpy = jest.spyOn(prismaMock.board, "create");
        prismaMock.match.findUnique.mockResolvedValue(null);

        let result = await boardService.addBoard(boardModel, prismaMock);

        expect(result).toStrictEqual(expectedRet);
        expect(matchSpy).not.toHaveBeenCalled();
    });

    test("Should create new board", async () => {
        const chess = new Chess();
        chess.load(BOARD_INITIAL_STATE);

        const expectedRet: ReturnObj = {
            message: "Board created",
            success: true,
            obj: {
                id: "1",
                matchId: "1",
                state: BOARD_INITIAL_STATE,
                createdAt: defaultDate,
                board: chess.board(),
            }
        }

        const boardModel: BoardModel = {
            matchId: "1",
            state: BOARD_INITIAL_STATE,
        };

        const matchSpy = jest.spyOn(prismaMock.board, "create");
        prismaMock.match.findUnique.mockResolvedValue(defaultMatch);
        prismaMock.board.create.mockResolvedValue({
            id: "1",
            match_id: "1",
            state: BOARD_INITIAL_STATE,
            created_at: defaultDate,
        });

        let result = await boardService.addBoard(boardModel, prismaMock);

        expect(result).toStrictEqual(expectedRet);
        expect(matchSpy).toHaveBeenCalled();
    });

    test("Should not update board that does not exist", async () => {
        const expectedRet: ReturnObj = {
            message: "Board not found",
            success: false,
        }

        const boardModel: BoardModel = {
            matchId: "1",
            state: BOARD_INITIAL_STATE,
        };

        const matchSpy = jest.spyOn(prismaMock.board, "update");
        prismaMock.board.findUnique.mockResolvedValue(null);

        let result = await boardService.updateBoard(boardModel, prismaMock);

        expect(result).toStrictEqual(expectedRet);
        expect(matchSpy).not.toHaveBeenCalled();
    });

    test("Should update board", async () => {
        const expectedRet: ReturnObj = {
            message: "Board updated",
            success: true,
        }

        const BOARD_UPDATED_STATE = BOARD_INITIAL_STATE + "A";

        const boardModel: BoardModel = {
            matchId: "1",
            state: BOARD_INITIAL_STATE,
        };

        const matchSpy = jest.spyOn(prismaMock.board, "update");
        prismaMock.board.findUnique.mockResolvedValue({
            id: "1",
            match_id: "1",
            state: BOARD_UPDATED_STATE,
            created_at: defaultDate,
        });
        prismaMock.board.update.mockResolvedValue({
            id: "1",
            match_id: "1",
            state: BOARD_UPDATED_STATE,
            created_at: defaultDate,
        });

        let result = await boardService.updateBoard(boardModel, prismaMock);

        expect(result).toStrictEqual(expectedRet);
        expect(matchSpy).toHaveBeenCalled();
    });

    test("Should get empty boards", async () => {
        const expectedRet: ReturnObj = {
            message: "",
            success: true,
            obj: []
        }

        const matchSpy = jest.spyOn(prismaMock.board, "findMany");
        prismaMock.board.findMany.mockResolvedValue([]);

        let result = await boardService.getBoards();

        expect(result).toStrictEqual(expectedRet);
        expect(matchSpy).toHaveBeenCalled();
    });

    test("Should get all boards", async () => {
        const chess = new Chess();
        chess.load(BOARD_INITIAL_STATE);

        const expectedRet: ReturnObj = {
            message: "",
            success: true,
            obj: [
                {
                    id: "1",
                    matchId: "2",
                    state: BOARD_INITIAL_STATE,
                    createdAt: defaultDate,
                    board: chess.board(),
                },
                {
                    id: "2",
                    matchId: "3",
                    state: BOARD_INITIAL_STATE,
                    createdAt: defaultDate,
                    board: chess.board(),
                },
                {
                    id: "3",
                    matchId: "4",
                    state: BOARD_INITIAL_STATE,
                    createdAt: defaultDate,
                    board: chess.board(),
                },
            ]
        }

        const matchSpy = jest.spyOn(prismaMock.board, "findMany");
        prismaMock.board.findMany.mockResolvedValue([
            {
                id: "1",
                match_id: "2",
                state: BOARD_INITIAL_STATE,
                created_at: defaultDate,
            },
            {
                id: "2",
                match_id: "3",
                state: BOARD_INITIAL_STATE,
                created_at: defaultDate,
            },
            {
                id: "3",
                match_id: "4",
                state: BOARD_INITIAL_STATE,
                created_at: defaultDate,
            },
        ]);

        let result = await boardService.getBoards();

        expect(result).toStrictEqual(expectedRet);
        expect(matchSpy).toHaveBeenCalled();
    });

    test("Should get board by id", async () => {
        const chess = new Chess();
        chess.load(BOARD_INITIAL_STATE);

        const expectedObj = {
            id: "1",
            matchId: "2",
            state: BOARD_INITIAL_STATE,
            createdAt: defaultDate,
            board: chess.board(),
        }
        const expectedRet: ReturnObj = {
            message: "",
            success: true,
            obj: expectedObj
        }

        const matchSpy = jest.spyOn(prismaMock.board, "findUnique");
        prismaMock.board.findUnique.mockResolvedValue({
            id: "1",
            match_id: "2",
            state: BOARD_INITIAL_STATE,
            created_at: defaultDate,
        });

        let result = await boardService.getBoardById("1");

        expect(result).toStrictEqual(expectedRet);
        expect(matchSpy).toHaveBeenCalled();
    });

    test("Should not find board by id", async () => {
        const expectedRet: ReturnObj = {
            message: "Board not found",
            success: false,
        }

        const matchSpy = jest.spyOn(prismaMock.board, "findUnique");
        prismaMock.board.findUnique.mockResolvedValue(null);

        let result = await boardService.getBoardById("1");

        expect(result).toStrictEqual(expectedRet);
        expect(matchSpy).toHaveBeenCalled();
    });
});

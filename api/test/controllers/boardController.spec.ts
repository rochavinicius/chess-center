import { error } from "console";
import { NextFunction, Request, Response } from "express";

const boardController = require("../../src/controllers/boardController");

const mockBoard = {
    id: "4311e874-b593-456b-809e-9d712deaf161",
    matchId: "1ff056a7-dac4-4b00-a747-ddbe356e7204",
    state: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    createdAt: "2024-01-24T20:16:32.912Z",
    moves: [],
};

let mockGetBoardsReturn = jest.fn().mockReturnValue({
    message: "",
    success: true,
    obj: [],
});

let mockgetBoardByIdReturn = jest.fn().mockReturnValue({
    message: "",
    success: true,
    obj: {},
});

jest.mock("../../src/services/boardService", () => {
    return {
        getBoards: () => mockGetBoardsReturn(),
        getBoardById: () => mockgetBoardByIdReturn(),
    };
});

describe("boardController", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction = jest.fn();

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            json: jest.fn(),
        };
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test("getBoards should return error at retrieving list of boards", async () => {
        const expectedResponse = "Boards not found";

        mockGetBoardsReturn = jest.fn().mockReturnValue({
            message: "Boards not found",
            success: false,
        });

        await boardController.getBoards(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(400);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test("getBoards should return a list of boards", async () => {
        const expectedResponse = [mockBoard];

        mockGetBoardsReturn = jest.fn().mockReturnValue({
            message: "",
            success: true,
            obj: [mockBoard],
        });

        await boardController.getBoards(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(200);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test("getBoards should handle error", async () => {
        mockGetBoardsReturn = jest.fn().mockImplementation(() => {
            throw new Error("Fatal error");
        });

        await boardController.getBoards(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(500);
    });

    test("getBoardById should return error at retrieving the board", async () => {
        const expectedResponse = "Board not found";

        mockRequest = {
            params: {
                boardId: "4311e874-b593-456b-809e-9d712deaf161",
            },
        };

        mockgetBoardByIdReturn = jest.fn().mockReturnValue({
            message: "Board not found",
            success: false,
        });

        await boardController.getBoardById(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(400);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test("getBoardById should return the board", async () => {
        const expectedResponse = mockBoard;

        mockRequest = {
            params: {
                boardId: "4311e874-b593-456b-809e-9d712deaf161",
            },
        };

        mockgetBoardByIdReturn = jest.fn().mockReturnValue({
            message: "",
            success: true,
            obj: mockBoard,
        });

        await boardController.getBoardById(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(200);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test("getBoardById should handle error", async () => {
        mockgetBoardByIdReturn = jest.fn().mockImplementation(() => {
            throw new Error("Fatal error");
        });

        await boardController.getBoardById(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(500);
    });
});

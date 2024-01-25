import { NextFunction, Request, Response } from "express";
import prisma from "../../prisma/prisma";
import { prismaMock } from "../singleton";

const moveController = require("../../src/controllers/moveController");

const mockMove = {
    id: "6f1d44d0-ac1f-46da-a136-21e05c839998",
    boardId: "5d3cbbb5-9ac0-477d-9661-653054b4fb53",
    color: "WHITE",
    movement: "e4",
    createdAt: "2024-01-25T20:44:52.954Z",
};

let mockAddMove = jest.fn().mockReturnValue({
    message: "",
    success: true,
    obj: [],
});

let mockGetMovesByBoardId = jest.fn().mockReturnValue({
    message: "",
    success: true,
    obj: [],
});

let mockGetMoveById = jest.fn().mockReturnValue({
    message: "",
    success: true,
    obj: [],
});

jest.mock("../../src/services/moveService", () => {
    return {
        addMove: () => mockAddMove(),
        getMovesByBoardId: () => mockGetMovesByBoardId(),
        getMoveById: () => mockGetMoveById(),
    };
});

describe("moveController", () => {
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

    test("addMove success", async () => {
        const expectedResponse = mockMove;

        mockRequest = {
            body: {
                boardId: "6247a9b9-496c-4c05-9da8-2bfc79b446b8",
                color: "WHITE",
                movement: "e4",
            },
        };

        mockAddMove = jest.fn().mockReturnValue({
            message: "Move created",
            success: true,
            obj: mockMove,
        });

        jest.spyOn(prisma, "$transaction").mockImplementation(
            (callback: any) => {
                return callback(prismaMock);
            }
        );

        await moveController.addMove(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(201);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test("addMove success false throw new error should handle error", async () => {
        const expectedResponse = "Error from moveService";

        mockRequest = {
            body: {
                boardId: "6247a9b9-496c-4c05-9da8-2bfc79b446b8",
                color: "WHITE",
                movement: "e4",
            },
        };

        mockAddMove = jest.fn().mockReturnValue({
            message: "Error from moveService",
            success: false,
        });

        jest.spyOn(prisma, "$transaction").mockImplementation(
            (callback: any) => {
                return callback(prismaMock);
            }
        );

        await moveController.addMove(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(400);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test("addMove should handle error", async () => {
        mockAddMove = jest.fn().mockImplementation(() => {
            throw new Error("Fatal error");
        });

        jest.spyOn(prisma, "$transaction").mockImplementation(
            (callback: any) => {
                return callback(prismaMock);
            }
        );

        await moveController.addMove(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(500);
    });

    test("getMovesByBoardId should return list of moves", async () => {
        const expectedResponse = [mockMove];

        mockRequest = {
            params: {
                boardId: "6247a9b9-496c-4c05-9da8-2bfc79b446b8",
            },
        };

        mockGetMovesByBoardId = jest.fn().mockReturnValue({
            message: "",
            success: true,
            obj: [mockMove],
        });

        jest.spyOn(prisma, "$transaction").mockImplementation(
            (callback: any) => {
                return callback(prismaMock);
            }
        );

        await moveController.getMovesByBoardId(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(200);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test("getMovesByBoardId should return error retriving list of moves", async () => {
        const expectedResponse = "Board not found";

        mockRequest = {
            params: {
                boardId: "6247a9b9-496c-4c05-9da8-2bfc79b446b8",
            },
        };

        mockGetMovesByBoardId = jest.fn().mockReturnValue({
            message: "Board not found",
            success: false,
        });

        jest.spyOn(prisma, "$transaction").mockImplementation(
            (callback: any) => {
                return callback(prismaMock);
            }
        );

        await moveController.getMovesByBoardId(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(400);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test("getMovesByBoardId should handle error", async () => {
        mockGetMovesByBoardId = jest.fn().mockImplementation(() => {
            throw new Error("Fatal error");
        });

        jest.spyOn(prisma, "$transaction").mockImplementation(
            (callback: any) => {
                return callback(prismaMock);
            }
        );

        await moveController.getMovesByBoardId(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(500);
    });

    test("getMoveById should return the move", async () => {
        const expectedResponse = mockMove;

        mockRequest = {
            params: {
                moveId: "6247a9b9-496c-4c05-9da8-2bfc79b446b8",
            },
        };

        mockGetMoveById = jest.fn().mockReturnValue({
            message: "",
            success: true,
            obj: mockMove,
        });

        jest.spyOn(prisma, "$transaction").mockImplementation(
            (callback: any) => {
                return callback(prismaMock);
            }
        );

        await moveController.getMoveById(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(200);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test("getMoveById should return error retriving the move", async () => {
        const expectedResponse = "Move not found";

        mockRequest = {
            params: {
                moveId: "6247a9b9-496c-4c05-9da8-2bfc79b446b8",
            },
        };

        mockGetMoveById = jest.fn().mockReturnValue({
            message: "Move not found",
            success: false,
        });

        jest.spyOn(prisma, "$transaction").mockImplementation(
            (callback: any) => {
                return callback(prismaMock);
            }
        );

        await moveController.getMoveById(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(400);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test("getMoveById should handle error", async () => {
        mockGetMoveById = jest.fn().mockImplementation(() => {
            throw new Error("Fatal error");
        });

        jest.spyOn(prisma, "$transaction").mockImplementation(
            (callback: any) => {
                return callback(prismaMock);
            }
        );

        await moveController.getMoveById(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(500);
    });
});

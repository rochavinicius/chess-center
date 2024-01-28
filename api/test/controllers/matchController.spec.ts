import { NextFunction, Request, Response } from "express";
import prisma from "../../prisma/prisma";
import { prismaMock } from "../singleton";

const matchController = require("../../src/controllers/matchController");

const mockMatch = {
    id: "3c6ee936-58a0-4905-b1e7-77ae33312422",
    roomId: "a38667c2-3a5d-4ff7-86b1-d52646b84ed9",
    status: "READY",
    whiteName: "Test User",
    blackName: "Vini",
};

let mockCommandMatch = jest.fn().mockReturnValue({
    message: "",
    success: true,
    obj: [],
});

let mockAddMatch = jest.fn().mockReturnValue({
    message: "",
    success: true,
    obj: [],
});

let mockGetMatches = jest.fn().mockReturnValue({
    message: "",
    success: true,
    obj: [],
});

let mockGetMatchById = jest.fn().mockReturnValue({
    message: "",
    success: true,
    obj: [],
});

jest.mock("../../src/services/matchService", () => {
    return {
        commandMatch: () => mockCommandMatch(),
        addMatch: () => mockAddMatch(),
        getMatches: () => mockGetMatches(),
        getMatchById: () => mockGetMatchById(),
    };
});

describe("matchController", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction = jest.fn();

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            json: jest.fn(),
            send: jest.fn()
        };
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test("commandMatch should return success", async () => {
        mockRequest = {
            body: {
                command: "FORFEITH",
                token: "dfasdfas",
            },
            params: {
                matchId: "1ff056a7-dac4-4b00-a747-ddbe356e7204",
            },
        };

        mockCommandMatch = jest.fn().mockReturnValue({
            message: "",
            success: true,
        });

        jest.spyOn(prisma, "$transaction").mockImplementation(
            (callback: any) => {
                return callback(prismaMock);
            }
        );

        await matchController.commandMatch(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(200);
    });

    test("commandMatch success false throw new error should handle error", async () => {
        const expectedResponse = "Error from matchService";

        mockRequest = {
            body: {
                command: "FORFEITH",
                token: "dfasdfas",
            },
            params: {
                matchId: "1ff056a7-dac4-4b00-a747-ddbe356e7204",
            },
        };

        mockCommandMatch = jest.fn().mockReturnValue({
            message: "Error from matchService",
            success: false,
        });

        jest.spyOn(prisma, "$transaction").mockImplementation(
            (callback: any) => {
                return callback(prismaMock);
            }
        );

        await matchController.commandMatch(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(400);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test("commandMatch should handle error", async () => {
        mockCommandMatch = jest.fn().mockImplementation(() => {
            throw new Error("Fatal error");
        });

        jest.spyOn(prisma, "$transaction").mockImplementation(
            (callback: any) => {
                return callback(prismaMock);
            }
        );

        await matchController.commandMatch(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(500);
    });

    test("createMatch success", async () => {
        const expectedResponse = mockMatch;

        mockRequest = {
            body: {
                name: "test",
                status: "OPEN",
                mode: "MULTIPLAYER",
                chatMode: "PRIVATE",
                visibility: "PRIVATE",
                playerOne: "Test User",
                playerTwo: "Vini",
                token: "dfasdfas",
            },
        };

        mockAddMatch = jest.fn().mockReturnValue({
            message: "Match created",
            success: true,
            obj: mockMatch,
        });

        jest.spyOn(prisma, "$transaction").mockImplementation(
            (callback: any) => {
                return callback(prismaMock);
            }
        );

        await matchController.createMatch(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(201);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test("createMatch success false throw new error should handle error", async () => {
        const expectedResponse = "Error from matchService";

        mockRequest = {
            body: {
                name: "test",
                status: "OPEN",
                mode: "MULTIPLAYER",
                chatMode: "PRIVATE",
                visibility: "PRIVATE",
                playerOne: "Test User",
                playerTwo: "Vini",
                token: "dfasdfas",
            },
        };

        mockAddMatch = jest.fn().mockReturnValue({
            message: "Error from matchService",
            success: false,
        });

        jest.spyOn(prisma, "$transaction").mockImplementation(
            (callback: any) => {
                return callback(prismaMock);
            }
        );

        await matchController.createMatch(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(400);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test("createMatch should handle error", async () => {
        mockAddMatch = jest.fn().mockImplementation(() => {
            throw new Error("Fatal error");
        });

        jest.spyOn(prisma, "$transaction").mockImplementation(
            (callback: any) => {
                return callback(prismaMock);
            }
        );

        await matchController.createMatch(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(500);
    });

    test("getMatches should return a list of matches", async () => {
        const expectedResponse = [mockMatch];

        mockGetMatches = jest.fn().mockReturnValue({
            message: "Matches found",
            success: true,
            obj: [mockMatch],
        });

        await matchController.getMatches(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(200);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test("getMatches should handle error", async () => {
        mockGetMatches = jest.fn().mockImplementation(() => {
            throw new Error("Fatal error");
        });

        await matchController.getMatches(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(500);
    });

    test("getMatchById should return error at retrieving the match", async () => {
        const expectedResponse = "Match not found";

        mockRequest = {
            params: {
                matchId: "4311e874-b593-456b-809e-9d712deaf161",
            },
        };

        mockGetMatchById = jest.fn().mockReturnValue({
            message: "Match not found",
            success: false,
        });

        await matchController.getMatchById(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(400);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test("getMatchById should return the match", async () => {
        const expectedResponse = mockMatch;

        mockRequest = {
            params: {
                boardId: "4311e874-b593-456b-809e-9d712deaf161",
            },
        };

        mockGetMatchById = jest.fn().mockReturnValue({
            message: "Match found",
            success: true,
            obj: mockMatch,
        });

        await matchController.getMatchById(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(200);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test("getMatchById should handle error", async () => {
        mockGetMatchById = jest.fn().mockImplementation(() => {
            throw new Error("Fatal error");
        });

        await matchController.getMatchById(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(500);
    });
});

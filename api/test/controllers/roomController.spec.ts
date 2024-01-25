import { NextFunction, Request, Response } from "express";
import prisma from "../../prisma/prisma";
import { prismaMock } from "../singleton";

const roomController = require("../../src/controllers/roomController");

const mockBoard = {
    id: "4311e874-b593-456b-809e-9d712deaf161",
    matchId: "1ff056a7-dac4-4b00-a747-ddbe356e7204",
    state: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    createdAt: "2024-01-24T20:16:32.912Z",
    moves: [],
};

const mockMatch = {
    id: "3c6ee936-58a0-4905-b1e7-77ae33312422",
    roomId: "a38667c2-3a5d-4ff7-86b1-d52646b84ed9",
    status: "READY",
    whiteName: "Test User",
    blackName: "Vini",
};

const mockRoom = {
    id: "a38667c2-3a5d-4ff7-86b1-d52646b84ed9",
    name: "test",
    status: "OPEN",
    mode: "MULTIPLAYER",
    chatMode: "PRIVATE",
    visibility: "PRIVATE",
    roomUrl:
        "http://127.0.0.1:3000/api/room/a38667c2-3a5d-4ff7-86b1-d52646b84ed9",
    createdBy: "Test User",
    playerOne: "Test User",
    playerTwo: "Vini",
    playerOneScore: 0,
    playerTwoScore: 0,
    viewers: 0,
    createdAt: "2024-01-25T19:32:16.213Z",
};

const mockFinalRoom = {
    id: "a38667c2-3a5d-4ff7-86b1-d52646b84ed9",
    name: "test",
    status: "OPEN",
    mode: "MULTIPLAYER",
    chatMode: "PRIVATE",
    visibility: "PRIVATE",
    roomUrl:
        "http://127.0.0.1:3000/api/room/a38667c2-3a5d-4ff7-86b1-d52646b84ed9",
    createdBy: "Test User",
    playerOne: "Test User",
    playerTwo: "Vini",
    playerOneScore: 0,
    playerTwoScore: 0,
    viewers: 0,
    createdAt: "2024-01-25T19:32:16.213Z",
    matches: [
        {
            id: "3c6ee936-58a0-4905-b1e7-77ae33312422",
            roomId: "a38667c2-3a5d-4ff7-86b1-d52646b84ed9",
            status: "READY",
            whiteName: "Test User",
            blackName: "Vini",
            board: {
                id: "4311e874-b593-456b-809e-9d712deaf161",
                matchId: "1ff056a7-dac4-4b00-a747-ddbe356e7204",
                state: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
                createdAt: "2024-01-24T20:16:32.912Z",
                moves: [],
            },
        },
    ],
};

let mockCommandRoom = jest.fn().mockReturnValue({
    message: "",
    success: true,
    obj: [],
});

let mockAddRoom = jest.fn().mockReturnValue({
    message: "",
    success: true,
    obj: [],
});

let mockEditRoom = jest.fn().mockReturnValue({
    message: "",
    success: true,
    obj: [],
});

let mockGetRooms = jest.fn().mockReturnValue({
    message: "",
    success: true,
    obj: [],
});

let mockGetRoomById = jest.fn().mockReturnValue({
    message: "",
    success: true,
    obj: [],
});

let mockInvite = jest.fn().mockReturnValue({
    message: "",
    success: true,
    obj: [],
});

jest.mock("../../src/services/roomService", () => {
    return {
        commandRoom: () => mockCommandRoom(),
        addRoom: () => mockAddRoom(),
        editRoom: () => mockEditRoom(),
        getRooms: () => mockGetRooms(),
        getRoomById: () => mockGetRoomById(),
        invite: () => mockInvite(),
    };
});

let mockAddMatch = jest.fn().mockReturnValue({
    message: "",
    success: true,
    obj: [],
});

jest.mock("../../src/services/matchService", () => {
    return {
        addMatch: () => mockAddMatch(),
    };
});

let mockAddBoard = jest.fn().mockReturnValue({
    message: "",
    success: true,
    obj: [],
});

jest.mock("../../src/services/boardService", () => {
    return {
        addBoard: () => mockAddBoard(),
    };
});

jest.mock("../../src/models/boardModel", () => {
    return {};
});

jest.mock("../../src/models/moveModel", () => {
    return {};
});

describe("roomController", () => {
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

    test("commandRoom should return success", async () => {
        mockRequest = {
            body: {
                command: "CLOSE",
            },
            params: {
                roomId: "1ff056a7-dac4-4b00-a747-ddbe356e7204",
            },
        };

        mockCommandRoom = jest.fn().mockReturnValue({
            message: "Success",
            success: true,
        });

        jest.spyOn(prisma, "$transaction").mockImplementation(
            (callback: any) => {
                return callback(prismaMock);
            }
        );

        await roomController.commandRoom(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(200);
    });

    test("commandRoom should throw error from roomService.commandRoom", async () => {
        const expectedResponse = "Error from roomService";

        mockRequest = {
            body: {
                command: "CLOSE",
            },
            params: {
                roomId: "1ff056a7-dac4-4b00-a747-ddbe356e7204",
            },
        };

        mockCommandRoom = jest.fn().mockReturnValue({
            message: "Error from roomService",
            success: false,
        });

        jest.spyOn(prisma, "$transaction").mockImplementation(
            (callback: any) => {
                return callback(prismaMock);
            }
        );

        await roomController.commandRoom(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(400);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test("commandRoom should handle error", async () => {
        mockCommandRoom = jest.fn().mockImplementation(() => {
            throw new Error("Fatal error");
        });

        jest.spyOn(prisma, "$transaction").mockImplementation(
            (callback: any) => {
                return callback(prismaMock);
            }
        );

        await roomController.commandRoom(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(500);
    });

    test("createRoom should return success", async () => {
        const expectedResponse = mockFinalRoom;

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

        mockAddRoom = jest.fn().mockReturnValue({
            message: "Room created",
            success: true,
            obj: mockRoom,
        });

        mockAddMatch = jest.fn().mockReturnValue({
            message: "Match created",
            success: true,
            obj: mockMatch,
        });

        mockAddBoard = jest.fn().mockReturnValue({
            message: "Board created",
            success: true,
            obj: mockBoard,
        });

        jest.spyOn(prisma, "$transaction").mockImplementation(
            (callback: any) => {
                return callback(prismaMock);
            }
        );

        await roomController.createRoom(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(201);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test("createRoom should throw error from roomService.addRoom", async () => {
        const expectedResponse = "Error from roomService";

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

        mockAddRoom = jest.fn().mockReturnValue({
            message: "Error from roomService",
            success: false,
            obj: mockRoom,
        });

        jest.spyOn(prisma, "$transaction").mockImplementation(
            (callback: any) => {
                return callback(prismaMock);
            }
        );

        await roomController.createRoom(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(400);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test("createRoom should throw error from matchService.addMatch", async () => {
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

        mockAddRoom = jest.fn().mockReturnValue({
            message: "Room created",
            success: true,
            obj: mockRoom,
        });

        mockAddMatch = jest.fn().mockReturnValue({
            message: "Error from matchService",
            success: false,
        });

        jest.spyOn(prisma, "$transaction").mockImplementation(
            (callback: any) => {
                return callback(prismaMock);
            }
        );

        await roomController.createRoom(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(400);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test("createRoom should throw error from boardService.addBoard", async () => {
        const expectedResponse = "Error from boardService";

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

        mockAddRoom = jest.fn().mockReturnValue({
            message: "Room created",
            success: true,
            obj: mockRoom,
        });

        mockAddMatch = jest.fn().mockReturnValue({
            message: "Match created",
            success: true,
            obj: mockMatch,
        });

        mockAddBoard = jest.fn().mockReturnValue({
            message: "Error from boardService",
            success: false,
        });

        jest.spyOn(prisma, "$transaction").mockImplementation(
            (callback: any) => {
                return callback(prismaMock);
            }
        );

        await roomController.createRoom(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(400);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test("createRoom should handle error", async () => {
        mockAddRoom = jest.fn().mockImplementation(() => {
            throw new Error("Fatal error");
        });

        jest.spyOn(prisma, "$transaction").mockImplementation(
            (callback: any) => {
                return callback(prismaMock);
            }
        );

        await roomController.createRoom(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(500);
    });

    test("editRoom should return success", async () => {
        const expectedResponse = mockRoom;

        mockRequest = {
            body: {
                visibility: "PRIVATE",
            },
            params: {
                roomId: "1ff056a7-dac4-4b00-a747-ddbe356e7204",
            },
        };

        mockEditRoom = jest.fn().mockReturnValue({
            message: "Room edited with success",
            success: true,
            obj: mockRoom,
        });

        jest.spyOn(prisma, "$transaction").mockImplementation(
            (callback: any) => {
                return callback(prismaMock);
            }
        );

        await roomController.editRoom(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(200);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test("editRoom should throw error from roomService.editRoom", async () => {
        const expectedResponse = "Error from roomService";

        mockRequest = {
            body: {
                visibility: "PRIVATE",
            },
            params: {
                roomId: "1ff056a7-dac4-4b00-a747-ddbe356e7204",
            },
        };

        mockEditRoom = jest.fn().mockReturnValue({
            message: "Error from roomService",
            success: false,
        });

        jest.spyOn(prisma, "$transaction").mockImplementation(
            (callback: any) => {
                return callback(prismaMock);
            }
        );

        await roomController.editRoom(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(400);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test("editRoom should handle error", async () => {
        mockEditRoom = jest.fn().mockImplementation(() => {
            throw new Error("Fatal error");
        });

        jest.spyOn(prisma, "$transaction").mockImplementation(
            (callback: any) => {
                return callback(prismaMock);
            }
        );

        await roomController.editRoom(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(500);
    });

    test("getRooms should return a list of rooms", async () => {
        const expectedResponse = [mockRoom];

        mockGetRooms = jest.fn().mockReturnValue({
            message: "Rooms found",
            success: true,
            obj: [mockRoom],
        });

        await roomController.getRooms(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(200);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test("getRooms should handle error", async () => {
        mockGetRooms = jest.fn().mockImplementation(() => {
            throw new Error("Fatal error");
        });

        await roomController.getRooms(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(500);
    });

    test("getRoomById should return the room", async () => {
        const expectedResponse = mockRoom;

        mockRequest = {
            params: {
                roomId: "4311e874-b593-456b-809e-9d712deaf161",
            },
        };

        mockGetRoomById = jest.fn().mockReturnValue({
            message: "Room found",
            success: true,
            obj: mockRoom,
        });

        await roomController.getRoomById(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(200);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test("getRoomById should return error at retrieving the match", async () => {
        const expectedResponse = "Room not found";

        mockRequest = {
            params: {
                roomId: "4311e874-b593-456b-809e-9d712deaf161",
            },
        };

        mockGetRoomById = jest.fn().mockReturnValue({
            message: "Room not found",
            success: false,
        });

        await roomController.getRoomById(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(400);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test("getRoomById should handle error", async () => {
        mockGetRoomById = jest.fn().mockImplementation(() => {
            throw new Error("Fatal error");
        });

        await roomController.getRoomById(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(500);
    });

    test("invite should return success", async () => {
        mockRequest = {
            body: {
                token: "fasfwfqafaece",
            },
            params: {
                roomId: "1ff056a7-dac4-4b00-a747-ddbe356e7204",
            },
        };

        mockInvite = jest.fn().mockReturnValue({
            message: "",
            success: true,
        });

        jest.spyOn(prisma, "$transaction").mockImplementation(
            (callback: any) => {
                return callback(prismaMock);
            }
        );

        await roomController.invite(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(200);
    });

    test("invite should return error from roomService.invite", async () => {
        const expectedResponse = "Error from roomService";

        mockRequest = {
            body: {
                token: "fasfwfqafaece",
            },
            params: {
                roomId: "1ff056a7-dac4-4b00-a747-ddbe356e7204",
            },
        };

        mockInvite = jest.fn().mockReturnValue({
            message: "Error from roomService",
            success: false,
        });

        jest.spyOn(prisma, "$transaction").mockImplementation(
            (callback: any) => {
                return callback(prismaMock);
            }
        );

        await roomController.invite(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(400);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test("invite should handle error", async () => {
        mockInvite = jest.fn().mockImplementation(() => {
            throw new Error("Fatal error");
        });

        jest.spyOn(prisma, "$transaction").mockImplementation(
            (callback: any) => {
                return callback(prismaMock);
            }
        );

        await roomController.invite(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.statusCode).toEqual(500);
    });
});

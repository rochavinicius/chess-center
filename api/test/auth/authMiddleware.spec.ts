import { NextFunction, Request, Response } from "express";

const authMiddleware = require("../../src/auth/authMiddleware");

let mockVerifyIdToken = jest.fn().mockReturnValue(false);

jest.mock("../../src/auth/firebase", () => {
    return {
        verifyIdToken: () => mockVerifyIdToken(),
    };
});

describe("authToken", () => {
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

    test("without headers", async () => {
        const expectedResponse = {
            message: "Authorization header not found",
        };

        await authMiddleware.authToken(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test("without authorization header", async () => {
        const expectedResponse = {
            message: "Authorization header not found",
        };

        mockRequest = {
            headers: {},
        };

        await authMiddleware.authToken(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test("with invalid authorization header", async () => {
        const expectedResponse = {
            message: "Invalid token",
        };

        mockRequest = {
            headers: {
                authorization: "bearertoken",
            },
        };

        await authMiddleware.authToken(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test("with authorization header but unauthorized token", async () => {
        const expectedResponse = {
            message: "Unauthorized",
        };

        mockVerifyIdToken = jest.fn().mockReturnValue(false);

        mockRequest = {
            headers: {
                authorization: "bearer token",
            },
        };

        await authMiddleware.authToken(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test("with authorization header and authorized token", async () => {
        mockVerifyIdToken = jest.fn().mockReturnValue(true);

        mockRequest = {
            body: {},
            headers: {
                authorization: "bearer token",
            },
        };

        await authMiddleware.authToken(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(nextFunction).toHaveBeenCalled();
    });
});

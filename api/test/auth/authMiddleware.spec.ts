import { NextFunction, Request, Response } from "express";

const authMiddleware = require("../../src/auth/authMiddleware");

jest.mock("../../src/auth/firebase", () => {
    return {
        auth: {
            verifyIdToken: jest.fn().mockReturnThis(),
        },
    };
});

describe("authToken", () => {
    // https://jestjs.io/docs/mock-functions
    // test("should return authorization not in header", async () => {
    //     let responseObj = {};
    //     let req = {
    //         headers: {},
    //     } as Request;
    //     let res: Partial<Response> = {
    //         json: jest.fn().mockImplementation((result) => {
    //             responseObj = result;
    //         }),
    //     };
    //     let next = {};

    //     res.json = jest.fn();
    //     // let next = jest.fn();

    //     console.log("test", res);

    //     await authMiddleware.authToken(
    //         req as Request,
    //         res as Response,
    //         next as NextFunction
    //     );

    //     console.log("res", responseObj);

    //     expect(responseObj).toEqual("Authorization header not found");
    // });

    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction = jest.fn();

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            json: jest.fn(),
        };
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
});

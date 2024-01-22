import { Response } from "express";

const authMiddleware = require("../../src/auth/authMiddleware");

jest.mock("../../src/auth/firebase", () => {
    return {
        auth: {
            verifyIdToken: jest.fn().mockReturnThis(),
        }
    };
});

// https://jestjs.io/docs/mock-functions
test("Should authenticate user in request", async () => {
    let req = {
        headers: {
        }
    };
    const res = {} as unknown as Response;
    res.json = jest.fn();
    let next = jest.fn();

    console.log(authMiddleware);

    await authMiddleware.authToken(req, res, next);
});
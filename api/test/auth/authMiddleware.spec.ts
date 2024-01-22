import { Request } from "express";
import { ClientRequest } from "node:http";
import test, { describe } from "node:test";
import firebase from "../../src/auth/firebase";

jest.mock('firebase/app', () => {
    return {
      auth: jest.fn(),
    };
  });

const authMiddleware = require('../src/auth/authMiddleware');

// https://jestjs.io/docs/mock-functions
test("Should authenticate user in request", async () => {
    let body: string = `
    {
        "": ""
    }
    `;

    // let req: Request = {
        // body: body,
    // };

    // await authMiddleware.auth(req, res, next);
});
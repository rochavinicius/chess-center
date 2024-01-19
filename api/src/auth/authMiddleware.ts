import { NextFunction, Request, Response } from "express";
import auth from "./firebase";
import { DecodedIdToken } from "firebase-admin/auth";

export interface CustomRequest extends Request {
    token: string | DecodedIdToken;
}

const authToken = async (req: Request, res: Response, next: NextFunction) => {
    if (!("authorization" in req.headers)) {
        return res.json({ message: "Authorization header not found" });
    }

    const authorization = req.headers["authorization"] as string;
    if (authorization.split(" ").length !== 2) {
        return res.json({ message: "Invalid token" });
    }
    const token = authorization.split(" ")[1];

    const decodedToken = await auth.verifyIdToken(token);
    if (!decodedToken) {
        return res.json({ message: "Unauthorized" });
    }

    // now we have a valid token, add to req to other services can use it
    //req.cookies["token"] = decodedToken;
    //(req as CustomRequest).token = decodedToken;
    next();
};

module.exports = { authToken };

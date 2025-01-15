import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Middleware to verify environment for resetting the database.
 */
export const verifyEnvironment: RequestHandler = (req, res, next) => {
    if (process.env.NODE_ENV === "production") {
        res.status(403).json({ message: "Access forbidden in production" });
        return;
    }
    next();
};
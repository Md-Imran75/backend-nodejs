import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { asyncHandle } from "../utils/asyncHandler";
import validator from 'validator';
import AdminModel from "@src/models/admin.mode";
import { generateAccessTokenAndRefreshToken, options } from "./user.controller";
import { ApiResponse } from "../utils/ApiResponse";
import { IGetUserAuthInfoRequest } from "../middlewares/authMiddleWare";
import { DecodedToken } from "@src/types/userType";
import Jwt from "jsonwebtoken"

export const adminLogin = asyncHandle(async (req: Request, res: Response, _next: NextFunction) => {

    const { email, password} = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Please fill all the required fields");
    }

    if (!validator.isEmail(email)) {
        throw new ApiError(400, "Invalid email format");
    }


    const admin: any = await AdminModel.findOne({ email })
    if (!admin) {
        throw new ApiError(404, "Invalid email or password");
    }

    const isPasswordValid = await admin.matchPassword(password);
    if (!isPasswordValid) {
        throw new ApiError(404, "Invalid email or password")
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(admin._id, "admin");
    
    const loggedAdmin = await AdminModel.findById(admin._id).select("-password -refreshToken");

    res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    admin: loggedAdmin,
                    accessToken,
                    refreshToken
                },
                "Admin logged in successfully",
                {}
            )
        );

})


export const logoutAdmin = asyncHandle(async (req: IGetUserAuthInfoRequest, res: Response, _next: NextFunction) => {
    
    await AdminModel.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 
            }
        },
        {
            new: true
        }
    );
    
    res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "Admin logged out successfully", {}));
});

export const refreshAccessTokenForAdmin = asyncHandle(async (req: IGetUserAuthInfoRequest, res: Response, _next: NextFunction) => {

    const incomingRefreshToken = req.cookies?.refreshToken;
    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    if (!process.env.REFRESH_TOKEN_SECRET) {
        throw new ApiError(500, "environment variable not set")
    }

    try {
        const decodedToken = Jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        ) as DecodedToken;

        const user: any = await AdminModel.findById((decodedToken)?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")

        }

        const { accessToken, refreshToken: refreshAccessToken } = await generateAccessTokenAndRefreshToken(user._id, "admin");

        res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshAccessToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: refreshAccessToken },
                    "Access token refreshed",
                    {}
                )
            )
    } catch (error: unknown) {
       
        if (error instanceof Error) {
            throw new ApiError(401, error.message || "Invalid token");
        }
        throw new ApiError(401, "Invalid token");
    }

})
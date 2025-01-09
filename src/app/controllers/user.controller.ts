import UserModel from '../../models/user.model';
import { asyncHandle } from '../utils/asyncHandler';
import type { DecodedToken, User } from '../../types/userType'
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import validator from 'validator';
import { ObjectId } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { IGetUserAuthInfoRequest } from '../middlewares/authMiddleWare';
import Jwt from 'jsonwebtoken';
import Admin from '@src/models/admin.mode';




export const options = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict' as const,
}

export const generateAccessTokenAndRefreshToken = async (userId: ObjectId , type: string = "user") => {
   
    try {
        let user : any;
        if(type === "user"){
             user = await UserModel.findById(userId.toString());
        }else{
             user = await Admin.findById(userId.toString());
        }
        if (!user) {
            throw new ApiError(500, "User not found");
        }
        const accessToken = user.getSignedToken();
        const refreshToken = user.getRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
     
        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, "Error in generating token");
    }
}

export const registerUser = asyncHandle(async (req: Request, res: Response, _next: NextFunction) => {

    const { userName, fullName, email, password, phone } = req.body;

    if (!userName || !fullName || !email || !password || !phone) {
        throw new ApiError(400, "Please fill all the required fields");
    }

    if (!validator.isEmail(email)) {
        throw new ApiError(400, "Invalid email format");
    }


    const existingUser = await UserModel.findOne({ $or: [{ userName }, { email }, { phone }] });

    if (existingUser) {
        throw new ApiError(409, "User already exists with this username or email or phone");
    }
    if (userName.Length < 3) {
        throw new ApiError(500, "Username must be at Least 3 character Long");
    }
    if (userName.Length > 20) {
        throw new ApiError(500, "Username must be at Most 20 character Long");
    }
    if (password.Length < 8) {
        throw new ApiError(500, "Password must be at Least 8 character Long");
    }
    if (phone.Length < 11 || phone.Length > 11) {
        throw new ApiError(500, "Phone number must be 11 character Long");
    }

    const newPhone = "+88" + phone;

    const user = await UserModel.create({
        userName: userName.toLowerCase(),
        fullName,
        email: email.toLowerCase(),
        phone: newPhone,
        password,

    })


    const createdUser = await UserModel.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "User not created");
    }

    res.status(201).json(
        new ApiResponse(
            200,
            createdUser,
            "User created successfully",
            {}
        )
    );

})

export const loginUser = asyncHandle(async (req: Request, res: Response, _next: NextFunction) => {

    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Please fill all the required fields");
    }

    if (!validator.isEmail(email)) {
        throw new ApiError(400, "Invalid email format");
    }


    const user: any = await UserModel.findOne({ email });
    if (!user) {
        throw new ApiError(404, "Invalid email or password");
    }

    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password")
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);
    const loggedUser = await UserModel.findById(user._id).select("-password -refreshToken")
    res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedUser,
                    accessToken,
                    refreshToken
                },
                "User logged in successfully",
                {}
            )
        );

})

export const logoutUser = asyncHandle(async (req: IGetUserAuthInfoRequest, res: Response, _next: NextFunction) => {
    await UserModel.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 //remove refreshToken
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
        .json(new ApiResponse(200, {}, "User logged out successfully", {}));
});


export const refreshAccessToken = asyncHandle(async (req: IGetUserAuthInfoRequest, res: Response, _next: NextFunction) => {

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

        const user: any = await UserModel.findById((decodedToken)?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")

        }

        const { accessToken, refreshToken: refreshAccessToken } = await generateAccessTokenAndRefreshToken(user._id);

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





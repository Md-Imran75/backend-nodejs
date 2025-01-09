import { ApiError } from "../utils/ApiError";
import { asyncHandle } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import UserModel from "@src/models/user.model";
import { ObjectId } from "mongoose";
import {Request} from "express"
import Admin from "@src/models/admin.mode";

export interface IGetUserAuthInfoRequest extends Request {
  user?: any;
}

interface DecodedToken {
    _id: ObjectId;
    iat?: number;
    exp?: number;
  }

export const verifyJwt = asyncHandle(async (req: IGetUserAuthInfoRequest, _res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized token");
    }

    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    );

    const user = await UserModel.findById((decodedToken as DecodedToken)._id).select("-password -refreshToken");
    
    if (!user) {
      throw new ApiError(401, "Unauthorized token");
    }

    req.user = user;
    next();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new ApiError(401, error.message || "Invalid token");
    }
    throw new ApiError(401, "Invalid token");
  }
});


export const verifyJwtForAdmin = asyncHandle(async (req: IGetUserAuthInfoRequest, _res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, "Unauthorized token");
    }

    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    );

    const adminUser: any = await Admin.findById((decodedToken as DecodedToken)._id).select("-password -refreshToken");
    if (!adminUser) {
      throw new ApiError(401, "Unauthorized user");
    }
    
    if(adminUser.role !== "admin"){
      throw new ApiError(401, "Unauthorized user");
    } 

    req.user = adminUser;
    next();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new ApiError(401, error.message || "Invalid token");
    }
    throw new ApiError(401, "Invalid token");
  }
});

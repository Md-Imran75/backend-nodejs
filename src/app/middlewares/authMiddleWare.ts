import { ApiError } from "../utils/ApiError";
import { asyncHandle } from "../utils/asyncHandler";
import jwt from 'jsonwebtoken';
import User from "@src/models/user.model";

export const verifyJwt = asyncHandle(async (req, res, next) => {
    try{
       const token = req.cookies?.accessToken || req.header 
    }catch(error : unknown ){
        if(error instanceof Error){
            throw new ApiError(401, error?.message || "Invalid token");
        }else{
            throw new ApiError(401, "Invalid token");
        }
    }
}) 


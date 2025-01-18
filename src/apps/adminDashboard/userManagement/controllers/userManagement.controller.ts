import { NextFunction, Request, Response } from "express";
import { asyncHandle } from "../../../utils/asyncHandler";
import { fetchUserQueryParameters } from "../../../../types/userType";
import UserModel from "@src/models/user.model";
import { ApiResponse } from "../../../utils/ApiResponse";
import { redisClient } from "@src/db/redis";
import { ApiError } from "../../../utils/ApiError";
import User from "@src/models/user.model";
import { IGetUserAuthInfoRequest } from "@src/apps/middlewares/authMiddleWare";

//fetch all user
export const fetchAllUserByPaginationAndSortAndFilterAndSearch = asyncHandle(
  async (req: Request, res: Response, _next: NextFunction) => {

    const {
      page = 1,
      limit = 10,
      sortBy = "_id",
      sortDirection = "asc",
      role,
      status,
      query,
    } = req.query as unknown as fetchUserQueryParameters;

    const skip = (Number(page) - 1) * limit;
    const sortOrder = sortDirection === "asc" ? 1 : -1;

    // Create a unique key for caching based on query parameters
    // const cacheKey = `users:${page}:${limit}:${sortBy}:${sortDirection}:${role || ""}:${status || ""}:${query || ""}`;

    // Check Redis cache
    // const cachedData = await redisClient.get(cacheKey);
    // if (cachedData) {
    //   const { users, totalUsers } = JSON.parse(cachedData);
    //   console.log("redis");
    //   res.status(200).json(
    //     new ApiResponse(200, users, "Users fetched successfully (cached)", {
    //       totalUsers,
    //       limit,
    //       totalPages: Math.ceil(totalUsers / limit),
    //       currentPage: Number(page),
    //     })

    //   )
    // } else {
      // Build aggregation pipeline
      const pipeline: any[] = [];
      console.log("controller");

      // Add filter for role and status
      if (role || status) {
        const filterConditions: Record<string, any> = {};
        if (role) filterConditions.role = role;
        if (status) filterConditions.status = status;

        pipeline.push({ $match: filterConditions });
      }

      // Add search stage for query
      if (query) {
        pipeline.push({
          $match: {
            $or: [
              { email: { $regex: query, $options: "i" } },
              { userName: { $regex: query, $options: "i" } },
            ],
          },
        });
      }

      // Add sorting stage
      pipeline.push({ $sort: { [sortBy]: sortOrder } });

      //add projection state to exlude password and refreshToken
      pipeline.push({
        $project: {
          password: 0,
          refreshToken: 0
        }
      })

      // Add pagination stages
      pipeline.push({ $skip: skip }, { $limit: Number(limit) });

      // Create a pipeline for total user count
      const countPipeline = [...pipeline];
      countPipeline.pop(); // Remove $skip
      countPipeline.pop(); // Remove $limit
      countPipeline.push({ $count: "totalUsers" });

      // Execute pipelines
      const [users, totalUsersResult] = await Promise.all([
        UserModel.aggregate(pipeline),
        UserModel.aggregate(countPipeline),
      ]);

      const totalUsers = totalUsersResult[0]?.totalUsers || 0;

      // Cache the result in Redis for a specified duration (e.g., 10 minutes)
      // await redisClient.set(
      //   cacheKey,
      //   JSON.stringify({ users, totalUsers }),
      //   { EX: 60 }
      // );

      // Return response
      res.status(200).json(
        new ApiResponse(200, users, "Users fetched successfully", {
          totalUsers,
          limit,
          totalPages: Math.ceil(totalUsers / limit),
          currentPage: Number(page),
        })
      );
    }
  // }
)

//create user
export const createUser = asyncHandle(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { userName, fullName, email, password, phone, role, status } = req.body;

    // Validate input
    if (!userName || !fullName || !email || !password || !phone || !role || !status) {
      res
        .status(400)
        .json(new ApiError(400, "Please fill all the required fields"));
      return; // Ensure the function exits
    }

    // Check if user exists in cache
    // const cachedUser = await redisClient.get(`user:${email}`);
    // if (cachedUser) {
    //   res
    //     .status(400)
    //     .json(new ApiError(400, "User already exists"));
    //   return; // Ensure the function exits
    // }

    // Check if user exists in database
    const existingUser = await User.findOne({
      $or: [{ userName }, { email }, { phone }],
    });
    if (existingUser) {
      // Cache the existing user
      // await redisClient.set(`user:${email}`, JSON.stringify(existingUser), {
      //   EX: 600, // Cache expiry time in seconds (e.g., 10 minutes)
      // });
      res
        .status(400)
        .json(new ApiError(400, "User already exists"));
      return; // Ensure the function exits
    }

    // Create new user
    const newUser = await User.create({
      userName,
      fullName,
      email,
      password,
      role,
      phone,
      status
    });

    // Cache the new user
    // await redisClient.set(`user:${email}`, JSON.stringify(newUser), {
    //   EX: 600, // Cache expiry time in seconds
    // });

    // Respond to client
    res
      .status(201)
      .json(new ApiResponse(201, {}, "User created successfully", {}));
  }
);

//update user
export const updateUser = asyncHandle(
  async (req: IGetUserAuthInfoRequest, res: Response, _next: NextFunction): Promise<void> => {


    const {fullName, email, password, phone, role, status, avatar, id, balance, userName} = req.body;
    console.log(id)
    const user = await User.findById(id);
    if(!user){
      res
      .status(404)
      .json(
        new ApiError(404, "user not found")
      )
      return;
    }
    console.log(user)
    const newBalance = user?.balance + balance;
    console.log(newBalance);

    // update new user
    const newUser = await User.findByIdAndUpdate(id,{
      userName : userName && userName,
      fullName : fullName && fullName,
      email: email && email,
      password : password && password,
      role: role && role,
      phone : phone && phone,
      status : status && status,
      balance : balance && newBalance,
      avatar : avatar && avatar
    }, 
  {
    new: true
  });


    res
      .status(201)
      .json(new ApiResponse(200, {} , "User updated successfully", {}));
  }
);

//view user
export const viewUserById = asyncHandle(
  async(req: IGetUserAuthInfoRequest, res: Response, _next: NextFunction) : Promise<void> => {
      const {id} = req.query;
  
      if(!id){
         res
         .status(400)
         .json(
          new ApiError(400, "User Id required")
         )
         return;
      }

      const user = await User.findById(id).select("-password -refreshToken");
      
      if(!user){
        res
        .status(404)
        .json(
          new ApiError(404, "User not found ")
        )
        return;
      }

      res
      .status(200)
      .json(
        new ApiResponse(200, user, "User find successfully", {})
      )

  }
)



import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiError } from "@src/apps/utils/ApiError";


export interface IUser extends Document {
    userName: string;
    fullName: string;
    email: string;
    password: string;
    avatar: string;
    phone: string;
    balance: number;
    role: "user" | "seller" | "manager" | "technician";
    status: "active" | "pending" | "rejected" | "blocked";
    refreshToken: string;
    getSignedToken(): string;
    getRefreshToken(): string;
    matchPassword(enteredPassword: string): Promise<boolean>;
}


const userSchema: Schema<IUser> = new Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            minLength: 3,
            maxLength: 20,
            index: true,
        },

        fullName: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            index: true,
        },

        password: {
            type: String,
            required: true,
            minLength: 8,
            trim: true,
        },

        avatar: {
            type: String,
            default: "https://www.gravatar.com/avatar",
        },

        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minLength: 14,
            maxLength: 14,
            index: true,
        },

        balance: {
            type: Number,
            default: 0,
        },

        role: {
            type: String,
            enum: ["user", "seller", "manager", "technician"],
            default: "user",
        },

        status: {
            type: String,
            enum: ["active", "pending", "rejected", "blocked"],
            default: "pending",
        },

        refreshToken: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);


userSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(enteredPassword, this.password);
    } catch (error) {
        throw new ApiError(500, "Error in match password");
    }
};


userSchema.methods.getSignedToken = function (): string {
    console.log(process.env.ACCESS_TOKEN_SECRET)
    if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new Error("ACCESS_TOKEN_SECRET is not set in environment variables");
    }
    try {
        return jwt.sign(
            {
                _id: this._id,
                role: this.role,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
            }
        );

    } catch (error) {
        throw new ApiError(500, "Error in generating access token");
    }
};


userSchema.methods.getRefreshToken = function (): string {
    console.log(process.env.REFRESH_TOKEN_SECRET)
    if (!process.env.REFRESH_TOKEN_SECRET) {
        throw new Error("REFRESH_TOKEN_SECRET is not set in environment variables");
    }
    try {
        return jwt.sign(
            {
                _id: this._id,
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: process.env.REFERSH_TOKEN_EXPIRES_IN,
            }
        );
    } catch (error) {
        console.log(error)
        throw new ApiError(500, "Error in generating refresh token");

    }
};

// Create the User model and ensure it is strongly typed
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;

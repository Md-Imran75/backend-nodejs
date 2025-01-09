import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiError } from "@src/app/utils/ApiError";


export interface IUserAdmin extends Document {
    fullName: string;
    email: string;
    password: string;
    avatar: string;
    refreshToken: string;
    role: string;
    getSignedToken(): string;
    getRefreshToken(): string;
    matchPassword(enteredPassword: string): Promise<boolean>;
}


const adminSchema: Schema<IUserAdmin> = new Schema(
    {

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
        role: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            default: "https://www.gravatar.com/avatar",
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


adminSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(enteredPassword, this.password);
    } catch (error) {
        throw new ApiError(500, "Error in match password");
    }
};


adminSchema.methods.getSignedToken = function (): string {
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
                expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "30s",
            }
        );

    } catch (error) {
        throw new ApiError(500, "Error in generating access token");
    }
};


adminSchema.methods.getRefreshToken = function (): string {
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
                expiresIn: "7d",
            }
        );
    } catch (error) {
        throw new ApiError(500, "Error in generating refresh token");

    }
};

const Admin: Model<IUserAdmin> = mongoose.model<IUserAdmin>("Admin", adminSchema);

export default Admin;

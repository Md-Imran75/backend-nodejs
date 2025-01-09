import { ObjectId } from "mongoose";

enum Role{
    user = "User",
    seller = "Seller",
    manager = "Manager",
    technician = "Technician"
}

enum Status{
    active = "Active",
    rejected = "Rejected",
    blocked = "Blocked",
    pending = "Pending"
}

export type User = {
    _id?: number | string | ObjectId;
    userName: string;
    fullName: string;
    email: string;
    password: string;
    phone: string;
    avater?: string;
    balance?: number;
    role?: Role;
    status?: Status;
    refreshToken?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface DecodedToken {
    _id: ObjectId;
    iat?: number;
    exp?: number;
}

export type fetchUserQueryParameters = {
   page: number | string;
   limit: number;
   query?: string;
   role?: Role;
   status?: Status;
   sortBy?: keyof User;
   sortDirection?: 'asc' | 'desc';
}
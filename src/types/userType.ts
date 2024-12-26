
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
    _id?: number | string;
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
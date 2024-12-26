import UserModel from '../../models/user.model';
import { asyncHandle } from '../utils/asyncHandler';
import type  {User} from '../../types/userType'
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import validator from 'validator';


export const registerUser = asyncHandle(async (req, res, _next) => {

const {userName, fullName, email, password, phone} = req.body;

if(!userName || !fullName || !email || !password || !phone){
    throw new ApiError(400, "Please fill all the required fields");
}

if (!validator.isEmail(email)) {
    throw new ApiError(400, "Invalid email format");
}


const existingUser = await UserModel.findOne({$or: [{userName}, {email}, {phone}]});

if(existingUser){
    throw new ApiError(409, "User already exists with this username or email or phone");
}
if(userName.Length < 3){
    throw new ApiError(500, "Username must be at Least 3 character Long");
}
if(userName.Length > 20){
    throw new ApiError(500, "Username must be at Most 20 character Long");
}
if(password.Length < 8){
    throw new ApiError(500, "Password must be at Least 8 character Long");
}
if(phone.Length < 11 || phone.Length > 11){
    throw new ApiError(500, "Phone number must be 11 character Long");
}

const newPhone = "+88" + phone;

const user = await UserModel.create({
    userName : userName.toLowerCase(),
    fullName,
    email: email.toLowerCase(),
    phone : newPhone,
    password,

})


const createdUser = await UserModel.findById(user._id).select("-password -refreshToken");

if(!createdUser){
    throw new ApiError(500, "User not created");
}

res.status(201).json(
    new ApiResponse(
        200,
        createdUser,
        "User created successfully"
    )
);


}) 
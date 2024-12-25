import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"

const UserSchema = new mongoose.Schema({

   userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 20,
    index: true
   },

   fullName: {
    type: String,
    required: true,
   },

   email: {
    type: String,
    require: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true
   },

   password: {
    type: String,
    required: true,
    minLength: 8,
    trim: true
   },
   
   avatar: {
    type: String,
    default: "https://www.gravatar.com/avatar"
   },

   balance: {
    type: Number,
    default: 0,
   },

   role: {
    type: String,
    enum: ["User", "Seller", "Manager", "Technician"],
    default: "User"
   },

   status: {
    type: String,
    enum: ["Active", "Pending", "Rejected", "Blocked"],
    default: "Pending"
   },

   refreshToken: {
    type: String,
    default: ''
   }

}, {
    timestamps: true
})

UserSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

UserSchema.methods.matchPassword = async function(enteredPassword : string){
    return await bcrypt.compare(enteredPassword, this.password);
}

UserSchema.methods.getSignedToken = function(){
    return jwt.sign(
    {
        _id: this._id,
        userName: this.userName,
        email: this.email,
        fullName: this.fullName,
        balance: this.balance,
        role: this.role
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
    }

)
}

UserSchema.methods.getRefreshToken = function(){
    return jwt.sign(
    {
        _id: this._id,
    },
    process.env.REFERSH_TOKEN_SECRET as string,
    {
        expiresIn: process.env.REFERSH_TOKEN_EXPIRES_IN
    }

)
}


const User = mongoose.model("User", UserSchema);

export default User;
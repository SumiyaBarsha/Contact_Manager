import asyncHandler from"express-async-handler";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from 'validator';

//ACCESS token generate
const generateAccessToken = (id) =>{
    return jwt.sign({id},process.env.JWT_ACCESS_SECRET,{expiresIn: "15m"});
}

//Refresh token generate
const generateRefreshToken = (id) =>{
    return jwt.sign({id},process.env.JWT_REFRESH_SECRET,{expiresIn: "7d"});
}

//verify access token
const verifyAccessToken = (token) =>{
    return jwt.verify(token,process.env.JWT_ACCESS_SECRET);
}
//verify refresh token
const verifyRefreshToken = (token) =>{
    return jwt.verify(token,process.env.JWT_REFRESH_SECRET);
}

// Store refresh tokens (in production, use Redis or database)
let refreshTokens = [];

const registerUser = asyncHandler(async (req,res)=>{
    const {username,email,password} = req.body;
    try{
        const existUser = await userModel.findOne({email});
        if(existUser){
            return res.status(400).json({sucess:false, message:"Email already exists!"});
        }
        //validate email
        if(!validator.isEmail(email)){
            return res.status(400).json({sucess:false, message:"Email invalid!"});
        }
        //validate password length
        if(!validator.isLength(password,{min:5})){
            return res.status(400).json({sucess:false, message:"Passowrd length must be at least 5!"});
        }
        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password,salt);

        const newUser = new userModel({
            username:username,
            email: email,
            password: hashedPass
        });
        const registeredUser = await newUser.save();
        //generate access & refresh token
        const accessToken = generateAccessToken(registeredUser._id);
        const refreshToken = generateRefreshToken(registeredUser._id);
        //store it in database
        refreshTokens.push(refreshToken); 
        //set refresh token as HTTP-ONLY cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        
        res.status(201).json({sucess:true, message:"Registered Successfully!",data: registeredUser,accessToken});
    }catch(err){
        console.log(err);
        res.status(500).json({success:false, message:"Error Creating User!"});
    }
});

const loginUser = asyncHandler(async (req,res)=>{
    const{email,password} = req.body;
    try{
        const user = await userModel.findOne({email});
        if(!user){
            res.status(404).json({success:false, message:"User Not Found!"});
        }
        const matchPass = await bcrypt.compare(password, user.password);
        if(!matchPass){
            res.status(401).json({success:false, message:"Wrong Credentials!"});
        }

        res.status(200).json({sucess:true, message:"Logged In Successfully!",data: user});

    }catch(err){
        console.log(err);
        res.status(500).json({success:false, message:"Error Signing in User!"});
    }
});

export {registerUser,loginUser};
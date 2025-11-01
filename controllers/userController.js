import asyncHandler from"express-async-handler";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from 'validator';

//ACCESS token generate
const generateAccessToken = (userId) =>{
    return jwt.sign({id: userId},process.env.JWT_ACCESS_SECRET,{expiresIn: "15m"});
}

//Refresh token generate
const generateRefreshToken = (userId) =>{
    return jwt.sign({id: userId},process.env.JWT_REFRESH_SECRET,{expiresIn: "7d"});
}

// send tokens (access → in body, refresh → cookie + body)
const sendTokens = (res, user) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // If you use cookie-parser in app.js, this will work:
  // app.use(cookieParser());
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    //secure: process.env.NODE_ENV === "production", // send over https in prod
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
  });

  return {
    accessToken,
    refreshToken,
  };
};

// for consistent user payload (never send password)
const userToClient = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});


const registerUser = asyncHandler(async (req,res)=>{
    const {username,email,password} = req.body;
    // basic checks
    if (!username || !email || !password) {
        return res
        .status(400)
        .json({ success: false, message: "Name, email & password are required." });
    }
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
        // generate & send tokens
        const { accessToken, refreshToken } = sendTokens(res, user);
        res.status(201).json({sucess:true, message:"Registered Successfully!",data: userToClient(registeredUser),accessToken,refreshToken});
    }catch(err){
        console.log(err);
        res.status(500).json({success:false, message:"Error Creating User!"});
    }
});

const loginUser = asyncHandler(async (req,res)=>{
    const{email,password} = req.body;
    // basic check
    if (!email || !password) {
        return res
        .status(400)
        .json({ success: false, message: "Email & password are required." });
    }
    try{
        const user = await userModel.findOne({email});
        if(!user){
            res.status(404).json({success:false, message:"User Not Found!"});
        }
        const matchPass = await bcrypt.compare(password, user.password);
        if(!matchPass){
            res.status(401).json({success:false, message:"Wrong Credentials!"});
        }
        // generate & send tokens
        const { accessToken, refreshToken } = sendTokens(res, user);
        res.status(200).json({sucess:true, message:"Logged In Successfully!",data: userToClient(user), accessToken,refreshToken});

    }catch(err){
        console.log(err);
        res.status(500).json({success:false, message:"Error Signing in User!"});
    }
});

//refreshing access token
const refreshAccessToken = asyncHandler(async (req,res) =>{
    // try cookie first, then body (to support mobile/postman)
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken || null;

    if(!refreshToken){
        return res.status(401).json({ success: false, message: "Refresh token missing." });
    }

    try{
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        //check if user still exists
        const user = await userModel.findById(decoded._id);
        if(!user){
            return res.status(401).json({ success: false, message: "User no longer exists." });
        }
        const newAccessToken = generateAccessToken(user._id);
        return res.status(200).json({success: true,accessToken: newAccessToken,});

    }catch(err){
        console.error("Refresh token error:", err.message);
    return res.status(401).json({ success: false, message: "Invalid or expired refresh token." });
  }
});

//logout
const logoutUser = asyncHandler(async(req,res)=>{
    res.clearCookie("refreshToken",{
        httpOnly: true,
        sameSite: "strict",
        //secure: process.env.NODE_ENV === "production",
    });
    return res.status(200).json({success: true,message: "Logged out successfully."});
});

export {registerUser,loginUser, refreshAccessToken, logoutUser};
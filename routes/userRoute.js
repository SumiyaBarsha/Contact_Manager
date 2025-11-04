import express from "express";
import {registerUser, loginUser,currentUser, logoutUser, refreshAccessToken} from "../controllers/userController.js";
import { validate } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/current", validate, currentUser);
userRouter.post("/refresh", refreshAccessToken);
userRouter.post("/logout", logoutUser);

export default userRouter;

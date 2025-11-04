import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import userModel from "../models/userModel.js";

/**
 * Get token from:
 * 1. Authorization: Bearer <token>
 * 2. (optional) req.cookies.accessToken  ← only if you later decide to set it in cookie
 */
const getAccessTokenFromReq = (req) => {
  // 1) from header - bearer token
  let authHeader = req.headers.Authorization || req.headers.authorization;
  if ( authHeader && authHeader.startsWith("Bearer")) {
      return authHeader.split(" ")[1];  // extract the token => 1st field = "Bearer" and 2nd field = Bearer token
  }

  // 2) from cookie (optional – only if you store access token in cookie)
  if (req.cookies && req.cookies.accessToken) {
    return req.cookies.accessToken;
  }

  return null;
};

/**
 * @desc Protect routes — only users with valid ACCESS TOKEN can pass
 * Usage: router.get("/me", protect, getMe);
 */
const validate = asyncHandler(async (req, res, next) => {
  const token = getAccessTokenFromReq(req);

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, no token." });
  }

  try {
    // verify access token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // find user and attach to req
    const user = await userModel.findById(decoded.id).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, user not found." });
    }

    req.user = user; // now available in controllers
    next();
  } catch (err) {
    // token expired or invalid
    const msg =
      err.name === "TokenExpiredError"
        ? "Access token expired."
        : "Not authorized, token failed.";
    return res.status(401).json({ success: false, message: msg });
  }
});

export { validate};

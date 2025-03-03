import jwt from "jsonwebtoken";
import User from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";
import { JWT_SECRET } from "../config.js";
export const isAuthenticatedUser = TryCatch(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandler("Please Login to access this", 401));
    }
    const decodedData = jwt.verify(token, JWT_SECRET);
    const currentUser = await User.findById(decodedData);
    if (!currentUser) {
        return next(new ErrorHandler("Error in currentUser ", 401));
    }
    req.userId = currentUser._id;
    next();
});
export const authorizeRoles = (...roles) => {
    return async (req, res, next) => {
        const user = await User.findById(req.userId);
        if (!user) {
            return next(new ErrorHandler("Not Logged In", 403));
        }
        if (!roles.includes(user.role)) {
            return next(new ErrorHandler(`Role : ${user.role} is not allowed to access this route `, 403));
        }
        next();
    };
};

import express from "express";
import { registerUser, loginUser } from "../controllers/user-controller.js";

const userRoute = express.Router();
// Đăng ký người dùng mới
userRoute.post("/register", registerUser);
// Đăng nhập người dùng
userRoute.post("/login", loginUser);

export default userRoute;

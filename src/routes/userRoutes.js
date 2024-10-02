import express from "express";
import { loginController } from "../controllers/userContollers.js";

const userRoutes = express.Router();

userRoutes.route("/login").post(loginController);

export default userRoutes;

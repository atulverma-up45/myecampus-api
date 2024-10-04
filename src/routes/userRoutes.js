import express from "express";
import { getUser, loginController } from "../controllers/userContollers.js";

const userRoutes = express.Router();

userRoutes.route("/login").post(loginController);
userRoutes.route("/users").get(getUser)

export default userRoutes;

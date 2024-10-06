import express from "express";
import { changeMpinController, createMpinController, getUser, loginController } from "../controllers/userContollers.js";

const userRoutes = express.Router();

userRoutes.route("/login").post(loginController);
userRoutes.route("/create-mpin").post(createMpinController);
userRoutes.route("/change-mpin").post(changeMpinController);
userRoutes.route("/users").get(getUser)

export default userRoutes;

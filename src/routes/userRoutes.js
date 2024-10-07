import express from "express";
import {
  changeMpinController,
  createMpinController,
  forgetMpinController,
  getUserDetailsController,
  loginController,
  updateUserDetailsController,
} from "../controllers/userContollers.js";

const userRoutes = express.Router();

userRoutes.route("/login").post(loginController);
userRoutes.route("/update-user-details").post(updateUserDetailsController);
userRoutes.route("/create-mpin").post(createMpinController);
userRoutes.route("/change-mpin").post(changeMpinController);
userRoutes.route("/forget-mpin").post(forgetMpinController);
userRoutes.route("/user/:reg_no").get(getUserDetailsController);

export default userRoutes;

import express from "express";
import { getUserExamApplicationsController } from "../controllers/examApplicationController.js";

const examRoutes = express.Router();

examRoutes
  .route("/user-exam-Applications")
  .post(getUserExamApplicationsController);

export default examRoutes;

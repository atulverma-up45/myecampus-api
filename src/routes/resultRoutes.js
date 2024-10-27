import express from "express";
import { getUserResultController } from "../controllers/resultControllers.js";

const resultRoutes = express.Router();

resultRoutes.route("/student-result").post(getUserResultController);

export default resultRoutes;

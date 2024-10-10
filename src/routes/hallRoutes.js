import express from "express";
import { getUserHallTicketDetailsController } from "../controllers/hallTicketController.js";

const hallRoutes = express.Router();

hallRoutes.route("/user-hall-tickets").post(getUserHallTicketDetailsController);

export default hallRoutes
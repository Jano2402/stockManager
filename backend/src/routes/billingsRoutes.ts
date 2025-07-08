import express from "express";
import { getPurchasesByDates } from "../controllers/billingsController";
import { authenticateAdminOrModerator } from "./authRoutes";

const router = express.Router();

router.get("/purchases", authenticateAdminOrModerator, getPurchasesByDates);

export default router;

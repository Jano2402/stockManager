import express from "express";
import clientRoutes from "./clientRoutes";
import billingsRoutes from "./billingsRoutes";
import stockRoutes from "./stockRoutes";
import { authenticateAdminOrModerator, authenticateToken } from "./authRoutes";

const router = express.Router();

router.use("/clients", authenticateToken, clientRoutes);
router.use("/billings", authenticateAdminOrModerator, billingsRoutes);
router.use("/stock", authenticateAdminOrModerator, stockRoutes);

export default router;

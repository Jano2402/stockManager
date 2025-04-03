import express from "express";
import clientRoutes from "./clientRoutes";
import billingsRoutes from "./billingsRoutes";
import stockRoutes from "./stockRoutes";

const router = express.Router();

router.use("/clients", clientRoutes);
router.use("/billings", billingsRoutes);
router.use("/stock", stockRoutes);

export default router;

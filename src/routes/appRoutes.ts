import express from "express";
import clientRoutes from "./clientRoutes";
import billingsRoutes from "./billingsRoutes";

const router = express.Router();

router.use("/clients", clientRoutes);
router.use("/billings", billingsRoutes);
router.use("/stock", () => {});

export default router;

import express from "express";
import clientRoutes from "./clientRoutes";

const router = express.Router();

router.use("/clients", clientRoutes);
router.use("/billings", () => {});
router.use("/stock", () => {});

export default router;

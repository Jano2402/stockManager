import express from "express";
import { getProducts, updateProduct } from "../controllers/stockController";
import { authenticateAdmin, authenticateAdminOrModerator } from "./authRoutes";

const router = express.Router();

router.get("/products", authenticateAdminOrModerator, getProducts);
router.put("/products/:id", authenticateAdmin, updateProduct);

export default router;

import express from "express";
import { getProducts, updateProduct } from "../controllers/stockController";

const router = express.Router();

router.get("/products", getProducts);
router.put("/products/:id", updateProduct);

export default router;

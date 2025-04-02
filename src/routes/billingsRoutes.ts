import express from "express";
import { getPurchasesByDates } from "../controllers/billingsController";

const router = express.Router();

router.get("/purchases", getPurchasesByDates);

export default router;

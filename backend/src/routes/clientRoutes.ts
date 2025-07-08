import express from "express";
import {
  initUser,
  searchUser,
  addPurchase,
  deleteClient,
  updateClient,
  modifyPurchase,
} from "../controllers/clientController";
import authenticateAdmin, { authenticateToken } from "./authRoutes";

const router = express.Router();

router.post("/init", authenticateToken, initUser);
router.get("/search", authenticateToken, searchUser);
router.post("/:id/purchases", authenticateToken, addPurchase);
router.put("/:id/modify", authenticateToken, updateClient);
router.delete("/:id/delete", authenticateAdmin, deleteClient);
router.put("/purchases/:id", authenticateToken, modifyPurchase);

export default router;

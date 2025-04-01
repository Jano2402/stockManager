import express from "express";
import {
  initUser,
  searchUser,
  addPurchase,
  deleteClient,
  updateClient,
  modifyPurchase,
  getPurchasesByDates,
} from "../controllers/clientController";

const router = express.Router();

router.post("/init", initUser);
router.get("/search", searchUser);
router.post("/:id/purchases", addPurchase);
router.put("/:id/modify", updateClient);
router.delete("/:id/delete", deleteClient);
router.put("/purchases/:id", modifyPurchase);

// Esta función debe ir en los routings de billings

router.get("/compras", getPurchasesByDates);

export default router;

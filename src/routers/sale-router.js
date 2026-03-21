import express from "express";
import saleController from "../controllers/sale-controller.js";

const router = express.Router();

router.post("/", saleController.realizarVenda);

export default router;
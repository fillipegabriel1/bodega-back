import express from "express";
import clientController from "../controllers/client-controller.js";

const router = express.Router();

router.post("/", clientController.create);
router.get("/:codigo", clientController.getByCodigo);
router.get("/:codigo/history", clientController.getHistory);
router.post("/:codigo/recharge", clientController.recharge);
router.post("/:codigo/debit", clientController.debit);

export default router;
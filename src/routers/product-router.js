import express from 'express';
import productController from '../controllers/product-controller.js';

const router = express.Router();

/* =========================
   ROTAS COM ID
========================= */
router.route('/:id')
  .get(productController.getOne)
  .put(productController.updateOne)
  .delete(productController.deleteOne);

/* =========================
   ROTAS GERAIS
========================= */
router.route('/')
  .get(productController.getAll)
  .post(productController.create);

export default router;
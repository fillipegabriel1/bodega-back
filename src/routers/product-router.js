import express from 'express';
import productController from '../controllers/product-controller.js';
const router = express.Router();

router.route('/:id')
.delete(productController.deleteOne)
.get(productController.getOne)
.put(productController.updateOne);

router.route('/')
.get(productController.getAll)
.post(productController.create);

export default router;
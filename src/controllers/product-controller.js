import Product from "../models/product-model.js";

const controller = {

  create: async (req, res) => {
    try {
      const product = await Product.create(req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: "Erro ao criar produto" });
    }
  },

  getAll: async (req, res) => {
    const products = await Product.find();
    res.json(products);
  },

  update: async (req, res) => {
    try {
      const updated = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      res.json(updated);
    } catch {
      res.status(500).json({ message: "Erro ao atualizar" });
    }
  },

  delete: async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: "Produto deletado" });
    } catch {
      res.status(500).json({ message: "Erro ao deletar" });
    }
  }

};

export default controller;
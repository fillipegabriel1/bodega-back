import Product from "../models/product-model.js";

const controller = {

  /* =========================
     CRIAR
  ========================= */
  create: async (req, res) => {
    try {
      const product = await Product.create(req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: "Erro ao criar produto" });
    }
  },

  /* =========================
     LISTAR TODOS
  ========================= */
  getAll: async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch {
      res.status(500).json({ message: "Erro ao buscar produtos" });
    }
  },

  /* =========================
     BUSCAR UM
  ========================= */
  getOne: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }

      res.json(product);
    } catch {
      res.status(500).json({ message: "Erro ao buscar produto" });
    }
  },

  /* =========================
     ATUALIZAR
  ========================= */
  updateOne: async (req, res) => {
    try {
      const updated = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }

      res.json(updated);
    } catch {
      res.status(500).json({ message: "Erro ao atualizar" });
    }
  },

  /* =========================
     DELETAR
  ========================= */
  deleteOne: async (req, res) => {
    try {
      const deleted = await Product.findByIdAndDelete(req.params.id);

      if (!deleted) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }

      res.json({ message: "Produto deletado" });
    } catch {
      res.status(500).json({ message: "Erro ao deletar" });
    }
  }

};

export default controller;
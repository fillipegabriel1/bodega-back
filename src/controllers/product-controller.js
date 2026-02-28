import Product from '../models/product-model.js';

const controller = {

    deleteOne: async function (req, res) {
        const result = await Product.deleteOne({ _id: req.params.id });
        res.status(200).json(result);
    },

    getOne: async function (req, res) {
        const result = await Product.findById(req.params.id);
        if (!result) return res.status(404).json({ message: "Produto não encontrado" });

        const { __v, _id, ...json } = result.toObject();
        res.status(200).json(json);
    },

    updateOne: async function (req, res) {
        const result = await Product.updateOne(
            { _id: req.params.id },
            req.body
        );
        res.status(200).json(result);
    },

    getAll: async function (req, res) {
        const result = await Product.find(); 
        res.status(200).json(result);
    },

    create: async function (req, res) {
        const result = await Product.create(req.body);
        res.status(201).json(result);
    }
}

export default controller;

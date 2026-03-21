import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  nome: String,
  preco: Number,
  quantidade: Number
});

export default mongoose.model("Product", productSchema);
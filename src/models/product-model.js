import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  preco: {
    type: Number,
    required: true
  },
  quantidade: {
    type: Number,
    required: true
  },
  categoria: {
  type: String,
  enum: ["ALIMENTO", "BEBIDA", "DOCE", "ARTIGO_RELIGIOSO"],
  required: true,
  default: "ALIMENTO"
}
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
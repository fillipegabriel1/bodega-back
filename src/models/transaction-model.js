import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({

  /* =========================
     CLIENTE
  ========================= */

  clienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true
  },

  /* =========================
     TIPO DA TRANSAÇÃO
  ========================= */

  tipo: {
    type: String,
    enum: ["RECARGA", "DEBITO"],
    required: true
  },

  /* =========================
     VALOR TOTAL
  ========================= */

  valor: {
    type: Number,
    required: true
  },

  /* =========================
     PRODUTO
  ========================= */

  produto: {
    type: String,
    default: null
  },

  /* =========================
     CATEGORIA
  ========================= */

  categoria: {
    type: String,
    enum: [
      "ALIMENTO",
      "BEBIDA",
      "DOCE",
      "ARTIGO_RELIGIOSO"
    ],
    default: null
  },

  /* =========================
     QUANTIDADE
  ========================= */

  quantidade: {
    type: Number,
    default: 1
  },

  /* =========================
     PREÇO UNITÁRIO
  ========================= */

  precoUnitario: {
    type: Number,
    default: 0
  },

  /* =========================
     OBSERVAÇÃO
  ========================= */

  observacao: {
    type: String,
    default: ""
  },

  /* =========================
     DATA
  ========================= */

  data: {
    type: Date,
    default: Date.now
  }

}, {

  timestamps: true

});

const Transaction = mongoose.model(
  "Transaction",
  transactionSchema
);

export default Transaction;
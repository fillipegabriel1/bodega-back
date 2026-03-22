import Client from "../models/client-model.js";
import Transaction from "../models/transaction-model.js";

const controller = {

  getDashboard: async (req, res) => {

    try {

      // 💰 TOTAL RECARGA
      const totalRecarga = await Transaction.aggregate([
        { $match: { tipo: "CREDITO" } },
        { $group: { _id: null, total: { $sum: "$valor" } } }
      ]);

      // 💸 TOTAL DEBITO
      const totalDebito = await Transaction.aggregate([
        { $match: { tipo: "DEBITO" } },
        { $group: { _id: null, total: { $sum: "$valor" } } }
      ]);

      // 🏦 SALDO TOTAL DOS CLIENTES
      const saldoBodega = await Client.aggregate([
        { $group: { _id: null, total: { $sum: "$saldo" } } }
      ]);

      // 👥 CLIENTES
      const clientes = await Client.countDocuments();

      // 🔄 TRANSAÇÕES
      const transacoes = await Transaction.countDocuments();

      res.json({
        totalRecarga: totalRecarga[0]?.total || 0,
        totalDebito: totalDebito[0]?.total || 0,
        saldoBodega: saldoBodega[0]?.total || 0,
        clientes,
        transacoes
      });

    } catch (error) {

      res.status(500).json({
        message: "Erro ao carregar dashboard",
        error: error.message
      });

    }

  }

};

export default controller;
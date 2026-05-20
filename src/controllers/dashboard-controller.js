import Client from "../models/client-model.js";
import Transaction from "../models/transaction-model.js";

const controller = {

  getDashboard: async (req, res) => {

    try {

      /* ================================
         💰 TOTAL DE CRÉDITOS
      ================================= */

      const totalRecarga = await Transaction.aggregate([
        {
          $match: {
            tipo: "CREDITO"
          }
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$valor"
            }
          }
        }
      ]);

      /* ================================
         💸 TOTAL DE VENDAS
      ================================= */

      const totalDebito = await Transaction.aggregate([
        {
          $match: {
            tipo: "DEBITO"
          }
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$valor"
            }
          }
        }
      ]);

      /* ================================
         🏦 SALDO DISPONÍVEL
      ================================= */

      const saldoBodega = await Client.aggregate([
        {
          $group: {
            _id: null,
            total: {
              $sum: "$saldo"
            }
          }
        }
      ]);

      /* ================================
         👥 CLIENTES CADASTRADOS
      ================================= */

      const clientes = await Client.countDocuments();

      /* ================================
         🔄 TOTAL DE TRANSAÇÕES
      ================================= */

      const transacoes = await Transaction.countDocuments();

      /* ================================
         💳 CLIENTES COM SALDO
      ================================= */

      const clientesComSaldo = await Client.countDocuments({
        saldo: {
          $gt: 0
        }
      });

      /* ================================
         📈 TICKET MÉDIO
      ================================= */

      const totalDebitoValor =
        totalDebito[0]?.total || 0;

      const ticketMedio =
        transacoes > 0
          ? totalDebitoValor / transacoes
          : 0;

      /* ================================
         💰 TOTAL REALIZADO
      ================================= */

      const totalRecargaValor =
        totalRecarga[0]?.total || 0;

      const saldoDisponivel =
        saldoBodega[0]?.total || 0;

      /* ================================
         📦 ÚLTIMAS TRANSAÇÕES
      ================================= */

      const ultimasTransacoes =
        await Transaction.find()
          .sort({ createdAt: -1 })
          .limit(5);

      /* ================================
         🚀 RESPOSTA
      ================================= */

      res.status(200).json({

        totalRecarga: totalRecargaValor,

        totalDebito: totalDebitoValor,

        saldoBodega: saldoDisponivel,

        clientes,

        transacoes,

        ticketMedio,

        clientesComSaldo,

        ultimasTransacoes

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message: "Erro ao carregar dashboard",

        error: error.message

      });

    }

  }

};

export default controller;
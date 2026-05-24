import Client from "../models/client-model.js";
import Transaction from "../models/transaction-model.js";

const controller = {

  getDashboard: async (req, res) => {

    try {

      /* ================================
         💰 TOTAL DE RECARGAS
      ================================= */

      const totalRecarga = await Transaction.aggregate([
        {
          $match: {
            tipo: "RECARGA"
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
         🏦 SALDO TOTAL CLIENTES
      ================================= */

      const saldoClientes = await Client.aggregate([
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
         👥 TOTAL CLIENTES
      ================================= */

      const clientes =
        await Client.countDocuments();

      /* ================================
         🔄 TOTAL TRANSAÇÕES
      ================================= */

      const transacoes =
        await Transaction.countDocuments();

      /* ================================
         💳 CLIENTES COM SALDO
      ================================= */

      const clientesComSaldo =
        await Client.countDocuments({
          saldo: { $gt: 0 }
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
         💰 VALORES FINAIS
      ================================= */

      const totalRecargaValor =
        totalRecarga[0]?.total || 0;

      const saldoDisponivel =
        saldoClientes[0]?.total || 0;

      /* ================================
         📦 ÚLTIMAS TRANSAÇÕES
      ================================= */

      const ultimasTransacoes =
        await Transaction.find()

          .populate(
            "clienteId",
            "nome codigo"
          )

          .sort({
            createdAt: -1
          })

          .limit(10);

      /* ================================
         📊 VENDAS POR CATEGORIA
      ================================= */

      const vendasPorCategoria =
        await Transaction.aggregate([

          {
            $match: {
              tipo: "DEBITO",
              categoria: {
                $ne: null
              }
            }
          },

          {
            $group: {

              _id: "$categoria",

              totalVendido: {
                $sum: "$valor"
              },

              quantidadeItens: {
                $sum: "$quantidade"
              }

            }
          },

          {
            $sort: {
              totalVendido: -1
            }
          }

        ]);

      /* ================================
         🏆 PRODUTOS MAIS VENDIDOS
      ================================= */

      const produtosMaisVendidos =
        await Transaction.aggregate([

          {
            $match: {
              tipo: "DEBITO",
              produto: {
                $ne: null
              }
            }
          },

          {
            $group: {

              _id: "$produto",

              totalVendido: {
                $sum: "$valor"
              },

              quantidadeVendida: {
                $sum: "$quantidade"
              }

            }
          },

          {
            $sort: {
              quantidadeVendida: -1
            }
          },

          {
            $limit: 5
          }

        ]);

      /* ================================
         💸 PRODUTOS MAIS LUCRATIVOS
      ================================= */

      const produtosMaisLucrativos =
        await Transaction.aggregate([

          {
            $match: {
              tipo: "DEBITO",
              produto: {
                $ne: null
              }
            }
          },

          {
            $group: {

              _id: "$produto",

              totalVendido: {
                $sum: "$valor"
              }

            }
          },

          {
            $sort: {
              totalVendido: -1
            }
          },

          {
            $limit: 5
          }

        ]);

      /* ================================
         👥 CLIENTES COM CRÉDITO
      ================================= */

      const clientesComCredito =
        await Client.find({
          saldo: { $gt: 0 }
        })

          .sort({
            saldo: -1
          })

          .limit(10)

          .select(
            "codigo nome saldo"
          );

      /* ================================
         🏆 CLIENTES QUE MAIS COMPRARAM
      ================================= */

      const rankingClientes =
        await Transaction.aggregate([

          {
            $match: {
              tipo: "DEBITO",
              clienteId: {
                $ne: null
              }
            }
          },

          {
            $group: {

              _id: "$clienteId",

              totalGasto: {
                $sum: "$valor"
              },

              totalCompras: {
                $sum: 1
              }

            }
          },

          {
            $sort: {
              totalGasto: -1
            }
          },

          {
            $lookup: {

              from: "clients",

              localField: "_id",

              foreignField: "_id",

              as: "cliente"

            }
          },

          {
            $unwind: "$cliente"
          },

          {
            $project: {

              _id: 0,

              nome: "$cliente.nome",

              codigo: "$cliente.codigo",

              totalGasto: 1,

              totalCompras: 1

            }
          },

          /* 🚨 REMOVE FELIPE GABRIEL */

          {
  $match: {
    nome: {
      $nin: [
        "Felipe Gabriel",
        "TesteFinal",
        "Arthur Pontes"
      ]
    }
  }
},

          {
            $limit: 5
          }

        ]);

      /* ================================
         🚀 RESPONSE
      ================================= */

      res.status(200).json({

        totalRecarga:
          totalRecargaValor,

        totalDebito:
          totalDebitoValor,

        saldoBodega:
          saldoDisponivel,

        clientes,

        transacoes,

        ticketMedio,

        clientesComSaldo,

        ultimasTransacoes,

        vendasPorCategoria,

        produtosMaisVendidos,

        produtosMaisLucrativos,

        clientesComCredito,

        rankingClientes

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Erro ao carregar dashboard",

        error: error.message

      });

    }

  }

};

export default controller;
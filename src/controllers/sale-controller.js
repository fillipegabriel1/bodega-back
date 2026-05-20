import Client from "../models/client-model.js";
import Transaction from "../models/transaction-model.js";
import Product from "../models/product-model.js";

const controller = {

  realizarVenda: async (req, res) => {

    try {

      const { codigo, itens } = req.body;

      /* =========================
         BUSCAR CLIENTE
      ========================= */

      const client = await Client.findOne({ codigo });

      if (!client) {

        return res.status(404).json({
          message: "Cliente não encontrado"
        });

      }

      let total = 0;

      const itensProcessados = [];

      /* =========================
         VALIDAR ITENS
      ========================= */

      for (const item of itens) {

        const produto =
          await Product.findById(item._id);

        if (!produto) {

          return res.status(404).json({
            message: "Produto não encontrado"
          });

        }

        if (produto.quantidade < item.quantidade) {

          return res.status(400).json({
            message: `${produto.nome} sem estoque suficiente`
          });

        }

        const subtotal =
          produto.preco * item.quantidade;

        total += subtotal;

        itensProcessados.push({
          produtoId: produto._id,
          produto: produto.nome,
          categoria: produto.categoria,
          quantidade: item.quantidade,
          precoUnitario: produto.preco,
          subtotal
        });

      }

      /* =========================
         VALIDAR SALDO
      ========================= */

      if (client.saldo < total) {

        return res.status(400).json({
          message: "Saldo insuficiente"
        });

      }

      /* =========================
         DEBITAR CLIENTE
      ========================= */

      client.saldo -= total;

      await client.save();

      /* =========================
         BAIXAR ESTOQUE
      ========================= */

      for (const item of itens) {

        const produto =
          await Product.findById(item._id);

        produto.quantidade -= item.quantidade;

        await produto.save();

      }

      /* =========================
         GERAR TRANSAÇÕES
      ========================= */

      for (const item of itensProcessados) {

        await Transaction.create({

          clienteId: client._id,

          tipo: "DEBITO",

          valor: item.subtotal,

          produto: item.produto,

          categoria: item.categoria,

          quantidade: item.quantidade,

          precoUnitario: item.precoUnitario,

          observacao:
            `Venda de ${item.produto}`

        });

      }

      /* =========================
         RESPOSTA
      ========================= */

      res.status(200).json({

        message: "Compra realizada com sucesso",

        saldoAtual: client.saldo,

        valorTotal: total,

        itens: itensProcessados

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message: "Erro ao realizar venda",

        error: error.message

      });

    }

  }

};

export default controller;
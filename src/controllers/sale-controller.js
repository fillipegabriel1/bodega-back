import Client from "../models/client-model.js";
import Transaction from "../models/transaction-model.js";
import Product from "../models/product-model.js";

const controller = {

  realizarVenda: async (req, res) => {

    try {

      const { codigo, itens } = req.body;

      const client = await Client.findOne({ codigo });

      if (!client) {
        return res.status(404).json({
          message: "Cliente não encontrado"
        });
      }

      let total = 0;

      // 🔥 validar e calcular total
      for (const item of itens) {

        const produto = await Product.findById(item.id);

        if (!produto) {
          return res.status(404).json({
            message: `Produto não encontrado`
          });
        }

        if (produto.quantidade < 1) {
          return res.status(400).json({
            message: `${produto.nome} sem estoque`
          });
        }

        total += produto.preco;

      }

      if (client.saldo < total) {
        return res.status(400).json({
          message: "Saldo insuficiente"
        });
      }

      // 🔥 debitar saldo
      client.saldo -= total;
      await client.save();

      // 🔥 baixar estoque
      for (const item of itens) {

        const produto = await Product.findById(item.id);

        produto.quantidade -= 1;
        await produto.save();

      }

      // 🔥 salvar transação
      await Transaction.create({
        clienteId: client._id,
        tipo: "DEBITO",
        valor: total,
        descricao: `Compra com ${itens.length} itens`
      });

      res.json({
        message: "Compra realizada com sucesso",
        saldoAtual: client.saldo
      });

    } catch (error) {

      res.status(500).json({
        message: "Erro ao realizar venda",
        error: error.message
      });

    }

  }

};

export default controller;
import Client from "../models/client-model.js";
import Transaction from "../models/transaction-model.js";

const controller = {

  realizarVenda: async (req, res) => {

    try {

      const { codigo, itens } = req.body;

      if (!codigo || !itens || itens.length === 0) {
        return res.status(400).json({
          message: "Dados inválidos"
        });
      }

      const client = await Client.findOne({ codigo });

      if (!client) {
        return res.status(404).json({
          message: "Cliente não encontrado"
        });
      }

      const total = itens.reduce((acc, item) => acc + item.preco, 0);

      if (client.saldo < total) {
        return res.status(400).json({
          message: "Saldo insuficiente"
        });
      }

      client.saldo -= total;
      await client.save();

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
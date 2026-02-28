import Client from "../models/client-model.js";
import Transaction from "../models/transaction-model.js";

const controller = {

    // Criar cliente
    create: async (req, res) => {
        try {
            const result = await Client.create(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ message: "Erro ao criar cliente", error: error.message });
        }
    },

    // Buscar por código
    getByCodigo: async (req, res) => {
        try {
            const result = await Client.findOne({ codigo: req.params.codigo });
            if (!result) return res.status(404).json({ message: "Cliente não encontrado" });

            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: "Erro ao buscar cliente", error: error.message });
        }
    },

    // Recarregar saldo
    recharge: async (req, res) => {
        try {
            const { valor } = req.body;

            const client = await Client.findOne({ codigo: req.params.codigo });
            if (!client) return res.status(404).json({ message: "Cliente não encontrado" });

            client.saldo += valor;
            await client.save();

            await Transaction.create({
                clienteId: client._id,
                tipo: "RECARGA",
                valor
            });

            res.status(200).json({ message: "Saldo recarregado", saldoAtual: client.saldo });

        } catch (error) {
            res.status(500).json({ message: "Erro ao recarregar saldo", error: error.message });
        }
    },

    // Debitar saldo
    debit: async (req, res) => {
        try {
            const { valor } = req.body;

            const client = await Client.findOne({ codigo: req.params.codigo });
            if (!client) return res.status(404).json({ message: "Cliente não encontrado" });

            if (client.saldo < valor) {
                return res.status(400).json({ message: "Saldo insuficiente" });
            }

            client.saldo -= valor;
            await client.save();

            await Transaction.create({
                clienteId: client._id,
                tipo: "DEBITO",
                valor
            });

            res.status(200).json({ message: "Saldo debitado", saldoAtual: client.saldo });

        } catch (error) {
            res.status(500).json({ message: "Erro ao debitar saldo", error: error.message });
        }
    },

    // Histórico por cliente
    getHistory: async (req, res) => {
        try {
            const client = await Client.findOne({ codigo: req.params.codigo });
            if (!client) return res.status(404).json({ message: "Cliente não encontrado" });

            const transactions = await Transaction.find({ clienteId: client._id })
                .sort({ data: -1 });

            res.status(200).json(transactions);

        } catch (error) {
            res.status(500).json({ message: "Erro ao buscar histórico", error: error.message });
        }
}

};

export default controller;
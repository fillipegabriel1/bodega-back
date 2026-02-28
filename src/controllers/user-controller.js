import User from '../models/user-model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const controller = {

    deleteOne: async function (req, res) {
        try {
            const result = await User.deleteOne({ _id: req.params.id });
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({ message: "Erro ao deletar o usuário", error: error.message });
        }
    },

    getOne: async function (req, res) {
        try {
            const result = await User.findOne({ cpf: req.params.id }, { __v: false, _id: false });
            if (!result) return res.status(404).json({ message: "Usuário não encontrado" });

            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({ message: "Erro ao buscar o usuário", error: error.message });
        }
    },

    updateOne: async function (req, res) {
        try {
            await User.updateOne({ cpf: req.params.id }, req.body, { upsert: true });
            res.status(200).json({ message: `Usuário atualizado com sucesso` });
        } catch (error) {
            res.status(500).json({ message: "Erro ao atualizar o usuário", error: error.message });
        }
    },

    getAll: async function (req, res) {
        const result = await User.getAll({}, { __v: false, _id: false });
        res.status(200).json(result);
    },

    create: async function (req, res) {
        try {
            const user = req.body;
            const passwordEncrypted = await bcrypt.hash(user.pass, 10);
            user.pass = passwordEncrypted;

            const result = await User.create(user);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ message: "Erro ao criar o usuário", error: error.message });
        }
    },

    login: async function (req, res) {
        try {
            const { email, pass } = req.body;

            const result = await User.findOne({ email });
            if (!result) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }

            const user = result.toObject();

            const match = await bcrypt.compare(pass, user.pass);
            if (!match) {
                return res.status(401).json({ message: "Senha incorreta" });
            }

            const token = jwt.sign(
                { email: user.email, name: user.name },
                process.env.SECRET,
                { expiresIn: '1h' }
            );

            res.status(200).json({ message: 'Login bem sucedido', token });

        } catch (error) {
            res.status(500).json({ 
                message: "Erro interno ao realizar login", 
                error: error.message 
            });
        }
    }
}

export default controller;

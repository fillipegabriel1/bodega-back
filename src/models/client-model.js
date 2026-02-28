import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
    codigo: { type: Number, required: true, unique: true },
    nome: { type: String, required: true },
    saldo: { type: Number, default: 0 },
    ativo: { type: Boolean, default: true },
    dataCriacao: { type: Date, default: Date.now }
});

const Client = mongoose.model("Client", clientSchema);

export default Client;
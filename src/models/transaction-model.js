import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    clienteId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: true
    },
    tipo: { 
        type: String,
        enum: ["RECARGA", "DEBITO"],
        required: true
    },
    valor: { type: Number, required: true },
    data: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
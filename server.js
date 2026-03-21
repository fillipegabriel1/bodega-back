import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

import userRouter from './src/routers/user-router.js';
import productRouter from './src/routers/product-router.js';
import clientRouter from './src/routers/client-router.js';
import dashboardRouter from './src/routers/dashboard-router.js';
import saleRouter from './src/routers/sale-router.js';

dotenv.config();

const app = express();

/* CONEXÃO COM MONGODB */
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('✅ Banco conectado com sucesso');
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar no banco:', err);
  });

/* MIDDLEWARES */
app.use(express.json());

app.use(cors({
  origin: "*"
}));

/* ROTA DE TESTE DA API */
app.get('/', (req, res) => {
  res.json({ status: "API Bodega funcionando 🚀" });
});

/* ROTAS DA API (SEM AUTENTICAÇÃO) */
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/client', clientRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/sale', saleRouter);

/* PORTA */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
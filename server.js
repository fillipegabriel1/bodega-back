import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import cors from 'cors';

import userRouter from './src/routers/user-router.js';
import productRouter from './src/routers/product-router.js';
import clientRouter from './src/routers/client-router.js';
import authMiddleware from './src/services/auth-middleware.js';

const app = express();

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('✅ Banco conectado com sucesso');
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar no banco:', err);
  });

app.use(express.json());

/* CORS CORRETO */
app.use(cors({
  origin: [
    process.env.FRONT_URL,
    "http://localhost:5173",
    "https://bodega-front-pied.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

/* liberar preflight */
app.options('*', cors());

/* ROTAS PUBLICAS */
app.use('/api/user', userRouter);

/* ROTAS PROTEGIDAS */
app.use(authMiddleware);
app.use('/api/product', productRouter);
app.use('/api/client', clientRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
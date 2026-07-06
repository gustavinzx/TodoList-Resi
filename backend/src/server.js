import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testarConexao } from './config/database.js';
import { iniciarCronDeEmails } from './services/emailService.js';
import usuariosRoutes from './routes/usuarios.js';
import tarefasRoutes from './routes/tarefas.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',');

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (server-to-server, curl, etc.)
        if (!origin || ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
        callback(new Error('CORS: Origem não permitida'));
    },
    credentials: true,
}));
app.use(express.json());

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/tarefas', tarefasRoutes);

app.get('/', (req, res) => {
    res.json({ status: 'API Todo-List rodando 📋' });
});

app.listen(PORT, async () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    await testarConexao();
    iniciarCronDeEmails();
});
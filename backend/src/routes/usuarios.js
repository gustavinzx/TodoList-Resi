import express from 'express';
import { cadastrar, login, getMe, listarTodos, editarUsuario, excluirUsuario } from '../controllers/usuariosController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/cadastrar', cadastrar);
router.post('/login', login);

// Private routes
router.get('/me', authenticateToken, getMe);

// Admin routes
const adminOnly = (req, res, next) => {
    if (req.user.perfil !== 'admin') return res.status(403).json({ erro: 'Acesso negado' });
    next();
};

router.get('/', authenticateToken, adminOnly, listarTodos);
router.put('/:id', authenticateToken, adminOnly, editarUsuario);
router.delete('/:id', authenticateToken, adminOnly, excluirUsuario);

export default router;

import express from 'express';
import { criar, listar, atualizar, excluir, gerarRelatorio } from '../controllers/tarefasController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/relatorio', authenticateToken, gerarRelatorio); // MUST be before /:id
router.get('/', authenticateToken, listar);
router.post('/', authenticateToken, criar);
router.put('/:id', authenticateToken, atualizar);
router.delete('/:id', authenticateToken, excluir);

export default router;

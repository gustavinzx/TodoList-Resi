import { pool } from '../config/database.js';
import PDFDocument from 'pdfkit';

export const criar = async (req, res) => {
    try {
        const { titulo, descricao } = req.body;
        if (!titulo) return res.status(400).json({ erro: 'Título é obrigatório' });

        const [result] = await pool.query(
            'INSERT INTO todo_tarefas (usuario_id, titulo, descricao, status) VALUES (?, ?, ?, ?)',
            [req.user.id, titulo, descricao || null, 'a_fazer']
        );

        res.status(201).json({ id: result.insertId, titulo, descricao, status: 'a_fazer' });
    } catch (e) {
        res.status(500).json({ erro: e.message });
    }
};

export const listar = async (req, res) => {
    try {
        // Se for admin, pode listar de todos (se passar ?all=true), senão lista só do usuário
        let query = 'SELECT * FROM todo_tarefas WHERE usuario_id = ? ORDER BY id DESC';
        let params = [req.user.id];

        if (req.user.perfil === 'admin' && req.query.all === 'true') {
            query = 'SELECT t.*, u.nome as dono FROM todo_tarefas t JOIN todo_usuarios u ON t.usuario_id = u.id ORDER BY t.id DESC';
            params = [];
        }

        const [tarefas] = await pool.query(query, params);
        res.json(tarefas);
    } catch (e) {
        res.status(500).json({ erro: e.message });
    }
};

export const atualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descricao, status } = req.body;

        const [result] = await pool.query(
            'UPDATE todo_tarefas SET titulo = COALESCE(?, titulo), descricao = COALESCE(?, descricao), status = COALESCE(?, status) WHERE id = ? AND usuario_id = ?',
            [titulo, descricao, status, id, req.user.id]
        );

        if (result.affectedRows === 0) return res.status(404).json({ erro: 'Tarefa não encontrada ou não pertence a você' });
        res.json({ mensagem: 'Tarefa atualizada' });
    } catch (e) {
        res.status(500).json({ erro: e.message });
    }
};

export const excluir = async (req, res) => {
    try {
        const { id } = req.params;
        // Admins can delete any task
        const isOwnerStr = req.user.perfil === 'admin' ? '' : ' AND usuario_id = ?';
        const params = req.user.perfil === 'admin' ? [id] : [id, req.user.id];

        const [result] = await pool.query(`DELETE FROM todo_tarefas WHERE id = ?${isOwnerStr}`, params);
        
        if (result.affectedRows === 0) return res.status(404).json({ erro: 'Tarefa não encontrada' });
        res.json({ mensagem: 'Tarefa excluída' });
    } catch (e) {
        res.status(500).json({ erro: e.message });
    }
};

export const gerarRelatorio = async (req, res) => {
    try {
        const { status } = req.query; // a_fazer, em_andamento, concluida
        
        let query = 'SELECT * FROM todo_tarefas WHERE usuario_id = ?';
        const params = [req.user.id];
        
        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }

        const [tarefas] = await pool.query(query, params);
        const [userRows] = await pool.query('SELECT nome FROM todo_usuarios WHERE id = ?', [req.user.id]);
        const userName = userRows[0]?.nome || 'Usuário';

        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=relatorio_tarefas.pdf`);

        doc.pipe(res);

        doc.fontSize(20).text('Relatório de Tarefas', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Gerado por: ${userName}`);
        doc.text(`Data e Horário: ${new Date().toLocaleString('pt-BR')}`);
        doc.text(`Filtro de Status: ${status ? status.replace('_', ' ') : 'Todos'}`);
        doc.moveDown();
        doc.text('----------------------------------------------------');
        doc.moveDown();

        if (tarefas.length === 0) {
            doc.text('Nenhuma tarefa encontrada com este filtro.');
        } else {
            tarefas.forEach(t => {
                doc.fontSize(14).text(`Título: ${t.titulo}`, { continued: true }).fontSize(10).text(`  (${new Date(t.criado_em).toLocaleDateString('pt-BR')})`);
                doc.fontSize(12).text(`Status: ${t.status.toUpperCase()}`);
                if (t.descricao) doc.text(`Descrição: ${t.descricao}`);
                doc.moveDown();
            });
        }

        doc.end();
    } catch (e) {
        res.status(500).json({ erro: e.message });
    }
};

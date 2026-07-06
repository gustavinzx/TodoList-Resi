import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';

export const cadastrar = async (req, res) => {
    try {
        const { nome, username, email, senha } = req.body;
        if (!nome || !username || !email || !senha) {
            return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
        }

        const [existing] = await pool.query('SELECT id FROM todo_usuarios WHERE email = ? OR username = ?', [email, username]);
        if (existing.length > 0) return res.status(400).json({ erro: 'E-mail ou Username já cadastrado' });

        const salt = await bcrypt.genSalt(10);
        const senha_hash = await bcrypt.hash(senha, salt);

        const [result] = await pool.query(
            'INSERT INTO todo_usuarios (nome, username, email, senha_hash, perfil) VALUES (?, ?, ?, ?, ?)',
            [nome, username, email, senha_hash, 'user']
        );

        const token = jwt.sign(
            { userId: result.insertId, perfil: 'user' },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );

        res.status(201).json({ mensagem: 'Usuário cadastrado', token });
    } catch (e) {
        res.status(500).json({ erro: e.message });
    }
};

export const login = async (req, res) => {
    try {
        const { login, senha } = req.body;
        if (!login || !senha) return res.status(400).json({ erro: 'Login e senha obrigatórios' });

        const [users] = await pool.query('SELECT * FROM todo_usuarios WHERE email = ? OR username = ?', [login, login]);
        if (users.length === 0) return res.status(401).json({ erro: 'Credenciais inválidas' });

        const user = users[0];
        const senhaCorreta = await bcrypt.compare(senha, user.senha_hash);
        if (!senhaCorreta) return res.status(401).json({ erro: 'Credenciais inválidas' });

        const token = jwt.sign(
            { userId: user.id, perfil: user.perfil },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );

        res.json({ mensagem: 'Login realizado', token, usuario: { id: user.id, nome: user.nome, perfil: user.perfil } });
    } catch (e) {
        res.status(500).json({ erro: e.message });
    }
};

export const getMe = async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, nome, username, email, perfil, criado_em FROM todo_usuarios WHERE id = ?', [req.user.id]);
        if (users.length === 0) return res.status(404).json({ erro: 'Usuário não encontrado' });
        res.json(users[0]);
    } catch (e) {
        res.status(500).json({ erro: e.message });
    }
};

// --- ADMIN ROUTES ---
export const listarTodos = async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, nome, username, email, perfil, criado_em FROM todo_usuarios ORDER BY id DESC');
        res.json(users);
    } catch (e) {
        res.status(500).json({ erro: e.message });
    }
};

// Admin cria um novo usuário (pode definir o perfil direto)
export const criarUsuarioAdmin = async (req, res) => {
    try {
        const { nome, username, email, senha, perfil } = req.body;
        if (!nome || !username || !email || !senha) {
            return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
        }

        const [existing] = await pool.query('SELECT id FROM todo_usuarios WHERE email = ? OR username = ?', [email, username]);
        if (existing.length > 0) return res.status(400).json({ erro: 'E-mail ou Username já cadastrado' });

        const salt = await bcrypt.genSalt(10);
        const senha_hash = await bcrypt.hash(senha, salt);
        const perfilFinal = perfil === 'admin' ? 'admin' : 'user';

        const [result] = await pool.query(
            'INSERT INTO todo_usuarios (nome, username, email, senha_hash, perfil) VALUES (?, ?, ?, ?, ?)',
            [nome, username, email, senha_hash, perfilFinal]
        );

        res.status(201).json({ id: result.insertId, nome, username, email, perfil: perfilFinal });
    } catch (e) {
        res.status(500).json({ erro: e.message });
    }
};

export const editarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email, perfil } = req.body;
        await pool.query('UPDATE todo_usuarios SET nome = ?, email = ?, perfil = ? WHERE id = ?', [nome, email, perfil, id]);
        res.json({ mensagem: 'Usuário atualizado com sucesso' });
    } catch (e) {
        res.status(500).json({ erro: e.message });
    }
};

export const excluirUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM todo_usuarios WHERE id = ?', [id]);
        res.json({ mensagem: 'Usuário excluído' });
    } catch (e) {
        res.status(500).json({ erro: e.message });
    }
};

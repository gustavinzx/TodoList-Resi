const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDB() {
    try {
        const c = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            multipleStatements: true
        });

        const sql = `
            CREATE DATABASE IF NOT EXISTS todolist_rec;
            USE todolist_rec;
            CREATE TABLE IF NOT EXISTS todo_usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                senha_hash VARCHAR(255) NOT NULL,
                perfil ENUM('admin', 'user') DEFAULT 'user',
                criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS todo_tarefas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                usuario_id INT NOT NULL,
                titulo VARCHAR(150) NOT NULL,
                descricao TEXT,
                status ENUM('a_fazer', 'em_andamento', 'concluida') DEFAULT 'a_fazer',
                criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
                atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (usuario_id) REFERENCES todo_usuarios(id) ON DELETE CASCADE
            );
        `;

        await c.query(sql);
        console.log("Tabelas do TODO-LIST (todo_usuarios, todo_tarefas) criadas com sucesso no banco atual!");
        await c.end();
    } catch (e) {
        console.error("Erro ao criar tabelas:", e);
    }
}

setupDB();

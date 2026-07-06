import nodemailer from 'nodemailer';
import cron from 'node-cron';
import { pool } from '../config/database.js';

// Configuração do Nodemailer (usando Mailtrap ou Ethereal para testes locais, ou Gmail)
// Para a faculdade, o ideal é mostrar que funciona. Vamos usar um serviço mock ou pedir as credenciais no .env
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.mailtrap.io",
    port: process.env.EMAIL_PORT || 2525,
    auth: {
        user: process.env.EMAIL_USER || "usuario_mailtrap",
        pass: process.env.EMAIL_PASS || "senha_mailtrap"
    }
});

export const iniciarCronDeEmails = () => {
    // Roda todos os dias às 08:00 (ou a cada 1 minuto para testes: '* * * * *')
    cron.schedule('* * * * *', async () => {
        try {
            console.log('⏳ CRON: Verificando tarefas pendentes para envio de e-mails...');
            
            // Busca tarefas não concluídas agrupadas por usuário
            const [tarefas] = await pool.query(`
                SELECT t.titulo, t.status, u.nome, u.email 
                FROM todo_tarefas t 
                JOIN todo_usuarios u ON t.usuario_id = u.id 
                WHERE t.status != 'concluida'
            `);

            if (tarefas.length === 0) return;

            // Agrupa por e-mail do usuário
            const tarefasPorUsuario = tarefas.reduce((acc, t) => {
                if (!acc[t.email]) acc[t.email] = { nome: t.nome, tarefas: [] };
                acc[t.email].tarefas.push(t);
                return acc;
            }, {});

            // Envia um e-mail para cada usuário
            for (const email in tarefasPorUsuario) {
                const { nome, tarefas } = tarefasPorUsuario[email];
                
                let html = `<h2>Olá, ${nome}!</h2><p>Você tem <b>${tarefas.length}</b> tarefas pendentes:</p><ul>`;
                tarefas.forEach(t => {
                    html += `<li><b>${t.titulo}</b> - Status: ${t.status.replace('_', ' ')}</li>`;
                });
                html += `</ul><p>Acesse o sistema para atualizá-las.</p>`;

                await transporter.sendMail({
                    from: '"Todo-List Admin" <admin@todolist.com>',
                    to: email,
                    subject: '🚨 Você tem Tarefas Pendentes!',
                    html
                });
                console.log(`✉️ E-mail enviado para ${email}`);
            }
        } catch (e) {
            console.error('❌ Erro no CRON de e-mails:', e.message);
        }
    });
};

'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { Trash2, UserCog, Users, ListTodo } from 'lucide-react';

interface Usuario {
    id: number;
    nome: string;
    username: string;
    email: string;
    perfil: string;
    criado_em: string;
}

export default function AdminPanel() {
    const { user, token } = useAuth();
    const router = useRouter();
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [tarefas, setTarefas] = useState<any[]>([]);

    useEffect(() => {
        if (!token) return;
        if (user?.perfil !== 'admin') {
            router.push('/dashboard');
            return;
        }
        fetchUsuarios();
        fetchTodasTarefas();
    }, [token, user]);

    async function fetchUsuarios() {
        try {
            const { data } = await api.get('/usuarios');
            setUsuarios(data);
        } catch (e) {
            toast.error('Erro ao carregar usuários');
        } finally {
            setLoading(false);
        }
    }

    async function fetchTodasTarefas() {
        try {
            const { data } = await api.get('/tarefas?all=true');
            setTarefas(data);
        } catch (e) {
            console.error(e);
        }
    }

    async function deletarUsuario(id: number) {
        if (!confirm('Tem certeza que deseja excluir este usuário? Todas as tarefas dele serão perdidas.')) return;
        try {
            await api.delete(`/usuarios/${id}`);
            fetchUsuarios();
            fetchTodasTarefas();
            toast.success('Usuário excluído');
        } catch (e) {
            toast.error('Erro ao excluir');
        }
    }

    async function promoverAdmin(id: number, currentNome: string, currentEmail: string, currentPerfil: string) {
        const novoPerfil = currentPerfil === 'admin' ? 'user' : 'admin';
        try {
            await api.put(`/usuarios/${id}`, { nome: currentNome, email: currentEmail, perfil: novoPerfil });
            fetchUsuarios();
            toast.success('Perfil atualizado');
        } catch (e) {
            toast.error('Erro ao atualizar perfil');
        }
    }

    if (!token || user?.perfil !== 'admin') return <div className="p-8">Acesso restrito.</div>;
    if (loading) return <div className="p-8 text-center">Carregando painel admin...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <ShieldIcon /> Painel de Administração
                </h1>
                <p className="text-slate-500 mt-2">Visão geral do sistema TODO-List Residência Porto Digital</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Gestão de Usuários */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                        <Users className="w-5 h-5 text-blue-500" />
                        Usuários Cadastrados
                    </h2>
                    <div className="card-ui overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800/50">
                                <tr>
                                    <th className="px-4 py-3">Nome</th>
                                    <th className="px-4 py-3">E-mail</th>
                                    <th className="px-4 py-3">Perfil</th>
                                    <th className="px-4 py-3 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map(u => (
                                    <tr key={u.id} className="border-b border-slate-200 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="px-4 py-3 font-medium">{u.nome}</td>
                                        <td className="px-4 py-3 text-slate-500">{u.email}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs ${u.perfil === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {u.perfil}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button 
                                                onClick={() => promoverAdmin(u.id, u.nome, u.email, u.perfil)}
                                                className="text-slate-400 hover:text-amber-500 mr-3"
                                                title="Alternar Perfil"
                                            >
                                                <UserCog className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => deletarUsuario(u.id)}
                                                className="text-slate-400 hover:text-red-500"
                                                title="Excluir Usuário"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Visão Global de Tarefas */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                        <ListTodo className="w-5 h-5 text-emerald-500" />
                        Todas as Tarefas do Sistema
                    </h2>
                    <div className="card-ui overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800/50">
                                <tr>
                                    <th className="px-4 py-3">Dono</th>
                                    <th className="px-4 py-3">Tarefa</th>
                                    <th className="px-4 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tarefas.map(t => (
                                    <tr key={t.id} className="border-b border-slate-200 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="px-4 py-3 font-medium text-slate-600 dark:text-slate-400">{t.dono}</td>
                                        <td className="px-4 py-3">{t.titulo}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                t.status === 'concluida' ? 'bg-emerald-100 text-emerald-700' :
                                                t.status === 'em_andamento' ? 'bg-blue-100 text-blue-700' :
                                                'bg-slate-100 text-slate-700'
                                            }`}>
                                                {t.status.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {tarefas.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-4 py-8 text-center text-slate-500">Nenhuma tarefa no sistema.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ShieldIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
    );
}

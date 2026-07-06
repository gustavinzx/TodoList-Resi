'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { Trash2, UserCog, Users, ListTodo, Shield } from 'lucide-react';
import { NatureBackground } from '@/components/ui/NatureBackground';
import BlurText from '@/components/ui/BlurText';

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

    if (!token || user?.perfil !== 'admin') return <div className="p-8 text-white">Acesso restrito.</div>;
    if (loading) return <div className="p-8 text-center text-white">Carregando painel admin...</div>;

    return (
        <NatureBackground>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10 w-full flex-grow">
                
                <div className="bg-slate-900/40 p-8 rounded-2xl backdrop-blur-md border border-white/10 shadow-2xl">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3 drop-shadow-md">
                        <Shield className="w-8 h-8 text-amber-400" />
                        <BlurText text="Painel de Administração" delay={50} animateBy="words" direction="top" />
                    </h1>
                    <p className="text-slate-300 mt-2">Visão geral do sistema e controle de acessos da plataforma.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Gestão de Usuários */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2 text-white drop-shadow-md">
                            <Users className="w-5 h-5 text-blue-400" />
                            Usuários Cadastrados
                        </h2>
                        <div className="glass-dark overflow-hidden rounded-xl border border-white/10 shadow-2xl">
                            <table className="w-full text-sm text-left text-slate-300">
                                <thead className="text-xs text-slate-400 uppercase bg-slate-900/60 border-b border-white/10">
                                    <tr>
                                        <th className="px-5 py-4">Nome</th>
                                        <th className="px-5 py-4">E-mail</th>
                                        <th className="px-5 py-4">Perfil</th>
                                        <th className="px-5 py-4 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usuarios.map(u => (
                                        <tr key={u.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                            <td className="px-5 py-4 font-medium text-white">{u.nome}</td>
                                            <td className="px-5 py-4">{u.email}</td>
                                            <td className="px-5 py-4">
                                                <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${u.perfil === 'admin' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-blue-500/20 text-blue-300 border-blue-500/30'}`}>
                                                    {u.perfil.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <button 
                                                    onClick={() => promoverAdmin(u.id, u.nome, u.email, u.perfil)}
                                                    className="text-slate-400 hover:text-amber-400 mr-4 transition-colors bg-slate-800/50 p-2 rounded-lg"
                                                    title="Alternar Perfil"
                                                >
                                                    <UserCog className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => deletarUsuario(u.id)}
                                                    className="text-slate-400 hover:text-red-400 transition-colors bg-slate-800/50 p-2 rounded-lg"
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
                        <h2 className="text-xl font-semibold flex items-center gap-2 text-white drop-shadow-md">
                            <ListTodo className="w-5 h-5 text-emerald-400" />
                            Todas as Tarefas do Sistema
                        </h2>
                        <div className="glass-dark overflow-hidden rounded-xl border border-white/10 shadow-2xl">
                            <table className="w-full text-sm text-left text-slate-300">
                                <thead className="text-xs text-slate-400 uppercase bg-slate-900/60 border-b border-white/10">
                                    <tr>
                                        <th className="px-5 py-4">Dono</th>
                                        <th className="px-5 py-4">Tarefa</th>
                                        <th className="px-5 py-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tarefas.map(t => (
                                        <tr key={t.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                            <td className="px-5 py-4 font-medium text-blue-200">{t.dono}</td>
                                            <td className="px-5 py-4 text-white line-clamp-1 max-w-[150px]">{t.titulo}</td>
                                            <td className="px-5 py-4">
                                                <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                                                    t.status === 'concluida' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                                                    t.status === 'em_andamento' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                                                    'bg-slate-700/50 text-slate-300 border-slate-600/50'
                                                }`}>
                                                    {t.status.replace('_', ' ').toUpperCase()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {tarefas.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="px-5 py-8 text-center text-slate-400">Nenhuma tarefa no sistema.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </NatureBackground>
    );
}

'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { Trash2, UserCog, Users, ListTodo, Shield, Pencil } from 'lucide-react';
import { NatureBackground } from '@/components/ui/NatureBackground';
import BlurText from '@/components/ui/BlurText';
import Modal from '@/components/Modal';

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
    const [showModal, setShowModal] = useState(false);
    const [editando, setEditando] = useState<Usuario | null>(null);
    const [form, setForm] = useState({ nome: '', username: '', email: '', senha: '', perfil: 'user' });

    function abrirCriar() {
        setEditando(null);
        setForm({ nome: '', username: '', email: '', senha: '', perfil: 'user' });
        setShowModal(true);
    }

    function abrirEditar(u: Usuario) {
        setEditando(u);
        setForm({ nome: u.nome, username: u.username, email: u.email, senha: '', perfil: u.perfil });
        setShowModal(true);
    }

    async function salvarUsuario() {
        try {
            if (editando) {
                await api.put(`/usuarios/${editando.id}`, { nome: form.nome, email: form.email, perfil: form.perfil });
                toast.success('Usuário atualizado');
            } else {
                await api.post('/usuarios', form);
                toast.success('Usuário criado');
            }
            setShowModal(false);
            fetchUsuarios();
        } catch (e: any) {
            toast.error(e?.response?.data?.erro || 'Erro ao salvar usuário');
        }
    }

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
                        <div className="flex justify-between items-center drop-shadow-md">
                            <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
                                <Users className="w-5 h-5 text-blue-400" />
                                Usuários Cadastrados
                            </h2>
                            <button onClick={abrirCriar} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 shadow-md">
                                + Novo Usuário
                            </button>
                        </div>
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
                                            <td className="px-5 py-4 text-right min-w-[140px]">
                                                <button 
                                                    onClick={() => abrirEditar(u)} 
                                                    className="text-slate-400 hover:text-blue-400 mr-2 transition-colors bg-slate-800/50 p-2 rounded-lg" 
                                                    title="Editar"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => promoverAdmin(u.id, u.nome, u.email, u.perfil)}
                                                    className="text-slate-400 hover:text-amber-400 mr-2 transition-colors bg-slate-800/50 p-2 rounded-lg"
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

            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <h3 className="text-lg font-bold text-white mb-4">{editando ? 'Editar Usuário' : 'Novo Usuário'}</h3>
                    <div className="space-y-3">
                        <input placeholder="Nome" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white outline-none focus:border-blue-500" />
                        {!editando && (
                            <input placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white outline-none focus:border-blue-500" />
                        )}
                        <input placeholder="E-mail" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white outline-none focus:border-blue-500" />
                        {!editando && (
                            <input placeholder="Senha" type="password" value={form.senha} onChange={e => setForm({ ...form, senha: e.target.value })} className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white outline-none focus:border-blue-500" />
                        )}
                        <select value={form.perfil} onChange={e => setForm({ ...form, perfil: e.target.value })} className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white outline-none focus:border-blue-500">
                            <option value="user">Usuário</option>
                            <option value="admin">Admin</option>
                        </select>
                        <button onClick={salvarUsuario} className="w-full py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors mt-2">Salvar</button>
                    </div>
                </Modal>
            )}
        </NatureBackground>
    );
}

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import api from '@/lib/api';
import { CheckSquare } from 'lucide-react';

export default function Cadastro() {
    const [form, setForm] = useState({ nome: '', username: '', email: '', senha: '' });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/usuarios/cadastrar', form);
            toast.success('Conta criada com sucesso! Faça login.');
            router.push('/login');
        } catch (err: any) {
            toast.error(err.response?.data?.erro ?? 'Erro ao criar conta');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-900 pt-16">
            <div className="max-w-md w-full space-y-8 card-ui p-8 bg-white dark:bg-slate-800">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                            <CheckSquare className="w-8 h-8" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Crie sua conta</h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Comece a organizar suas tarefas hoje mesmo</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nome Completo</label>
                            <input
                                type="text"
                                required
                                value={form.nome}
                                onChange={e => setForm({ ...form, nome: e.target.value })}
                                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                placeholder="João Silva"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nome de Usuário</label>
                            <input
                                type="text"
                                required
                                value={form.username}
                                onChange={e => setForm({ ...form, username: e.target.value })}
                                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                placeholder="joaosilva"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">E-mail</label>
                            <input
                                type="email"
                                required
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                placeholder="joao@exemplo.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Senha</label>
                            <input
                                type="password"
                                required
                                value={form.senha}
                                onChange={e => setForm({ ...form, senha: e.target.value })}
                                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Cadastrando...' : 'Cadastrar'}
                    </button>
                </form>

                <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
                    Já possui conta?{' '}
                    <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                        Faça login
                    </Link>
                </p>
            </div>
        </div>
    );
}

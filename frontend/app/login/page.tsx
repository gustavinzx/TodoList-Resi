'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import api from '@/lib/api';
import { CheckSquare } from 'lucide-react';

export default function Login() {
    const [form, setForm] = useState({ login: '', senha: '' });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/usuarios/login', form);
            localStorage.setItem('token', data.token);
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
            window.dispatchEvent(new Event('localStorageChange'));
            toast.success('Login bem-sucedido!');
            router.push('/dashboard');
        } catch (err: any) {
            toast.error(err.response?.data?.erro ?? 'Erro ao fazer login');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-900">
            <div className="max-w-md w-full space-y-8 card-ui p-8 bg-white dark:bg-slate-800">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                            <CheckSquare className="w-8 h-8" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Acesse sua conta</h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Gerencie suas tarefas com facilidade</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">E-mail ou Usuário</label>
                            <input
                                type="text"
                                required
                                value={form.login}
                                onChange={e => setForm({ ...form, login: e.target.value })}
                                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                placeholder="exemplo@email.com"
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
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
                    Ainda não tem conta?{' '}
                    <Link href="/cadastro" className="font-medium text-blue-600 hover:text-blue-500">
                        Cadastre-se grátis
                    </Link>
                </p>
            </div>
        </div>
    );
}

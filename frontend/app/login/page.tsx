'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import api from '@/lib/api';
import { CheckSquare, ArrowLeft } from 'lucide-react';
import ShinyText from '@/components/ui/ShinyText';

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
        <div className="min-h-screen flex w-full">
            {/* Esquerda - Imagem Fotográfica (Natureza Abstrata/Foco) */}
            <div className="hidden lg:flex flex-1 relative bg-slate-900 overflow-hidden items-end p-12">
                <img 
                    src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2574&auto=format&fit=crop" 
                    alt="Natureza Abstrata"
                    className="absolute inset-0 w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                
                <div className="relative z-10 max-w-xl">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-dark text-blue-300 text-sm font-medium mb-6">
                        <CheckSquare className="w-4 h-4" />
                        Todo-List Pro
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                        Foco no que realmente <br/> <span className="text-blue-400">importa.</span>
                    </h1>
                    <p className="text-slate-300 text-lg">
                        Deixe a desordem para trás. Uma interface limpa, orgânica e desenhada para maximizar a sua produtividade diária.
                    </p>
                </div>
            </div>

            {/* Direita - Formulário Glass/Clean */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 bg-slate-50 dark:bg-slate-900 relative">
                
                <Link href="/" className="absolute top-8 left-8 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-2 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Voltar
                </Link>

                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Bem-vindo de volta</h2>
                        <p className="mt-2 text-slate-500 dark:text-slate-400">Acesse sua conta para continuar</p>
                    </div>

                    <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">E-mail ou Usuário</label>
                                <input
                                    type="text"
                                    required
                                    value={form.login}
                                    onChange={e => setForm({ ...form, login: e.target.value })}
                                    className="block w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="exemplo@email.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Senha</label>
                                <input
                                    type="password"
                                    required
                                    value={form.senha}
                                    onChange={e => setForm({ ...form, senha: e.target.value })}
                                    className="block w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all card-hover"
                        >
                            {loading ? 'Autenticando...' : <ShinyText text="Entrar na Plataforma" disabled={false} speed={3} className="text-white font-medium" />}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-8">
                        Ainda não tem conta?{' '}
                        <Link href="/cadastro" className="font-semibold text-blue-600 hover:text-blue-500">
                            Crie gratuitamente
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

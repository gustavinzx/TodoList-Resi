'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import api from '@/lib/api';
import { CheckSquare, ArrowLeft } from 'lucide-react';
import ShinyText from '@/components/ui/ShinyText';

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
        <div className="min-h-screen flex w-full">
            {/* Direita - Imagem Fotográfica (Natureza Abstrata) */}
            <div className="hidden lg:flex flex-1 relative bg-slate-900 overflow-hidden items-end p-12 order-2">
                <img 
                    src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2574&auto=format&fit=crop" 
                    alt="Natureza Abstrata"
                    className="absolute inset-0 w-full h-full object-cover opacity-70"
                    style={{ transform: 'scaleX(-1)' }} // Invertida só pra dar uma diferença do login
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                
                <div className="relative z-10 max-w-xl">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-dark text-blue-300 text-sm font-medium mb-6">
                        <CheckSquare className="w-4 h-4" />
                        Todo-List Pro
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                        Comece a sua jornada <br/> de <span className="text-blue-400">alta performance.</span>
                    </h1>
                    <p className="text-slate-300 text-lg">
                        Organização é a chave para a produtividade. Junte-se a nós e transforme sua rotina em resultados concretos.
                    </p>
                </div>
            </div>

            {/* Esquerda - Formulário Clean */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 bg-slate-50 dark:bg-slate-900 relative order-1 py-12">
                
                <Link href="/" className="absolute top-8 left-8 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-2 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Voltar
                </Link>

                <div className="max-w-md w-full space-y-6">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Crie sua conta</h2>
                        <p className="mt-2 text-slate-500 dark:text-slate-400">É rápido, fácil e gratuito.</p>
                    </div>

                    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nome Completo</label>
                            <input
                                type="text"
                                required
                                value={form.nome}
                                onChange={e => setForm({ ...form, nome: e.target.value })}
                                className="block w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="João Silva"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nome de Usuário</label>
                            <input
                                type="text"
                                required
                                value={form.username}
                                onChange={e => setForm({ ...form, username: e.target.value })}
                                className="block w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="joaosilva"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">E-mail</label>
                            <input
                                type="email"
                                required
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                className="block w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="joao@exemplo.com"
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all card-hover mt-4"
                        >
                            {loading ? 'Cadastrando...' : <ShinyText text="Finalizar Cadastro" disabled={false} speed={3} className="text-white font-medium" />}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-6">
                        Já possui conta?{' '}
                        <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500">
                            Fazer Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

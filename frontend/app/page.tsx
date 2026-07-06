'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, Mail } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center pt-20 px-4">
            <div className="text-center max-w-3xl space-y-8 mt-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    Residência Porto Digital III
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Organize seu dia.<br/>
                    <span className="text-blue-600 dark:text-blue-500">Conquiste o amanhã.</span>
                </h1>
                
                <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Um sistema completo de gerenciamento de tarefas desenvolvido para manter sua produtividade em dia com relatórios em PDF e alertas por e-mail.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                    <Link href="/cadastro" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all card-hover">
                        Começar Agora <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link href="/login" className="w-full sm:w-auto flex items-center justify-center px-8 py-4 rounded-xl bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:hover:bg-slate-700 transition-all font-medium">
                        Já tenho conta
                    </Link>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl w-full mt-32">
                <div className="card-ui p-6 space-y-4">
                    <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-semibold">Gestão Simplificada</h3>
                    <p className="text-slate-600 dark:text-slate-400">Organize suas atividades em status claros: A Fazer, Em Andamento e Concluídas.</p>
                </div>

                <div className="card-ui p-6 space-y-4">
                    <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                        <Mail className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-semibold">Alertas Automáticos</h3>
                    <p className="text-slate-600 dark:text-slate-400">Receba notificações por e-mail sobre as tarefas que ainda estão pendentes.</p>
                </div>

                <div className="card-ui p-6 space-y-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-semibold">Controle Total</h3>
                    <p className="text-slate-600 dark:text-slate-400">Painel de administração completo para gerenciar usuários e visualizar progresso.</p>
                </div>
            </div>
        </div>
    );
}

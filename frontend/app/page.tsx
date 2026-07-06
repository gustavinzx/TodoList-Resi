'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, Mail } from 'lucide-react';
import { NatureBackground } from '@/components/ui/NatureBackground';
import BlurText from '@/components/ui/BlurText';
import ShinyText from '@/components/ui/ShinyText';

export default function Home() {
    return (
        <NatureBackground>
            <div className="flex flex-col items-center pt-24 px-4 flex-grow">
                <div className="text-center max-w-4xl space-y-8 mt-12 relative z-10">
                    
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-dark text-blue-300 text-sm font-medium border border-blue-500/30">
                        <CheckCircle2 className="w-4 h-4" />
                        <ShinyText text="Residência Porto Digital III" disabled={false} speed={3} className="text-sm font-medium" />
                    </div>
                    
                    <div className="text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-lg">
                        <BlurText 
                            text="Organize seu dia." 
                            delay={100} 
                            animateBy="words" 
                            direction="top"
                            className="text-white inline-block mr-3"
                        />
                        <BlurText 
                            text="Conquiste o amanhã." 
                            delay={150} 
                            animateBy="words" 
                            direction="bottom"
                            className="text-blue-400 inline-block"
                        />
                    </div>
                    
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto drop-shadow">
                        Um sistema completo de gerenciamento de tarefas desenvolvido para manter sua produtividade em dia com relatórios em PDF e alertas por e-mail.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                        <Link href="/cadastro" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue-600/90 text-white font-medium hover:bg-blue-600 transition-all card-hover backdrop-blur-sm border border-blue-500/50 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                            Começar Agora <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link href="/login" className="w-full sm:w-auto flex items-center justify-center px-8 py-4 rounded-xl glass text-slate-100 hover:bg-slate-800/50 transition-all font-medium">
                            Já tenho conta
                        </Link>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl w-full mt-24 mb-16 relative z-10">
                    <div className="glass-dark p-6 space-y-4 rounded-xl card-hover border-t border-slate-700/50">
                        <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">Gestão Simplificada</h3>
                        <p className="text-slate-400">Organize suas atividades em status claros: A Fazer, Em Andamento e Concluídas.</p>
                    </div>

                    <div className="glass-dark p-6 space-y-4 rounded-xl card-hover border-t border-slate-700/50">
                        <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 border border-amber-500/30">
                            <Mail className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">Alertas Automáticos</h3>
                        <p className="text-slate-400">Receba notificações por e-mail sobre as tarefas que ainda estão pendentes.</p>
                    </div>

                    <div className="glass-dark p-6 space-y-4 rounded-xl card-hover border-t border-slate-700/50">
                        <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 border border-purple-500/30">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">Controle Total</h3>
                        <p className="text-slate-400">Painel de administração completo para gerenciar usuários e visualizar progresso.</p>
                    </div>
                </div>
            </div>
        </NatureBackground>
    );
}

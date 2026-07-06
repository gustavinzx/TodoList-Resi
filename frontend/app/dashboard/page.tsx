'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Plus, Trash2, FileText, CheckCircle2, Clock, Circle } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { NatureBackground } from '@/components/ui/NatureBackground';
import BlurText from '@/components/ui/BlurText';

interface Tarefa {
    id: number;
    titulo: string;
    descricao: string;
    status: 'a_fazer' | 'em_andamento' | 'concluida';
    criado_em: string;
}

export default function Dashboard() {
    const { token } = useAuth();
    const router = useRouter();
    const [tarefas, setTarefas] = useState<Tarefa[]>([]);
    const [novaTarefa, setNovaTarefa] = useState({ titulo: '', descricao: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;
        fetchTarefas();
    }, [token]);

    async function fetchTarefas() {
        try {
            const { data } = await api.get('/tarefas');
            setTarefas(data);
        } catch (e) {
            toast.error('Erro ao carregar tarefas');
        } finally {
            setLoading(false);
        }
    }

    async function criarTarefa(e: React.FormEvent) {
        e.preventDefault();
        if (!novaTarefa.titulo) return;
        try {
            await api.post('/tarefas', novaTarefa);
            setNovaTarefa({ titulo: '', descricao: '' });
            fetchTarefas();
            toast.success('Tarefa adicionada!');
        } catch (e) {
            toast.error('Erro ao criar tarefa');
        }
    }

    async function mudarStatus(id: number, status: string) {
        try {
            await api.put(`/tarefas/${id}`, { status });
            fetchTarefas();
        } catch (e) {
            toast.error('Erro ao atualizar status');
        }
    }

    async function deletarTarefa(id: number) {
        try {
            await api.delete(`/tarefas/${id}`);
            fetchTarefas();
            toast.success('Tarefa excluída');
        } catch (e) {
            toast.error('Erro ao excluir tarefa');
        }
    }

    const aFazer = tarefas.filter(t => t.status === 'a_fazer');
    const emAndamento = tarefas.filter(t => t.status === 'em_andamento');
    const concluida = tarefas.filter(t => t.status === 'concluida');

    if (!token) return <div className="p-8 text-center text-white">Redirecionando...</div>;
    if (loading) return <div className="p-8 text-center text-white">Carregando...</div>;

    const handleDownloadPDF = async (statusFiltro: string) => {
        try {
            const url = `http://localhost:3001/api/tarefas/relatorio${statusFiltro ? `?status=${statusFiltro}` : ''}`;
            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Erro ao gerar PDF');
            const blob = await res.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `relatorio_tarefas.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (e) {
            toast.error('Falha ao baixar o PDF');
        }
    };

    return (
        <NatureBackground>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 w-full flex-grow">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 bg-slate-900/40 p-6 rounded-2xl backdrop-blur-md border border-white/10">
                    <div>
                        <div className="text-3xl font-bold text-white drop-shadow-md">
                            <BlurText text="Minhas Tarefas" delay={50} animateBy="words" direction="top" />
                        </div>
                        <p className="text-slate-300 mt-2">Visão geral da sua produtividade diária.</p>
                    </div>
                    
                    <div className="flex gap-3">
                        <button onClick={() => handleDownloadPDF('')} className="flex items-center gap-2 px-5 py-2.5 glass-dark hover:bg-slate-800/80 text-white rounded-xl font-medium transition-all shadow-lg border border-white/20 card-hover">
                            <FileText className="w-4 h-4 text-blue-400" /> PDF (Geral)
                        </button>
                        <button onClick={() => handleDownloadPDF('a_fazer')} className="flex items-center gap-2 px-5 py-2.5 glass-dark hover:bg-slate-800/80 text-white rounded-xl font-medium transition-all shadow-lg border border-white/20 card-hover">
                            <FileText className="w-4 h-4 text-amber-400" /> PDF (Pendentes)
                        </button>
                    </div>
                </div>

                {/* Create Task Form */}
                <form onSubmit={criarTarefa} className="glass-dark p-4 mb-8 flex flex-col md:flex-row gap-4 rounded-xl border border-white/10 shadow-xl">
                    <input 
                        type="text" 
                        placeholder="Qual é a sua próxima grande tarefa?" 
                        required
                        value={novaTarefa.titulo}
                        onChange={e => setNovaTarefa({...novaTarefa, titulo: e.target.value})}
                        className="flex-1 px-4 py-3 rounded-lg border border-slate-700 bg-slate-900/50 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                    <input 
                        type="text" 
                        placeholder="Detalhes adicionais (opcional)" 
                        value={novaTarefa.descricao}
                        onChange={e => setNovaTarefa({...novaTarefa, descricao: e.target.value})}
                        className="flex-1 px-4 py-3 rounded-lg border border-slate-700 bg-slate-900/50 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                    <button type="submit" className="flex items-center justify-center gap-2 px-8 py-3 bg-blue-600/90 hover:bg-blue-600 text-white font-medium rounded-lg transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] whitespace-nowrap card-hover">
                        <Plus className="w-5 h-5" /> Criar
                    </button>
                </form>

                {/* Kanban Board */}
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Coluna A Fazer */}
                    <div className="glass-dark rounded-xl p-5 border border-white/5 shadow-2xl h-fit">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                            <div className="flex items-center gap-2 text-white">
                                <Circle className="w-5 h-5 text-slate-400" />
                                <h2 className="text-lg font-semibold">A Fazer</h2>
                            </div>
                            <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-full border border-slate-700">{aFazer.length}</span>
                        </div>
                        <div className="space-y-3">
                            {aFazer.map(t => <TaskCard key={t.id} tarefa={t} onStatus={mudarStatus} onDelete={deletarTarefa} color="border-l-slate-400" />)}
                        </div>
                    </div>

                    {/* Coluna Em Andamento */}
                    <div className="glass-dark rounded-xl p-5 border border-white/5 shadow-2xl h-fit">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                            <div className="flex items-center gap-2 text-white">
                                <Clock className="w-5 h-5 text-blue-400" />
                                <h2 className="text-lg font-semibold">Em Andamento</h2>
                            </div>
                            <span className="bg-blue-900/50 text-blue-200 text-xs px-2.5 py-1 rounded-full border border-blue-800/50">{emAndamento.length}</span>
                        </div>
                        <div className="space-y-3">
                            {emAndamento.map(t => <TaskCard key={t.id} tarefa={t} onStatus={mudarStatus} onDelete={deletarTarefa} color="border-l-blue-400" />)}
                        </div>
                    </div>

                    {/* Coluna Concluídas */}
                    <div className="glass-dark rounded-xl p-5 border border-white/5 shadow-2xl h-fit">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                            <div className="flex items-center gap-2 text-white">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                <h2 className="text-lg font-semibold">Concluídas</h2>
                            </div>
                            <span className="bg-emerald-900/50 text-emerald-200 text-xs px-2.5 py-1 rounded-full border border-emerald-800/50">{concluida.length}</span>
                        </div>
                        <div className="space-y-3">
                            {concluida.map(t => <TaskCard key={t.id} tarefa={t} onStatus={mudarStatus} onDelete={deletarTarefa} color="border-l-emerald-400" />)}
                        </div>
                    </div>
                </div>
            </div>
        </NatureBackground>
    );
}

function TaskCard({ tarefa, onStatus, onDelete, color }: { tarefa: Tarefa, onStatus: any, onDelete: any, color: string }) {
    return (
        <div className={`bg-slate-800/60 p-4 rounded-lg flex flex-col gap-3 group relative overflow-hidden border border-slate-700/50 shadow-inner hover:bg-slate-700/80 transition-colors border-l-4 ${color}`}>
            <div>
                <h3 className="font-semibold text-white pr-8">{tarefa.titulo}</h3>
                {tarefa.descricao && <p className="text-sm text-slate-400 mt-1.5 line-clamp-2">{tarefa.descricao}</p>}
            </div>
            
            <div className="flex items-center justify-between mt-1">
                <select 
                    value={tarefa.status}
                    onChange={(e) => onStatus(tarefa.id, e.target.value)}
                    className="text-xs bg-slate-900/80 border border-slate-600 rounded px-2.5 py-1.5 outline-none text-slate-300 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                    <option value="a_fazer">A Fazer</option>
                    <option value="em_andamento">Em Andamento</option>
                    <option value="concluida">Concluída</option>
                </select>
                <span className="text-[11px] text-slate-500 font-medium">
                    {new Date(tarefa.criado_em).toLocaleDateString('pt-BR')}
                </span>
            </div>

            <button 
                onClick={() => onDelete(tarefa.id)}
                className="absolute top-3 right-3 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/50 p-1.5 rounded-md"
                title="Excluir"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );
}

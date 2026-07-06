'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Plus, Trash2, FileText, CheckCircle2, Clock, Circle } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';

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

    if (!token) return <div className="p-8 text-center">Redirecionando...</div>;
    if (loading) return <div className="p-8 text-center">Carregando...</div>;

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Minhas Tarefas</h1>
                    <p className="text-slate-500">Gerencie suas atividades diárias.</p>
                </div>
                
                <div className="flex gap-2">
                    <button onClick={() => handleDownloadPDF('')} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-medium transition-colors border border-slate-200 dark:border-slate-700">
                        <FileText className="w-4 h-4" /> PDF (Todas)
                    </button>
                    <button onClick={() => handleDownloadPDF('a_fazer')} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-medium transition-colors border border-slate-200 dark:border-slate-700">
                         PDF (Pendentes)
                    </button>
                </div>
            </div>

            <form onSubmit={criarTarefa} className="card-ui p-4 mb-8 flex flex-col md:flex-row gap-4">
                <input 
                    type="text" 
                    placeholder="Título da Tarefa" 
                    required
                    value={novaTarefa.titulo}
                    onChange={e => setNovaTarefa({...novaTarefa, titulo: e.target.value})}
                    className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <input 
                    type="text" 
                    placeholder="Descrição (opcional)" 
                    value={novaTarefa.descricao}
                    onChange={e => setNovaTarefa({...novaTarefa, descricao: e.target.value})}
                    className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button type="submit" className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors whitespace-nowrap">
                    <Plus className="w-5 h-5" /> Adicionar
                </button>
            </form>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Coluna A Fazer */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b-2 border-slate-200 dark:border-slate-700">
                        <Circle className="w-5 h-5 text-slate-400" />
                        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300">A Fazer ({aFazer.length})</h2>
                    </div>
                    {aFazer.map(t => <TaskCard key={t.id} tarefa={t} onStatus={mudarStatus} onDelete={deletarTarefa} />)}
                </div>

                {/* Coluna Em Andamento */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b-2 border-blue-200 dark:border-blue-900">
                        <Clock className="w-5 h-5 text-blue-500" />
                        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300">Em Andamento ({emAndamento.length})</h2>
                    </div>
                    {emAndamento.map(t => <TaskCard key={t.id} tarefa={t} onStatus={mudarStatus} onDelete={deletarTarefa} />)}
                </div>

                {/* Coluna Concluídas */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b-2 border-emerald-200 dark:border-emerald-900">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300">Concluídas ({concluida.length})</h2>
                    </div>
                    {concluida.map(t => <TaskCard key={t.id} tarefa={t} onStatus={mudarStatus} onDelete={deletarTarefa} />)}
                </div>
            </div>
        </div>
    );
}

function TaskCard({ tarefa, onStatus, onDelete }: { tarefa: Tarefa, onStatus: any, onDelete: any }) {
    return (
        <div className="card-ui p-4 flex flex-col gap-3 group relative overflow-hidden">
            <div>
                <h3 className="font-semibold text-slate-900 dark:text-white pr-8">{tarefa.titulo}</h3>
                {tarefa.descricao && <p className="text-sm text-slate-500 mt-1">{tarefa.descricao}</p>}
            </div>
            
            <div className="flex items-center gap-2 mt-2">
                <select 
                    value={tarefa.status}
                    onChange={(e) => onStatus(tarefa.id, e.target.value)}
                    className="text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 outline-none text-slate-700 dark:text-slate-300"
                >
                    <option value="a_fazer">A Fazer</option>
                    <option value="em_andamento">Em Andamento</option>
                    <option value="concluida">Concluída</option>
                </select>
                <span className="text-xs text-slate-400">
                    {new Date(tarefa.criado_em).toLocaleDateString('pt-BR')}
                </span>
            </div>

            <button 
                onClick={() => onDelete(tarefa.id)}
                className="absolute top-3 right-3 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );
}

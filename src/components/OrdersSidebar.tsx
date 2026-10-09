import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Plus, 
  Trash2, 
  Copy, 
  FileText, 
  Truck, 
  MapPin, 
  Calendar,
  AlertCircle,
  Printer
} from 'lucide-react';
import { LoadingOrder, OrderStatus } from '../types';
import { ConfirmModal } from './ConfirmModal';

interface OrdersSidebarProps {
  aberto: boolean;
  onFechar: () => void;
  ordens: LoadingOrder[];
  ordemAtualId: string;
  onSelecionarOrdem: (id: string) => void;
  onNovaOrdem: () => void;
  onDuplicarOrdem: (ordem: LoadingOrder) => void;
  onExcluirOrdem: (id: string) => void;
  onImprimirOrdem?: (ordem: LoadingOrder) => void;
}

export const OrdersSidebar: React.FC<OrdersSidebarProps> = ({
  aberto,
  onFechar,
  ordens,
  ordemAtualId,
  onSelecionarOrdem,
  onNovaOrdem,
  onDuplicarOrdem,
  onExcluirOrdem,
  onImprimirOrdem
}) => {
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [ordemParaExcluir, setOrdemParaExcluir] = useState<LoadingOrder | null>(null);

  if (!aberto) return null;

  const ordensFiltradas = ordens.filter(ordem => {
    const termo = busca.toLowerCase();
    const matchBusca = 
      ordem.ocNum.toLowerCase().includes(termo) ||
      ordem.cliente.toLowerCase().includes(termo) ||
      ordem.destino.toLowerCase().includes(termo) ||
      ordem.veiculo.modelo.toLowerCase().includes(termo) ||
      ordem.veiculo.placa.toLowerCase().includes(termo) ||
      ordem.equipamentos.some(e => e.nome.toLowerCase().includes(termo));

    if (!matchBusca) return false;
    if (filtroStatus === 'todos') return true;
    return ordem.status === filtroStatus;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden no-print">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onFechar}
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-8">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200">
          
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-400" />
              <div>
                <h2 className="text-sm font-bold tracking-tight">Ordens de Carregamento</h2>
                <p className="text-[11px] text-slate-400">
                  {ordens.length} {ordens.length === 1 ? 'ordem cadastrada' : 'ordens cadastradas'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onNovaOrdem();
                  onFechar();
                }}
                className="p-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                title="Criar nova O.C."
              >
                <Plus className="w-4 h-4" />
                <span>Nova</span>
              </button>
              <button
                type="button"
                onClick={onFechar}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por O.C., cliente, destino, placa..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
                className="w-full text-xs bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 outline-none focus:ring-2 focus:ring-orange-500 text-slate-800"
              />
            </div>

            {/* Status Filter Segmented Control */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px]">
              {['todos', 'Rascunho', 'Aprovado', 'Carregando', 'Em Trânsito', 'Concluído'].map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFiltroStatus(st)}
                  className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                    filtroStatus === st
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {st === 'todos' ? 'Todas' : st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {ordensFiltradas.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="font-semibold text-slate-600">Nenhuma ordem encontrada</p>
                <p className="mt-1 text-slate-400">Tente ajustar o termo de busca ou filtros.</p>
              </div>
            ) : (
              ordensFiltradas.map(ordem => {
                const isAtiva = ordem.id === ordemAtualId;
                const totalKg = ordem.equipamentos.reduce(
                  (acc, i) => acc + (Number(i.qtd) || 0) * (Number(i.pesoUn) || 0),
                  0
                );

                return (
                  <div
                    key={ordem.id}
                    className={`rounded-xl border p-3 transition-all cursor-pointer ${
                      isAtiva
                        ? 'bg-orange-50/80 border-orange-400 ring-2 ring-orange-400/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
                    }`}
                    onClick={() => {
                      onSelecionarOrdem(ordem.id);
                      onFechar();
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-slate-900">
                          O.C. {ordem.ocNum}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                          ordem.status === 'Aprovado'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : ordem.status === 'Em Trânsito'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {ordem.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                        {onImprimirOrdem && (
                          <button
                            type="button"
                            onClick={() => onImprimirOrdem(ordem)}
                            className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Imprimir esta O.C."
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onDuplicarOrdem(ordem)}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="Duplicar O.C."
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setOrdemParaExcluir(ordem)}
                          className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Excluir O.C."
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-1.5 font-medium text-xs text-slate-800 line-clamp-1">
                      {ordem.cliente || 'Cliente não informado'}
                    </div>

                    <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 line-clamp-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{ordem.destino || 'Destino não informado'}</span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Truck className="w-3 h-3 text-slate-400" />
                        <span className="font-medium text-slate-700 truncate max-w-[130px]">
                          {ordem.veiculo.modelo}
                        </span>
                      </div>
                      <div className="font-mono text-slate-900 font-semibold tabular-nums">
                        {totalKg.toLocaleString('pt-BR')} kg · {ordem.equipamentos.length} itens
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Info */}
          <div className="p-3 bg-slate-100 border-t border-slate-200 text-center text-[11px] text-slate-500">
            Armazenamento local ativo · Essencial Energia Logística
          </div>

        </div>
      </div>

      {/* Confirmação de Exclusão da Ordem */}
      <ConfirmModal
        aberto={Boolean(ordemParaExcluir)}
        onFechar={() => setOrdemParaExcluir(null)}
        onConfirmar={() => {
          if (ordemParaExcluir) {
            onExcluirOrdem(ordemParaExcluir.id);
            setOrdemParaExcluir(null);
          }
        }}
        titulo="Excluir Ordem de Carregamento?"
        mensagem={
          ordemParaExcluir ? (
            <div className="space-y-1">
              <p>
                Tem certeza que deseja excluir permanentemente a <strong>O.C. {ordemParaExcluir.ocNum}</strong>?
              </p>
              <p className="text-slate-500 text-[11px]">
                Cliente: {ordemParaExcluir.cliente || 'Não informado'} · Veículo: {ordemParaExcluir.veiculo.modelo}
              </p>
            </div>
          ) : ''
        }
        textoConfirmar="Sim, Excluir O.C."
        tipo="perigo"
      />
    </div>
  );
};

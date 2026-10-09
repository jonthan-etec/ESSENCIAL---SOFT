import React, { useState } from 'react';
import { 
  CheckSquare, 
  Check, 
  Plus, 
  Trash2, 
  AlertCircle, 
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { ChecklistItem } from '../types';
import { DEFAULT_CHECKLIST } from '../data/presets';
import { ConfirmModal } from './ConfirmModal';

interface ChecklistSectionProps {
  checklist: ChecklistItem[];
  onToggleItem: (id: string) => void;
  onAdicionarItem: (categoria: ChecklistItem['categoria'], descricao: string) => void;
  onRemoverItem: (id: string) => void;
  onMarcarTodos: (marcar: boolean) => void;
  onRestaurarPadrao: () => void;
}

export const ChecklistSection: React.FC<ChecklistSectionProps> = ({
  checklist,
  onToggleItem,
  onAdicionarItem,
  onRemoverItem,
  onMarcarTodos,
  onRestaurarPadrao
}) => {
  const [novoTexto, setNovoTexto] = useState('');
  const [novaCategoria, setNovaCategoria] = useState<ChecklistItem['categoria']>('Amarração & Distribuição');
  const [mostrarNovoInput, setMostrarNovoInput] = useState(false);
  const [confirmarRestaurar, setConfirmarRestaurar] = useState(false);

  const total = checklist.length;
  const marcados = checklist.filter(i => i.marcado).length;
  const percentual = total > 0 ? (marcados / total) * 100 : 0;

  const categorias: ChecklistItem['categoria'][] = [
    'Veículo & Documentos',
    'Amarração & Distribuição',
    'Fluidos & Meio Ambiente'
  ];

  const handleAdicionar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoTexto.trim()) return;
    onAdicionarItem(novaCategoria, novoTexto.trim());
    setNovoTexto('');
    setMostrarNovoInput(false);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 lg:p-6 space-y-4 w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700 shrink-0">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-slate-900 leading-tight truncate">
              Check-list de Inspeção & Liberação de Carga
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              Verificações mandatórias antes da saída do veículo do pátio operacional
            </p>
          </div>
        </div>

        {/* Status de Conclusão e Ações Rápidas */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onMarcarTodos(true)}
            className="h-8 px-2.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            Marcar Todos
          </button>
          <button
            type="button"
            onClick={() => onMarcarTodos(false)}
            className="h-8 px-2.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            Desmarcar Todos
          </button>
          <button
            type="button"
            onClick={() => setConfirmarRestaurar(true)}
            className="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Restaurar itens padrão do checklist"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Barra de Progresso do Checklist */}
      <div className="p-3 sm:p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
        <div className="flex justify-between items-center text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Progresso da Inspeção Técnica
          </span>
          <span className="font-mono tabular-nums text-slate-900">
            {marcados} de {total} itens verificados ({percentual.toFixed(0)}%)
          </span>
        </div>

        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              percentual === 100 ? 'bg-emerald-500' : 'bg-orange-500'
            }`}
            style={{ width: `${percentual}%` }}
          />
        </div>
      </div>

      {/* Itens Agrupados por Categoria */}
      <div className="space-y-4">
        {categorias.map(cat => {
          const itensDaCat = checklist.filter(i => i.categoria === cat);
          if (itensDaCat.length === 0) return null;

          return (
            <div key={cat} className="space-y-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1">
                {cat}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {itensDaCat.map(item => (
                  <label
                    key={item.id}
                    className={`flex items-start gap-2.5 p-2.5 rounded-lg border transition-all cursor-pointer min-w-0 ${
                      item.marcado
                        ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.marcado}
                      onChange={() => onToggleItem(item.id)}
                      className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0"
                    />
                    <span className="flex-1 text-[11px] leading-relaxed break-words">
                      {item.descricao}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onRemoverItem(item.id);
                      }}
                      className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1 rounded-md transition-colors no-print shrink-0 cursor-pointer"
                      title="Excluir este item do checklist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Formulário para Adicionar Item Customizado */}
      <div className="pt-2 no-print">
        {mostrarNovoInput ? (
          <form onSubmit={handleAdicionar} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5 text-xs">
            <div className="font-semibold text-slate-700">Novo Item de Inspeção:</div>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={novaCategoria}
                onChange={e => setNovaCategoria(e.target.value as ChecklistItem['categoria'])}
                className="h-9 bg-white border border-slate-300 rounded-lg px-2.5 outline-none font-medium cursor-pointer"
              >
                {categorias.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Descrição do item a ser inspecionado..."
                value={novoTexto}
                onChange={e => setNovoTexto(e.target.value)}
                className="flex-1 h-9 bg-white border border-slate-300 rounded-lg px-3 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
                autoFocus
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="h-9 px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  Adicionar
                </button>
                <button
                  type="button"
                  onClick={() => setMostrarNovoInput(false)}
                  className="h-9 px-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setMostrarNovoInput(true)}
            className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar item de verificação personalizado</span>
          </button>
        )}
      </div>

      {/* Confirmação para Restaurar Itens Padrão do Checklist */}
      <ConfirmModal
        aberto={confirmarRestaurar}
        onFechar={() => setConfirmarRestaurar(false)}
        onConfirmar={() => {
          onRestaurarPadrao();
          setConfirmarRestaurar(false);
        }}
        titulo="Restaurar Checklist Padrão?"
        mensagem="Deseja recarregar todos os itens oficiais de inspeção da Essencial Energia? Quaisquer itens customizados adicionados serão substituídos pelo modelo regulamentar."
        textoConfirmar="Restaurar Checklist"
        tipo="aviso"
      />

    </div>
  );
};

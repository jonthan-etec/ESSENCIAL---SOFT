import React, { useState } from 'react';
import { 
  Boxes, 
  Plus, 
  Trash2, 
  Copy, 
  BookOpen, 
  AlertCircle,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { EquipmentItem, BedZone } from '../types';
import { ConfirmModal } from './ConfirmModal';

interface EquipmentTableProps {
  equipamentos: EquipmentItem[];
  onAdicionarItem: () => void;
  onAbrirCatalogo: () => void;
  onRemoverItem: (id: string) => void;
  onDuplicarItem: (item: EquipmentItem) => void;
  onAtualizarItem: (id: string, campo: keyof EquipmentItem, valor: any) => void;
  onLimparTodos?: () => void;
}

const ZONAS_OPCOES: BedZone[] = [
  'Dianteira',
  'Centro-Dianteiro',
  'Centro',
  'Centro-Traseiro',
  'Traseira'
];

export const EquipmentTable: React.FC<EquipmentTableProps> = ({
  equipamentos,
  onAdicionarItem,
  onAbrirCatalogo,
  onRemoverItem,
  onDuplicarItem,
  onAtualizarItem,
  onLimparTodos
}) => {
  const [itemParaExcluir, setItemParaExcluir] = useState<EquipmentItem | null>(null);
  const [confirmarLimpar, setConfirmarLimpar] = useState<boolean>(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 lg:p-6 space-y-4 w-full min-w-0">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 bg-orange-100 rounded-lg text-orange-600 shrink-0">
            <Boxes className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-slate-900 leading-tight truncate">
              Equipamentos e Cargas (Variáveis Múltiplas)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              {equipamentos.length} {equipamentos.length === 1 ? 'item configurado' : 'itens configurados'} na ordem
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {equipamentos.length > 0 && onLimparTodos && (
            <button
              type="button"
              onClick={() => setConfirmarLimpar(true)}
              className="h-9 px-3 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 border border-slate-200 hover:border-red-200 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer whitespace-nowrap"
              title="Remover todos os equipamentos configurados nesta ordem"
            >
              <Trash2 className="w-3.5 h-3.5 shrink-0" />
              <span>Limpar Itens</span>
            </button>
          )}

          <button
            type="button"
            onClick={onAbrirCatalogo}
            className="h-9 px-3.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer whitespace-nowrap"
            title="Adicionar a partir do catálogo padrão da Essencial Energia"
          >
            <BookOpen className="w-4 h-4 text-orange-400 shrink-0" />
            <span>Catálogo Padrão</span>
          </button>

          <button
            type="button"
            onClick={onAdicionarItem}
            className="h-9 px-3.5 rounded-lg text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer whitespace-nowrap"
            title="Adicionar nova linha em branco"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Novo Item</span>
          </button>
        </div>
      </div>

      {/* Tabela de Itens Contida e Otimizada */}
      <div className="w-full max-w-full overflow-x-auto rounded-xl border border-slate-200/90 shadow-2xs bg-white">
        <table className="w-full text-left text-xs bg-white min-w-[920px] divide-y divide-slate-200">
          <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[11px]">
            <tr>
              <th className="py-2.5 px-3 min-w-[210px] whitespace-nowrap">Equipamento / Descrição Técnica</th>
              <th className="py-2.5 px-2 w-16 min-w-[60px] text-center whitespace-nowrap">Qtd</th>
              <th className="py-2.5 px-2 w-44 min-w-[160px] text-center whitespace-nowrap">Dimensões (CxLxA m)</th>
              <th className="py-2.5 px-2 w-28 min-w-[100px] text-right whitespace-nowrap">Peso Un. (kg)</th>
              <th className="py-2.5 px-2 w-28 min-w-[100px] text-right whitespace-nowrap">Peso Total</th>
              <th className="py-2.5 px-2 w-36 min-w-[135px] whitespace-nowrap">Posição no Veículo</th>
              <th className="py-2.5 px-2 w-44 min-w-[155px] whitespace-nowrap">Amarração / Fixação</th>
              <th className="py-2.5 px-2 w-14 min-w-[50px] text-center whitespace-nowrap">Calço</th>
              <th className="py-2.5 px-2 w-20 min-w-[70px] text-center no-print whitespace-nowrap">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {equipamentos.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-slate-400 text-xs">
                  <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                  Nenhum equipamento adicionado. Clique em "Catálogo Padrão" ou "Novo Item".
                </td>
              </tr>
            ) : (
              equipamentos.map((item) => {
                const subtotal = (Number(item.qtd) || 0) * (Number(item.pesoUn) || 0);

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Descrição */}
                    <td className="p-2 pl-3">
                      <input
                        type="text"
                        value={item.nome}
                        onChange={e => onAtualizarItem(item.id, 'nome', e.target.value)}
                        placeholder="Nome do equipamento..."
                        className="w-full h-8 font-semibold border border-slate-300 rounded-md px-2.5 py-1 bg-white focus:ring-1 focus:ring-orange-500 outline-none text-slate-900 transition-colors text-xs"
                      />
                    </td>

                    {/* Qtd */}
                    <td className="p-2 text-center">
                      <input
                        type="number"
                        min="1"
                        value={item.qtd}
                        onChange={e => onAtualizarItem(item.id, 'qtd', Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-14 h-8 text-center font-mono font-bold border border-slate-300 rounded-md py-1 bg-white focus:ring-1 focus:ring-orange-500 outline-none text-slate-900 transition-colors text-xs"
                      />
                    </td>

                    {/* Dimensões C x L x A */}
                    <td className="p-2">
                      <div className="flex items-center justify-center gap-1 font-mono text-[11px]">
                        <input
                          type="text"
                          value={item.comp}
                          onChange={e => onAtualizarItem(item.id, 'comp', e.target.value)}
                          placeholder="C"
                          title="Comprimento em metros"
                          className="w-9 h-8 text-center border border-slate-300 rounded-md py-1 bg-white focus:ring-1 focus:ring-orange-500 outline-none text-xs"
                        />
                        <span className="text-slate-400">×</span>
                        <input
                          type="text"
                          value={item.larg}
                          onChange={e => onAtualizarItem(item.id, 'larg', e.target.value)}
                          placeholder="L"
                          title="Largura em metros"
                          className="w-9 h-8 text-center border border-slate-300 rounded-md py-1 bg-white focus:ring-1 focus:ring-orange-500 outline-none text-xs"
                        />
                        <span className="text-slate-400">×</span>
                        <input
                          type="text"
                          value={item.alt}
                          onChange={e => onAtualizarItem(item.id, 'alt', e.target.value)}
                          placeholder="A"
                          title="Altura em metros"
                          className="w-9 h-8 text-center border border-slate-300 rounded-md py-1 bg-white focus:ring-1 focus:ring-orange-500 outline-none text-xs"
                        />
                      </div>
                    </td>

                    {/* Peso Unitário */}
                    <td className="p-2">
                      <input
                        type="number"
                        step="10"
                        value={item.pesoUn}
                        onChange={e => onAtualizarItem(item.id, 'pesoUn', parseFloat(e.target.value) || 0)}
                        className="w-full h-8 text-right font-mono font-medium border border-slate-300 rounded-md px-2 py-1 bg-white focus:ring-1 focus:ring-orange-500 outline-none transition-colors text-xs"
                      />
                    </td>

                    {/* Peso Total Linha */}
                    <td className="p-2 text-right font-mono font-bold text-slate-900 tabular-nums whitespace-nowrap">
                      {subtotal.toLocaleString('pt-BR')} kg
                    </td>

                    {/* Posição no Veículo */}
                    <td className="p-2">
                      <select
                        value={item.posicao}
                        onChange={e => onAtualizarItem(item.id, 'posicao', e.target.value as BedZone)}
                        className="w-full h-8 font-medium border border-slate-300 rounded-md px-2 py-1 bg-white focus:ring-1 focus:ring-orange-500 outline-none text-slate-800 text-xs cursor-pointer"
                      >
                        {ZONAS_OPCOES.map((zona, zIdx) => (
                          <option key={zona} value={zona}>
                            {zIdx + 1}. {zona}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Amarração */}
                    <td className="p-2">
                      <input
                        type="text"
                        value={item.amarracao}
                        onChange={e => onAtualizarItem(item.id, 'amarracao', e.target.value)}
                        placeholder="Ex: 4x Cinta Catraca 5T"
                        className="w-full h-8 border border-slate-300 rounded-md px-2 py-1 bg-white focus:ring-1 focus:ring-orange-500 outline-none text-slate-800 text-xs"
                      />
                    </td>

                    {/* Calço */}
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={item.calco}
                        onChange={e => onAtualizarItem(item.id, 'calco', e.target.checked)}
                        className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                        title="Calço de piso ou trava"
                      />
                    </td>

                    {/* Ações */}
                    <td className="p-2 text-center no-print">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => onDuplicarItem(item)}
                          className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Duplicar linha"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setItemParaExcluir(item)}
                          className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title={`Excluir "${item.nome}" da ordem`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Dica técnica inferior responsiva */}
      <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5 leading-snug">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Conforme Resolução CONTRAN 552/2015: proibido uso exclusivo de cordas; utilizar cintas com catracas ou correntes.</span>
        </span>
        <span className="font-mono text-slate-700 font-semibold shrink-0">
          Total de Itens: {equipamentos.reduce((acc, i) => acc + (Number(i.qtd) || 0), 0)} un.
        </span>
      </div>

      {/* Modal de Confirmação para Excluir Item */}
      <ConfirmModal
        aberto={Boolean(itemParaExcluir)}
        onFechar={() => setItemParaExcluir(null)}
        onConfirmar={() => {
          if (itemParaExcluir) {
            onRemoverItem(itemParaExcluir.id);
            setItemParaExcluir(null);
          }
        }}
        titulo="Excluir Equipamento da Ordem?"
        mensagem={
          itemParaExcluir ? (
            <div className="space-y-1">
              <p>
                Deseja remover <strong>"{itemParaExcluir.nome}"</strong> ({itemParaExcluir.pesoUn.toLocaleString('pt-BR')} kg) desta ordem de carregamento?
              </p>
              <p className="text-slate-500 text-[11px]">
                Posição: {itemParaExcluir.posicao} · Quantidade: {itemParaExcluir.qtd} un.
              </p>
            </div>
          ) : ''
        }
        textoConfirmar="Sim, Excluir Item"
        tipo="perigo"
      />

      {/* Modal de Confirmação para Limpar Todos os Itens */}
      <ConfirmModal
        aberto={confirmarLimpar}
        onFechar={() => setConfirmarLimpar(false)}
        onConfirmar={() => {
          if (onLimparTodos) {
            onLimparTodos();
          }
          setConfirmarLimpar(false);
        }}
        titulo="Limpar Todos os Equipamentos?"
        mensagem={
          <p>
            Deseja remover todos os <strong>{equipamentos.length} equipamentos</strong> configurados nesta ordem?
            Você poderá adicionar novos equipamentos manualmente ou a partir do catálogo a qualquer momento.
          </p>
        }
        textoConfirmar="Sim, Limpar Tabela"
        tipo="aviso"
      />

    </div>
  );
};

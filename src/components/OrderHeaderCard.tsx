import React from 'react';
import { 
  FileSpreadsheet, 
  Building2, 
  MapPin, 
  Calendar, 
  Clock, 
  Flag,
  UserCheck,
  Phone,
  Receipt,
  Package
} from 'lucide-react';
import { LoadingOrder, OrderStatus, PriorityLevel } from '../types';

interface OrderHeaderCardProps {
  ordem: LoadingOrder;
  onChange: (campo: keyof LoadingOrder, valor: any) => void;
}

export const OrderHeaderCard: React.FC<OrderHeaderCardProps> = ({
  ordem,
  onChange
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 lg:p-6 space-y-4 w-full min-w-0">
      {/* Top Banner & Status bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 bg-orange-100 rounded-lg text-orange-600 shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-slate-900 leading-tight truncate">
              Dados da Ordem de Carregamento
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              Controle de emissão, nota fiscal, destinação e status logístico
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* Status selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <label className="text-slate-500 font-medium">Status:</label>
            <select
              value={ordem.status}
              onChange={e => onChange('status', e.target.value as OrderStatus)}
              className="h-9 font-bold text-xs bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg px-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-slate-800 transition-colors cursor-pointer"
            >
              <option value="Rascunho">Rascunho</option>
              <option value="Em Análise">Em Análise</option>
              <option value="Aprovado">Aprovado p/ Pátio</option>
              <option value="Carregando">Carregando</option>
              <option value="Em Trânsito">Em Trânsito</option>
              <option value="Concluído">Concluído</option>
            </select>
          </div>

          {/* Priority selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <label className="text-slate-500 font-medium">Prioridade:</label>
            <select
              value={ordem.prioridade}
              onChange={e => onChange('prioridade', e.target.value as PriorityLevel)}
              className="h-9 font-bold text-xs bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg px-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-slate-800 transition-colors cursor-pointer"
            >
              <option value="Normal">Normal</option>
              <option value="Urgente">Urgente</option>
              <option value="Emergencial (Blackout)">Emergencial (Blackout)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid de Inputs Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
        <div className="min-w-0">
          <label className="block font-semibold text-slate-700 mb-1 truncate">
            Número da O.C. *
          </label>
          <input
            type="text"
            value={ordem.ocNum}
            onChange={e => onChange('ocNum', e.target.value)}
            placeholder="Ex: 0002/2026"
            className="w-full h-9 font-mono font-bold bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-slate-900 transition-colors"
          />
        </div>

        <div className="min-w-0">
          <label className="block font-semibold text-slate-700 mb-1 truncate">
            Data de Emissão / Carregamento *
          </label>
          <input
            type="date"
            value={ordem.data}
            onChange={e => onChange('data', e.target.value)}
            className="w-full h-9 bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-slate-900 transition-colors font-medium"
          />
        </div>

        <div className="min-w-0">
          <label className="block font-semibold text-slate-700 mb-1 truncate">
            Horário Previsto de Saída
          </label>
          <input
            type="time"
            value={ordem.horaPrevista || ''}
            onChange={e => onChange('horaPrevista', e.target.value)}
            className="w-full h-9 bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-slate-900 transition-colors font-medium"
          />
        </div>

        <div className="min-w-0">
          <label className="block font-semibold text-slate-700 mb-1 truncate">
            Cliente / Contratante *
          </label>
          <input
            type="text"
            value={ordem.cliente}
            onChange={e => onChange('cliente', e.target.value)}
            placeholder="Ex: MERCADO LIVRE (MELI)"
            className="w-full h-9 font-semibold bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-slate-900 transition-colors"
          />
        </div>
      </div>

      {/* Grid Dados Fiscais e Destino */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs pt-0.5">
        <div className="min-w-0">
          <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5 truncate">
            <Receipt className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            <span className="truncate">Número da Nota Fiscal (NF-e)</span>
          </label>
          <input
            type="text"
            value={ordem.notaFiscal || ''}
            onChange={e => onChange('notaFiscal', e.target.value)}
            placeholder="Ex: 14.892 / NF-e 001.234"
            className="w-full h-9 font-mono bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-slate-900 transition-colors"
          />
        </div>

        <div className="min-w-0">
          <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5 truncate">
            <Package className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            <span className="truncate">Quantidade de Volumes</span>
          </label>
          <input
            type="text"
            value={ordem.quantidadeVolumes ?? ''}
            onChange={e => onChange('quantidadeVolumes', e.target.value)}
            placeholder="Ex: 3 volumes"
            className="w-full h-9 font-mono bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-slate-900 transition-colors"
          />
        </div>

        <div className="sm:col-span-2 lg:col-span-2 min-w-0">
          <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            <span className="truncate">Destino / Local de Entrega *</span>
          </label>
          <input
            type="text"
            value={ordem.destino}
            onChange={e => onChange('destino', e.target.value)}
            placeholder="Ex: Rodovia Presidente Dutra, km 302 - Galpão 3"
            className="w-full h-9 bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-slate-900 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs pt-0.5">
        <div className="min-w-0">
          <label className="block font-semibold text-slate-700 mb-1 truncate">
            Cidade / UF
          </label>
          <input
            type="text"
            value={ordem.cidadeUf || ''}
            onChange={e => onChange('cidadeUf', e.target.value)}
            placeholder="Ex: Resende / RJ"
            className="w-full h-9 bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-slate-900 transition-colors"
          />
        </div>

        <div className="min-w-0">
          <label className="block font-semibold text-slate-700 mb-1 truncate">
            Obra / Projeto / Evento
          </label>
          <input
            type="text"
            value={ordem.obraProjeto || ''}
            onChange={e => onChange('obraProjeto', e.target.value)}
            placeholder="Ex: Expansão Galpão Logístico"
            className="w-full h-9 bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-slate-900 transition-colors"
          />
        </div>

        <div className="min-w-0">
          <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5 truncate">
            <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">Contato no Destino</span>
          </label>
          <input
            type="text"
            value={ordem.contatoLocal || ''}
            onChange={e => onChange('contatoLocal', e.target.value)}
            placeholder="Ex: Eng. Marcelo Prado"
            className="w-full h-9 bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-slate-900 transition-colors"
          />
        </div>

        <div className="min-w-0">
          <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5 truncate">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">Telefone / WhatsApp Destino</span>
          </label>
          <input
            type="text"
            value={ordem.telefoneLocal || ''}
            onChange={e => onChange('telefoneLocal', e.target.value)}
            placeholder="Ex: (24) 99876-1122"
            className="w-full h-9 bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-slate-900 transition-colors"
          />
        </div>
      </div>

    </div>
  );
};

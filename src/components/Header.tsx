import React from 'react';
import { 
  Zap, 
  PlusCircle, 
  Save, 
  Printer, 
  Share2, 
  FolderOpen,
  CheckCircle2,
  AlertTriangle,
  FileText,
  HardDrive
} from 'lucide-react';
import { LoadingOrder } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  ordem: LoadingOrder;
  temAlteracoesNaoSalvas: boolean;
  onNovaOrdem: () => void;
  onSalvar: () => void;
  onAbrirSidebar: () => void;
  onAbrirCompartilhar: () => void;
  onImprimir: () => void;
  onVisualizarPdf?: () => void;
  onAbrirPendriveModal?: () => void;
  conectadoAoServidorPendrive?: boolean;
  totalSalvas: number;
}

export const Header: React.FC<HeaderProps> = ({
  ordem,
  temAlteracoesNaoSalvas,
  onNovaOrdem,
  onSalvar,
  onAbrirSidebar,
  onAbrirCompartilhar,
  onImprimir,
  onVisualizarPdf,
  onAbrirPendriveModal,
  conectadoAoServidorPendrive,
  totalSalvas
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 no-print w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-3">
        
        {/* Zona 1: Identidade da Marca (Clean wordmark com ícone funcional) */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-md font-black shrink-0">
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-white uppercase block leading-none truncate">
              ESSENCIAL ENERGIA
            </span>
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline-block mt-0.5 truncate">
              Gestor de Ordens de Carregamento
            </span>
          </div>
        </div>

        {/* Zona 2: Metadados da Ordem Atual (legível e sem pills estáticas genéricas) */}
        <div className="hidden 2xl:flex items-center gap-3 text-xs text-slate-300 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">O.C.:</span>
            <span className="font-mono font-bold text-white tabular-nums bg-slate-800/90 px-2 py-0.5 rounded border border-slate-700">
              {ordem.ocNum || 'S/N'}
            </span>
          </div>

          <span className="text-slate-700" aria-hidden="true">·</span>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Revisão:</span>
            <span className="font-mono font-bold text-slate-300 bg-slate-800/90 px-2 py-0.5 rounded border border-slate-700">
              REV 001/2026
            </span>
          </div>

          <span className="text-slate-700" aria-hidden="true">·</span>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Status:</span>
            <span className={`text-[11px] font-semibold ${
              ordem.status === 'Aprovado' 
                ? 'text-emerald-400'
                : ordem.status === 'Em Trânsito'
                ? 'text-blue-400'
                : 'text-amber-400'
            }`}>
              {ordem.status}
            </span>
          </div>

          <span className="text-slate-700" aria-hidden="true">·</span>

          {temAlteracoesNaoSalvas ? (
            <div className="flex items-center gap-1 text-amber-400 text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Pendentes</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-emerald-400 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Salvo</span>
            </div>
          )}
        </div>

        {/* Zona 3: Ações Principais Responsivas e Perfeitamente Alinhadas */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <PWAInstallButton />

          {/* Ordens Salvas */}
          <button
            type="button"
            onClick={onAbrirSidebar}
            className="h-9 px-2.5 sm:px-3 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/80 transition-colors flex items-center gap-1.5 text-slate-200 cursor-pointer whitespace-nowrap shrink-0"
            title="Ver e gerenciar todas as ordens salvas"
          >
            <FolderOpen className="w-4 h-4 text-orange-400 shrink-0" />
            <span className="hidden sm:inline">Ordens</span>
            <span className="bg-slate-700 text-slate-300 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold leading-none">
              {totalSalvas}
            </span>
          </button>

          {/* Nova O.C. */}
          <button
            type="button"
            onClick={onNovaOrdem}
            className="h-9 px-2.5 sm:px-3 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/80 transition-colors hidden md:flex items-center gap-1.5 text-slate-200 cursor-pointer whitespace-nowrap shrink-0"
            title="Criar nova Ordem de Carregamento em branco"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="hidden lg:inline">Nova O.C.</span>
          </button>

          {/* Compartilhar / Exportar */}
          <button
            type="button"
            onClick={onAbrirCompartilhar}
            className="h-9 px-2.5 sm:px-3 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/80 transition-colors hidden lg:flex items-center gap-1.5 text-slate-200 cursor-pointer whitespace-nowrap shrink-0"
            title="Exportar ou compartilhar via WhatsApp"
          >
            <Share2 className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Exportar</span>
          </button>

          {/* Central Modo Pendrive */}
          {onAbrirPendriveModal && (
            <button
              type="button"
              onClick={onAbrirPendriveModal}
              className="h-9 px-2.5 sm:px-3 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/80 transition-colors flex items-center gap-1.5 text-slate-200 cursor-pointer whitespace-nowrap shrink-0"
              title="Central do Modo Pendrive: Usar em qualquer computador"
            >
              <HardDrive className={`w-4 h-4 shrink-0 ${conectadoAoServidorPendrive ? 'text-emerald-400' : 'text-cyan-400'}`} />
              <span className="hidden sm:inline">Pendrive</span>
              {conectadoAoServidorPendrive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Sincronização ativa com pendrive" />
              )}
            </button>
          )}

          {/* Visualizar PDF */}
          {onVisualizarPdf && (
            <button
              type="button"
              onClick={onVisualizarPdf}
              className="h-9 px-2.5 sm:px-3 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/80 transition-colors hidden sm:flex items-center gap-1.5 text-slate-200 cursor-pointer whitespace-nowrap shrink-0"
              title="Pré-visualizar folha oficial, baixar em PDF ou TXT A4"
            >
              <FileText className="w-4 h-4 text-orange-400 shrink-0" />
              <span className="hidden md:inline">PDF</span>
            </button>
          )}

          {/* Salvar Ordem */}
          <button
            type="button"
            onClick={onSalvar}
            className={`h-9 px-3 sm:px-3.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap shrink-0 ${
              temAlteracoesNaoSalvas
                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-white'
            }`}
            title="Salvar alterações no armazenamento local e pendrive"
          >
            <Save className="w-4 h-4 shrink-0" />
            <span className="hidden xs:inline sm:inline">Salvar</span>
          </button>

          {/* Imprimir Ordem Imediatamente */}
          <button
            type="button"
            onClick={onImprimir}
            className="h-9 px-3 sm:px-3.5 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap shrink-0"
            title="Carregar impressora e imprimir ordem imediatamente (Ctrl+P)"
          >
            <Printer className="w-4 h-4 shrink-0" />
            <span>Imprimir</span>
          </button>
        </div>

      </div>
    </header>
  );
};

import React from 'react';
import { 
  FileText, 
  AlertTriangle, 
  RotateCcw, 
  BookCheck,
  ShieldAlert
} from 'lucide-react';
import { DEFAULT_TECHNICAL_INSTRUCTIONS, DEFAULT_SAFETY_OBSERVATIONS } from '../data/presets';

interface TechnicalGuidelinesProps {
  detalhesPosicionamento: string;
  obsSeguranca: string;
  onChangePosicionamento: (val: string) => void;
  onChangeSeguranca: (val: string) => void;
}

export const TechnicalGuidelines: React.FC<TechnicalGuidelinesProps> = ({
  detalhesPosicionamento,
  obsSeguranca,
  onChangePosicionamento,
  onChangeSeguranca
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full min-w-0">
      {/* Orientações Técnicas de Carga */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 lg:p-6 space-y-3 min-w-0 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <BookCheck className="w-4 h-4 text-orange-500 shrink-0" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 truncate">
                Orientações Técnicas de Içamento
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onChangePosicionamento(DEFAULT_TECHNICAL_INSTRUCTIONS)}
              className="h-7 px-2 text-[11px] font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md flex items-center gap-1 transition-colors no-print shrink-0 cursor-pointer"
              title="Restaurar orientações padrão"
            >
              <RotateCcw className="w-3 h-3" /> Padrão
            </button>
          </div>

          <textarea
            rows={5}
            value={detalhesPosicionamento}
            onChange={e => onChangePosicionamento(e.target.value)}
            placeholder="Instruções de amarração, calços e sequência de içamento..."
            className="w-full text-xs p-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 leading-relaxed bg-white text-slate-800 font-sans resize-y min-h-[120px] transition-colors"
          />
        </div>

        <div className="text-[11px] text-slate-400 leading-tight pt-1">
          Instruções específicas para a equipe de munck / guindaste e operadores de pátio da Essencial Energia.
        </div>
      </div>

      {/* Observações de Segurança Rodoviária */}
      <div className="bg-amber-50/50 rounded-xl border border-amber-200 shadow-2xs p-4 sm:p-5 lg:p-6 space-y-3 min-w-0 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-amber-200 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 truncate">
                Segurança Rodoviária & Emergência
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onChangeSeguranca(DEFAULT_SAFETY_OBSERVATIONS)}
              className="h-7 px-2 text-[11px] font-medium text-amber-800 hover:text-amber-950 hover:bg-amber-100/70 rounded-md flex items-center gap-1 transition-colors no-print shrink-0 cursor-pointer"
              title="Restaurar observações padrão"
            >
              <RotateCcw className="w-3 h-3" /> Padrão
            </button>
          </div>

          <textarea
            rows={5}
            value={obsSeguranca}
            onChange={e => onChangeSeguranca(e.target.value)}
            placeholder="Diretrizes de viagem, contatos do CCO e procedimentos em trânsito..."
            className="w-full text-xs p-3 border border-amber-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 leading-relaxed bg-white/95 text-slate-800 font-sans resize-y min-h-[120px] transition-colors"
          />
        </div>

        <div className="text-[11px] text-amber-800 font-medium leading-tight pt-1">
          O condutor deve tomar ciência dessas diretrizes antes de assinar a liberação da carga no pátio.
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { 
  FileSignature, 
  UserCheck, 
  CalendarClock, 
  ShieldCheck,
  Check
} from 'lucide-react';
import { Signatures } from '../types';

interface SignaturesCardProps {
  assinaturas: Signatures;
  motoristaNomeVeiculo: string;
  onChange: (campo: keyof Signatures, valor: any) => void;
}

export const SignaturesCard: React.FC<SignaturesCardProps> = ({
  assinaturas,
  motoristaNomeVeiculo,
  onChange
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 lg:p-6 space-y-4 w-full min-w-0 print-break-inside-avoid">
      <div className="flex items-center gap-2.5 pb-3.5 border-b border-slate-100">
        <div className="p-2 bg-slate-900 rounded-lg text-white shrink-0">
          <FileSignature className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-slate-900 leading-tight truncate">
            Liberação Operacional & Termo de Responsabilidade
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            Conferência física da amarração, integridade das máquinas e autorização de tráfego
          </p>
        </div>
      </div>

      {/* Termo de Aceite Checkbox */}
      <div className="p-3 sm:p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={assinaturas.termoAceite}
            onChange={e => onChange('termoAceite', e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded text-orange-600 focus:ring-orange-500 cursor-pointer shrink-0"
          />
          <span className="text-slate-700 leading-relaxed text-[11px]">
            Declaro que a carga especificada nesta Ordem de Carregamento foi vistoriada presencialmente, encontrando-se devidamente amarrada, calçada, com peso distribuído uniformemente sobre os eixos e respeitando os limites da Resolução CONTRAN 552/2015.
          </span>
        </label>
      </div>

      {/* Campos de Assinatura */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs pt-1">
        <div className="min-w-0">
          <label className="block font-semibold text-slate-700 mb-1 truncate">
            Responsável pelo Carregamento (Pátio) *
          </label>
          <input
            type="text"
            value={assinaturas.responsavelCarregamento}
            onChange={e => onChange('responsavelCarregamento', e.target.value)}
            placeholder="Ex: Roberto Mendes - Coordenador de Logística"
            className="w-full h-9 font-semibold bg-white border border-slate-300 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-900 transition-colors"
          />
        </div>

        <div className="min-w-0">
          <label className="block font-semibold text-slate-700 mb-1 truncate">
            Cargo / Departamento
          </label>
          <input
            type="text"
            value={assinaturas.cargoResponsavel}
            onChange={e => onChange('cargoResponsavel', e.target.value)}
            placeholder="Ex: Logística & Pátio Central"
            className="w-full h-9 bg-white border border-slate-300 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-900 transition-colors"
          />
        </div>

        <div className="min-w-0">
          <label className="block font-semibold text-slate-700 mb-1 truncate">
            Data e Hora da Liberação
          </label>
          <input
            type="text"
            value={assinaturas.dataHoraLiberacao}
            onChange={e => onChange('dataHoraLiberacao', e.target.value)}
            placeholder="Ex: 07/10/2026 às 08:15"
            className="w-full h-9 font-mono bg-white border border-slate-300 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-900 transition-colors"
          />
        </div>
      </div>

      {/* Assinaturas Digitais e Físicas para Impressão */}
      <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 text-center text-xs">
        <div className="flex flex-col items-center justify-end min-w-0">
          <div className="w-full max-w-xs border-b border-slate-400 pb-1 font-bold text-slate-900 truncate">
            {assinaturas.responsavelCarregamento || '______________________________________'}
          </div>
          <span className="text-[11px] text-slate-500 mt-1">
            Assinatura do Responsável Técnico (Essencial Energia)
          </span>
        </div>

        <div className="flex flex-col items-center justify-end min-w-0">
          <div className="w-full max-w-xs border-b border-slate-400 pb-1 font-bold text-slate-900 truncate">
            {motoristaNomeVeiculo || assinaturas.motoristaConferente || '______________________________________'}
          </div>
          <span className="text-[11px] text-slate-500 mt-1">
            Assinatura do Motorista / Transportador
          </span>
        </div>
      </div>

    </div>
  );
};

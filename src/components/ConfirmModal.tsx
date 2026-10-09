import React, { useEffect } from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  aberto: boolean;
  onFechar: () => void;
  onConfirmar: () => void;
  titulo: string;
  mensagem: React.ReactNode;
  textoConfirmar?: string;
  textoCancelar?: string;
  tipo?: 'perigo' | 'aviso';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  aberto,
  onFechar,
  onConfirmar,
  titulo,
  mensagem,
  textoConfirmar = 'Sim, Excluir',
  textoCancelar = 'Cancelar',
  tipo = 'perigo'
}) => {
  // Fechar com tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && aberto) {
        onFechar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [aberto, onFechar]);

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 no-print animate-in fade-in duration-150">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onFechar}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 overflow-hidden z-10 space-y-4">
        
        {/* Header com Ícone */}
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl shrink-0 ${
            tipo === 'perigo' 
              ? 'bg-red-100 text-red-600' 
              : 'bg-amber-100 text-amber-600'
          }`}>
            {tipo === 'perigo' ? (
              <Trash2 className="w-6 h-6" />
            ) : (
              <AlertTriangle className="w-6 h-6" />
            )}
          </div>

          <div className="flex-1 min-w-0 pr-6">
            <h3 className="text-base font-bold text-slate-900 leading-snug">
              {titulo}
            </h3>
            <div className="text-xs text-slate-600 mt-1 leading-relaxed">
              {mensagem}
            </div>
          </div>

          <button
            type="button"
            onClick={onFechar}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Botões de Ação */}
        <div className="pt-2 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onFechar}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            {textoCancelar}
          </button>

          <button
            type="button"
            onClick={() => {
              onConfirmar();
              onFechar();
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg text-white transition-colors flex items-center gap-1.5 shadow-sm ${
              tipo === 'perigo'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-amber-600 hover:bg-amber-700'
            }`}
          >
            {tipo === 'perigo' ? <Trash2 className="w-3.5 h-3.5" /> : null}
            <span>{textoConfirmar}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

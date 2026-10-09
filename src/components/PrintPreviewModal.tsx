import React, { useState, useEffect } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  Loader2, 
  Eye, 
  FileText,
  AlertCircle,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import { LoadingOrder } from '../types';
import { CalculationResults } from '../utils/calculations';
import { PrintDocument } from './PrintDocument';
import { gerarPdfNativo } from '../utils/pdfGenerator';
import { baixarArquivoTxtA4 } from '../utils/txtGenerator';

interface PrintPreviewModalProps {
  aberto: boolean;
  onFechar: () => void;
  ordem: LoadingOrder;
  metricas: CalculationResults;
  autoImprimir?: boolean;
}

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  aberto,
  onFechar,
  ordem,
  metricas,
  autoImprimir = false
}) => {
  const [gerandoPdf, setGerandoPdf] = useState(false);
  const [imprimindo, setImprimindo] = useState(false);
  const [statusPdf, setStatusPdf] = useState<string>('');
  const [sucessoPdf, setSucessoPdf] = useState(false);
  const [zoom, setZoom] = useState<number>(100);

  // Efeito para disparar a impressora automaticamente quando solicitado pelo botão Imprimir
  useEffect(() => {
    if (aberto && autoImprimir) {
      const timer = setTimeout(() => {
        handleImprimirAgora();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [aberto, autoImprimir]);

  // Suporte a tecla Esc para fechar e Ctrl+P para imprimir dentro do modal
  useEffect(() => {
    if (!aberto) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onFechar();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handleImprimirAgora();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [aberto]);

  if (!aberto) return null;

  const handleImprimirAgora = () => {
    setImprimindo(true);
    setStatusPdf('Preparando e enviando documento para a impressora...');
    setSucessoPdf(false);

    setTimeout(() => {
      try {
        window.focus();
        // Dispara o diálogo nativo do sistema/navegador
        window.print();
        
        setStatusPdf('Comando de impressão executado! Se necessário, baixe também o PDF oficial abaixo.');
        setSucessoPdf(true);
        setTimeout(() => {
          setStatusPdf('');
          setSucessoPdf(false);
          setImprimindo(false);
        }, 5000);
      } catch (err) {
        console.warn('Tentativa de window.print() gerou exceção:', err);
        setStatusPdf('Diálogo direto indisponível neste ambiente. Gerando PDF oficial para impressão...');
        handleBaixarPdfDireto();
        setImprimindo(false);
      }
    }, 150);
  };

  const handleBaixarPdfDireto = () => {
    setGerandoPdf(true);
    setSucessoPdf(false);
    setStatusPdf('Gerando documento PDF oficial de alta resolução (A4)...');

    const nomeFormatado = `Ordem_Carregamento_OC_${(ordem.ocNum || 'SN').replace(/[\/\\]/g, '-')}_REV_001_2026.pdf`;

    setTimeout(() => {
      try {
        const sucesso = gerarPdfNativo(ordem, metricas, nomeFormatado);
        setGerandoPdf(false);

        if (sucesso) {
          setSucessoPdf(true);
          setStatusPdf('Arquivo PDF baixado com sucesso! Pronto para abrir e imprimir em qualquer impressora.');
          setTimeout(() => {
            setSucessoPdf(false);
            setStatusPdf('');
          }, 4500);
        } else {
          setStatusPdf('Falha ao compilar PDF. Tente usar a opção "Imprimir Agora".');
        }
      } catch (err) {
        console.error('Erro ao gerar PDF:', err);
        setGerandoPdf(false);
        setStatusPdf('Falha ao compilar PDF. Tente usar a opção "Imprimir Agora".');
      }
    }, 150);
  };

  const handleBaixarTxt = () => {
    baixarArquivoTxtA4(ordem, metricas);
    setStatusPdf('Arquivo TXT formatado no padrão A4 baixado com sucesso!');
    setSucessoPdf(true);
    setTimeout(() => {
      setStatusPdf('');
      setSucessoPdf(false);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-start p-2 sm:p-5 no-print animate-in fade-in duration-150">
      
      {/* Barra de Controle Superior Fixa */}
      <div className="sticky top-2 z-20 w-full max-w-5xl bg-slate-900 text-white p-3 sm:p-4 rounded-2xl shadow-2xl border border-slate-700/80 flex flex-wrap items-center justify-between gap-3 mb-4">
        
        {/* Identificação e Título */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 rounded-xl text-white font-bold shadow-md">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-extrabold tracking-tight">
                Central de Impressão & Emissão Oficial
              </h2>
              <span className="font-mono text-[10px] font-bold bg-slate-800 text-orange-400 px-2 py-0.5 rounded border border-slate-700">
                REV 001/2026
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              O.C. {ordem.ocNum || 'S/N'} · Cliente: {ordem.cliente || 'Não informado'} · Padrão A4 Oficial
            </p>
          </div>
        </div>

        {/* Botões de Ação de Impressão */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Controles de Zoom */}
          <div className="hidden md:flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700 text-slate-300 mr-1">
            <button
              type="button"
              onClick={() => setZoom(prev => Math.max(70, prev - 15))}
              className="p-1.5 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              title="Diminuir visualização"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-2 font-semibold">{zoom}%</span>
            <button
              type="button"
              onClick={() => setZoom(prev => Math.min(130, prev + 15))}
              className="p-1.5 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              title="Aumentar visualização"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoom(100)}
              className="p-1.5 hover:text-white hover:bg-slate-700 rounded-lg transition-colors ml-0.5"
              title="Restaurar tamanho 100%"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Botão Baixar TXT A4 */}
          <button
            type="button"
            onClick={handleBaixarTxt}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            title="Baixar documento em texto formatado para padrão A4 (80 colunas)"
          >
            <FileText className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Baixar TXT</span>
          </button>

          {/* Botão Baixar PDF Direto */}
          <button
            type="button"
            disabled={gerandoPdf}
            onClick={handleBaixarPdfDireto}
            className="px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 disabled:bg-orange-800 text-white transition-colors flex items-center gap-2 shadow-md cursor-pointer"
            title="Gera e faz download direto do arquivo .pdf vetorial para impressão"
          >
            {gerandoPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Gerando PDF...</span>
              </>
            ) : sucessoPdf ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>PDF Baixado!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Baixar PDF (.pdf)</span>
              </>
            )}
          </button>

          {/* BOTAO IMPRIMIR PRINCIPAL */}
          <button
            type="button"
            disabled={imprimindo}
            onClick={handleImprimirAgora}
            className="px-4 sm:px-5 py-2 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white transition-all flex items-center gap-2 shadow-lg shadow-blue-900/40 cursor-pointer ring-2 ring-blue-400/30"
            title="Enviar diretamente para a impressora do sistema (Ctrl+P)"
          >
            {imprimindo ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Printer className="w-4 h-4 stroke-[2.5]" />
            )}
            <span>Imprimir Agora</span>
          </button>

          {/* Botão Fechar Modal */}
          <button
            type="button"
            onClick={onFechar}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1 cursor-pointer"
            title="Fechar visualização de impressão (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Banner de Feedback e Instruções de Impressão */}
      {statusPdf && (
        <div className={`w-full max-w-5xl p-3 mb-3 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all shadow-md ${
          sucessoPdf 
            ? 'bg-emerald-600 text-white' 
            : gerandoPdf || imprimindo
            ? 'bg-blue-600 text-white animate-pulse'
            : 'bg-amber-600 text-white'
        }`}>
          {sucessoPdf ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : gerandoPdf || imprimindo ? (
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{statusPdf}</span>
        </div>
      )}

      {/* Dica de Impressão Rápida */}
      <div className="w-full max-w-5xl mb-3 flex items-center justify-between text-[11px] text-slate-400 px-2">
        <span>
          💡 <strong>Dica de Impressão:</strong> Clique em <strong>Imprimir Agora</strong> para abrir o diálogo da sua impressora. Você também pode salvar o arquivo clicando em <strong>Baixar PDF</strong>.
        </span>
        <span className="font-mono hidden sm:inline text-slate-400">
          Atalho: Ctrl+P
        </span>
      </div>

      {/* Visual A4 Paper Preview Container */}
      <div className="w-full max-w-5xl bg-slate-900/60 p-2 sm:p-6 rounded-2xl flex justify-center shadow-inner overflow-x-auto border border-slate-800">
        <div 
          id="documento-preview-conteudo"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          className="bg-white shadow-2xl rounded-sm w-full max-w-[820px] transition-transform duration-200"
        >
          <PrintDocument
            ordem={ordem}
            metricas={metricas}
            isModalPreview={true}
          />
        </div>
      </div>

    </div>
  );
};

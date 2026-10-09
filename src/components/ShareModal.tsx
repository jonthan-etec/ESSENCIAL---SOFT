import React, { useState } from 'react';
import { 
  X, 
  MessageSquare, 
  FileSpreadsheet, 
  Download, 
  Upload, 
  Copy, 
  Check, 
  Share2, 
  FileCode,
  AlertCircle,
  FileText
} from 'lucide-react';
import { LoadingOrder } from '../types';
import { CalculationResults } from '../utils/calculations';
import { 
  exportarOrdensParaJson, 
  exportarOrdemParaCsv, 
  gerarResumoTextoWhatsApp 
} from '../utils/storage';
import { 
  gerarDocumentoTxtA4, 
  baixarArquivoTxtA4 
} from '../utils/txtGenerator';

interface ShareModalProps {
  aberto: boolean;
  onFechar: () => void;
  ordem: LoadingOrder;
  metricas: CalculationResults;
  onImportarJson: (dados: LoadingOrder | LoadingOrder[]) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  aberto,
  onFechar,
  ordem,
  metricas,
  onImportarJson
}) => {
  const [abaAtiva, setAbaAtiva] = useState<'txt' | 'whatsapp' | 'csv' | 'json'>('txt');
  const [copiado, setCopiado] = useState(false);
  const [copiadoTxt, setCopiadoTxt] = useState(false);
  const [erroImport, setErroImport] = useState<string | null>(null);

  if (!aberto) return null;

  const textoWhatsApp = gerarResumoTextoWhatsApp(ordem);
  const textoTxtA4 = gerarDocumentoTxtA4(ordem, metricas);

  const handleCopiarTexto = () => {
    navigator.clipboard.writeText(textoWhatsApp);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleCopiarTxtA4 = () => {
    navigator.clipboard.writeText(textoTxtA4);
    setCopiadoTxt(true);
    setTimeout(() => setCopiadoTxt(false), 2000);
  };

  const handleBaixarTxt = () => {
    baixarArquivoTxtA4(ordem, metricas);
  };

  const handleArquivoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErroImport(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const conteudo = event.target?.result as string;
        const parsed = JSON.parse(conteudo);
        onImportarJson(parsed);
        onFechar();
      } catch (err) {
        setErroImport('Arquivo JSON inválido ou corrompido.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 no-print">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onFechar}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col border border-slate-200 overflow-hidden z-10 max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">Exportar & Compartilhar O.C.</h2>
              <p className="text-[11px] text-slate-400">
                O.C. {ordem.ocNum} · {ordem.cliente}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onFechar}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Abas */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 text-xs px-4 pt-2 gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setAbaAtiva('txt')}
            className={`px-3 py-2 font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              abaAtiva === 'txt'
                ? 'border-orange-500 text-orange-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4 text-orange-500" />
            <span>Documento TXT (A4)</span>
          </button>

          <button
            type="button"
            onClick={() => setAbaAtiva('whatsapp')}
            className={`px-3 py-2 font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              abaAtiva === 'whatsapp'
                ? 'border-orange-500 text-orange-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-500" />
            <span>WhatsApp / Despacho</span>
          </button>

          <button
            type="button"
            onClick={() => setAbaAtiva('csv')}
            className={`px-3 py-2 font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              abaAtiva === 'csv'
                ? 'border-orange-500 text-orange-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-green-600" />
            <span>Planilha CSV / Excel</span>
          </button>

          <button
            type="button"
            onClick={() => setAbaAtiva('json')}
            className={`px-3 py-2 font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              abaAtiva === 'json'
                ? 'border-orange-500 text-orange-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCode className="w-4 h-4 text-blue-500" />
            <span>Backup JSON</span>
          </button>
        </div>

        {/* Conteúdo das Abas */}
        <div className="p-5 text-xs flex-1 overflow-y-auto">
          {abaAtiva === 'txt' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-xs">
                    Documento de Texto Formatado no Padrão A4 (80 Colunas)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Diagramação técnica em ASCII / UTF-8 compatível com impressoras térmicas, matriciais e sistemas de despacho.
                  </p>
                </div>
              </div>

              <div className="relative">
                <textarea
                  readOnly
                  rows={13}
                  value={textoTxtA4}
                  className="w-full font-mono text-[10.5px] p-3 bg-slate-900 text-slate-100 rounded-lg outline-none leading-tight border border-slate-700 select-all overflow-x-auto whitespace-pre font-normal"
                />
              </div>

              <div className="flex flex-wrap justify-between items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-500">
                  Formato: 80 colunas × 58 linhas por folha A4
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopiarTxtA4}
                    className="px-3.5 py-2 rounded-lg font-semibold border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                  >
                    {copiadoTxt ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copiar Texto</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleBaixarTxt}
                    className="px-4 py-2 rounded-lg font-bold bg-orange-500 hover:bg-orange-600 text-white transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>Baixar Arquivo TXT (.txt)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
          {abaAtiva === 'whatsapp' && (
            <div className="space-y-3">
              <p className="text-slate-600">
                Resumo formatado pronto para envio aos motoristas, supervisores de campo ou clientes:
              </p>
              
              <div className="relative">
                <textarea
                  readOnly
                  rows={8}
                  value={textoWhatsApp}
                  className="w-full font-mono text-[11px] p-3 bg-slate-50 border border-slate-300 rounded-lg outline-none leading-relaxed text-slate-800 select-all"
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[11px] text-slate-400">
                  Compatível com WhatsApp Web e Mobile
                </span>
                <button
                  type="button"
                  onClick={handleCopiarTexto}
                  className={`px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-1.5 shadow-xs ${
                    copiado
                      ? 'bg-emerald-600 text-white'
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                  }`}
                >
                  {copiado ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copiado com sucesso!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar Texto Formatado</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {abaAtiva === 'csv' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
                <div className="font-bold text-emerald-900 flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
                  Exportação para Excel e Sistemas ERP
                </div>
                <p className="text-emerald-800 text-[11px] leading-relaxed">
                  Gera um arquivo delimitado por ponto e vírgula (.CSV) em codificação UTF-8 compatível com o Microsoft Excel, LibreOffice e Google Sheets contendo a lista completa de equipamentos, pesos, amarrações e metadados.
                </p>
              </div>

              <button
                type="button"
                onClick={() => exportarOrdemParaCsv(ordem)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Baixar Planilha CSV da O.C. {ordem.ocNum}</span>
              </button>
            </div>
          )}

          {abaAtiva === 'json' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="font-bold text-slate-800">Exportar Arquivo de Backup:</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => exportarOrdensParaJson(ordem)}
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg font-semibold text-slate-800 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-4 h-4 text-blue-600" />
                    <span>Baixar Esta O.C. (.json)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => exportarOrdensParaJson()}
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg font-semibold text-slate-800 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-4 h-4 text-slate-700" />
                    <span>Baixar Todas as O.C.s</span>
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 space-y-2">
                <div className="font-bold text-slate-800">Restaurar / Importar Backup JSON:</div>
                <label className="border-2 border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 hover:bg-orange-50/20 transition-all text-center">
                  <Upload className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="font-bold text-slate-700">Selecione um arquivo .json para restaurar</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Substitui ou acrescenta ordens salvas</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleArquivoUpload}
                    className="hidden"
                  />
                </label>

                {erroImport && (
                  <div className="p-2 bg-red-50 text-red-700 rounded border border-red-200 flex items-center gap-1.5 text-[11px]">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{erroImport}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-right">
          <button
            type="button"
            onClick={onFechar}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium rounded-lg text-xs transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};

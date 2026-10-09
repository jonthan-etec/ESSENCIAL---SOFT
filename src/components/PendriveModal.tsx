import React, { useRef, useState } from 'react';
import { 
  X, 
  HardDrive, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Laptop, 
  FolderSync, 
  FileText, 
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { LoadingOrder, PresetEquipment } from '../types';
import { 
  exportarBackupCompletoPendrive, 
  importarBackupCompletoPendrive, 
  salvarNoPendriveApi 
} from '../utils/storage';

interface PendriveModalProps {
  aberto: boolean;
  onFechar: () => void;
  ordens: LoadingOrder[];
  catalogo: PresetEquipment[];
  conectadoAoServidorPendrive: boolean;
  onRecarregarDados: (novasOrdens?: LoadingOrder[], novoCatalogo?: PresetEquipment[]) => void;
  onNotificar: (msg: string) => void;
}

export const PendriveModal: React.FC<PendriveModalProps> = ({
  aberto,
  onFechar,
  ordens,
  catalogo,
  conectadoAoServidorPendrive,
  onRecarregarDados,
  onNotificar,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sincronizando, setSincronizando] = useState(false);
  const [copiadoPassos, setCopiadoPassos] = useState(false);

  if (!aberto) return null;

  const handleBaixarBackup = () => {
    exportarBackupCompletoPendrive(ordens, catalogo);
    onNotificar('Arquivo dados_pendrive.json gerado! Salve-o na pasta do seu pendrive.');
  };

  const handleForcarSincronizacao = async () => {
    setSincronizando(true);
    const ok = await salvarNoPendriveApi(ordens, catalogo);
    setSincronizando(false);
    if (ok) {
      onNotificar('✓ Dados sincronizados diretamente com dados_pendrive.json no pendrive!');
    } else {
      handleBaixarBackup();
    }
  };

  const handleSelecionarArquivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const conteudo = event.target?.result as string;
      if (!conteudo) return;

      const resultado = importarBackupCompletoPendrive(conteudo);
      if (resultado.success) {
        onRecarregarDados(resultado.ordens, resultado.catalogo);
        onNotificar(`✓ ${resultado.mensagem}`);
        onFechar();
      } else {
        alert(resultado.mensagem);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const copiarInstrucoes = () => {
    const texto = `COMO USAR NO PENDRIVE EM QUALQUER COMPUTADOR:\n1. Copie a pasta inteira para o pendrive.\n2. Conecte o pendrive em qualquer computador Windows.\n3. Dê dois cliques em 'INICIAR_SISTEMA.bat'.\n4. O sistema abre no navegador sem precisar de internet nem de instalar nada!\n5. As ordens ficam salvas em 'dados_pendrive.json'.\nRevisão: REV 001/2026 | Desenvolvido por Jonthan Oliveira`;
    navigator.clipboard.writeText(texto).then(() => {
      setCopiadoPassos(true);
      setTimeout(() => setCopiadoPassos(false), 2500);
      onNotificar('Instruções copiadas para a área de transferência!');
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in no-print">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">
                  Central do Modo Pendrive (Portátil)
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                  REV 001/2026
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Funciona em qualquer computador Windows, Linux ou Mac direto do Pendrive
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

        {/* Conteúdo rolável */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Status de Sincronização */}
          <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
            conectadoAoServidorPendrive 
              ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
              : 'bg-slate-800/60 border-slate-700/80 text-slate-200'
          }`}>
            {conectadoAoServidorPendrive ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <FolderSync className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="font-semibold text-sm flex items-center justify-between">
                <span>
                  {conectadoAoServidorPendrive
                    ? 'Conectado ao Servidor Nativo do Pendrive'
                    : 'Modo Portátil Standalone Ativo'}
                </span>
                {conectadoAoServidorPendrive && (
                  <span className="text-[11px] bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-700">
                    Sincronização em Tempo Real
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {conectadoAoServidorPendrive
                  ? 'Todas as alterações são gravadas instantaneamente no arquivo dados_pendrive.json localizado na raiz da sua pasta no pendrive.'
                  : 'Ao copiar a pasta para o pendrive, basta dar 2 cliques em INICIAR_SISTEMA.bat em qualquer computador Windows para abrir com dados persistidos.'}
              </p>
            </div>
          </div>

          {/* Guia Rápido: Como Usar no Pendrive */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Laptop className="w-4 h-4 text-cyan-400" />
                Como Rodar em Qualquer Computador (Windows)
              </h3>
              <button
                type="button"
                onClick={copiarInstrucoes}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
              >
                {copiadoPassos ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiadoPassos ? 'Copiado!' : 'Copiar Guia'}
              </button>
            </div>

            <ol className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-cyan-900/60 text-cyan-300 flex items-center justify-center font-bold text-[11px] shrink-0 border border-cyan-700">
                  1
                </span>
                <span>
                  <strong className="text-white">Copie a pasta completa do projeto</strong> para a raiz do seu pendrive ou disco externo.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-cyan-900/60 text-cyan-300 flex items-center justify-center font-bold text-[11px] shrink-0 border border-cyan-700">
                  2
                </span>
                <span>
                  Conecte o pendrive em <strong className="text-white">qualquer computador</strong> (Windows 10, 11, 8 ou 7).
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-cyan-900/60 text-cyan-300 flex items-center justify-center font-bold text-[11px] shrink-0 border border-cyan-700">
                  3
                </span>
                <span>
                  Dê dois cliques em <strong className="text-cyan-400 font-mono">INICIAR_SISTEMA.bat</strong> ou <strong className="text-cyan-400 font-mono">INICIAR_MODO_APP_WINDOWS.bat</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-cyan-900/60 text-cyan-300 flex items-center justify-center font-bold text-[11px] shrink-0 border border-cyan-700">
                  4
                </span>
                <span>
                  O aplicativo abre na hora! <strong className="text-emerald-400">Zero instalação</strong> (não requer Node.js, Python ou permissão de administrador).
                </span>
              </li>
            </ol>
          </div>

          {/* Resumo de Dados Atuais */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Ordens Salvas</div>
              <div className="text-xl font-bold text-white mt-0.5">{ordens.length}</div>
              <div className="text-[10px] text-slate-500">Prontas para transporte</div>
            </div>

            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Catálogo Técnico</div>
              <div className="text-xl font-bold text-white mt-0.5">{catalogo.length}</div>
              <div className="text-[10px] text-slate-500">Equipamentos e geradores</div>
            </div>

            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60 col-span-2 sm:col-span-1">
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Arquivo de Dados</div>
              <div className="text-xs font-mono font-bold text-cyan-300 mt-1 truncate">
                dados_pendrive.json
              </div>
              <div className="text-[10px] text-slate-500">Banco de dados portátil</div>
            </div>
          </div>

          {/* Ações de Backup e Restauração */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Ações Manuais de Backup e Restauração
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleBaixarBackup}
                className="p-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-900/30"
              >
                <Download className="w-4 h-4" />
                <span>Baixar Backup Geral (.json)</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Upload className="w-4 h-4 text-emerald-400" />
                <span>Restaurar Dados do Pendrive</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleSelecionarArquivo}
              />
            </div>

            {conectadoAoServidorPendrive && (
              <button
                type="button"
                onClick={handleForcarSincronizacao}
                disabled={sincronizando}
                className="w-full py-2.5 px-3 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${sincronizando ? 'animate-spin' : ''}`} />
                <span>Forçar Gravação Direta no Pendrive Agora</span>
              </button>
            )}
          </div>
        </div>

        {/* Rodapé do Modal */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">REV 001/2026</span>
            <span>·</span>
            <span>Desenvolvido por Jonthan Oliveira</span>
          </div>

          <button
            type="button"
            onClick={onFechar}
            className="px-4 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

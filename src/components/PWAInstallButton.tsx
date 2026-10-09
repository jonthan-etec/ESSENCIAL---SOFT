import React, { useState } from 'react';
import { Monitor, Download, CheckCircle2, X, Laptop, ShieldCheck } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        onClose();
      }
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden text-slate-800">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-700 via-sky-600 to-blue-700 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
              <Monitor className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Instalar Aplicativo Windows</h3>
              <p className="text-xs text-sky-100">Essencial Energia • Standalone Desktop</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-sm">
          {isInstalled ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 text-emerald-800">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="font-semibold">Aplicativo já instalado!</p>
                <p className="text-xs text-emerald-700">
                  O sistema já está configurado como aplicativo no seu Windows. Você pode acessá-lo pelo Menu Iniciar ou barra de tarefas.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Laptop className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sky-900">Vantagens do App no Windows:</h4>
                    <ul className="text-xs text-sky-800 mt-1.5 space-y-1 list-disc list-inside">
                      <li>Janela própria sem barra de endereços (visual de software nativo)</li>
                      <li>Ícone dedicado no Menu Iniciar e na Área de Trabalho</li>
                      <li>Atalhos diretos e carregamento ultrarrápido com cache offline</li>
                      <li>Acesso instantâneo para emissão e impressão de O.C.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {isInstallable ? (
                <div className="text-center py-2">
                  <p className="text-xs text-slate-600 mb-3">
                    Seu navegador está pronto para criar o executável do app na sua Área de Trabalho e Menu Iniciar:
                  </p>
                  <button
                    onClick={handleInstallClick}
                    className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md shadow-sky-600/20 transition active:scale-95"
                  >
                    <Download className="w-5 h-5" />
                    Instalar no Windows Agora (1 Clique)
                  </button>
                </div>
              ) : (
                <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-sky-600" />
                    Instalação no Microsoft Edge ou Google Chrome (Windows)
                  </h4>
                  <ol className="text-xs text-slate-600 space-y-2 list-decimal list-inside">
                    <li>
                      No <strong>Microsoft Edge</strong> ou <strong>Google Chrome</strong> no Windows:
                    </li>
                    <li className="pl-2">
                      Olhe no topo direito da barra de navegação e clique no ícone de <strong>Instalar Aplicativo</strong> (ou vá no menu <strong>···</strong> &gt; <strong>Aplicativos</strong> &gt; <strong>Instalar Essencial Energia</strong>).
                    </li>
                    <li className="pl-2">
                      Marque <em>"Criar atalho na Área de Trabalho"</em> e <em>"Fixar na barra de tarefas"</em>.
                    </li>
                  </ol>
                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={handleCopyUrl}
                      className="text-xs bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
                    >
                      {copied ? 'Link Copiado!' : 'Copiar Link para abrir no Edge/Chrome'}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[11px] text-slate-500">
            <span>Essencial Energia • versão desenvolvida por Jonthan Oliveira</span>
            <button
              onClick={onClose}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium transition"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  // If already installed, show small badge or hide
  if (isInstalled) {
    return (
      <div
        title="Executando no modo Aplicativo Windows"
        className="hidden xl:flex items-center gap-1.5 h-9 px-2.5 text-xs font-semibold rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 whitespace-nowrap shrink-0"
      >
        <Monitor className="w-3.5 h-3.5 text-emerald-300" />
        <span>App Windows Ativo</span>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setShowModal(true);
        }}
        className="hidden md:flex items-center gap-1.5 h-9 px-2.5 sm:px-3 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-500 text-white shadow-xs transition cursor-pointer border border-sky-400/40 whitespace-nowrap shrink-0"
        title="Instalar como aplicativo no Windows (Área de Trabalho e Menu Iniciar)"
      >
        <Monitor className="w-4 h-4 text-yellow-300 shrink-0" />
        <span className="hidden xl:inline">Instalar App Windows</span>
        <span className="hidden md:inline xl:hidden">Instalar App</span>
      </button>

      <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

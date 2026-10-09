import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <aside
      aria-label="Notificação de conexão"
      className="fixed bottom-4 left-4 right-4 sm:right-auto max-w-[calc(100vw-2rem)] z-50 flex items-center gap-2 rounded-xl bg-slate-900/90 text-amber-300 border border-amber-500/40 px-3.5 py-2 text-xs font-semibold shadow-2xl backdrop-blur-md"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
      </span>
      <WifiOff className="w-4 h-4 text-amber-400" />
      <span>Modo Offline do App • Dados e O.C. salvos localmente</span>
    </aside>
  );
};

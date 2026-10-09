import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Registra Service Worker para suporte a Aplicativo Desktop Windows e PWA Offline
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('Nova versão do aplicativo disponível.');
  },
  onOfflineReady() {
    console.log('Aplicativo pronto para uso offline no Windows.');
  },
});

createRoot(document.getElementById('root')!).render(<App />);

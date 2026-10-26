import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register PWA service worker for Chrome installability and offline support
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  try {
    registerSW({
      immediate: true,
      onRegisteredSW(swUrl) {
        console.log('ADHD Visual Textbook Service Worker active:', swUrl);
      },
      onRegisterError(error) {
        console.warn('PWA auto-register notice; attempting /sw.js fallback:', error);
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.warn('Manual SW registration notice:', err);
        });
      }
    });
  } catch (e) {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('Manual SW fallback notice:', err);
    });
  }
}

createRoot(document.getElementById('root')!).render(<App />);

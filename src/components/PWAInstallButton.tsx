import React, { useState } from 'react';
import { usePWAInstall } from '../utils/usePWAInstall';
import { Download, CheckCircle, HelpCircle, X, Laptop } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already running in standalone PWA window, display a subtle confirmation
  if (isInstalled) {
    return (
      <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 rounded font-mono shadow-2xs">
        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
        <span>Installed App</span>
      </span>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      setIsInstalling(true);
      try {
        await install();
      } finally {
        setIsInstalling(false);
      }
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        disabled={isInstalling}
        className="px-2.5 py-1 text-xs font-bold rounded border-2 border-black bg-amber-400 hover:bg-amber-300 text-black flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 whitespace-nowrap cursor-pointer"
        title="Install as Chrome PWA Desktop App"
      >
        <Download className="w-3.5 h-3.5 text-black stroke-[2.5]" />
        <span>{isInstalling ? 'Installing...' : 'Install App'}</span>
        {!isInstallable && !isIOS && (
          <HelpCircle className="w-3 h-3 text-black/60 hidden sm:inline" />
        )}
      </button>

      {/* Guide modal if browser hasn't fired beforeinstallprompt or user wants desktop Chrome guide */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-xl bg-[#FFFDF9] border-2 border-black p-6 shadow-2xl text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black">
              <div className="flex items-center gap-2">
                <Laptop className="w-5 h-5 text-amber-600" />
                <h3 className="font-extrabold text-base font-mono uppercase tracking-wide">
                  Install in Google Chrome
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="p-1 rounded hover:bg-slate-200 text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs leading-relaxed">
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg flex items-start gap-2.5">
                <span className="text-xl">💡</span>
                <div>
                  <p className="font-bold text-slate-900">How to install directly from Chrome:</p>
                  <p className="text-slate-700 mt-1">
                    1. Look at the <strong>right side of your Chrome URL address bar</strong>.<br />
                    2. Click the <strong>Install icon 📥</strong> (or computer monitor icon with a down arrow).<br />
                    3. Click <strong>Install</strong> to add the ADHD Visual Textbook to your desktop or taskbar.
                  </p>
                </div>
              </div>

              {isIOS && (
                <div className="p-3 bg-blue-50 border border-blue-300 rounded-lg flex items-start gap-2.5">
                  <span className="text-xl">📱</span>
                  <div>
                    <p className="font-bold text-slate-900">On iPhone or iPad (Safari / Chrome):</p>
                    <p className="text-slate-700 mt-1">
                      1. Tap the <strong>Share</strong> button (box with up arrow).<br />
                      2. Scroll down and tap <strong>Add to Home Screen</strong>.
                    </p>
                  </div>
                </div>
              )}

              <div className="p-3 bg-slate-100 border border-slate-300 rounded-lg">
                <p className="font-bold text-slate-800">Alternative from Chrome Menu:</p>
                <p className="text-slate-600 mt-1">
                  Click the <strong>three dots menu (⋮)</strong> in Chrome top-right &rarr; <strong>Cast, save and share</strong> &rarr; <strong>Install ADHD Visual Textbook...</strong>
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-black/20 flex justify-end">
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="px-4 py-1.5 bg-black text-white text-xs font-bold rounded border border-black hover:bg-slate-800 transition"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

import React, { useState, useRef } from 'react';
import { PaperTheme, FontPreference, FontSizePreference } from '../types';
import {
  Printer,
  Bug,
  Sparkles,
  BookOpen,
  FileCode,
  FileDown,
  ChevronDown,
  Library,
  ExternalLink,
  SlidersHorizontal,
  X,
  Check,
  Tag,
  Download,
  Upload,
  FileJson
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface TopHeaderProps {
  paperTheme: PaperTheme;
  onPaperThemeChange: (theme: PaperTheme) => void;
  fontPref: FontPreference;
  onFontPrefChange: (font: FontPreference) => void;
  fontSize: FontSizePreference;
  onFontSizeChange: (size: FontSizePreference) => void;
  onVectorPrint: () => void;
  onOpenPrintTab: () => void;
  onDownloadHtml: () => void;
  onDownloadMarkdown: () => void;
  onOpenLibrary: () => void;
  savedCount: number;
  onToggleConsole: () => void;
  logCount: number;
  hasErrors: boolean;
  onSelectPreset: (presetId: string) => void;
  activePresetId: string;
  activeView: 'textbook' | 'generator';
  onViewChange: (view: 'textbook' | 'generator') => void;
  onOpenCategoryManager?: () => void;
  onExportLibrary?: () => void;
  onImportBackup?: (file: File) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  paperTheme,
  onPaperThemeChange,
  fontPref,
  onFontPrefChange,
  fontSize,
  onFontSizeChange,
  onVectorPrint,
  onOpenPrintTab,
  onDownloadHtml,
  onDownloadMarkdown,
  onOpenLibrary,
  savedCount,
  onToggleConsole,
  logCount,
  hasErrors,
  onSelectPreset,
  activePresetId,
  activeView,
  onViewChange,
  onOpenCategoryManager,
  onExportLibrary,
  onImportBackup
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showMobileTools, setShowMobileTools] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImportBackup) {
      onImportBackup(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <header className="w-full bg-[#FFFDF9] border-b-2 border-black sticky top-0 z-40 shadow-xs no-print transition-colors">
      {/* ========================================================
          1. PRIMARY NAVIGATION BAR (Always single compact line)
          Responsive across mobile portrait, landscape, tablet & desktop
         ======================================================== */}
      <div className="max-w-[1440px] mx-auto px-2.5 sm:px-4 h-13 sm:h-14 flex items-center justify-between gap-2">
        {/* Left Section: Brand Logo & Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <img
              src="/icon.svg"
              alt="Visual Notebook"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded object-contain border border-black/20 shadow-2xs shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold tracking-tight uppercase text-black font-mono text-[11px] sm:text-xs md:text-sm truncate">
                <span className="inline sm:hidden">VISUAL NOTEBOOK</span>
                <span className="hidden sm:inline md:hidden">VISUAL NOTEBOOK</span>
                <span className="hidden md:inline">VISUAL NOTEBOOK · APPLIED KNOWLEDGE</span>
              </span>
              <span className="text-[10px] text-amber-900 font-mono tracking-wider -mt-0.5 hidden xl:inline font-bold">
                “Knowledge isn’t power. Applied knowledge is.”
              </span>
            </div>
          </div>

          <span className="text-black/20 hidden md:inline">|</span>

          {/* Navigation View Switcher (Read vs Auto-Analyze) */}
          <div className="inline-flex p-0.5 bg-slate-200/80 border border-black/40 rounded-md shrink-0">
            <button
              type="button"
              onClick={() => {
                onViewChange('textbook');
                setShowMobileTools(false);
              }}
              className={`px-2 sm:px-3 py-1 rounded text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeView === 'textbook'
                  ? 'bg-black text-white shadow-2xs'
                  : 'text-slate-700 hover:text-black hover:bg-white/60'
              }`}
              title="Read Textbook Chapters"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden xs:inline sm:inline">Read</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onViewChange('generator');
                setShowMobileTools(false);
              }}
              className={`px-2 sm:px-3 py-1 rounded text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeView === 'generator'
                  ? 'bg-black text-white shadow-2xs'
                  : 'text-slate-700 hover:text-black hover:bg-white/60'
              }`}
              title="Auto-Analyze New YouTube Video"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden xs:inline sm:inline">Analyze</span>
            </button>
          </div>
        </div>

        {/* Right Section: Print PDF + Desktop Toolbar Items + Mobile Ergonomics Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Desktop Only: Quick Presets */}
          <div className="hidden xl:flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase font-mono">Presets:</span>
            <button
              type="button"
              onClick={() => {
                onSelectPreset('huberman-dopamine-masterclass');
                onViewChange('textbook');
              }}
              className={`px-2 py-0.5 text-[11px] font-semibold rounded border transition-colors whitespace-nowrap cursor-pointer ${
                activePresetId === 'huberman-dopamine-masterclass' && activeView === 'textbook'
                  ? 'bg-amber-100 text-black border-black font-bold shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-black'
              }`}
            >
              ⚡ Huberman
            </button>
            <button
              type="button"
              onClick={() => {
                onSelectPreset('lembke-dopamine-nation');
                onViewChange('textbook');
              }}
              className={`px-2 py-0.5 text-[11px] font-semibold rounded border transition-colors whitespace-nowrap cursor-pointer ${
                activePresetId === 'lembke-dopamine-nation' && activeView === 'textbook'
                  ? 'bg-purple-100 text-black border-black font-bold shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-black'
              }`}
            >
              🧠 Lembke
            </button>
          </div>

          {/* Desktop Only: PWA Install & Library Button */}
          <div className="hidden lg:flex items-center gap-1.5">
            <PWAInstallButton />

            <button
              type="button"
              onClick={onOpenLibrary}
              className="px-2.5 py-1 text-xs font-bold rounded border-2 border-black bg-white hover:bg-slate-100 flex items-center gap-1.5 shadow-2xs transition-colors whitespace-nowrap cursor-pointer"
              title="Open My Library (IndexedDB Storage)"
            >
              <Library className="w-3.5 h-3.5 text-black" />
              <span>Library</span>
              <span className="bg-black text-white text-[10px] font-mono px-1 rounded">
                {savedCount}
              </span>
            </button>
          </div>

          {/* Vector A4 Print Button Group (Always Visible & Accessible on all devices) */}
          <div className="relative inline-block text-left">
            <div className="flex items-center">
              <button
                type="button"
                onClick={onVectorPrint}
                className="px-2.5 sm:px-3 py-1.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold text-[11px] sm:text-xs uppercase tracking-wider rounded-l border-2 border-black flex items-center gap-1 sm:gap-1.5 shadow-2xs transition-transform active:scale-95 cursor-pointer"
                title="Print Vector A4 PDF (Ctrl+P / Command+P)"
              >
                <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                <span className="hidden sm:inline">Print A4 PDF</span>
                <span className="inline sm:hidden">PDF</span>
              </button>
              <button
                type="button"
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="px-1.5 py-1.5 bg-[#15803D] hover:bg-[#166534] text-white border-2 border-l-0 border-black rounded-r cursor-pointer"
                title="More Print & Vector Export Options"
                aria-label="More export options"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Export Menu Dropdown */}
            {showExportMenu && (
              <div
                className="absolute right-0 mt-1 w-64 bg-white border-2 border-black rounded shadow-lg py-1 z-50 font-mono text-xs"
                onMouseLeave={() => setShowExportMenu(false)}
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowExportMenu(false);
                    onVectorPrint();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-100 flex items-center gap-2 font-bold text-black cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-emerald-600" />
                  <span>🖨️ Direct Browser Print (Ctrl+P)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowExportMenu(false);
                    onOpenPrintTab();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-100 flex items-center gap-2 text-slate-800 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-purple-600" />
                  <span>📄 Popout Print View (Clean Tab)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowExportMenu(false);
                    onDownloadHtml();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-100 flex items-center gap-2 text-slate-800 cursor-pointer"
                >
                  <FileCode className="w-3.5 h-3.5 text-blue-600" />
                  <span>💾 Download Standalone .HTML</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowExportMenu(false);
                    onDownloadMarkdown();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-100 flex items-center gap-2 text-slate-800 border-t border-black/10 cursor-pointer"
                  title="Download in Markdown (.md) format with full YouTube source attribution"
                >
                  <FileDown className="w-3.5 h-3.5 text-amber-600" />
                  <span>📝 Download Markdown (.md) + Source</span>
                </button>
                {onExportLibrary && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowExportMenu(false);
                      onExportLibrary();
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-100 flex items-center gap-2 text-amber-950 font-bold border-t border-black/10 cursor-pointer"
                    title="Export complete lossless JSON backup of all textbooks and categories"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-700" />
                    <span>💾 Export Entire Library (.json)</span>
                  </button>
                )}
                {onImportBackup && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowExportMenu(false);
                      fileInputRef.current?.click();
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-100 flex items-center gap-2 text-slate-800 cursor-pointer"
                    title="Upload JSON backup to restore textbooks and categories"
                  >
                    <Upload className="w-3.5 h-3.5 text-black" />
                    <span>📂 Import Library Backup (.json)</span>
                  </button>
                )}
                {onOpenCategoryManager && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowExportMenu(false);
                      onOpenCategoryManager();
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-100 flex items-center gap-2 text-slate-800 border-t border-black/10 cursor-pointer"
                    title="Create, edit, and organize curriculum categories"
                  >
                    <Tag className="w-3.5 h-3.5 text-amber-700" />
                    <span>🏷️ Manage Categories</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Hidden file input for header import trigger */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Upload JSON backup"
          />

          {/* Mobile & Tablet Ergonomics Drawer Toggle Button (Visible on screens < lg) */}
          <button
            type="button"
            onClick={() => setShowMobileTools(!showMobileTools)}
            className={`lg:hidden px-2 sm:px-2.5 py-1.5 text-xs font-bold rounded border-2 border-black flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs ${
              showMobileTools
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-slate-100'
            }`}
            title="Toggle Reading Tools & Typography"
            aria-expanded={showMobileTools}
          >
            {showMobileTools ? (
              <X className="w-4 h-4" />
            ) : (
              <SlidersHorizontal className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Tools</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          2. DESKTOP TYPOGRAPHY & READING RIBBON (Always visible on lg+)
         ======================================================== */}
      <div className="hidden lg:block border-t border-black/15 bg-[#FAF7F0] px-4 py-1.5">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-3 text-xs">
          {/* Left: Quick Switchers (Theme, Font, Size) */}
          <div className="flex items-center gap-3">
            {/* Theme: Warm Paper vs Pure White Xerox */}
            <div className="flex items-center border-2 border-black rounded overflow-hidden bg-white text-[11px] font-bold shadow-2xs">
              <button
                type="button"
                onClick={() => onPaperThemeChange('warm')}
                className={`px-2.5 py-1 transition-all flex items-center gap-1 cursor-pointer ${
                  paperTheme === 'warm'
                    ? 'bg-[#D97706] text-white font-extrabold'
                    : 'text-slate-800 bg-white hover:bg-amber-50'
                }`}
                title="Warm Paper (Amber Cream #FFFDF9 & Pastel Callouts)"
              >
                <span>📜 Warm Paper</span>
              </button>
              <button
                type="button"
                onClick={() => onPaperThemeChange('white')}
                className={`px-2.5 py-1 border-l-2 border-black transition-all flex items-center gap-1 cursor-pointer ${
                  paperTheme === 'white'
                    ? 'bg-black text-white font-extrabold'
                    : 'text-slate-800 bg-white hover:bg-slate-100'
                }`}
                title="Pure White Xerox (B&W #FFFFFF & Black Ink Callouts)"
              >
                <span>🖨️ Pure B&W</span>
              </button>
            </div>

            {/* Font Family Selector */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold uppercase text-slate-500 font-mono">Font:</span>
              <div className="flex items-center border border-black rounded overflow-hidden bg-white text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => onFontPrefChange('atkinson')}
                  className={`px-2 py-0.5 transition-colors cursor-pointer ${
                    fontPref === 'atkinson' ? 'bg-black text-white' : 'text-slate-800 hover:bg-slate-100'
                  }`}
                  title="Atkinson Hyperlegible"
                >
                  Atkinson
                </button>
                <button
                  type="button"
                  onClick={() => onFontPrefChange('lexend')}
                  className={`px-2 py-0.5 border-l border-black transition-colors cursor-pointer ${
                    fontPref === 'lexend' ? 'bg-black text-white' : 'text-slate-800 hover:bg-slate-100'
                  }`}
                  title="Lexend"
                >
                  Lexend
                </button>
                <button
                  type="button"
                  onClick={() => onFontPrefChange('sans')}
                  className={`px-2 py-0.5 border-l border-black transition-colors cursor-pointer ${
                    fontPref === 'sans' ? 'bg-black text-white' : 'text-slate-800 hover:bg-slate-100'
                  }`}
                  title="Plus Jakarta Sans"
                >
                  Sans
                </button>
              </div>
            </div>

            {/* Font Size Selector */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold uppercase text-slate-500 font-mono">Size:</span>
              <div className="flex items-center border border-black rounded overflow-hidden bg-white text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => onFontSizeChange('compact')}
                  className={`px-1.5 py-0.5 transition-colors cursor-pointer ${
                    fontSize === 'compact' ? 'bg-black text-white' : 'text-slate-800 hover:bg-slate-100'
                  }`}
                  title="Compact 14px"
                >
                  14px
                </button>
                <button
                  type="button"
                  onClick={() => onFontSizeChange('normal')}
                  className={`px-1.5 py-0.5 border-l border-black transition-colors cursor-pointer ${
                    fontSize === 'normal' ? 'bg-black text-white' : 'text-slate-800 hover:bg-slate-100'
                  }`}
                  title="Normal 17px"
                >
                  17px
                </button>
                <button
                  type="button"
                  onClick={() => onFontSizeChange('large')}
                  className={`px-1.5 py-0.5 border-l border-black transition-colors cursor-pointer ${
                    fontSize === 'large' ? 'bg-black text-white' : 'text-slate-800 hover:bg-slate-100'
                  }`}
                  title="Large 19px"
                >
                  19px
                </button>
              </div>
            </div>
          </div>

          {/* Right: Diagnostic Console Trigger */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleConsole}
              className={`px-2.5 py-1 rounded border border-black font-mono font-bold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer ${
                hasErrors
                  ? 'bg-rose-100 text-rose-800 border-rose-600'
                  : 'bg-white text-slate-800 hover:bg-slate-100'
              }`}
              title="Open Developer & Diagnostic Console"
            >
              <Bug className="w-3.5 h-3.5" />
              <span>Diagnostic Console</span>
              {logCount > 0 && (
                <span className={`px-1 rounded text-[10px] ${hasErrors ? 'bg-rose-600 text-white' : 'bg-black text-white'}`}>
                  {logCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          3. MOBILE & TABLET EXPANDABLE TOOLS DRAWER (< lg)
          Provides effortless access to Theme, Fonts, Presets, Library & Diagnostic
          without cluttering the main reading canvas.
         ======================================================== */}
      {showMobileTools && (
        <div className="lg:hidden border-t-2 border-black bg-[#FFFDF9] px-3 sm:px-4 py-3 shadow-lg animate-in slide-in-from-top-2 duration-150 max-h-[80vh] overflow-y-auto">
          <div className="max-w-md mx-auto space-y-3.5 text-xs">
            {/* Quick Actions (Library & Install) */}
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-black/15">
              <span className="font-mono uppercase font-bold text-[11px] text-slate-500">
                Library & App
              </span>
              <div className="flex items-center gap-2">
                <PWAInstallButton />
                <button
                  type="button"
                  onClick={() => {
                    setShowMobileTools(false);
                    onOpenLibrary();
                  }}
                  className="px-2.5 py-1 text-xs font-bold rounded border-2 border-black bg-white hover:bg-slate-100 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Library className="w-3.5 h-3.5 text-black" />
                  <span>My Library ({savedCount})</span>
                </button>
              </div>
            </div>

            {/* Export & Download Options (Mobile / Tablet) */}
            <div>
              <span className="block font-mono uppercase font-bold text-[11px] text-slate-500 mb-1.5">
                Export & Download Options:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowMobileTools(false);
                    onDownloadMarkdown();
                  }}
                  className="p-2 rounded border-2 border-black bg-amber-50 hover:bg-amber-100 text-left font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-2xs"
                  title="Download in Markdown (.md) format with YouTube source attribution"
                >
                  <FileDown className="w-4 h-4 text-amber-700 shrink-0" />
                  <div>
                    <div className="font-bold text-black">Download .MD</div>
                    <div className="text-[10px] text-slate-600 font-normal">With source link</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMobileTools(false);
                    onVectorPrint();
                  }}
                  className="p-2 rounded border-2 border-black bg-emerald-50 hover:bg-emerald-100 text-left font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-2xs"
                  title="Print Vector A4 PDF"
                >
                  <Printer className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div>
                    <div className="font-bold text-black">Print Vector PDF</div>
                    <div className="text-[10px] text-slate-600 font-normal">A4 vector layout</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Presets Selector */}
            <div>
              <span className="block font-mono uppercase font-bold text-[11px] text-slate-500 mb-1.5">
                Master Presets:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onSelectPreset('huberman-dopamine-masterclass');
                    onViewChange('textbook');
                    setShowMobileTools(false);
                  }}
                  className={`p-2 rounded border-2 text-left font-semibold text-xs transition-colors cursor-pointer flex flex-col justify-between ${
                    activePresetId === 'huberman-dopamine-masterclass' && activeView === 'textbook'
                      ? 'bg-amber-100 text-black border-black font-bold shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  <span>⚡ Huberman</span>
                  <span className="text-[10px] text-slate-500 font-normal">Dopamine Baseline</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSelectPreset('lembke-dopamine-nation');
                    onViewChange('textbook');
                    setShowMobileTools(false);
                  }}
                  className={`p-2 rounded border-2 text-left font-semibold text-xs transition-colors cursor-pointer flex flex-col justify-between ${
                    activePresetId === 'lembke-dopamine-nation' && activeView === 'textbook'
                      ? 'bg-purple-100 text-black border-black font-bold shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  <span>🧠 Lembke</span>
                  <span className="text-[10px] text-slate-500 font-normal">Pleasure-Pain Seesaw</span>
                </button>
              </div>
            </div>

            {/* Paper Theme (Warm vs Pure B&W) */}
            <div>
              <span className="block font-mono uppercase font-bold text-[11px] text-slate-500 mb-1.5">
                Paper Theme:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onPaperThemeChange('warm')}
                  className={`py-2 px-3 rounded border-2 font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paperTheme === 'warm'
                      ? 'bg-[#D97706] text-white border-black shadow-xs'
                      : 'bg-white text-slate-800 border-slate-300'
                  }`}
                >
                  <span>📜 Warm Paper</span>
                  {paperTheme === 'warm' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
                <button
                  type="button"
                  onClick={() => onPaperThemeChange('white')}
                  className={`py-2 px-3 rounded border-2 font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paperTheme === 'white'
                      ? 'bg-black text-white border-black shadow-xs'
                      : 'bg-white text-slate-800 border-slate-300'
                  }`}
                >
                  <span>🖨️ Pure B&W</span>
                  {paperTheme === 'white' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
              </div>
            </div>

            {/* Typography: Font Family & Size */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <span className="block font-mono uppercase font-bold text-[11px] text-slate-500 mb-1.5">
                  Reading Font:
                </span>
                <div className="flex flex-col gap-1">
                  {[
                    { id: 'atkinson', label: 'Atkinson Hyperlegible' },
                    { id: 'lexend', label: 'Lexend (High Readability)' },
                    { id: 'sans', label: 'Jakarta Sans' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => onFontPrefChange(f.id as FontPreference)}
                      className={`px-2.5 py-1.5 rounded border text-left font-medium text-xs flex items-center justify-between cursor-pointer ${
                        fontPref === f.id
                          ? 'bg-black text-white border-black font-bold'
                          : 'bg-white text-slate-800 border-slate-300'
                      }`}
                    >
                      <span>{f.label}</span>
                      {fontPref === f.id && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="block font-mono uppercase font-bold text-[11px] text-slate-500 mb-1.5">
                  Text Size:
                </span>
                <div className="flex flex-col gap-1">
                  {[
                    { id: 'compact', label: 'Compact (14px)' },
                    { id: 'normal', label: 'Normal (17px)' },
                    { id: 'large', label: 'Large (19px)' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => onFontSizeChange(s.id as FontSizePreference)}
                      className={`px-2.5 py-1.5 rounded border text-left font-medium text-xs flex items-center justify-between cursor-pointer ${
                        fontSize === s.id
                          ? 'bg-black text-white border-black font-bold'
                          : 'bg-white text-slate-800 border-slate-300'
                      }`}
                    >
                      <span>{s.label}</span>
                      {fontSize === s.id && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Diagnostic Console Button */}
            <div className="pt-2 border-t border-black/15 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setShowMobileTools(false);
                  onToggleConsole();
                }}
                className={`w-full py-1.5 px-3 rounded border font-mono font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                  hasErrors
                    ? 'bg-rose-100 text-rose-800 border-rose-600'
                    : 'bg-slate-100 text-slate-800 border-slate-400 hover:bg-slate-200'
                }`}
              >
                <Bug className="w-3.5 h-3.5" />
                <span>Diagnostic Console ({logCount})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

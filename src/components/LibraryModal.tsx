import React, { useState, useRef } from 'react';
import { StudyTextbook, Category } from '../types';
import {
  BookOpen,
  Trash2,
  Check,
  Shield,
  Clock,
  ExternalLink,
  X,
  PlusCircle,
  Search,
  FileDown,
  Tag,
  Upload,
  Download,
  FileJson,
  SlidersHorizontal
} from 'lucide-react';
import { downloadTextbookMarkdown } from '../utils/exportMarkdown';

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  textbooks: StudyTextbook[];
  activeTextbookId: string;
  onSelectTextbook: (id: string) => void;
  onDeleteTextbook: (id: string) => Promise<void>;
  onNewAnalysis: () => void;
  // Category management & filtering
  categories: Category[];
  selectedCategoryId: string | 'all';
  onSelectCategory: (catId: string | 'all') => void;
  onOpenCategoryManager: () => void;
  // Lossless Import & Export
  onExportAll: () => void;
  onImportBackup: (file: File) => void;
  onExportSingle: (textbook: StudyTextbook) => void;
}

export const LibraryModal: React.FC<LibraryModalProps> = ({
  isOpen,
  onClose,
  textbooks,
  activeTextbookId,
  onSelectTextbook,
  onDeleteTextbook,
  onNewAnalysis,
  categories,
  selectedCategoryId,
  onSelectCategory,
  onOpenCategoryManager,
  onExportAll,
  onImportBackup,
  onExportSingle
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const filtered = textbooks.filter((t) => {
    const matchesSearch =
      t.videoTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.speaker.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategoryId === 'all' || t.categoryId === selectedCategoryId;
    return matchesSearch && matchesCategory;
  });

  const presets = filtered.filter((t) => t.isPreset);
  const customGuides = filtered.filter((t) => !t.isPreset);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDeleteTextbook(id);
      setDeleteConfirmId(null);
    } finally {
      setDeletingId(null);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportBackup(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 no-print">
      <div className="w-full max-w-4xl bg-[#FFFDF9] border-2 border-black rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Hidden File Input for Lossless JSON Import */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileInputChange}
          className="hidden"
          aria-label="Upload JSON backup"
        />

        {/* 1. Header with Brand & Close Button */}
        <div className="px-5 py-3.5 bg-[#F8FAFC] border-b-2 border-black flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <BookOpen className="w-5 h-5 text-black shrink-0" />
            <div>
              <h2 className="text-base font-extrabold uppercase tracking-tight text-black font-mono">
                Study Library & Curriculum Hub
              </h2>
              <p className="text-xs text-slate-600 font-sans">
                {textbooks.length} High-Yield Textbooks across {categories.length} Categories · IndexedDB Storage
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Manage Categories Trigger */}
            <button
              type="button"
              onClick={onOpenCategoryManager}
              className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-900 border border-black rounded text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all active:scale-95"
              title="Create, edit, or delete curriculum categories"
            >
              <Tag className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden sm:inline">Manage Categories</span>
            </button>

            {/* Export Library Button */}
            <button
              type="button"
              onClick={onExportAll}
              className="px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 border border-black rounded text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all active:scale-95"
              title="Download entire library (textbooks, categories, daily protocols, and progress) as lossless JSON"
            >
              <Download className="w-3.5 h-3.5 text-amber-800" />
              <span className="hidden sm:inline">Export All (.json)</span>
            </button>

            {/* Import Backup Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 bg-black hover:bg-slate-800 text-white border border-black rounded text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all active:scale-95"
              title="Upload JSON backup to restore or import textbooks and categories without formatting loss"
            >
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Import Backup</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 border border-black rounded bg-white hover:bg-slate-100 text-black cursor-pointer transition-colors"
              title="Close Library"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Category Filter Rail */}
        <div className="px-5 py-2.5 bg-[#FFFDF9] border-b border-black/20 flex items-center gap-2 overflow-x-auto scrollbar-thin text-xs font-mono">
          <span className="text-[11px] font-extrabold uppercase text-slate-500 shrink-0">
            Category:
          </span>

          {/* All Categories Chip */}
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className={`px-2.5 py-1 rounded border text-xs font-bold shrink-0 transition-colors cursor-pointer ${
              selectedCategoryId === 'all'
                ? 'bg-black text-white border-black shadow-2xs'
                : 'bg-white text-slate-800 border-slate-300 hover:border-black'
            }`}
          >
            All Textbooks ({textbooks.length})
          </button>

          {/* Individual Category Chips with Item Counters */}
          {categories.map((cat) => {
            const count = textbooks.filter((t) => t.categoryId === cat.id).length;
            const isSelected = selectedCategoryId === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`px-2.5 py-1 rounded border text-xs font-bold shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-amber-300 text-black border-black ring-1 ring-black shadow-2xs font-black'
                    : 'bg-white text-slate-800 border-slate-300 hover:border-black'
                }`}
                title={cat.description || cat.name}
              >
                <span>{cat.icon || '📁'}</span>
                <span>{cat.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-black/10 rounded-full font-mono">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 3. Search & Quick Actions Bar */}
        <div className="px-5 py-3 border-b border-black/20 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, speaker, or concept..."
              className="w-full pl-8 pr-3 py-1.5 border border-black rounded bg-[#F8FAFC] text-black text-xs font-mono focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => {
                onClose();
                onNewAnalysis();
              }}
              className="w-full sm:w-auto px-3 py-1.5 bg-black text-white font-bold rounded flex items-center justify-center gap-1.5 hover:bg-slate-800 transition-colors cursor-pointer shadow-2xs"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Analyze New Video</span>
            </button>
          </div>
        </div>

        {/* 4. Scrollable Library Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Master Reference Presets Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-black/20 pb-1.5">
              <span className="text-xs font-mono font-extrabold uppercase text-slate-700 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-600" />
                <span>Curated Master Reference Textbooks ({presets.length})</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Peer-Reviewed Visual Syntheses
              </span>
            </div>

            {presets.length === 0 ? (
              <div className="p-6 text-center bg-white border border-dashed border-slate-300 rounded text-xs text-slate-500">
                No master textbooks match the selected filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2.5">
                {presets.map((preset) => {
                  const isActive = preset.id === activeTextbookId;
                  const cat = categories.find((c) => c.id === preset.categoryId);

                  return (
                    <div
                      key={preset.id}
                      className={`p-3.5 rounded-lg border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isActive
                          ? 'bg-[#FEF3C7] border-black shadow-2xs'
                          : 'bg-white border-slate-300 hover:border-black'
                      }`}
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                          {cat && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-300">
                              <span>{cat.icon}</span>
                              <span>{cat.name}</span>
                            </span>
                          )}
                          <span className="font-extrabold text-black font-sans text-sm block">
                            {preset.videoTitle}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                          <span className="font-bold text-slate-900">{preset.speaker}</span>
                          <span>·</span>
                          <span className="flex items-center gap-0.5 font-mono">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span>{preset.duration}</span>
                          </span>
                          <span>·</span>
                          <span className="font-mono text-slate-600 font-semibold">
                            {preset.chapters.length} Chapters
                          </span>
                          {preset.dailyProtocol && (
                            <>
                              <span>·</span>
                              <span className="inline-flex items-center gap-0.5 bg-emerald-100 text-emerald-950 border border-emerald-300 text-[10px] font-mono px-1.5 py-0.2 rounded font-bold">
                                ⚡ Daily Protocol
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Select to Read */}
                        <button
                          type="button"
                          onClick={() => {
                            onSelectTextbook(preset.id);
                            onClose();
                          }}
                          className={`px-3 py-1.5 rounded font-mono text-xs font-bold border transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-black text-white border-black'
                              : 'bg-white text-black border-black hover:bg-slate-100'
                          }`}
                        >
                          {isActive ? 'Currently Reading' : 'Read Textbook'}
                        </button>

                        {/* Lossless JSON Export */}
                        <button
                          type="button"
                          onClick={() => onExportSingle(preset)}
                          className="p-1.5 border border-black/30 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 transition-colors shadow-2xs cursor-pointer"
                          title="Export lossless JSON format for backup and re-import"
                        >
                          <FileJson className="w-4 h-4 text-amber-800" />
                        </button>

                        {/* Download Markdown with Source Button */}
                        <button
                          type="button"
                          onClick={() => downloadTextbookMarkdown(preset)}
                          className="p-1.5 border border-black/30 rounded bg-white hover:bg-slate-100 text-slate-800 transition-colors shadow-2xs cursor-pointer"
                          title="Download in Markdown (.md) format with full YouTube source attribution"
                        >
                          <FileDown className="w-4 h-4 text-slate-800" />
                        </button>

                        {/* Protected Shield */}
                        <span
                          className="p-1.5 text-slate-400 cursor-not-allowed opacity-60"
                          title="Curated master reference textbooks are protected from accidental deletion"
                        >
                          <Shield className="w-4 h-4 text-slate-400" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* User-Generated Custom Guides Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-black/20 pb-1.5">
              <span className="text-xs font-mono font-extrabold uppercase text-slate-700 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                <span>Your Custom Analyzed Guides ({customGuides.length})</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500">Stored in IndexedDB</span>
            </div>

            {customGuides.length === 0 ? (
              <div className="p-8 text-center bg-white border border-dashed border-slate-300 rounded text-xs text-slate-500 space-y-2">
                <p>No custom analyzed videos in this category yet.</p>
                <p className="text-[11px] text-slate-400">
                  Analyze any YouTube video in the generator tab, and it will be stored here automatically!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2.5">
                {customGuides.map((guide) => {
                  const isActive = guide.id === activeTextbookId;
                  const isConfirming = deleteConfirmId === guide.id;
                  const cat = categories.find((c) => c.id === guide.categoryId);

                  return (
                    <div
                      key={guide.id}
                      className={`p-3.5 rounded-lg border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isActive
                          ? 'bg-[#EFF6FF] border-black shadow-2xs'
                          : 'bg-white border-slate-300 hover:border-black'
                      }`}
                    >
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                          {cat && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-300">
                              <span>{cat.icon}</span>
                              <span>{cat.name}</span>
                            </span>
                          )}
                          <span className="font-extrabold text-black font-sans text-sm block">
                            {guide.videoTitle}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                          <span className="font-bold text-slate-800">{guide.speaker}</span>
                          <span>·</span>
                          <span className="flex items-center gap-0.5 font-mono">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span>{guide.duration}</span>
                          </span>
                          <span>·</span>
                          <span className="font-mono text-[10px] text-slate-500">
                            {guide.generatedAt}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isConfirming ? (
                          <div className="flex items-center gap-1 bg-rose-50 border border-rose-300 p-1 rounded font-mono text-xs">
                            <span className="text-rose-800 text-[11px] font-bold px-1">Delete?</span>
                            <button
                              type="button"
                              onClick={() => handleDelete(guide.id)}
                              disabled={deletingId === guide.id}
                              className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold text-[11px] cursor-pointer"
                            >
                              Yes
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-[11px] cursor-pointer"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                onSelectTextbook(guide.id);
                                onClose();
                              }}
                              className={`px-3 py-1.5 rounded font-mono text-xs font-bold border transition-colors cursor-pointer ${
                                isActive
                                  ? 'bg-black text-white border-black'
                                  : 'bg-white text-black border-black hover:bg-slate-100'
                              }`}
                            >
                              {isActive ? 'Currently Reading' : 'Read'}
                            </button>

                            {/* Lossless JSON Export */}
                            <button
                              type="button"
                              onClick={() => onExportSingle(guide)}
                              className="p-1.5 border border-black/30 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 transition-colors shadow-2xs cursor-pointer"
                              title="Export lossless JSON format for backup and re-import"
                            >
                              <FileJson className="w-4 h-4 text-amber-800" />
                            </button>

                            {/* Download Markdown with Source Button */}
                            <button
                              type="button"
                              onClick={() => downloadTextbookMarkdown(guide)}
                              className="p-1.5 border border-black/30 rounded bg-white hover:bg-slate-100 text-slate-800 transition-colors shadow-2xs cursor-pointer"
                              title="Download in Markdown (.md) format with full YouTube source attribution"
                            >
                              <FileDown className="w-4 h-4 text-slate-800" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(guide.id)}
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded border border-transparent hover:border-rose-300 transition-colors cursor-pointer"
                              title="Delete this custom guide from IndexedDB"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* 5. Footer */}
        <div className="px-5 py-3 bg-[#F8FAFC] border-t-2 border-black flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-600">
          <div className="flex items-center gap-2">
            <span>💾 100% Lossless JSON Backups Supported</span>
            <span>·</span>
            <button
              type="button"
              onClick={onExportAll}
              className="text-amber-800 hover:underline font-bold cursor-pointer"
            >
              Export All
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-amber-800 hover:underline font-bold cursor-pointer"
            >
              Import Backup
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-black text-white hover:bg-slate-800 rounded font-bold cursor-pointer transition-colors shadow-2xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useCallback } from 'react';
import {
  StudyTextbook,
  PaperTheme,
  FontPreference,
  FontSizePreference,
  DiagnosticLog,
  AIEngineConfig,
  Category
} from './types';
import { SAMPLE_TEXTBOOKS } from './data/sampleGuides';
import { DEFAULT_CATEGORIES } from './data/categories';
import { TopHeader } from './components/TopHeader';
import { StudyGuideViewer } from './components/StudyGuideViewer';
import { InputDashboard } from './components/InputDashboard';
import { ErrorConsole } from './components/ErrorConsole';
import { LibraryModal } from './components/LibraryModal';
import { CategoryManagerModal } from './components/CategoryManagerModal';
import {
  getAllTextbooks,
  saveTextbook,
  deleteTextbook,
  getAllCategories,
  saveCategory,
  saveAllCategories,
  deleteCategory
} from './utils/db';
import { printTextbookVector, openVectorPrintWindow, downloadVectorHtml } from './utils/exportPdf';
import { downloadTextbookMarkdown } from './utils/exportMarkdown';
import {
  exportEntireLibrary,
  exportSingleTextbook,
  parseAndValidateImport
} from './utils/exportImport';
import { OfflineIndicator } from './components/OfflineIndicator';
import { synthesizeTextbookWithoutAI } from './utils/nonAiSynthesizer';

export default function App() {
  const [allTextbooks, setAllTextbooks] = useState<StudyTextbook[]>(SAMPLE_TEXTBOOKS);
  const [textbook, setTextbook] = useState<StudyTextbook>(SAMPLE_TEXTBOOKS[0]);
  const [activePresetId, setActivePresetId] = useState<string>('huberman-adhd-protocols');
  const [activeView, setActiveView] = useState<'textbook' | 'generator'>('textbook');

  // Curriculum Categories & Filter States
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | 'all'>('all');
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState<boolean>(false);

  // Ergonomic Reading Settings
  const [paperTheme, setPaperTheme] = useState<PaperTheme>('warm');
  const [fontPref, setFontPref] = useState<FontPreference>('atkinson');
  const [fontSize, setFontSize] = useState<FontSizePreference>('normal');

  // Modals & Panels
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);
  const [isConsoleOpen, setIsConsoleOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [stepMessage, setStepMessage] = useState<string>('');

  const [logs, setLogs] = useState<DiagnosticLog[]>([
    {
      id: 'init-1',
      timestamp: new Date().toLocaleTimeString(),
      level: 'info',
      step: 'System Startup',
      message: 'ADHD Visual Textbook & IndexedDB Learning Hub initialized.',
      details: 'Loaded protected master reference presets across 5 curriculum categories. IndexedDB active.'
    }
  ]);

  const addLog = useCallback((log: Omit<DiagnosticLog, 'id' | 'timestamp'>) => {
    const item: DiagnosticLog = {
      ...log,
      id: 'log-' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString()
    };
    setLogs((prev) => [item, ...prev.slice(0, 99)]);
  }, []);

  // Load persistent library and categories from IndexedDB on startup
  useEffect(() => {
    async function loadData() {
      try {
        // Load categories
        const loadedCats = await getAllCategories();
        if (loadedCats && loadedCats.length > 0) {
          setCategories(loadedCats);
        }

        // Load textbooks
        const loaded = await getAllTextbooks();
        if (loaded && loaded.length > 0) {
          setAllTextbooks(loaded);
          // Restore last selected guide if exists
          const savedActiveId = localStorage.getItem('adhd_active_guide_id');
          if (savedActiveId) {
            const match = loaded.find((t) => t.id === savedActiveId);
            if (match) {
              setTextbook(match);
              if (match.isPreset) setActivePresetId(match.id);
            }
          }
        }
      } catch (err) {
        console.warn('IndexedDB initial load error:', err);
      }
    }
    loadData();
  }, []);

  // Sync data-theme with document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', paperTheme);
  }, [paperTheme]);

  const handleSelectTextbookById = (id: string) => {
    const match = allTextbooks.find((t) => t.id === id);
    if (match) {
      setTextbook(match);
      setActivePresetId(match.isPreset ? match.id : '');
      setActiveView('textbook');
      localStorage.setItem('adhd_active_guide_id', match.id);
      addLog({
        level: 'success',
        step: 'Library Navigation',
        message: `Opened textbook: "${match.videoTitle}"`,
        details: `Speaker: ${match.speaker}\nChapters: ${match.chapters.length}`
      });
    }
  };

  const handlePaperThemeChange = (theme: PaperTheme) => {
    setPaperTheme(theme);
    addLog({
      level: 'info',
      step: 'Theme Switcher',
      message: `Switched reading theme to ${theme === 'warm' ? 'Warm Paper (#FFFDF9 & Pastels)' : 'Pure White B&W Xerox (#FFFFFF & Black Ink)'}.`
    });
  };

  // True Vector Print Pipeline
  const handleVectorPrint = () => {
    addLog({
      level: 'info',
      step: 'Vector Print',
      message: 'Opening vector print dialog (window.print)...'
    });

    const success = printTextbookVector();
    if (!success) {
      addLog({
        level: 'warn',
        step: 'Print Notice',
        message: 'Direct print was restricted by iframe sandbox. Opening Popout Print Window instead...'
      });
      openVectorPrintWindow('textbook-document', textbook.videoTitle);
    }
  };

  const handleOpenPrintTab = () => {
    addLog({
      level: 'info',
      step: 'Popout Print',
      message: `Opened clean printable tab for "${textbook.videoTitle}".`
    });
    openVectorPrintWindow('textbook-document', textbook.videoTitle);
  };

  const handleDownloadHtml = () => {
    const cleanTitle = textbook.videoTitle.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 40);
    const filename = `${cleanTitle}_ADHD_Textbook.html`;
    downloadVectorHtml('textbook-document', filename);
    addLog({
      level: 'success',
      step: 'HTML Export',
      message: `Saved offline vector HTML textbook: ${filename}`
    });
  };

  const handleDownloadMarkdown = () => {
    try {
      downloadTextbookMarkdown(textbook);
      addLog({
        level: 'success',
        step: 'Markdown Export',
        message: `Saved Markdown textbook with source attribution: "${textbook.videoTitle}"`,
        details: `Source: ${textbook.videoUrl || (textbook.videoId ? `https://www.youtube.com/watch?v=${textbook.videoId}` : 'N/A')}\nSpeaker: ${textbook.speaker}\nChapters: ${textbook.chapters.length}`
      });
    } catch (err: any) {
      addLog({
        level: 'error',
        step: 'Markdown Export Error',
        message: err?.message || 'Failed to download markdown file.',
        details: String(err)
      });
    }
  };

  // Category CRUD Handlers (IndexedDB Persistence)
  const handleCreateCategory = async (catData: Omit<Category, 'id' | 'createdAt'>) => {
    const newCat: Category = {
      ...catData,
      id: `cat-${Date.now()}`,
      createdAt: Date.now()
    };
    await saveCategory(newCat);
    const updated = await getAllCategories();
    setCategories(updated);
    addLog({
      level: 'success',
      step: 'Category Created',
      message: `Created curriculum category: "${newCat.name}" ${newCat.icon}`
    });
  };

  const handleEditCategory = async (cat: Category) => {
    await saveCategory(cat);
    const updated = await getAllCategories();
    setCategories(updated);
    addLog({
      level: 'success',
      step: 'Category Updated',
      message: `Updated category: "${cat.name}"`
    });
  };

  const handleDeleteCategory = async (catId: string) => {
    await deleteCategory(catId);
    const updated = await getAllCategories();
    setCategories(updated);
    if (selectedCategoryId === catId) {
      setSelectedCategoryId('all');
    }
    addLog({
      level: 'success',
      step: 'Category Deleted',
      message: `Deleted category with ID ${catId}`
    });
  };

  // Lossless Import & Export Pipeline (Preserves formatting, takeaways, penKeys, protocols)
  const handleExportLibrary = () => {
    try {
      exportEntireLibrary(allTextbooks, categories);
      addLog({
        level: 'success',
        step: 'Library Export',
        message: `Exported full lossless backup (${allTextbooks.length} textbooks, ${categories.length} categories) to JSON.`
      });
    } catch (err: any) {
      addLog({
        level: 'error',
        step: 'Export Error',
        message: err?.message || 'Failed to export library.'
      });
    }
  };

  const handleImportBackup = async (file: File) => {
    try {
      const text = await file.text();
      const result = parseAndValidateImport(text);

      if (result.categories && result.categories.length > 0) {
        await saveAllCategories(result.categories);
        const updatedCats = await getAllCategories();
        setCategories(updatedCats);
      }

      for (const tb of result.textbooks) {
        await saveTextbook(tb);
      }

      const updatedBooks = await getAllTextbooks();
      setAllTextbooks(updatedBooks);

      if (result.textbooks.length > 0) {
        setTextbook(result.textbooks[0]);
        if (result.textbooks[0].isPreset) {
          setActivePresetId(result.textbooks[0].id);
        } else {
          setActivePresetId('');
        }
        localStorage.setItem('adhd_active_guide_id', result.textbooks[0].id);
      }

      addLog({
        level: 'success',
        step: 'Lossless Import',
        message: `Successfully imported ${result.importedCount} textbooks with 100% fidelity without formatting loss.`
      });
    } catch (err: any) {
      addLog({
        level: 'error',
        step: 'Import Error',
        message: err?.message || 'Failed to import backup file.',
        details: String(err)
      });
    }
  };

  const handleExportSingle = (targetTextbook: StudyTextbook) => {
    try {
      exportSingleTextbook(targetTextbook);
      addLog({
        level: 'success',
        step: 'Textbook Export',
        message: `Exported "${targetTextbook.videoTitle}" to lossless JSON.`
      });
    } catch (err: any) {
      addLog({
        level: 'error',
        step: 'Export Error',
        message: err?.message || 'Failed to export textbook.'
      });
    }
  };

  // Granular Delete Control (Protected Presets are blocked)
  const handleDeleteTextbook = async (id: string) => {
    try {
      await deleteTextbook(id);
      const updated = await getAllTextbooks();
      setAllTextbooks(updated);

      addLog({
        level: 'success',
        step: 'IndexedDB Delete',
        message: `Deleted custom study guide (${id}) from IndexedDB storage.`
      });

      // If active textbook was deleted, switch back to Huberman masterclass
      if (textbook.id === id) {
        const fallback = SAMPLE_TEXTBOOKS[0];
        setTextbook(fallback);
        setActivePresetId(fallback.id);
        localStorage.setItem('adhd_active_guide_id', fallback.id);
      }
    } catch (err: any) {
      addLog({
        level: 'error',
        step: 'Delete Error',
        message: err?.message || 'Failed to delete textbook.',
        details: String(err)
      });
    }
  };

  // Persist takeaway progress in IndexedDB
  const handleToggleTakeaway = async (chapterIdx: number, takeawayId: string) => {
    const updatedChapters = textbook.chapters.map((ch, idx) => {
      if (idx !== chapterIdx) return ch;
      return {
        ...ch,
        checkableTakeaways: ch.checkableTakeaways.map((t) =>
          t.id === takeawayId ? { ...t, checked: !t.checked } : t
        )
      };
    });

    const updatedTextbook = { ...textbook, chapters: updatedChapters };
    setTextbook(updatedTextbook);

    // Save state in IndexedDB if it's a custom guide or local copy
    try {
      await saveTextbook(updatedTextbook);
      const updatedList = await getAllTextbooks();
      setAllTextbooks(updatedList);
    } catch (e) {
      console.warn('Progress save warning:', e);
    }
  };

  const handleTogglePenKey = async (chapterIdx: number, takeawayId: string) => {
    const updatedChapters = textbook.chapters.map((ch, idx) => {
      if (idx !== chapterIdx) return ch;
      return {
        ...ch,
        checkableTakeaways: ch.checkableTakeaways.map((t) => {
          if (t.id !== takeawayId) return t;
          const nextKey: 'check' | 'circle' | 'star' =
            t.penKey === 'star' ? 'circle' : t.penKey === 'circle' ? 'check' : 'star';
          return { ...t, penKey: nextKey };
        })
      };
    });

    const updatedTextbook = { ...textbook, chapters: updatedChapters };
    setTextbook(updatedTextbook);

    try {
      await saveTextbook(updatedTextbook);
      const updatedList = await getAllTextbooks();
      setAllTextbooks(updatedList);
    } catch (e) {
      console.warn('Progress save warning:', e);
    }
  };

  // High-Yield YouTube URL -> Transcript -> Study Guide Pipeline (Algorithmic & AI)
  const handleGenerateTextbook = async (params: {
    videoUrl: string;
    videoId: string;
    videoTitle: string;
    speaker: string;
    transcript: string;
    engineConfig: AIEngineConfig;
  }) => {
    setIsLoading(true);
    setStepMessage('Validating lecture metadata & structure...');

    addLog({
      level: 'info',
      step: 'Pipeline Start',
      message: `Analyzing lecture: "${params.videoTitle}" (${params.videoId || 'Custom'})`,
      details: `Speaker: ${params.speaker}\nMode: ${params.engineConfig.provider.toUpperCase()}`
    });

    try {
      let finalTranscript = params.transcript.trim();

      // Stage 1: Verified Transcript Retrieval Waterfall if not already provided
      if (!finalTranscript && params.videoId) {
        setStepMessage('Querying transcript waterfall (innertube & cache)...');
        addLog({
          level: 'info',
          step: 'Transcript Retrieval',
          message: 'Querying backend transcript waterfall...'
        });

        try {
          const trRes = await fetch(`/api/fetch-transcript?videoId=${params.videoId}`);
          if (trRes.ok) {
            const trData = await trRes.json();
            if (trData.success && trData.transcript) {
              finalTranscript = trData.transcript;
              addLog({
                level: 'success',
                step: 'Transcript Engine',
                message: `Loaded ${trData.wordCount?.toLocaleString() || 'verified'} words of spoken captions via ${trData.method || 'caption engine'}.`
              });
            } else {
              addLog({
                level: 'info',
                step: 'Transcript Notice',
                message: 'YouTube automated caption scraper restricted by cloud IP; using verified keynote metadata and algorithmic structuring.'
              });
            }
          }
        } catch (fetchErr) {
          console.warn('Transcript waterfall skipped:', fetchErr);
        }
      }

      // Stage 2: Synthesis Engine
      // Case A: User explicitly chose Instant Algorithmic Mode (No AI / Offline)
      if (params.engineConfig.provider === 'algorithmic') {
        setStepMessage('Synthesizing ADHD Visual Textbook (Instant Algorithmic Mode - No AI)...');
        addLog({
          level: 'info',
          step: 'Algorithmic Synthesizer',
          message: 'Executing deterministic ADHD textbook synthesis (No AI required)...'
        });

        const generatedGuide = synthesizeTextbookWithoutAI({
          videoUrl: params.videoUrl,
          videoId: params.videoId,
          videoTitle: params.videoTitle,
          speaker: params.speaker,
          transcript: finalTranscript
        });

        // Save to IndexedDB automatically
        await saveTextbook(generatedGuide);
        const updatedList = await getAllTextbooks();
        setAllTextbooks(updatedList);

        setTextbook(generatedGuide);
        setActivePresetId('');
        setActiveView('textbook');
        localStorage.setItem('adhd_active_guide_id', generatedGuide.id);

        addLog({
          level: 'success',
          step: 'Work Done Without AI',
          message: `Generated "${generatedGuide.videoTitle}" instantly with Algorithmic Engine!`,
          details: `ID: ${generatedGuide.id}\nDuration: ${generatedGuide.duration}\nChapters: ${generatedGuide.chapters.length}`
        });
        return;
      }

      // Case B: AI Engine (Gemini 3.8 Flash / Ollama) with seamless Algorithmic Fallback
      setStepMessage(`Synthesizing textbook with ${params.engineConfig.provider === 'gemini' ? 'Gemini 3.8 Flash' : 'Ollama'}...`);
      addLog({
        level: 'info',
        step: 'AI Synthesis',
        message: `Calling ${params.engineConfig.provider} engine with strict ADHD zero-hallucination prompt...`
      });

      const response = await fetch('/api/generate-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: finalTranscript,
          videoUrl: params.videoUrl,
          videoId: params.videoId,
          videoTitle: params.videoTitle,
          speaker: params.speaker,
          customApiKey: params.engineConfig.apiKey,
          engineConfig: params.engineConfig
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to synthesize study textbook.');
      }

      const generatedGuide: StudyTextbook = {
        ...data.textbook,
        isPreset: false,
        createdAt: Date.now()
      };

      // Save to IndexedDB automatically
      await saveTextbook(generatedGuide);
      const updatedList = await getAllTextbooks();
      setAllTextbooks(updatedList);

      setTextbook(generatedGuide);
      setActivePresetId('');
      setActiveView('textbook');
      localStorage.setItem('adhd_active_guide_id', generatedGuide.id);

      addLog({
        level: 'success',
        step: 'IndexedDB Saved',
        message: `Successfully generated and saved "${generatedGuide.videoTitle}" to IndexedDB library!`,
        details: `ID: ${generatedGuide.id}\nDuration: ${generatedGuide.duration}`
      });
    } catch (err: any) {
      console.warn('AI pipeline error, activating Instant Algorithmic Fallback:', err);
      addLog({
        level: 'warn',
        step: 'Non-AI Fallback',
        message: `${err.message || 'AI request failed'}. Activating Instant Algorithmic Synthesizer to complete work without AI...`
      });

      // Complete work without AI so user is NEVER blocked
      const fallbackGuide = synthesizeTextbookWithoutAI({
        videoUrl: params.videoUrl,
        videoId: params.videoId,
        videoTitle: params.videoTitle,
        speaker: params.speaker,
        transcript: params.transcript
      });

      await saveTextbook(fallbackGuide);
      const updatedList = await getAllTextbooks();
      setAllTextbooks(updatedList);

      setTextbook(fallbackGuide);
      setActivePresetId('');
      setActiveView('textbook');
      localStorage.setItem('adhd_active_guide_id', fallbackGuide.id);

      addLog({
        level: 'success',
        step: 'Work Done Without AI',
        message: `Successfully completed "${fallbackGuide.videoTitle}" without AI!`,
        details: `ID: ${fallbackGuide.id}\nChapters: ${fallbackGuide.chapters.length}`
      });
    } finally {
      setIsLoading(false);
      setStepMessage('');
    }
  };

  const hasErrors = logs.some((l) => l.level === 'error');

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        paperTheme === 'warm' ? 'bg-[#F4F1EA] text-[#111827]' : 'bg-[#E5E7EB] text-black'
      }`}
    >
      {/* Top Editorial Header & Toolbar */}
      <TopHeader
        paperTheme={paperTheme}
        onPaperThemeChange={handlePaperThemeChange}
        fontPref={fontPref}
        onFontPrefChange={setFontPref}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        onVectorPrint={handleVectorPrint}
        onOpenPrintTab={handleOpenPrintTab}
        onDownloadHtml={handleDownloadHtml}
        onDownloadMarkdown={handleDownloadMarkdown}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        savedCount={allTextbooks.length}
        onToggleConsole={() => setIsConsoleOpen((prev) => !prev)}
        logCount={logs.length}
        hasErrors={hasErrors}
        onSelectPreset={handleSelectTextbookById}
        activePresetId={activePresetId}
        activeView={activeView}
        onViewChange={setActiveView}
        onOpenCategoryManager={() => setIsCategoryManagerOpen(true)}
        onExportLibrary={handleExportLibrary}
        onImportBackup={handleImportBackup}
      />

      {/* Main View Area */}
      <main className="flex-1 px-3 sm:px-6">
        {activeView === 'textbook' ? (
          <StudyGuideViewer
            textbook={textbook}
            paperTheme={paperTheme}
            fontPref={fontPref}
            fontSize={fontSize}
            onToggleTakeaway={handleToggleTakeaway}
            onTogglePenKey={handleTogglePenKey}
            onDownloadMarkdown={handleDownloadMarkdown}
          />
        ) : (
          <InputDashboard
            onGenerateTextbook={handleGenerateTextbook}
            isLoading={isLoading}
            stepMessage={stepMessage}
            onSelectPreset={(id) => {
              handleSelectTextbookById(id);
              setActiveView('textbook');
            }}
          />
        )}
      </main>

      {/* Library Drawer Modal (IndexedDB Management, Categories & Lossless Backups) */}
      <LibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        textbooks={allTextbooks}
        activeTextbookId={textbook.id}
        onSelectTextbook={handleSelectTextbookById}
        onDeleteTextbook={handleDeleteTextbook}
        onNewAnalysis={() => setActiveView('generator')}
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
        onOpenCategoryManager={() => setIsCategoryManagerOpen(true)}
        onExportAll={handleExportLibrary}
        onImportBackup={handleImportBackup}
        onExportSingle={handleExportSingle}
      />

      {/* Category Manager Modal (Create, Edit, Delete Curriculum Categories) */}
      <CategoryManagerModal
        isOpen={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
        categories={categories}
        textbooks={allTextbooks}
        onCreateCategory={handleCreateCategory}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      {/* Developer & Diagnostic Console Drawer */}
      <ErrorConsole
        logs={logs}
        isOpen={isConsoleOpen}
        onClose={() => setIsConsoleOpen(false)}
        onClear={() => setLogs([])}
      />

      {/* Offline Status Toast Indicator */}
      <OfflineIndicator />
    </div>
  );
}

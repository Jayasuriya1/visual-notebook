import React, { useState, useEffect } from 'react';
import { AIEngineConfig, EngineProvider } from '../types';
import {
  Youtube,
  Sparkles,
  FileText,
  Settings,
  CheckCircle2,
  AlertCircle,
  Upload,
  Eraser,
  Clipboard,
  ChevronDown,
  ChevronUp,
  Zap,
  Cpu
} from 'lucide-react';

interface InputDashboardProps {
  onGenerateTextbook: (params: {
    videoUrl: string;
    videoId: string;
    videoTitle: string;
    speaker: string;
    transcript: string;
    engineConfig: AIEngineConfig;
  }) => Promise<void>;
  isLoading: boolean;
  stepMessage: string;
  onSelectPreset: (presetId: string) => void;
}

export const InputDashboard: React.FC<InputDashboardProps> = ({
  onGenerateTextbook,
  isLoading,
  stepMessage,
  onSelectPreset
}) => {
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/watch?v=QmOF0crdyRU');
  const [videoId, setVideoId] = useState('QmOF0crdyRU');
  const [videoTitle, setVideoTitle] = useState('Controlling Your Dopamine For Motivation, Focus & Satisfaction');
  const [speaker, setSpeaker] = useState('Dr. Andrew Huberman, Ph.D.');
  const [isFetchingMeta, setIsFetchingMeta] = useState(false);
  const [isFetchingTranscript, setIsFetchingTranscript] = useState(false);
  const [transcriptStatus, setTranscriptStatus] = useState<
    'idle' | 'verified_full' | 'curated_summary' | 'verified_partial' | 'restricted' | 'manual'
  >('idle');
  const [transcriptInfo, setTranscriptInfo] = useState<{
    wordCount?: number;
    method?: string;
    isCuratedSummary?: boolean;
    coveragePct?: number;
  }>({});
  const [transcript, setTranscript] = useState('');
  const [showTranscriptDrawer, setShowTranscriptDrawer] = useState(false);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [showHelpGuide, setShowHelpGuide] = useState(false);

  // Engine state: Default to 'algorithmic' (No AI) for instant, 100% reliable results!
  const [provider, setProvider] = useState<EngineProvider>('algorithmic');
  const [customApiKey, setCustomApiKey] = useState('');
  const [ollamaEndpoint, setOllamaEndpoint] = useState('http://localhost:11434');
  const [ollamaModel, setOllamaModel] = useState('llama3');

  useEffect(() => {
    const savedKey = localStorage.getItem('adhd_gemini_api_key');
    if (savedKey) setCustomApiKey(savedKey);
    const savedOllama = localStorage.getItem('adhd_ollama_endpoint');
    if (savedOllama) setOllamaEndpoint(savedOllama);
    const savedProvider = localStorage.getItem('adhd_engine_provider') as EngineProvider;
    if (savedProvider) setProvider(savedProvider);
  }, []);

  const handleProviderChange = (p: EngineProvider) => {
    setProvider(p);
    localStorage.setItem('adhd_engine_provider', p);
  };

  // Extract YouTube ID
  const extractId = (url: string): string | null => {
    const match = url.match(/(?:v=|youtu\.be\/|shorts\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  // When URL changes, automatically fetch metadata and attempt transcript retrieval
  const handleUrlChange = async (url: string) => {
    setVideoUrl(url);
    const id = extractId(url);
    if (id) {
      setVideoId(id);
      setIsFetchingMeta(true);
      setIsFetchingTranscript(true);

      // 1. Fetch Video Metadata
      try {
        const metaRes = await fetch(`/api/youtube-meta?videoId=${id}`);
        if (metaRes.ok) {
          const data = await metaRes.json();
          if (data.title) setVideoTitle(data.title);
          if (data.author_name) setSpeaker(data.author_name);
        }
      } catch (e) {
        console.warn('Metadata fetch fallback:', e);
      } finally {
        setIsFetchingMeta(false);
      }

      // 2. Fetch Transcript via server waterfall
      try {
        const trRes = await fetch(`/api/fetch-transcript?videoId=${id}`);
        if (trRes.ok) {
          const trData = await trRes.json();
          if (trData.success && trData.transcript) {
            setTranscript(trData.transcript);
            const status: 'verified_full' | 'curated_summary' | 'verified_partial' =
              trData.status === 'curated_summary' || trData.isCuratedSummary
                ? 'curated_summary'
                : trData.status === 'verified_partial'
                ? 'verified_partial'
                : 'verified_full';
            setTranscriptStatus(status);
            setTranscriptInfo({
              wordCount: trData.wordCount,
              method: trData.method,
              isCuratedSummary: trData.isCuratedSummary,
              coveragePct: trData.coveragePct
            });
            setShowTranscriptDrawer(false);
          } else {
            setTranscriptStatus('restricted');
          }
        } else {
          setTranscriptStatus('restricted');
        }
      } catch (e) {
        console.warn('Transcript waterfall notice:', e);
        setTranscriptStatus('restricted');
      } finally {
        setIsFetchingTranscript(false);
      }
    }
  };

  // Clean raw transcript timestamps
  const cleanTranscriptText = (text: string): string => {
    return text
      .replace(/WEBVTT[\s\S]*?\n\n/g, '')
      .replace(/\d{1,2}:\d{2}(?::\d{2})?(?:\.\d{3})?(?:\s*-->\s*\d{1,2}:\d{2}(?::\d{2})?(?:\.\d{3})?)?/g, '')
      .replace(/\d+\s*\n\d{1,2}:\d{2}:\d{2}[,\.]\d{3}\s*-->\s*\d{1,2}:\d{2}:\d{2}[,\.]\d{3}/g, '')
      .replace(/<[^>]+>/g, '')
      .replace(/\[(?:Music|Applause|Laughter)\]/gi, '')
      .replace(/\r\n/g, '\n')
      .replace(/\n{2,}/g, '\n')
      .replace(/\s{2,}/g, ' ')
      .trim();
  };

  const handleManualTranscriptClean = () => {
    if (!transcript) return;
    const cleaned = cleanTranscriptText(transcript);
    setTranscript(cleaned);
    setTranscriptStatus('manual');
    const words = cleaned.split(/\s+/).filter(Boolean).length;
    setTranscriptInfo({ wordCount: words, method: 'Cleaned Manual Input' });
  };

  const handlePasteFromClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim().length > 10) {
          const cleaned = cleanTranscriptText(text);
          setTranscript(cleaned);
          setTranscriptStatus('manual');
          const words = cleaned.split(/\s+/).filter(Boolean).length;
          setTranscriptInfo({ wordCount: words, method: '1-Click Clipboard Paste' });
          setShowTranscriptDrawer(true);
        } else {
          setShowTranscriptDrawer(true);
        }
      } else {
        setShowTranscriptDrawer(true);
      }
    } catch (e) {
      console.warn('Clipboard read permission error:', e);
      setShowTranscriptDrawer(true);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = (event.target?.result as string) || '';
      const cleaned = cleanTranscriptText(content);
      setTranscript(cleaned);
      setTranscriptStatus('manual');
      const words = cleaned.split(/\s+/).filter(Boolean).length;
      setTranscriptInfo({ wordCount: words, method: `Uploaded File (${file.name})` });
      setShowTranscriptDrawer(true);
    };
    reader.readAsText(file);
  };

  const handleSaveApiKey = (key: string) => {
    setCustomApiKey(key);
    if (key.trim()) {
      localStorage.setItem('adhd_gemini_api_key', key.trim());
    } else {
      localStorage.removeItem('adhd_gemini_api_key');
    }
  };

  const handleTriggerGenerate = async (forcedProvider?: EngineProvider) => {
    const chosenProvider = forcedProvider || provider;
    await onGenerateTextbook({
      videoUrl,
      videoId: videoId || extractId(videoUrl) || 'custom-video',
      videoTitle: videoTitle.trim() || 'Educational Masterclass',
      speaker: speaker.trim() || 'Featured Speaker',
      transcript,
      engineConfig: {
        provider: chosenProvider,
        apiKey: customApiKey.trim() || undefined,
        ollamaEndpoint,
        ollamaModel
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleTriggerGenerate();
  };

  const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="max-w-[880px] mx-auto my-6 no-print">
      {/* Container with Warm Paper Sheet Styling */}
      <div className="bg-[#FFFDF9] border-2 border-black rounded-lg shadow-md p-5 sm:p-8 space-y-6">
        {/* Banner Header */}
        <div className="border-b-2 border-black pb-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-amber-700 mb-1">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Applied Knowledge Engine · Retention Pipeline</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-black font-sans-custom">
            “Knowledge isn’t power. Applied knowledge is.”
          </h2>
          <p className="text-sm text-slate-700 mt-1 leading-relaxed">
            Most people read or watch a video, nod their heads… and forget it by next week. We solve that: transform passive consumption into indelible visual mental models, time-anchored daily action protocols, and active retrieval practice.
          </p>
        </div>

        {/* Synthesis Engine Mode Selector */}
        <div className="p-3.5 bg-white border-2 border-black rounded space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-black flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-amber-700" />
              <span>Synthesis Engine Mode:</span>
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {provider === 'algorithmic' ? '⚡ 100% Offline · No API Key · 0.1s Speed' : provider === 'gemini' ? '🤖 Cloud AI · Requires Key' : '💻 Local Ollama · Self-Hosted'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs">
            <button
              type="button"
              onClick={() => handleProviderChange('algorithmic')}
              className={`p-2.5 rounded border-2 text-left transition-all cursor-pointer flex flex-col gap-0.5 ${
                provider === 'algorithmic'
                  ? 'bg-amber-100 border-black text-black font-bold shadow-2xs'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold">
                <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>⚡ Instant Algorithmic</span>
              </div>
              <span className="text-[10px] text-slate-600 font-normal">
                No AI required · Instant · 100% reliable
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleProviderChange('gemini')}
              className={`p-2.5 rounded border-2 text-left transition-all cursor-pointer flex flex-col gap-0.5 ${
                provider === 'gemini'
                  ? 'bg-amber-100 border-black text-black font-bold shadow-2xs'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>🤖 Gemini 3.8 Flash</span>
              </div>
              <span className="text-[10px] text-slate-600 font-normal">
                Deep neural synthesis · Server AI
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleProviderChange('ollama')}
              className={`p-2.5 rounded border-2 text-left transition-all cursor-pointer flex flex-col gap-0.5 ${
                provider === 'ollama'
                  ? 'bg-amber-100 border-black text-black font-bold shadow-2xs'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold">
                <Cpu className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>💻 Local Ollama</span>
              </div>
              <span className="text-[10px] text-slate-600 font-normal">
                Self-hosted LLM (Llama3 / Mistral)
              </span>
            </button>
          </div>
        </div>

        {/* Quick Sample Selector */}
        <div className="p-3 bg-[#FEF3C7] border-2 border-black rounded flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs font-mono">
          <div className="flex items-center gap-2 font-bold text-black shrink-0">
            <span>📚 Instant Masterclasses:</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => onSelectPreset('huberman-dopamine-masterclass')}
              className="px-2 py-1 bg-white hover:bg-slate-50 border border-black rounded font-bold transition-colors cursor-pointer text-[11px]"
            >
              Dr. Huberman (Dopamine)
            </button>
            <button
              type="button"
              onClick={() => onSelectPreset('lembke-dopamine-nation')}
              className="px-2 py-1 bg-white hover:bg-slate-50 border border-black rounded font-bold transition-colors cursor-pointer text-[11px]"
            >
              Dr. Lembke (Dopamine Nation)
            </button>
            <button
              type="button"
              onClick={() => onSelectPreset('barkley-adhd-executive-function')}
              className="px-2 py-1 bg-white hover:bg-slate-50 border border-black rounded font-bold transition-colors cursor-pointer text-[11px]"
            >
              Dr. Barkley (Action Scaffolding)
            </button>
            <button
              type="button"
              onClick={() => onSelectPreset('healthygamer-adhd-motivation')}
              className="px-2 py-1 bg-white hover:bg-slate-50 border border-black rounded font-bold transition-colors cursor-pointer text-[11px]"
            >
              Dr. K (Motivation Architecture)
            </button>
          </div>
        </div>

        {/* Generator Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* URL Input */}
          <div className="space-y-3">
            <label className="text-xs font-mono font-extrabold uppercase text-black flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Youtube className="w-4 h-4 text-rose-600" />
                <span>YouTube Lecture URL</span>
              </span>
              {videoId && (
                <span className="text-slate-500 font-normal">
                  ID: <span className="font-bold text-black">{videoId}</span>
                </span>
              )}
            </label>

            <div className="relative">
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                required
                className="w-full pl-3 pr-24 py-3 bg-white border-2 border-black rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
              />
              <button
                type="button"
                onClick={() => handleUrlChange(videoUrl)}
                disabled={isFetchingMeta || isFetchingTranscript}
                className="absolute right-2 top-2 bottom-2 px-3 bg-slate-100 hover:bg-slate-200 border border-black rounded text-xs font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                {isFetchingMeta || isFetchingTranscript ? (
                  <span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Verify</span>
                )}
              </button>
            </div>
          </div>

          {/* Video Metadata Card with Live Transcript Status */}
          {videoId && (
            <div className="p-4 bg-white border-2 border-black rounded space-y-3 shadow-2xs">
              <div className="flex flex-col sm:flex-row gap-4">
                <img
                  src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                  alt="YouTube Thumbnail"
                  className="w-full sm:w-44 h-28 object-cover rounded border border-black shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
                  }}
                />
                <div className="flex-1 space-y-2">
                  <div>
                    <span className="font-mono text-slate-500 uppercase text-[10px] block">Verified Lecture Title:</span>
                    <input
                      type="text"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      className="w-full font-bold text-black text-sm bg-slate-50 border border-slate-300 rounded px-2.5 py-1 mt-0.5 focus:bg-white"
                    />
                  </div>
                  <div>
                    <span className="font-mono text-slate-500 uppercase text-[10px] block">Speaker / Keynote Channel:</span>
                    <input
                      type="text"
                      value={speaker}
                      onChange={(e) => setSpeaker(e.target.value)}
                      className="w-full text-slate-800 text-sm bg-slate-50 border border-slate-300 rounded px-2.5 py-1 mt-0.5 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Spoken Transcript Status Bar */}
              <div className="pt-2 border-t border-slate-200">
                {isFetchingTranscript ? (
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-600 bg-amber-50 p-2.5 rounded border border-amber-200">
                    <span className="w-3.5 h-3.5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                    <span>Querying YouTube transcript engines...</span>
                  </div>
                ) : transcriptStatus === 'verified_full' ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-emerald-50 border border-emerald-300 rounded text-xs font-mono text-emerald-900">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-bold">
                        Full Transcript Verified ({transcriptInfo.wordCount?.toLocaleString() || wordCount} words)
                      </span>
                      <span className="text-emerald-700 hidden sm:inline">· Exact spoken quotes & timestamps loaded</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowTranscriptDrawer(!showTranscriptDrawer)}
                      className="underline font-bold hover:text-black cursor-pointer text-left sm:text-right"
                    >
                      {showTranscriptDrawer ? 'Hide Source' : 'Inspect Source'}
                    </button>
                  </div>
                ) : transcriptStatus === 'curated_summary' ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-amber-50 border border-amber-300 rounded text-xs font-mono text-amber-950">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span className="font-bold">
                        Curated Excerpt Loaded ({transcriptInfo.wordCount?.toLocaleString() || wordCount} words)
                      </span>
                      <span className="text-amber-800 text-[11px]">
                        (Abbreviated source summary for testing, not full spoken transcript)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowTranscriptDrawer(!showTranscriptDrawer)}
                      className="underline font-bold hover:text-black cursor-pointer text-left sm:text-right"
                    >
                      {showTranscriptDrawer ? 'Hide Excerpt' : 'Inspect Excerpt'}
                    </button>
                  </div>
                ) : transcriptStatus === 'verified_partial' ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-amber-50 border border-amber-300 rounded text-xs font-mono text-amber-950">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span className="font-bold">
                        Partial Transcript ({transcriptInfo.wordCount?.toLocaleString() || wordCount} words)
                      </span>
                      <span className="text-amber-800 text-[11px]">
                        (Initial segments loaded; coverage is partial)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowTranscriptDrawer(!showTranscriptDrawer)}
                      className="underline font-bold hover:text-black cursor-pointer text-left sm:text-right"
                    >
                      {showTranscriptDrawer ? 'Hide Source' : 'Inspect Source'}
                    </button>
                  </div>
                ) : transcriptStatus === 'manual' ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-blue-50 border border-blue-300 rounded text-xs font-mono text-blue-950">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="font-bold">
                        User-Supplied Transcript ({wordCount.toLocaleString()} words)
                      </span>
                      <span className="text-blue-700 hidden sm:inline">· Ready for evidence-grounded synthesis</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowTranscriptDrawer(!showTranscriptDrawer)}
                      className="underline font-bold hover:text-black cursor-pointer text-left sm:text-right"
                    >
                      {showTranscriptDrawer ? 'Hide Source' : 'Inspect Source'}
                    </button>
                  </div>
                ) : transcriptStatus === 'restricted' ? (
                  /* Proactive Alternative Solutions Card when Cloud IP is Restricted */
                  <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg text-xs font-mono space-y-2 text-amber-950">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="font-bold block">
                          YouTube automated caption download restricted for this cloud IP.
                        </span>
                        <span className="text-slate-700 text-[11px] block mt-0.5 leading-relaxed">
                          For evidence-grounded synthesis with real quotes and mechanisms, paste captions below or upload a file. If you proceed without captions, honest heuristic mode will structure available title metadata without fabricating claims.
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {/* Solution 1: Instant Algorithmic Generation Without AI */}
                      <button
                        type="button"
                        onClick={() => handleTriggerGenerate('algorithmic')}
                        disabled={isLoading}
                        className="px-3 py-1.5 bg-black hover:bg-slate-800 text-white rounded font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>⚡ Generate Heuristic Guide</span>
                      </button>

                      {/* Solution 2: 1-Click Clipboard Paste */}
                      <button
                        type="button"
                        onClick={handlePasteFromClipboard}
                        className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-black border border-slate-300 rounded font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Clipboard className="w-3.5 h-3.5 text-slate-700" />
                        <span>📋 Paste from Clipboard</span>
                      </button>

                      {/* Solution 3: Show 10-second YouTube transcript helper */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowTranscriptDrawer(true);
                          setShowHelpGuide(true);
                        }}
                        className="px-2.5 py-1.5 text-amber-900 hover:text-black underline cursor-pointer font-bold"
                      >
                        How to copy in 10s?
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* Transcript Assistant & Source Material Drawer */}
          <div className="border-t-2 border-black pt-4">
            <button
              type="button"
              onClick={() => setShowTranscriptDrawer(!showTranscriptDrawer)}
              className="text-xs font-mono font-bold text-slate-800 hover:text-black flex items-center justify-between w-full py-1 cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-700" />
                <span>
                  Transcript & Lecture Source Material {wordCount > 0 ? `(${wordCount.toLocaleString()} words loaded)` : '(Paste or Upload)'}
                </span>
              </span>
              <span className="flex items-center gap-1 text-[11px] text-slate-600">
                {showTranscriptDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </span>
            </button>

            {showTranscriptDrawer && (
              <div className="mt-3 space-y-3 bg-white p-4 border-2 border-black rounded shadow-2xs">
                {/* Guidance Banner */}
                <div className="flex items-start justify-between gap-2 p-2.5 bg-slate-50 border border-slate-300 rounded text-xs font-mono text-slate-700">
                  <div className="space-y-1">
                    <p className="font-bold text-black flex items-center gap-1.5">
                      <span>💡 100% Faithful Study Guide Guarantee:</span>
                    </p>
                    <p>
                      Providing the spoken transcript or lecture description guarantees precise numbers, timestamps, and quotes. If left empty, our Algorithmic Engine automatically structures the textbook from verified lecture metadata.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowHelpGuide(!showHelpGuide)}
                    className="underline text-amber-800 hover:text-black shrink-0 font-bold"
                  >
                    {showHelpGuide ? 'Hide Guide' : 'How to Copy in 10s'}
                  </button>
                </div>

                {/* 10-Second Quick Copy Guide */}
                {showHelpGuide && (
                  <div className="p-3 bg-amber-50 border border-amber-300 rounded text-xs font-mono space-y-1.5 text-amber-950">
                    <div className="font-bold">How to copy transcript from your browser in 10 seconds:</div>
                    <ol className="list-decimal list-inside space-y-1 text-slate-800">
                      <li>Open the YouTube video in your browser (residential IPs are never blocked by YouTube).</li>
                      <li>Below the video title, click <span className="font-bold">"...more"</span> in the description.</li>
                      <li>Click the <span className="font-bold">"Show transcript"</span> button.</li>
                      <li>Select the text, copy (<kbd className="bg-white px-1 border border-black rounded">Ctrl+C</kbd> / <kbd className="bg-white px-1 border border-black rounded">⌘+C</kbd>).</li>
                      <li>Click the <span className="font-bold">"📋 Paste from Clipboard"</span> button below to auto-clean all timestamps!</li>
                    </ol>
                  </div>
                )}

                {/* Textarea */}
                <textarea
                  rows={7}
                  value={transcript}
                  onChange={(e) => {
                    setTranscript(e.target.value);
                    setTranscriptStatus('manual');
                  }}
                  placeholder="Paste YouTube captions, VTT/SRT text, or lecture notes here. If left empty, our Algorithmic Engine will structure the textbook directly using verified keynote metadata."
                  className="w-full p-3 rounded border-2 border-black bg-[#FFFDF9] text-black font-mono text-xs focus:ring-2 focus:ring-amber-500 leading-relaxed"
                />

                {/* Utility Toolbar for Transcript */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-black">
                      {wordCount.toLocaleString()} words ({transcript.length.toLocaleString()} characters)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* 1-Click Clipboard button */}
                    <button
                      type="button"
                      onClick={handlePasteFromClipboard}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 text-black border border-black rounded font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Clipboard className="w-3 h-3 text-slate-700" />
                      <span>Paste Clipboard</span>
                    </button>

                    {/* Auto-Clean Timestamps button */}
                    {transcript && (
                      <button
                        type="button"
                        onClick={handleManualTranscriptClean}
                        className="px-2.5 py-1 bg-[#FEF3C7] hover:bg-amber-200 text-amber-900 border border-black rounded font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        title="Strip timestamps (e.g. 00:15) and formatting artifacts"
                      >
                        <Eraser className="w-3 h-3 text-amber-800" />
                        <span>Clean Timestamps</span>
                      </button>
                    )}

                    {/* Upload File button */}
                    <label className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-black rounded font-bold flex items-center gap-1 cursor-pointer transition-colors">
                      <Upload className="w-3 h-3" />
                      <span>Upload File</span>
                      <input
                        type="file"
                        accept=".txt,.vtt,.srt"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    {transcript && (
                      <button
                        type="button"
                        onClick={() => {
                          setTranscript('');
                          setTranscriptStatus('idle');
                        }}
                        className="px-2 py-1 text-rose-600 hover:underline cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Engine Settings Drawer */}
          {provider !== 'algorithmic' && (
            <div className="border-t border-black/20 pt-3">
              <button
                type="button"
                onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
                className="text-xs font-mono font-bold text-slate-600 hover:text-black flex items-center justify-between w-full py-1 cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5" />
                  <span>⚙️ Model Settings ({provider === 'gemini' ? 'Gemini 3.8 Flash' : 'Ollama'})</span>
                </span>
                <span className="text-[11px] text-slate-500">
                  {showSettingsDrawer ? '▲ Hide' : '▼ Configure'}
                </span>
              </button>

              {showSettingsDrawer && (
                <div className="mt-3 p-4 bg-slate-50 border-2 border-black rounded space-y-3 text-xs font-mono">
                  {provider === 'gemini' ? (
                    <div>
                      <label className="block text-[11px] font-bold uppercase mb-1">
                        Custom Gemini API Key (Optional Override)
                      </label>
                      <input
                        type="password"
                        value={customApiKey}
                        onChange={(e) => handleSaveApiKey(e.target.value)}
                        placeholder="Leave empty to use automatic server environment GEMINI_API_KEY"
                        className="w-full p-2 bg-white border border-black rounded text-xs font-mono"
                      />
                      <span className="text-[10px] text-slate-500 block mt-1">
                        If no key is present, the app automatically switches to Instant Algorithmic Mode so your work is never interrupted!
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase mb-1">Ollama Endpoint</label>
                        <input
                          type="text"
                          value={ollamaEndpoint}
                          onChange={(e) => setOllamaEndpoint(e.target.value)}
                          className="w-full p-2 bg-white border border-black rounded text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase mb-1">Model Name</label>
                        <input
                          type="text"
                          value={ollamaModel}
                          onChange={(e) => setOllamaModel(e.target.value)}
                          className="w-full p-2 bg-white border border-black rounded text-xs font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Action Trigger Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !videoUrl.trim()}
              className="w-full py-4 px-6 bg-black hover:bg-slate-900 text-white font-mono font-extrabold text-sm uppercase tracking-wider rounded border-2 border-black shadow-md transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99] cursor-pointer"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>{stepMessage || 'Processing Video Pipeline...'}</span>
                </>
              ) : provider === 'algorithmic' ? (
                <>
                  <Zap className="w-5 h-5 text-amber-400" />
                  <span>⚡ Synthesize Applied Knowledge Textbook (Instant Algorithmic - No AI)</span>
                </>
              ) : provider === 'gemini' ? (
                <>
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>🤖 Synthesize Applied Knowledge Textbook (Gemini 3.8 Flash)</span>
                </>
              ) : (
                <>
                  <Cpu className="w-5 h-5 text-amber-400" />
                  <span>💻 Synthesize with Local Ollama</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

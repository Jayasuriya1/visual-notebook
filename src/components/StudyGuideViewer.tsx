import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StudyTextbook,
  FontPreference,
  FontSizePreference,
  PaperTheme,
  TextbookChapter,
  ChapterBlock,
  SourceMetadata,
  ChapterRecall
} from '../types';
import { InteractiveMindmap } from './InteractiveMindmap';
import { renderBionicText } from '../utils/bionicReading';
import {
  formatChapterForTTS,
  formatTextbookForTTS,
  formatDailyProtocolForTTS,
  splitIntoSentences,
  SpeechUnit
} from '../utils/ttsSpeechFormatter';
import { AudioPlayerBar } from './AudioPlayerBar';
import confetti from 'canvas-confetti';
import {
  Clock,
  ExternalLink,
  CheckSquare,
  Square,
  Bookmark,
  Youtube,
  Sparkles,
  FileDown,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Layers,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  HelpCircle,
  Award,
  Zap,
  ArrowRight,
  Headphones,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2
} from 'lucide-react';

/** Timezone-safe local ISO date (YYYY-MM-DD) avoiding UTC midnight flip bugs */
export const getLocalDateStr = (d: Date = new Date()): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

/** Motion-conscious confetti respecting prefers-reduced-motion */
export const safeConfetti = (opts: confetti.Options = {}) => {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }
  try {
    confetti(opts);
  } catch {
    // Non-fatal if canvas unavailable
  }
};

interface StudyGuideViewerProps {
  textbook: StudyTextbook;
  paperTheme: PaperTheme;
  fontPref: FontPreference;
  fontSize: FontSizePreference;
  onToggleTakeaway: (chapterIdx: number, takeawayId: string) => void;
  onTogglePenKey: (chapterIdx: number, takeawayId: string) => void;
  onDownloadMarkdown?: () => void;
}

export const StudyGuideViewer: React.FC<StudyGuideViewerProps> = ({
  textbook,
  paperTheme,
  fontPref,
  fontSize,
  onToggleTakeaway,
  onTogglePenKey,
  onDownloadMarkdown
}) => {
  // Cognitive accessibility states
  const [bionicReading, setBionicReading] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  // activeChapterTab: 'all' | 'protocol' | number (0-indexed chapter)
  const [activeChapterTab, setActiveChapterTab] = useState<'all' | 'protocol' | number>('all');
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  // Active recall flip states: { [chapterIdx]: boolean }
  const [flippedCards, setFlippedCards] = useState<{ [key: number]: boolean }>({});
  const [masteredRecalls, setMasteredRecalls] = useState<{ [key: number]: boolean }>({});

  // Action step copy feedback: { [stepKey]: boolean }
  const [copiedStep, setCopiedStep] = useState<string | null>(null);

  // Audio Reader (TTS) States
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPausedAudio, setIsPausedAudio] = useState(false);
  const [isAudioPlayerOpen, setIsAudioPlayerOpen] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(() => {
    const saved = localStorage.getItem('adhd_audio_speed');
    return saved ? parseFloat(saved) : 1.0;
  });
  const [autoScroll, setAutoScroll] = useState<boolean>(() => {
    const saved = localStorage.getItem('adhd_audio_autoscroll');
    return saved !== null ? saved === 'true' : true;
  });

  const [speechUnits, setSpeechUnits] = useState<SpeechUnit[]>([]);
  const [currentUnitIndex, setCurrentUnitIndex] = useState<number>(0);
  const [activeSpeechUnitId, setActiveSpeechUnitId] = useState<string | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');

  // Daily Action Protocol tracking states (keyed by local date so users can track daily adherence)
  const todayDateStr = getLocalDateStr();
  const protocolStorageKey = `adhd_daily_protocol_${textbook.id}_${todayDateStr}`;
  const [completedProtocolBlocks, setCompletedProtocolBlocks] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(protocolStorageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Retrieval Practice Self-Evaluations: { [chapterNumber]: 'got_it' | 'partial' | 'review' }
  const recallStorageKey = `adhd_recall_eval_${textbook.id}`;
  const [recallEvaluations, setRecallEvaluations] = useState<Record<number, 'got_it' | 'partial' | 'review'>>(() => {
    try {
      const saved = localStorage.getItem(recallStorageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Re-sync local storage states whenever textbook.id or local date changes
  useEffect(() => {
    try {
      const pSaved = localStorage.getItem(protocolStorageKey);
      setCompletedProtocolBlocks(pSaved ? JSON.parse(pSaved) : {});
    } catch {
      setCompletedProtocolBlocks({});
    }

    try {
      const rSaved = localStorage.getItem(recallStorageKey);
      setRecallEvaluations(rSaved ? JSON.parse(rSaved) : {});
    } catch {
      setRecallEvaluations({});
    }
  }, [textbook.id, protocolStorageKey, recallStorageKey]);

  const [copiedProtocol, setCopiedProtocol] = useState(false);

  const pauseTimerRef = useRef<number | null>(null);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const currentChapterPlayingRef = useRef<number | null>(null);

  const fontClass =
    fontPref === 'atkinson'
      ? 'font-atkinson'
      : fontPref === 'lexend'
      ? 'font-lexend'
      : 'font-sans-custom';

  const bodySizeClass =
    fontSize === 'compact'
      ? 'text-[14px] leading-[1.65]'
      : fontSize === 'large'
      ? 'text-[19px] leading-[1.85]'
      : 'text-[17px] leading-[1.75]';

  const isWarm = paperTheme === 'warm';

  // Load available browser voices for natural TTS
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const populateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const englishVoices = voices.filter((v) => v.lang.startsWith('en'));
        const candidateVoices = englishVoices.length > 0 ? englishVoices : voices;
        setAvailableVoices(candidateVoices);

        const savedVoice = localStorage.getItem('adhd_audio_voice');
        if (savedVoice && voices.some((v) => v.voiceURI === savedVoice)) {
          setSelectedVoiceURI(savedVoice);
        } else {
          // Prefer high-yield natural Google or Apple voices if available
          const preferred =
            candidateVoices.find((v) => /natural|google|samantha|enhanced/i.test(v.name)) ||
            candidateVoices.find((v) => v.default) ||
            candidateVoices[0];
          if (preferred) {
            setSelectedVoiceURI(preferred.voiceURI);
          }
        }
      }
    };

    populateVoices();
    window.speechSynthesis.onvoiceschanged = populateVoices;

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Stop audio on unmount or when textbook switches
  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [textbook.id]);

  // Clean cancellation helper
  const cancelSpeechEngine = useCallback(() => {
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    activeUtteranceRef.current = null;
  }, []);

  // Primary Speech Dispatcher: speaks unit at specific index with formatting & pauses
  const speakUnitAtIndex = useCallback(
    (index: number, unitsList: SpeechUnit[], speedOverride?: number) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

      if (!unitsList || unitsList.length === 0 || index < 0 || index >= unitsList.length) {
        setIsPlayingAudio(false);
        setIsPausedAudio(false);
        setActiveSpeechUnitId(null);
        return;
      }

      cancelSpeechEngine();

      const unit = unitsList[index];
      setCurrentUnitIndex(index);
      setActiveSpeechUnitId(unit.id);
      setIsPlayingAudio(true);
      setIsPausedAudio(false);

      // Smoothly bring the active sentence or block into center view
      if (autoScroll) {
        setTimeout(() => {
          const el = document.getElementById(unit.id);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 60);
      }

      const utterance = new SpeechSynthesisUtterance(unit.spokenText);
      const effectiveRate = speedOverride ?? audioSpeed;
      utterance.rate = Math.max(0.5, Math.min(2.5, effectiveRate));

      if (selectedVoiceURI) {
        const foundVoice = availableVoices.find((v) => v.voiceURI === selectedVoiceURI);
        if (foundVoice) utterance.voice = foundVoice;
      }

      utterance.onend = () => {
        // Proceed to next unit after natural breathing pause
        if (index + 1 < unitsList.length) {
          const pauseMs = Math.max(160, unit.pauseAfterMs || 300);
          pauseTimerRef.current = window.setTimeout(() => {
            speakUnitAtIndex(index + 1, unitsList, effectiveRate);
          }, pauseMs);
        } else {
          setIsPlayingAudio(false);
          setIsPausedAudio(false);
          setActiveSpeechUnitId(null);
        }
      };

      utterance.onerror = (e) => {
        // Ignore benign interruption events from speed changes or skips
        if (e.error === 'interrupted' || e.error === 'canceled') {
          return;
        }
        console.warn('SpeechSynthesis event notice:', e.error);
        setIsPlayingAudio(false);
        setIsPausedAudio(false);
        setActiveSpeechUnitId(null);
      };

      activeUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [audioSpeed, autoScroll, availableVoices, selectedVoiceURI, cancelSpeechEngine]
  );

  // Speed Adjustment Handler: FIXED - Never restarts from the beginning!
  const handleAudioSpeedChange = (newSpeed: number) => {
    const clamped = Math.max(0.5, Math.min(2.5, Math.round(newSpeed * 100) / 100));
    setAudioSpeed(clamped);
    localStorage.setItem('adhd_audio_speed', clamped.toString());

    // If audio is actively narrating, cancel current sentence and resume AT CURRENT UNIT with new speed
    if (isPlayingAudio && !isPausedAudio && speechUnits.length > 0) {
      cancelSpeechEngine();
      speakUnitAtIndex(currentUnitIndex, speechUnits, clamped);
    }
  };

  // Toggle Play / Pause
  const handleTogglePlay = () => {
    if (isPausedAudio) {
      // Resume from current unit
      speakUnitAtIndex(currentUnitIndex, speechUnits);
    } else if (isPlayingAudio) {
      // Pause
      cancelSpeechEngine();
      setIsPausedAudio(true);
      setIsPlayingAudio(true);
    } else {
      // Start listening to the active chapter
      const targetCh = focusMode ? textbook.chapters[activeChapterIndex] : textbook.chapters[0];
      handleStartChapterAudio(targetCh);
    }
  };

  // Start reading a specific chapter
  const handleStartChapterAudio = (chapter: TextbookChapter) => {
    setIsAudioPlayerOpen(true);
    const units = formatChapterForTTS(chapter);
    setSpeechUnits(units);
    currentChapterPlayingRef.current = chapter.chapterNumber;
    speakUnitAtIndex(0, units);
  };

  // Start reading entire textbook from beginning
  const handleStartFullTextbookAudio = () => {
    setIsAudioPlayerOpen(true);
    const units = formatTextbookForTTS(textbook);
    setSpeechUnits(units);
    currentChapterPlayingRef.current = 0;
    speakUnitAtIndex(0, units);
  };

  // Start reading Daily Action Protocol
  const handleStartDailyProtocolAudio = useCallback(() => {
    if (!textbook.dailyProtocol) return;
    setIsAudioPlayerOpen(true);
    const units = formatDailyProtocolForTTS(textbook.dailyProtocol);
    setSpeechUnits(units);
    currentChapterPlayingRef.current = -1;
    speakUnitAtIndex(0, units);
  }, [textbook.dailyProtocol, speakUnitAtIndex]);

  // Stop Audio (resets audio state without hiding bar)
  const handleStopAudio = () => {
    cancelSpeechEngine();
    setIsPlayingAudio(false);
    setIsPausedAudio(false);
    setActiveSpeechUnitId(null);
  };

  // Close Audio Player completely (stops speech and hides player)
  const handleCloseAudio = useCallback(() => {
    cancelSpeechEngine();
    setIsPlayingAudio(false);
    setIsPausedAudio(false);
    setActiveSpeechUnitId(null);
    setIsAudioPlayerOpen(false);
  }, [cancelSpeechEngine]);

  // Open Audio Player
  const handleOpenAudioPlayer = useCallback(() => {
    setIsAudioPlayerOpen(true);
    if (speechUnits.length === 0) {
      if (textbook.dailyProtocol) {
        setSpeechUnits(formatDailyProtocolForTTS(textbook.dailyProtocol));
      } else {
        setSpeechUnits(formatTextbookForTTS(textbook));
      }
    }
  }, [speechUnits.length, textbook]);

  // Skip Prev / Next Sentence
  const handlePrevUnit = () => {
    if (currentUnitIndex > 0) {
      speakUnitAtIndex(currentUnitIndex - 1, speechUnits);
    }
  };

  const handleNextUnit = () => {
    if (currentUnitIndex < speechUnits.length - 1) {
      speakUnitAtIndex(currentUnitIndex + 1, speechUnits);
    }
  };

  // Jump audio playback directly to any clicked sentence, step, or takeaway
  const handleJumpToUnit = (unitId: string, chapterNumber?: number) => {
    setIsAudioPlayerOpen(true);
    let units = speechUnits;

    // If jump is to daily protocol block
    if (unitId.startsWith('protocol-') || unitId.startsWith('daily-protocol-')) {
      if (textbook.dailyProtocol && currentChapterPlayingRef.current !== -1) {
        units = formatDailyProtocolForTTS(textbook.dailyProtocol);
        setSpeechUnits(units);
        currentChapterPlayingRef.current = -1;
      }
    } else if (chapterNumber && currentChapterPlayingRef.current !== chapterNumber) {
      // If not loaded or playing a different chapter, load chapter units
      const ch = textbook.chapters.find((c) => c.chapterNumber === chapterNumber);
      if (ch) {
        units = formatChapterForTTS(ch);
        setSpeechUnits(units);
        currentChapterPlayingRef.current = chapterNumber;
      }
    } else if (units.length === 0) {
      const ch = chapterNumber
        ? textbook.chapters.find((c) => c.chapterNumber === chapterNumber)
        : textbook.chapters[0];
      if (ch) {
        units = formatChapterForTTS(ch);
        setSpeechUnits(units);
        currentChapterPlayingRef.current = ch.chapterNumber;
      }
    }

    const targetIdx = units.findIndex((u) => u.id === unitId);
    if (targetIdx !== -1) {
      speakUnitAtIndex(targetIdx, units);
    }
  };

  // Protocol Checklist & Copy Handlers
  const totalProtocolBlocks = textbook.dailyProtocol?.blocks.length || 0;
  const protocolCompletedCount = Object.values(completedProtocolBlocks).filter(Boolean).length;
  const protocolPercent = totalProtocolBlocks > 0 ? Math.round((protocolCompletedCount / totalProtocolBlocks) * 100) : 0;

  const handleToggleProtocolBlock = (blockId: string) => {
    setCompletedProtocolBlocks((prev) => {
      const next = { ...prev, [blockId]: !prev[blockId] };
      try {
        localStorage.setItem(protocolStorageKey, JSON.stringify(next));
      } catch {
        // ignore
      }

      const checked = Object.values(next).filter(Boolean).length;
      if (totalProtocolBlocks > 0 && checked === totalProtocolBlocks) {
        safeConfetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#F59E0B', '#10B981', '#3B82F6', '#8B5CF6']
        });
      }
      return next;
    });
  };

  const handleResetProtocolBlocks = () => {
    setCompletedProtocolBlocks({});
    try {
      localStorage.removeItem(protocolStorageKey);
    } catch {
      // ignore
    }
  };

  const handleCopyProtocol = () => {
    if (!textbook.dailyProtocol) return;
    const p = textbook.dailyProtocol;
    const lines = [
      `# ⚡ Daily Action Protocol: ${p.title}`,
      `> "${p.dailyAnchorQuote}"`,
      `*Source: ${textbook.videoTitle} (${textbook.speaker})*`,
      '',
      ...p.blocks.map((b, i) => [
        `### ${i + 1}. [${b.timeWindow}] ${b.phaseName}`,
        `**Core Concept:** ${b.coreConcept}`,
        `- 🟢 **WHAT TO DO:** ${b.doThis.action}`,
        `  *Tactical Cue:* ${b.doThis.tacticalCue}`,
        `- 🔴 **WHAT NOT TO DO:** ${b.dontDoThis.trap}`,
        `  *Why this damages focus:* ${b.dontDoThis.whyTrapDamages}`,
        `- ⚡ **Biological Mechanism:** ${b.biologicalWhy}`,
        ''
      ].join('\n'))
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedProtocol(true);
    setTimeout(() => setCopiedProtocol(false), 2000);
  };

  const handleToggleAutoScroll = () => {
    const nextVal = !autoScroll;
    setAutoScroll(nextVal);
    localStorage.setItem('adhd_audio_autoscroll', String(nextVal));
  };

  const handleSelectVoice = (voiceURI: string) => {
    setSelectedVoiceURI(voiceURI);
    localStorage.setItem('adhd_audio_voice', voiceURI);
    if (isPlayingAudio && !isPausedAudio && speechUnits.length > 0) {
      cancelSpeechEngine();
      speakUnitAtIndex(currentUnitIndex, speechUnits);
    }
  };

  const handleOpenTimestamp = (seconds?: number) => {
    if (typeof seconds === 'number') {
      const url = `https://www.youtube.com/watch?v=${textbook.videoId}&t=${seconds}s`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCopyStep = (text: string, stepId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepId);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const handleFlipRecall = (chIdx: number) => {
    setFlippedCards((prev) => ({ ...prev, [chIdx]: !prev[chIdx] }));
  };

  // Self-assessed active recall evaluation handler
  const handleRateRecall = (chapterNumber: number, rating: 'got_it' | 'partial' | 'review') => {
    setRecallEvaluations((prev) => {
      const next = { ...prev, [chapterNumber]: rating };
      try {
        localStorage.setItem(recallStorageKey, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });

    if (rating === 'got_it') {
      safeConfetti({
        particleCount: 45,
        spread: 55,
        origin: { y: 0.8 },
        colors: ['#10B981', '#34D399', '#059669']
      });
    }
  };

  // Two-tiered learning outcomes measurement:
  // 1. Reviewed Insights (passive takeaway checkoffs)
  const allTakeaways = textbook.chapters.flatMap((c) => c.checkableTakeaways);
  const checkedCount = allTakeaways.filter((t) => t.checked).length;
  const totalCount = allTakeaways.length;
  const progressPercent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  // 2. Retrieval Practice (active test-and-evaluate self-assessment)
  const totalRecallChapters = textbook.chapters.filter((c) => c.quickRecall).length;
  const evaluatedRecallCount = Object.keys(recallEvaluations).length;
  const gotItCount = Object.values(recallEvaluations).filter((v) => v === 'got_it').length;
  const partialCount = Object.values(recallEvaluations).filter((v) => v === 'partial').length;
  const reviewCount = Object.values(recallEvaluations).filter((v) => v === 'review').length;

  const handleTakeawayClick = (chIdx: number, takeawayId: string) => {
    onToggleTakeaway(chIdx, takeawayId);
    if (checkedCount + 1 === totalCount && totalCount > 0) {
      safeConfetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  // Chapters to display based on active chapter tab
  const isProtocolOnlyView = activeChapterTab === 'protocol';
  const displayedChapters = isProtocolOnlyView
    ? []
    : typeof activeChapterTab === 'number'
    ? [textbook.chapters[activeChapterTab] || textbook.chapters[0]]
    : focusMode
    ? [textbook.chapters[activeChapterIndex] || textbook.chapters[0]]
    : textbook.chapters;

  const currentSpeechUnit = speechUnits[currentUnitIndex] || null;

  return (
    <>
      <article
        id="textbook-document"
        className={`max-w-[840px] mx-auto ${
          isWarm ? 'bg-[#FFFDF9]' : 'bg-[#FFFFFF]'
        } text-[#111827] shadow-lg border border-slate-300 rounded-xl p-4 sm:p-7 md:p-9 my-4 sm:my-8 print-page-sheet ${fontClass} transition-colors duration-200 pb-28`}
      >
        {/* Fallback Notice Banner (When fallback synthesis was utilized) */}
        {(textbook.isFallback || textbook.fallbackNotice) && (
          <div className="mb-6 p-4 bg-amber-50/90 border border-amber-300 rounded-lg text-xs font-mono text-amber-950 flex items-start gap-3 no-print">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block uppercase tracking-wider text-[11px] text-amber-900">
                Heuristic Synthesis Active (Honest Notice)
              </span>
              <p className="text-amber-900/90 text-xs leading-relaxed font-sans-custom">
                {textbook.fallbackNotice ||
                  'This study guide was synthesized without full neural model confirmation. Chapters and study prompts are derived directly from the available transcript or title metadata without invented scientific claims.'}
              </p>
            </div>
          </div>
        )}

        {/* 1. Textbook Meta Kicker & Title Header */}
        <section className="border-b border-slate-300 pb-6 mb-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5 text-xs font-mono">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold uppercase bg-black text-white px-2 py-0.5 rounded text-[11px] tracking-wider">
                VISUAL NOTEBOOK · APPLIED KNOWLEDGE
              </span>
              <span className="text-slate-600">Edition: {textbook.generatedAt}</span>
              {/* Provenance Badge */}
              {textbook.sourceMetadata && (
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${
                  textbook.sourceMetadata.status === 'verified_full'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : textbook.sourceMetadata.status === 'curated_summary'
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : textbook.sourceMetadata.status === 'verified_partial'
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : textbook.sourceMetadata.status === 'user_supplied'
                    ? 'bg-blue-50 text-blue-800 border-blue-300'
                    : 'bg-slate-100 text-slate-700 border-slate-300'
                }`}>
                  {textbook.sourceMetadata.status === 'verified_full' ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Verified Transcript ({textbook.sourceMetadata.wordCount?.toLocaleString() || 'Full'} words)</span>
                    </>
                  ) : textbook.sourceMetadata.status === 'curated_summary' ? (
                    <>
                      <Info className="w-3 h-3 text-amber-600" />
                      <span>Curated Excerpt (Abbreviated Source)</span>
                    </>
                  ) : textbook.sourceMetadata.status === 'verified_partial' ? (
                    <>
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      <span>Partial Transcript ({textbook.sourceMetadata.wordCount?.toLocaleString() || 'Segment'} words)</span>
                    </>
                  ) : textbook.sourceMetadata.status === 'user_supplied' ? (
                    <>
                      <ShieldCheck className="w-3 h-3 text-blue-600" />
                      <span>User Transcript ({textbook.sourceMetadata.wordCount?.toLocaleString() || 'Custom'} words)</span>
                    </>
                  ) : (
                    <>
                      <Info className="w-3 h-3 text-slate-500" />
                      <span>Metadata Only (Heuristic Synthesis)</span>
                    </>
                  )}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-slate-700">
              <span className="flex items-center gap-1 font-semibold text-black">
                <Clock className="w-3.5 h-3.5" />
                <span>{textbook.duration}</span>
              </span>
              <span>·</span>
              <span className="font-semibold text-black">
                {textbook.chapters.length + (textbook.dailyProtocol ? 1 : 0)} Chapters (incl. Protocol)
              </span>
            </div>
          </div>

          {/* Video Title & Keynote Speaker */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-black leading-tight font-sans-custom">
              {textbook.videoTitle}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-700">
              <span className="text-slate-900">Keynote: {textbook.speaker}</span>
              {textbook.videoUrl && (
                <a
                  href={textbook.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-800 hover:text-black underline flex items-center gap-1 font-mono text-xs no-print"
                >
                  <Youtube className="w-3.5 h-3.5 text-rose-600" />
                  <span>Watch Source Video</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              {/* Listen to Full Textbook Button */}
              <button
                type="button"
                onClick={handleStartFullTextbookAudio}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 border border-black/30 rounded text-xs font-mono font-bold shadow-2xs transition-all active:scale-95 cursor-pointer no-print"
                title="Listen to full textbook narration with synchronized sentence highlighting"
              >
                <Headphones className="w-3.5 h-3.5 text-amber-800" />
                <span>Listen Full Book (TTS)</span>
              </button>

              {/* Dedicated Daily Action Protocol Chapter Button */}
              {textbook.dailyProtocol && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveChapterTab('protocol');
                    const el = document.getElementById('daily-protocol-chapter');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded text-xs font-mono font-bold shadow-2xs transition-all active:scale-95 cursor-pointer no-print ${
                    activeChapterTab === 'protocol'
                      ? 'bg-amber-400 text-black border-black ring-1 ring-black font-extrabold'
                      : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border-black/30'
                  }`}
                  title="Open isolated Daily Action Protocol chapter"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-800 fill-amber-500" />
                  <span>⚡ Daily Protocol Chapter</span>
                </button>
              )}

              {/* Listen to Daily Action Protocol */}
              {textbook.dailyProtocol && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveChapterTab('protocol');
                    handleStartDailyProtocolAudio();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border border-black/30 rounded text-xs font-mono font-bold shadow-2xs transition-all active:scale-95 cursor-pointer no-print"
                  title="Listen to the daily action protocol (What to do vs what not to do)"
                >
                  <Volume2 className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Listen Protocol (TTS)</span>
                </button>
              )}

              {/* Toggle Audio Player Control Dock */}
              <button
                type="button"
                onClick={() => {
                  if (isAudioPlayerOpen) {
                    handleCloseAudio();
                  } else {
                    handleOpenAudioPlayer();
                  }
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded text-xs font-mono font-bold shadow-2xs transition-all active:scale-95 cursor-pointer no-print ${
                  isAudioPlayerOpen
                    ? 'bg-black text-white hover:bg-slate-800 border-black'
                    : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                }`}
                title={isAudioPlayerOpen ? 'Close bottom audio player panel' : 'Open bottom audio player panel'}
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                <span>{isAudioPlayerOpen ? 'Hide Audio Player' : 'Audio Controls'}</span>
              </button>

              {onDownloadMarkdown && (
                <button
                  type="button"
                  onClick={onDownloadMarkdown}
                  className="sm:ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FEF3C7] hover:bg-[#FDE68A] text-amber-950 border border-black/30 rounded text-xs font-mono font-bold shadow-2xs transition-all active:scale-95 cursor-pointer no-print"
                  title="Download entire study guide in Markdown (.md) format with full YouTube source attribution"
                >
                  <FileDown className="w-3.5 h-3.5 text-amber-800" />
                  <span>Download .MD (with Source)</span>
                </button>
              )}
            </div>
          </div>

          {/* Executive Summary Callout with Synchronized Audio Sentences */}
          <div className="p-4 sm:p-5 summary-box rounded-lg space-y-1.5 border border-amber-200/80 bg-amber-50/60">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono font-extrabold uppercase tracking-wider text-black flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Executive Synthesis</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500 no-print">
                Click any sentence to listen 🔊
              </span>
            </div>

            <p className={`${bodySizeClass} font-medium text-slate-900 max-w-[72ch] leading-relaxed`}>
              {splitIntoSentences(textbook.executiveSummary).map((sent, sIdx) => {
                const unitId = `textbook-summary-s${sIdx}`;
                const isCurrent = activeSpeechUnitId === unitId;

                return (
                  <span
                    key={sIdx}
                    id={unitId}
                    onClick={() => handleJumpToUnit(unitId)}
                    className={`cursor-pointer transition-all duration-150 rounded px-1 py-0.5 inline ${
                      isCurrent
                        ? 'bg-amber-200 text-slate-950 font-bold ring-2 ring-amber-500 shadow-sm'
                        : 'hover:bg-amber-100/70'
                    }`}
                    title="Click to start audio narration from here"
                  >
                    {isCurrent && (
                      <span className="inline-block mr-1 text-amber-800 animate-pulse text-xs font-mono font-black">
                        🔊
                      </span>
                    )}
                    {renderBionicText(sent, bionicReading)}{' '}
                  </span>
                );
              })}
            </p>
          </div>

          {/* Cognitive Learning & Accessibility Toolbar (No-Print) */}
          <div className="p-3.5 bg-white border border-slate-300 rounded-lg space-y-3 no-print shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              {/* Evidence-Grounded Two-Tier Learning Metrics */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold uppercase text-slate-700 flex items-center gap-1">
                    <span>📖 Reviewed:</span>
                    <span className="bg-slate-100 text-slate-800 border border-slate-300 px-1.5 py-0.5 rounded font-bold">
                      {progressPercent}%
                    </span>
                  </span>
                  <span className="text-slate-600 font-medium">
                    ({checkedCount}/{totalCount} Key Insights)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-extrabold uppercase text-slate-700 flex items-center gap-1">
                    <span>🎯 Active Recall:</span>
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 px-1.5 py-0.5 rounded font-bold">
                      {evaluatedRecallCount}/{totalRecallChapters} Tested
                    </span>
                  </span>
                  {evaluatedRecallCount > 0 && (
                    <span className="text-slate-600 text-[11px]">
                      ({gotItCount} 🟢 · {partialCount} 🟡 · {reviewCount} 🟠)
                    </span>
                  )}
                </div>
              </div>

              {/* Cognitive Reading Enhancers */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Bionic Reading Toggle */}
                <button
                  type="button"
                  onClick={() => setBionicReading(!bionicReading)}
                  className={`px-2.5 py-1 rounded border text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                    bionicReading
                      ? 'bg-amber-100 border-amber-400 text-black shadow-2xs'
                      : 'bg-slate-50 border-slate-300 text-slate-700 hover:border-black'
                  }`}
                  title="Bionic Reading bolds the first letters of words to anchor visual fixation"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-800" />
                  <span>Bionic Reading: {bionicReading ? 'ON' : 'OFF'}</span>
                </button>

                {/* Single Chapter Focus Mode Toggle */}
                <button
                  type="button"
                  onClick={() => setFocusMode(!focusMode)}
                  className={`px-2.5 py-1 rounded border text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                    focusMode
                      ? 'bg-amber-100 border-amber-400 text-black shadow-2xs'
                      : 'bg-slate-50 border-slate-300 text-slate-700 hover:border-black'
                  }`}
                  title="Chapter Focus Mode hides all other chapters to eliminate visual scrolling fatigue"
                >
                  <Layers className="w-3.5 h-3.5 text-slate-800" />
                  <span>{focusMode ? 'Focus: 1 Chapter' : 'View: All Chapters'}</span>
                </button>
              </div>
            </div>

            {/* Dual Learning Progress Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div>
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-0.5">
                  <span>Insight Checkoff Progress</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 border border-slate-300 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-600 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-0.5">
                  <span>Active Recall Tested</span>
                  <span>{totalRecallChapters > 0 ? Math.round((evaluatedRecallCount / totalRecallChapters) * 100) : 0}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 border border-slate-300 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-emerald-600 transition-all duration-300"
                    style={{ width: `${totalRecallChapters > 0 ? (gotItCount / totalRecallChapters) * 100 : 0}%` }}
                    title={`${gotItCount} Confident`}
                  />
                  <div
                    className="h-full bg-amber-500 transition-all duration-300"
                    style={{ width: `${totalRecallChapters > 0 ? (partialCount / totalRecallChapters) * 100 : 0}%` }}
                    title={`${partialCount} Partially Understood`}
                  />
                  <div
                    className="h-full bg-orange-400 transition-all duration-300"
                    style={{ width: `${totalRecallChapters > 0 ? (reviewCount / totalRecallChapters) * 100 : 0}%` }}
                    title={`${reviewCount} Need Review`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Sticky Chapter Rail & View Switcher */}
          <nav
            aria-label="Chapter Table of Contents"
            className="p-2.5 bg-[#FFFDF9] border border-black rounded-md flex items-center gap-2 overflow-x-auto no-print scrollbar-thin text-xs font-mono"
          >
            <span className="font-extrabold uppercase shrink-0 text-slate-500 text-[11px] pl-1">
              Chapter Rail:
            </span>

            {/* All Chapters Tab */}
            <button
              type="button"
              onClick={() => setActiveChapterTab('all')}
              className={`px-3 py-1.5 rounded border text-left shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeChapterTab === 'all'
                  ? 'bg-black text-white border-black font-bold shadow-2xs'
                  : 'bg-white text-slate-800 border-slate-300 hover:border-black font-semibold'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Chapters (1–{textbook.chapters.length})</span>
            </button>

            {/* Individual Chapters */}
            {textbook.chapters.map((ch, idx) => {
              const chTakeaways = ch.checkableTakeaways;
              const isCompleted = chTakeaways.length > 0 && chTakeaways.every((t) => t.checked);
              const isActive = activeChapterTab === idx;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setActiveChapterTab(idx);
                    setActiveChapterIndex(idx);
                    const el = document.getElementById(`chapter-${ch.chapterNumber}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`px-3 py-1.5 rounded border text-left shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-black text-white border-black font-bold shadow-2xs'
                      : isCompleted
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:border-black'
                      : 'bg-white text-slate-800 border-slate-300 hover:border-black'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center font-bold">
                      {ch.chapterNumber}
                    </span>
                  )}
                  <span className="font-semibold truncate max-w-[140px] sm:max-w-[200px]">
                    Ch {ch.chapterNumber}: {ch.title}
                  </span>
                </button>
              );
            })}

            {/* Dedicated Daily Action Protocol Chapter Tab */}
            {textbook.dailyProtocol && (
              <button
                type="button"
                onClick={() => {
                  setActiveChapterTab('protocol');
                  const el = document.getElementById('daily-protocol-chapter');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`px-3 py-1.5 rounded border text-left shrink-0 flex items-center gap-1.5 transition-all cursor-pointer font-bold ${
                  activeChapterTab === 'protocol'
                    ? 'bg-amber-400 text-black border-black ring-2 ring-black font-extrabold shadow-sm'
                    : 'bg-amber-100/90 text-amber-950 border-amber-400 hover:border-black hover:bg-amber-200'
                }`}
                title="Click to view ONLY the Daily Action Protocol chapter"
              >
                <Zap className="w-3.5 h-3.5 text-amber-900 shrink-0 fill-amber-500" />
                <span>⚡ Ch 0{textbook.chapters.length + 1}: Daily Protocol</span>
              </button>
            )}
          </nav>

          {/* Master Knowledge Architecture Flowchart */}
          {textbook.masterMindmapMermaid && activeChapterTab !== 'protocol' && !focusMode && (
            <div className="pt-2">
              <InteractiveMindmap
                mermaidCode={textbook.masterMindmapMermaid}
                title={`Master Knowledge Mindmap: ${textbook.speaker}`}
              />
            </div>
          )}
        </section>

        {/* 2. Dedicated Chapter: Daily Action Protocol (What To Do vs. What NOT To Do) */}
        {textbook.dailyProtocol && isProtocolOnlyView && (
          <section
            id="daily-protocol-chapter"
            aria-labelledby="daily-protocol-title"
            className="my-8 p-5 sm:p-7 bg-[#FFFDF8] border-2 border-black rounded-lg shadow-sm space-y-5 transition-all print-chapter"
          >
            {/* Isolated Chapter View Indicator (No-Print) */}
            <div className="p-3 bg-amber-300/90 border-2 border-black rounded flex flex-wrap items-center justify-between gap-2.5 text-xs font-mono font-bold no-print shadow-2xs">
              <div className="flex items-center gap-2 text-black">
                <Zap className="w-4 h-4 text-black fill-black shrink-0" />
                <span className="uppercase tracking-wider">
                  Isolated Chapter View · Focus Mode Active (Ch 0{textbook.chapters.length + 1})
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveChapterTab('all');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3 py-1 bg-black hover:bg-slate-800 text-white rounded text-xs font-mono font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-2xs active:scale-95"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Return to All Chapters</span>
              </button>
            </div>

            {/* Header: Title, Subtitle, and Adherence Actions */}
            <div className="flex flex-wrap items-start justify-between gap-3 border-b-2 border-black/20 pb-4">
              <div className="space-y-1.5 flex-1 min-w-[280px]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-black uppercase tracking-wider bg-black text-white shadow-2xs">
                    Chapter 0{textbook.chapters.length + 1}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-black uppercase tracking-wider bg-amber-400 text-black border border-black shadow-2xs">
                    <Zap className="w-3.5 h-3.5 text-black fill-black" />
                    <span>Action Engine</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
                    Time-Based Daily Execution Architecture
                  </span>
                </div>

                <h2
                  id="daily-protocol-title"
                  className="text-xl sm:text-2xl md:text-3xl font-black text-black tracking-tight font-sans-custom"
                >
                  {textbook.dailyProtocol.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-700 font-medium max-w-[72ch] leading-relaxed">
                  {textbook.dailyProtocol.subtitle}
                </p>
              </div>

              {/* Protocol Quick Actions Bar (No-Print) */}
              <div className="flex flex-wrap items-center gap-2 no-print shrink-0">
                {/* Daily Progress Tracker */}
                <span className="px-2.5 py-1 bg-white border border-black rounded text-xs font-mono font-bold text-slate-900 shadow-2xs">
                  Today: {protocolCompletedCount}/{totalProtocolBlocks} Blocks ({protocolPercent}%)
                </span>

                {/* Copy Protocol Button */}
                <button
                  type="button"
                  onClick={handleCopyProtocol}
                  className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-950 border border-black rounded text-xs font-mono font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95 transition-all"
                  title="Copy today's daily protocol in markdown format to paste into Notion, Todoist, or Notes"
                >
                  {copiedProtocol ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-amber-800" />
                      <span>Copy Protocol</span>
                    </>
                  )}
                </button>

                {/* Listen to Protocol via Audio Reader */}
                <button
                  type="button"
                  onClick={handleStartDailyProtocolAudio}
                  className="px-3 py-1 bg-black hover:bg-slate-800 text-white border border-black rounded text-xs font-mono font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95 transition-all"
                  title="Listen to the full daily action protocol narrated with sentence highlighting"
                >
                  <Headphones className="w-3.5 h-3.5 text-amber-400" />
                  <span>Listen Protocol</span>
                </button>

                {/* Reset Daily Adherence Checks */}
                {protocolCompletedCount > 0 && (
                  <button
                    type="button"
                    onClick={handleResetProtocolBlocks}
                    className="px-2.5 py-1 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-300 hover:border-rose-400 rounded text-xs font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    title="Reset today's completed checkboxes"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* Daily Adherence Progress Bar */}
            <div className="w-full h-2 bg-slate-200 border border-black/20 rounded-full overflow-hidden no-print">
              <div
                className="h-full bg-emerald-600 transition-all duration-300"
                style={{ width: `${protocolPercent}%` }}
              />
            </div>

            {/* Anchor Mindset Quote Banner */}
            {textbook.dailyProtocol.dailyAnchorQuote && (
              <div className="p-3 bg-amber-50/90 border-l-4 border-amber-600 rounded-r text-xs sm:text-sm font-medium italic text-amber-950 flex items-start gap-2 shadow-2xs">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>"{textbook.dailyProtocol.dailyAnchorQuote}"</span>
              </div>
            )}

            {/* Time Blocks List: Tactical Execution Windows */}
            <div className="space-y-4 pt-1">
              {textbook.dailyProtocol.blocks.map((block, bIdx) => {
                const isDone = !!completedProtocolBlocks[block.id];
                const doUnitId = `protocol-block-${block.id}-do`;
                const dontUnitId = `protocol-block-${block.id}-dont`;
                const whyUnitId = `protocol-block-${block.id}-why`;

                const isDoActive = activeSpeechUnitId === doUnitId;
                const isDontActive = activeSpeechUnitId === dontUnitId;
                const isWhyActive = activeSpeechUnitId === whyUnitId;

                return (
                  <div
                    key={block.id}
                    className={`border-2 border-black rounded-md p-4 sm:p-5 transition-all duration-200 shadow-2xs ${
                      isDone ? 'bg-emerald-50/50 border-emerald-900' : 'bg-white'
                    }`}
                  >
                    {/* Block Header: Time Window, Phase Name, Interactive Checkbox */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/15 pb-3">
                      <div className="flex items-center gap-3">
                        {/* Interactive Daily Checkbox */}
                        <button
                          type="button"
                          onClick={() => handleToggleProtocolBlock(block.id)}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors shadow-2xs shrink-0 ${
                            isDone
                              ? 'bg-emerald-600 border-emerald-800 text-white'
                              : 'bg-white border-black hover:border-amber-600'
                          }`}
                          title={isDone ? 'Mark block as incomplete for today' : 'Mark block as complete for today'}
                        >
                          {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>

                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-800" />
                            <span>{block.timeWindow}</span>
                          </span>

                          <h3
                            className={`text-base font-extrabold text-black font-sans-custom ${
                              isDone ? 'line-through text-slate-500' : ''
                            }`}
                          >
                            {block.phaseName}
                          </h3>
                        </div>
                      </div>

                      {/* Click-to-Read Audio Button */}
                      <button
                        type="button"
                        onClick={() => handleJumpToUnit(doUnitId)}
                        className="text-xs font-mono text-slate-600 hover:text-black font-bold flex items-center gap-1 hover:underline cursor-pointer no-print ml-auto"
                        title="Listen to this time block's instructions"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                        <span>Read Block</span>
                      </button>
                    </div>

                    {/* Core Conceptual Principle */}
                    {block.coreConcept && (
                      <div className="pt-2.5 text-xs sm:text-sm text-slate-800 font-medium flex items-start gap-1.5">
                        <span className="font-bold text-amber-950 font-mono shrink-0">💡 Main Principle:</span>
                        <span className="italic">{renderBionicText(block.coreConcept, bionicReading)}</span>
                      </div>
                    )}

                    {/* Contrast Grid: WHAT TO DO vs. WHAT NOT TO DO */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2.5">
                      {/* 🟢 DO THIS (High-Friction Reducer) */}
                      <div
                        id={doUnitId}
                        onClick={() => handleJumpToUnit(doUnitId)}
                        className={`p-3.5 rounded border-2 transition-all cursor-pointer ${
                          isDoActive
                            ? 'bg-emerald-100 border-emerald-700 ring-2 ring-emerald-500 font-bold'
                            : 'bg-emerald-50/70 border-emerald-600 hover:bg-emerald-100/50'
                        }`}
                        title="Click to hear execution instructions"
                      >
                        <div className="flex items-center gap-1.5 text-emerald-950 font-mono text-xs font-black uppercase tracking-wider mb-1.5">
                          <CheckSquare className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span>What To Do (Execution Rule)</span>
                          {isDoActive && (
                            <span className="animate-pulse ml-auto text-[11px] bg-emerald-600 text-white px-1.5 py-0.2 rounded">
                              Reading Aloud
                            </span>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                          {renderBionicText(block.doThis.action, bionicReading)}
                        </p>

                        {block.doThis.tacticalCue && (
                          <div className="mt-2.5 text-[12px] bg-white border border-emerald-300 rounded p-2 text-emerald-950 font-mono">
                            <span className="font-bold text-emerald-800">⚡ Tactical Cue:</span> {block.doThis.tacticalCue}
                          </div>
                        )}
                      </div>

                      {/* 🔴 DON'T DO THIS (The Dopamine Trap) */}
                      <div
                        id={dontUnitId}
                        onClick={() => handleJumpToUnit(dontUnitId)}
                        className={`p-3.5 rounded border-2 transition-all cursor-pointer ${
                          isDontActive
                            ? 'bg-rose-100 border-rose-700 ring-2 ring-rose-500 font-bold'
                            : 'bg-rose-50/70 border-rose-500 hover:bg-rose-100/50'
                        }`}
                        title="Click to hear dopamine trap warning"
                      >
                        <div className="flex items-center gap-1.5 text-rose-950 font-mono text-xs font-black uppercase tracking-wider mb-1.5">
                          <Square className="w-4 h-4 text-rose-600 stroke-[2.5] shrink-0" />
                          <span>What NOT To Do (Dopamine Trap)</span>
                          {isDontActive && (
                            <span className="animate-pulse ml-auto text-[11px] bg-rose-600 text-white px-1.5 py-0.2 rounded">
                              Reading Aloud
                            </span>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                          {renderBionicText(block.dontDoThis.trap, bionicReading)}
                        </p>

                        {block.dontDoThis.whyTrapDamages && (
                          <div className="mt-2.5 text-[12px] bg-white border border-rose-300 rounded p-2 text-rose-950 font-mono">
                            <span className="font-bold text-rose-800">⚠️ Why It Damages:</span> {block.dontDoThis.whyTrapDamages}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ⚡ Biological Mechanism Bar */}
                    <div
                      id={whyUnitId}
                      onClick={() => handleJumpToUnit(whyUnitId)}
                      className={`mt-2.5 p-2.5 rounded border transition-all text-xs font-mono flex items-start gap-2 cursor-pointer ${
                        isWhyActive
                          ? 'bg-amber-200 border-amber-600 ring-2 ring-amber-500 font-bold'
                          : 'bg-amber-50/80 border-amber-300 hover:bg-amber-100/70 text-slate-800'
                      }`}
                      title="Click to hear biological mechanism explanation"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-black">Biological Mechanism: </span>
                        <span>{renderBionicText(block.biologicalWhy, bionicReading)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Protocol Chapter Bottom Navigation */}
            <div className="pt-6 border-t-2 border-black/20 flex flex-wrap items-center justify-between gap-3 text-xs font-mono no-print">
              <button
                type="button"
                onClick={() => {
                  setActiveChapterTab(0);
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                className="px-3.5 py-2 bg-white hover:bg-slate-100 text-black border border-black rounded font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Read Chapter 1: {textbook.chapters[0]?.title}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveChapterTab('all');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2 bg-black hover:bg-slate-800 text-white border border-black rounded font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 transition-all"
              >
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Return to Full Textbook</span>
              </button>
            </div>
          </section>
        )}

        {/* Focus Mode Navigation Bar (if in Focus Mode) */}
        {focusMode && (
          <div className="flex items-center justify-between p-3 bg-amber-50 border-2 border-black rounded-md mb-6 no-print text-xs font-mono font-bold">
            <button
              type="button"
              disabled={activeChapterIndex === 0}
              onClick={() => setActiveChapterIndex((prev) => Math.max(0, prev - 1))}
              className="px-3 py-1.5 bg-white border border-black rounded flex items-center gap-1 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:bg-slate-50"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev Chapter</span>
            </button>

            <span className="text-black">
              Chapter {activeChapterIndex + 1} of {textbook.chapters.length}
            </span>

            <button
              type="button"
              disabled={activeChapterIndex === textbook.chapters.length - 1}
              onClick={() => setActiveChapterIndex((prev) => Math.min(textbook.chapters.length - 1, prev + 1))}
              className="px-3 py-1.5 bg-white border border-black rounded flex items-center gap-1 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:bg-slate-50"
            >
              <span>Next Chapter</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Chapters: 100% Full-Width Single-Column Stack */}
        <div className="space-y-16">
          {displayedChapters.map((chapter) => {
            const chIdx = chapter.chapterNumber - 1;
            const isThisChapterPlaying =
              (isPlayingAudio || isPausedAudio) &&
              currentChapterPlayingRef.current === chapter.chapterNumber;

            return (
              <section
                key={chapter.chapterNumber}
                id={`chapter-${chapter.chapterNumber}`}
                className="space-y-6 print-chapter scroll-mt-6"
              >
                {/* Chapter Banner Header */}
                <div
                  id={`chapter-${chapter.chapterNumber}-header`}
                  className={`chapter-banner py-3 px-4 my-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-2 border-black rounded-md transition-colors ${
                    activeSpeechUnitId === `chapter-${chapter.chapterNumber}-header`
                      ? 'bg-amber-100 ring-2 ring-amber-400'
                      : 'bg-white shadow-2xs'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-bold">
                      Chapter 0{chapter.chapterNumber} · ~4 min read
                    </div>
                    <h2 className="text-lg sm:text-[22px] font-extrabold text-black uppercase tracking-tight font-sans-custom">
                      {chapter.chapterNumber}. {chapter.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 no-print flex-wrap">
                    {/* Audio Reader Button with Active State */}
                    <button
                      type="button"
                      onClick={() => {
                        if (isThisChapterPlaying) {
                          handleTogglePlay();
                        } else {
                          handleStartChapterAudio(chapter);
                        }
                      }}
                      className={`font-mono text-xs font-bold border border-black px-3 py-1.5 rounded shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                        isThisChapterPlaying
                          ? 'bg-amber-400 text-black font-extrabold ring-1 ring-black'
                          : 'bg-white hover:bg-amber-50 text-black'
                      }`}
                      title="Listen to this chapter with synchronized read-along highlighting"
                    >
                      {isThisChapterPlaying ? (
                        isPausedAudio ? (
                          <>
                            <Play className="w-3.5 h-3.5 fill-black" />
                            <span>Resume Ch {chapter.chapterNumber}</span>
                          </>
                        ) : (
                          <>
                            <Pause className="w-3.5 h-3.5 animate-pulse text-amber-900" />
                            <span>Pause Ch {chapter.chapterNumber}</span>
                          </>
                        )
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-slate-700" />
                          <span>Listen Chapter {chapter.chapterNumber}</span>
                        </>
                      )}
                    </button>

                    {/* Timestamp Jump Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenTimestamp(chapter.startSeconds)}
                      className="font-mono text-xs font-bold bg-white text-black border border-black px-2.5 py-1.5 rounded shadow-2xs hover:bg-amber-100 flex items-center gap-1 transition-colors cursor-pointer"
                      title="Jump to video moment on YouTube"
                    >
                      <Clock className="w-3 h-3 text-slate-700" />
                      <span>{chapter.timestampRange}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>

                {/* 1. 🎯 CORE CONCEPT Box (Full-Width with Sentence Read-Along Highlighting) */}
                <div className="callout-core p-5 rounded-md space-y-3.5 print-avoid-break border border-black/30">
                  <div className="flex items-center justify-between text-xs font-mono font-extrabold uppercase tracking-wider text-black">
                    <span className="flex items-center gap-2">
                      <span className="text-base">🎯</span>
                      <span>CORE MECHANISM & SCIENTIFIC PRINCIPLES</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 font-normal no-print">
                      Click sentence to hear audio
                    </span>
                  </div>

                  <div className="space-y-3">
                    {chapter.coreConcepts.map((concept, cIdx) => {
                      const sentences = splitIntoSentences(concept);
                      return (
                        <p
                          key={cIdx}
                          className={`${bodySizeClass} max-w-[75ch] text-slate-900 leading-relaxed`}
                        >
                          {sentences.map((sent, sIdx) => {
                            const unitId = `chapter-${chapter.chapterNumber}-concept-${cIdx}-s${sIdx}`;
                            const isCurrent = activeSpeechUnitId === unitId;

                            return (
                              <span
                                key={sIdx}
                                id={unitId}
                                onClick={() => handleJumpToUnit(unitId, chapter.chapterNumber)}
                                className={`cursor-pointer transition-all duration-150 rounded px-1 py-0.5 inline ${
                                  isCurrent
                                    ? 'bg-amber-200 text-slate-950 font-bold ring-2 ring-amber-500 shadow-sm'
                                    : 'hover:bg-amber-100/70'
                                }`}
                                title="Click to listen from this sentence"
                              >
                                {isCurrent && (
                                  <span className="inline-block mr-1 text-amber-800 animate-pulse text-xs font-mono font-black">
                                    🔊
                                  </span>
                                )}
                                {renderBionicText(sent, bionicReading)}{' '}
                              </span>
                            );
                          })}
                        </p>
                      );
                    })}
                  </div>

                  {chapter.anchorKeywords.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-2.5 border-t border-black/20 text-xs font-mono">
                      <span className="font-bold uppercase text-slate-700">Anchor Terms:</span>
                      {chapter.anchorKeywords.map((kw, kwIdx) => (
                        <span
                          key={kwIdx}
                          className="bg-white border border-black font-bold px-2 py-0.5 rounded text-[11px] text-black"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. 🧠 MENTAL MODEL / STORY ANALOGY Box (Full-Width with Sentence Highlighting) */}
                <div className="callout-model p-5 rounded-md space-y-3 print-avoid-break border border-black/30">
                  <div className="flex items-center gap-2 text-xs font-mono font-extrabold uppercase tracking-wider text-black">
                    <span className="text-base">🧠</span>
                    <span>MENTAL MODEL & STORY ANALOGY</span>
                  </div>

                  <h3
                    id={`chapter-${chapter.chapterNumber}-model-header`}
                    onClick={() =>
                      handleJumpToUnit(`chapter-${chapter.chapterNumber}-model-header`, chapter.chapterNumber)
                    }
                    className={`text-lg font-extrabold font-sans-custom text-black p-1 rounded cursor-pointer transition-colors ${
                      activeSpeechUnitId === `chapter-${chapter.chapterNumber}-model-header`
                        ? 'bg-amber-200 ring-2 ring-amber-400'
                        : 'hover:bg-amber-50'
                    }`}
                  >
                    {chapter.mentalModelTitle}
                  </h3>

                  <p className={`${bodySizeClass} max-w-[75ch] text-slate-900 italic leading-relaxed`}>
                    "{chapter.mentalModelExplanation && splitIntoSentences(chapter.mentalModelExplanation).map((sent, sIdx) => {
                      const unitId = `chapter-${chapter.chapterNumber}-model-desc-s${sIdx}`;
                      const isCurrent = activeSpeechUnitId === unitId;

                      return (
                        <span
                          key={sIdx}
                          id={unitId}
                          onClick={() => handleJumpToUnit(unitId, chapter.chapterNumber)}
                          className={`cursor-pointer transition-all duration-150 rounded px-1 py-0.5 inline ${
                            isCurrent
                              ? 'bg-amber-200 text-slate-950 font-bold not-italic ring-2 ring-amber-500 shadow-sm'
                              : 'hover:bg-amber-100/70'
                          }`}
                          title="Click to listen from this sentence"
                        >
                          {isCurrent && (
                            <span className="inline-block mr-1 text-amber-800 animate-pulse text-xs font-mono font-black">
                              🔊
                            </span>
                          )}
                          {renderBionicText(sent, bionicReading)}{' '}
                        </span>
                      );
                    })}"
                  </p>
                </div>

                {/* 3. 📊 FULL-WIDTH VISUAL DIAGRAM CONTAINER (Mermaid.js) */}
                {chapter.mermaidDiagram && (
                  <div className="w-full print-avoid-break">
                    <InteractiveMindmap
                      mermaidCode={chapter.mermaidDiagram}
                      title={`Fig ${chapter.chapterNumber}.1: ${chapter.mentalModelTitle} (Neural Loop)`}
                    />
                  </div>
                )}

                {/* 4. ⚡ IMMEDIATE ACTION PROTOCOL (Tactile Steps Pipeline with Read-Along Highlight) */}
                {chapter.actionSteps && chapter.actionSteps.length > 0 && (
                  <div className="callout-action p-5 rounded-md space-y-3 print-avoid-break border border-black/30">
                    <div className="flex items-center justify-between text-xs font-mono font-extrabold uppercase tracking-wider text-black">
                      <span className="flex items-center gap-2">
                        <span className="text-base">⚡</span>
                        <span>IMMEDIATE ACTION PROTOCOL (TACTILE STEPS)</span>
                      </span>
                      <span className="text-slate-600 font-normal">Physical implementation</span>
                    </div>

                    <div className="space-y-3 pt-1">
                      {chapter.actionSteps.map((step, sIdx) => {
                        const unitId = `chapter-${chapter.chapterNumber}-action-${sIdx}`;
                        const isCurrent = activeSpeechUnitId === unitId;
                        const stepKey = `step-${chapter.chapterNumber}-${sIdx}`;
                        const isCopied = copiedStep === stepKey;

                        return (
                          <div
                            key={sIdx}
                            id={unitId}
                            onClick={() => handleJumpToUnit(unitId, chapter.chapterNumber)}
                            className={`flex items-start justify-between gap-3 p-3 rounded transition-all duration-150 group cursor-pointer ${
                              isCurrent
                                ? 'bg-amber-100/90 border-2 border-amber-600 ring-2 ring-amber-400 shadow-md'
                                : 'bg-white border border-black hover:border-amber-700 shadow-2xs'
                            }`}
                            title="Click to start listening to this step"
                          >
                            <div className="flex items-start gap-3">
                              <span
                                className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 ${
                                  isCurrent
                                    ? 'bg-amber-700 text-white animate-pulse'
                                    : 'bg-black text-white'
                                }`}
                              >
                                {sIdx + 1}
                              </span>
                              <p className={`${bodySizeClass} max-w-[70ch] font-medium text-slate-900`}>
                                {renderBionicText(step, bionicReading)}
                              </p>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              {isCurrent && (
                                <span className="text-xs font-mono font-bold text-amber-900 bg-amber-200 px-1.5 py-0.5 rounded border border-amber-400">
                                  🔊 Reading
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyStep(step, stepKey);
                                }}
                                className="text-slate-400 hover:text-black shrink-0 p-1 rounded transition-colors no-print cursor-pointer"
                                title="Copy this action step"
                              >
                                {isCopied ? (
                                  <Check className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 5. ⚠️ THE TRAP Box (Full-Width with Sentence Highlighting) */}
                {chapter.theTrap && (
                  <div className="callout-trap p-5 rounded-md space-y-2 print-avoid-break border border-black/30">
                    <div className="flex items-center gap-2 text-xs font-mono font-extrabold uppercase tracking-wider text-black">
                      <span className="text-base">⚠️</span>
                      <span>THE TRAP / WHY WILLPOWER FAILS BIOLOGICALLY</span>
                    </div>

                    <h4
                      id={`chapter-${chapter.chapterNumber}-trap-header`}
                      onClick={() =>
                        handleJumpToUnit(`chapter-${chapter.chapterNumber}-trap-header`, chapter.chapterNumber)
                      }
                      className={`text-base font-extrabold font-sans-custom text-black p-1 rounded cursor-pointer transition-colors ${
                        activeSpeechUnitId === `chapter-${chapter.chapterNumber}-trap-header`
                          ? 'bg-amber-200 ring-2 ring-amber-400'
                          : 'hover:bg-amber-50'
                      }`}
                    >
                      {chapter.theTrap.title}
                    </h4>

                    <p className={`${bodySizeClass} max-w-[75ch] text-slate-900 leading-relaxed`}>
                      {splitIntoSentences(chapter.theTrap.description).map((sent, sIdx) => {
                        const unitId = `chapter-${chapter.chapterNumber}-trap-desc-s${sIdx}`;
                        const isCurrent = activeSpeechUnitId === unitId;

                        return (
                          <span
                            key={sIdx}
                            id={unitId}
                            onClick={() => handleJumpToUnit(unitId, chapter.chapterNumber)}
                            className={`cursor-pointer transition-all duration-150 rounded px-1 py-0.5 inline ${
                              isCurrent
                                ? 'bg-amber-200 text-slate-950 font-bold ring-2 ring-amber-500 shadow-sm'
                                : 'hover:bg-amber-100/70'
                            }`}
                            title="Click to listen from this sentence"
                          >
                            {isCurrent && (
                              <span className="inline-block mr-1 text-amber-800 animate-pulse text-xs font-mono font-black">
                                🔊
                              </span>
                            )}
                            {renderBionicText(sent, bionicReading)}{' '}
                          </span>
                        );
                      })}
                    </p>
                  </div>
                )}

                {/* 6. 📋 BORDERED COMPARISON TABLE */}
                {chapter.comparisonTable && chapter.comparisonTable.rows.length > 0 && (
                  <div className="w-full overflow-x-auto my-5 print-avoid-break">
                    <div className="text-xs font-mono font-extrabold uppercase tracking-wider text-black mb-1.5 flex items-center gap-1.5">
                      <span>Table {chapter.chapterNumber}.1: Common Pitfalls vs. Applied Action Protocol</span>
                    </div>
                    <table className="textbook-table">
                      <thead>
                        <tr>
                          {chapter.comparisonTable.headers.map((header, hIdx) => (
                            <th key={hIdx} className="text-sm">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {chapter.comparisonTable.rows.map((row, rIdx) => (
                          <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="text-sm">
                                {renderBionicText(cell, bionicReading)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 7. ✍️ CHECKABLE TAKEAWAYS (with Read-Along Synchronized Highlighter) */}
                {chapter.checkableTakeaways.length > 0 && (
                  <div className="border-2 border-black rounded-md p-4 sm:p-5 bg-white space-y-3.5 print-avoid-break shadow-2xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono font-extrabold uppercase tracking-wider text-black">
                      <span className="flex items-center gap-1.5">
                        <Bookmark className="w-4 h-4 text-amber-600" />
                        <span>Checkable Chapter Insights & Pen Markers</span>
                      </span>
                      <span className="text-slate-500 font-normal">
                        Click marker (✓ / ○ / ★) to cycle pen styles · Click insight to hear audio
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {chapter.checkableTakeaways.map((takeaway) => {
                        const unitId = `chapter-${chapter.chapterNumber}-takeaway-${takeaway.id}`;
                        const isCurrent = activeSpeechUnitId === unitId;

                        return (
                          <div
                            key={takeaway.id}
                            id={unitId}
                            onClick={() => handleJumpToUnit(unitId, chapter.chapterNumber)}
                            className={`p-3 rounded border transition-all duration-150 flex items-start gap-3 takeaway-item cursor-pointer ${
                              isCurrent
                                ? 'bg-amber-100 border-2 border-amber-600 ring-2 ring-amber-400 shadow-md'
                                : takeaway.checked
                                ? isWarm
                                  ? 'bg-[#ECFDF5] border-[#059669]'
                                  : 'bg-slate-100 border-black'
                                : 'bg-[#F8FAFC] border-slate-300 hover:border-black'
                            }`}
                            title="Click to listen to this takeaway"
                          >
                            {/* Checkbox button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTakeawayClick(chIdx, takeaway.id);
                              }}
                              className="mt-0.5 text-black hover:text-emerald-700 transition-colors shrink-0 cursor-pointer"
                            >
                              {takeaway.checked ? (
                                <CheckSquare className="w-5 h-5 text-emerald-700" />
                              ) : (
                                <Square className="w-5 h-5 text-slate-500" />
                              )}
                            </button>

                            {/* Content */}
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2 text-xs font-mono">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenTimestamp(takeaway.seconds);
                                  }}
                                  className="font-bold text-amber-800 hover:underline flex items-center gap-0.5 cursor-pointer"
                                >
                                  <Clock className="w-3 h-3" />
                                  <span>{takeaway.timestamp}</span>
                                </button>
                                <span>·</span>
                                <span
                                  className={`px-1.5 py-0.5 rounded font-bold text-[10px] uppercase border ${
                                    isWarm
                                      ? takeaway.category === 'Key Insight'
                                        ? 'bg-amber-100 border-amber-300 text-amber-900'
                                        : takeaway.category === 'Aha Moment'
                                        ? 'bg-purple-100 border-purple-300 text-purple-900'
                                        : 'bg-emerald-100 border-emerald-300 text-emerald-900'
                                      : 'bg-slate-200 border-black text-black'
                                  }`}
                                >
                                  {takeaway.category}
                                </span>
                                {isCurrent && (
                                  <span className="text-amber-800 font-bold flex items-center gap-1 animate-pulse">
                                    🔊 Reading
                                  </span>
                                )}
                              </div>

                              <p
                                className={`${bodySizeClass} ${
                                  takeaway.checked
                                    ? 'line-through text-slate-500'
                                    : 'text-slate-900 font-medium'
                                }`}
                              >
                                {renderBionicText(takeaway.text, bionicReading)}
                              </p>
                            </div>

                            {/* Pen Marker Toggle */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onTogglePenKey(chIdx, takeaway.id);
                              }}
                              className="p-1.5 rounded hover:bg-slate-200 text-slate-700 font-mono text-xs shrink-0 no-print cursor-pointer"
                              title="Click to cycle marker: Checked (✓), Circle (○), Star (★)"
                            >
                              {takeaway.penKey === 'check' && (
                                <span className="font-bold text-emerald-600">✓</span>
                              )}
                              {takeaway.penKey === 'circle' && (
                                <span className="font-bold text-purple-600">○</span>
                              )}
                              {(!takeaway.penKey || takeaway.penKey === 'star') && (
                                <span className="font-bold text-amber-600">★</span>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 8. 🧩 INTERACTIVE ACTIVE RECALL SELF-CHECK FLASHCARD */}
                {/* Flexible Structured Chapter Blocks (When Present) */}
                {chapter.blocks && chapter.blocks.length > 0 && (
                  <div className="space-y-3 pt-1">
                    {chapter.blocks.map((block, bIdx) => {
                      if (block.type === 'explanation') {
                        return (
                          <div key={bIdx} className="p-3.5 rounded-lg border border-slate-200 bg-white text-sm space-y-1">
                            {block.title && <div className="font-mono text-xs font-bold uppercase">{block.title}</div>}
                            <p className="leading-relaxed">{renderBionicText(block.text, bionicReading)}</p>
                            {block.sourceQuote && (
                              <blockquote className="text-xs text-slate-600 italic border-l-2 pl-2">
                                "{block.sourceQuote}"
                              </blockquote>
                            )}
                          </div>
                        );
                      }
                      if (block.type === 'source_evidence') {
                        return (
                          <div key={bIdx} className="p-3.5 rounded-lg border border-amber-200 bg-amber-50/70 text-sm space-y-1">
                            <div className="font-mono text-xs font-bold text-amber-900 uppercase">
                              Spoken Source Evidence {block.sourceRange && `(${block.sourceRange})`}
                            </div>
                            <p className="font-medium text-slate-900">{block.claim}</p>
                            {block.exactQuote && (
                              <p className="italic text-slate-800 border-l-2 border-amber-400 pl-2">
                                "{renderBionicText(block.exactQuote, bionicReading)}"
                              </p>
                            )}
                            {block.speakerAttribution && <div className="text-xs text-slate-600">— {block.speakerAttribution}</div>}
                          </div>
                        );
                      }
                      if (block.type === 'action_step') {
                        return (
                          <div key={bIdx} className="p-3.5 rounded-lg border border-emerald-200 bg-emerald-50/70 text-sm space-y-1">
                            <div className="font-mono text-xs font-bold text-emerald-900 uppercase">
                              ⚡ Action Step {block.isDirectSpeakerRecommendation ? '(Direct Recommendation)' : ''}
                            </div>
                            <p className="font-medium text-slate-900">{renderBionicText(block.step, bionicReading)}</p>
                            {block.rationale && <div className="text-xs text-slate-600">{block.rationale}</div>}
                          </div>
                        );
                      }
                      if (block.type === 'definition') {
                        return (
                          <div key={bIdx} className="p-3.5 rounded-lg border border-purple-200 bg-purple-50/60 text-sm space-y-1">
                            <div className="font-mono text-xs font-bold text-purple-900 uppercase">
                              📖 {block.term}
                            </div>
                            <p className="text-slate-900">{renderBionicText(block.definition, bionicReading)}</p>
                            {block.context && <div className="text-xs text-slate-500">{block.context}</div>}
                          </div>
                        );
                      }
                      if (block.type === 'caution_trap') {
                        return (
                          <div key={bIdx} className="p-3.5 rounded-lg border border-rose-200 bg-rose-50/60 text-sm space-y-1">
                            <div className="font-mono text-xs font-bold text-rose-900 uppercase">
                              ⚠️ {block.title || block.trap}
                            </div>
                            <p className="text-slate-800">{renderBionicText(block.whyItFails, bionicReading)}</p>
                            {block.sourceWarning && <div className="text-xs font-bold text-rose-800">{block.sourceWarning}</div>}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}

                {/* 8. 🧩 INTERACTIVE ACTIVE RECALL & SELF-ASSESSMENT CHALLENGE */}
                {chapter.quickRecall && (
                  <div className="border border-amber-300 rounded-lg p-4 sm:p-5 bg-[#FEF3C7]/70 space-y-3 print-avoid-break no-print shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono font-extrabold uppercase tracking-wider text-black">
                      <span className="flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-amber-700" />
                        <span>🧠 Active Recall Challenge (Test Memory Before Checking)</span>
                      </span>

                      {/* Current Self-Assessment Rating Tag */}
                      {recallEvaluations[chapter.chapterNumber] && (
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                          recallEvaluations[chapter.chapterNumber] === 'got_it'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                            : recallEvaluations[chapter.chapterNumber] === 'partial'
                            ? 'bg-amber-100 text-amber-900 border-amber-400'
                            : 'bg-orange-100 text-orange-900 border-orange-400'
                        }`}>
                          {recallEvaluations[chapter.chapterNumber] === 'got_it'
                            ? '✓ Confident (Retained)'
                            : recallEvaluations[chapter.chapterNumber] === 'partial'
                            ? '~ Partially Retained'
                            : '🟠 Needs Review'}
                        </span>
                      )}
                    </div>

                    <div className="bg-white border border-slate-300 rounded-lg p-4 space-y-3 shadow-2xs">
                      <div className="flex items-center justify-between text-xs font-mono text-slate-500 uppercase font-bold">
                        <span>Retrieval Question:</span>
                        <span className="text-[11px] font-normal lowercase text-slate-400">
                          Formulate answer in your mind first
                        </span>
                      </div>

                      <p
                        id={`chapter-${chapter.chapterNumber}-recall-q`}
                        onClick={() =>
                          handleJumpToUnit(
                            `chapter-${chapter.chapterNumber}-recall-q`,
                            chapter.chapterNumber
                          )
                        }
                        className={`text-base font-bold text-black font-sans-custom p-1.5 rounded cursor-pointer transition-colors ${
                          activeSpeechUnitId === `chapter-${chapter.chapterNumber}-recall-q`
                            ? 'bg-amber-200 ring-2 ring-amber-400'
                            : 'hover:bg-amber-50'
                        }`}
                        title="Click to hear question"
                      >
                        {chapter.quickRecall.question}
                      </p>

                      {flippedCards[chapter.chapterNumber] ? (
                        <div className="pt-3 border-t border-slate-200 space-y-3 animate-fadeIn">
                          <div className="text-xs font-mono text-emerald-800 uppercase font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Grounded Mechanism & Explanation:</span>
                          </div>

                          <p
                            id={`chapter-${chapter.chapterNumber}-recall-a`}
                            onClick={() =>
                              handleJumpToUnit(
                                `chapter-${chapter.chapterNumber}-recall-a`,
                                chapter.chapterNumber
                              )
                            }
                            className={`${bodySizeClass} text-slate-800 font-medium p-1 rounded cursor-pointer ${
                              activeSpeechUnitId === `chapter-${chapter.chapterNumber}-recall-a`
                                ? 'bg-amber-200 ring-2 ring-amber-400'
                                : 'hover:bg-amber-50'
                            }`}
                            title="Click to hear answer"
                          >
                            {chapter.quickRecall.answer}
                          </p>

                          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-md text-xs font-mono text-amber-950 font-semibold">
                            💡 Core Principle: {chapter.quickRecall.coreTakeaway}
                          </div>

                          {/* Honest 3-tier Self-Assessment Controls */}
                          <div className="pt-2 border-t border-slate-100 space-y-1.5">
                            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                              <span className="font-bold uppercase">Rate Your Recall:</span>
                              <span>How well did your mental recall match?</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <button
                                type="button"
                                onClick={() => handleRateRecall(chapter.chapterNumber, 'got_it')}
                                className={`px-2.5 py-1.5 rounded text-xs font-mono font-bold border flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                                  recallEvaluations[chapter.chapterNumber] === 'got_it'
                                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm ring-2 ring-emerald-300'
                                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-300'
                                }`}
                              >
                                <Award className="w-3.5 h-3.5" />
                                <span>Got It Right</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleRateRecall(chapter.chapterNumber, 'partial')}
                                className={`px-2.5 py-1.5 rounded text-xs font-mono font-bold border flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                                  recallEvaluations[chapter.chapterNumber] === 'partial'
                                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm ring-2 ring-amber-200'
                                    : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                                }`}
                              >
                                <HelpCircle className="w-3.5 h-3.5" />
                                <span>Partially Understood</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleRateRecall(chapter.chapterNumber, 'review')}
                                className={`px-2.5 py-1.5 rounded text-xs font-mono font-bold border flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                                  recallEvaluations[chapter.chapterNumber] === 'review'
                                    ? 'bg-orange-600 text-white border-orange-700 shadow-sm ring-2 ring-orange-200'
                                    : 'bg-orange-50 hover:bg-orange-100 text-orange-950 border-orange-300'
                                }`}
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Needs Review</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="pt-1 flex items-center justify-between flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleFlipRecall(chapter.chapterNumber)}
                            className="px-3.5 py-2 bg-slate-900 hover:bg-black text-white font-mono text-xs font-bold rounded flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all"
                          >
                            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                            <span>Flip to Reveal Evidence Explanation</span>
                          </button>
                          <span className="text-[11px] font-mono text-slate-500">
                            Tests evidence recall without premature clueing
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* Action Protocol Transition Callout (When viewing all chapters) */}
        {textbook.dailyProtocol && activeChapterTab === 'all' && (
          <div className="mt-16 p-6 bg-[#FFFDF8] border-2 border-black rounded-lg shadow-sm space-y-3 no-print">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/15 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="bg-black text-white px-2 py-0.5 rounded text-[11px] font-mono font-black uppercase">
                  Chapter 0{textbook.chapters.length + 1}
                </span>
                <span className="bg-amber-300 text-black px-2 py-0.5 rounded text-[11px] font-mono font-black uppercase flex items-center gap-1 border border-black shadow-2xs">
                  <Zap className="w-3.5 h-3.5 text-black fill-black" />
                  <span>Action Engine</span>
                </span>
              </div>
              <span className="text-xs font-mono text-slate-600 font-bold">
                Convert Knowledge Into Action
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-black text-black font-sans-custom">
                {textbook.dailyProtocol.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700">
                {textbook.dailyProtocol.subtitle}
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setActiveChapterTab('protocol');
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-black border-2 border-black rounded font-mono text-xs font-black flex items-center gap-2 cursor-pointer shadow-sm active:scale-95 transition-all"
              >
                <Zap className="w-4 h-4 text-black fill-black" />
                <span>Open Dedicated Daily Protocol Chapter ➡️</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveChapterTab('protocol');
                  handleStartDailyProtocolAudio();
                }}
                className="px-3.5 py-2 bg-black hover:bg-slate-800 text-white rounded font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 transition-all"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Listen Protocol (TTS)</span>
              </button>
            </div>
          </div>
        )}

        {/* Single Chapter Navigation Bar (When viewing a specific numbered chapter) */}
        {typeof activeChapterTab === 'number' && (
          <div className="mt-12 p-4 bg-amber-50 border-2 border-black rounded-md flex flex-wrap items-center justify-between gap-3 text-xs font-mono font-bold no-print">
            <button
              type="button"
              disabled={activeChapterTab === 0}
              onClick={() => {
                setActiveChapterTab((prev) => (typeof prev === 'number' ? Math.max(0, prev - 1) : 0));
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              className="px-3 py-1.5 bg-white border border-black rounded flex items-center gap-1 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:bg-slate-50"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Chapter</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveChapterTab('all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3 py-1.5 bg-white border border-black rounded hover:bg-slate-50 text-slate-800"
            >
              View All Chapters
            </button>

            {activeChapterTab < textbook.chapters.length - 1 ? (
              <button
                type="button"
                onClick={() => {
                  setActiveChapterTab((prev) => (typeof prev === 'number' ? prev + 1 : 0));
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                className="px-3 py-1.5 bg-black text-white border border-black rounded flex items-center gap-1 cursor-pointer hover:bg-slate-800"
              >
                <span>Next: Ch {activeChapterTab + 2}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : textbook.dailyProtocol ? (
              <button
                type="button"
                onClick={() => {
                  setActiveChapterTab('protocol');
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                className="px-3 py-1.5 bg-amber-400 text-black border-2 border-black rounded flex items-center gap-1.5 cursor-pointer hover:bg-amber-500 font-black shadow-2xs"
              >
                <Zap className="w-3.5 h-3.5 text-black fill-black" />
                <span>Next: Daily Protocol</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : null}
          </div>
        )}
      </article>

      {/* Floating Tactical Audio Player Bar (No-Print) */}
      <AudioPlayerBar
        isOpen={isAudioPlayerOpen}
        isPlaying={isPlayingAudio}
        isPaused={isPausedAudio}
        currentUnit={currentSpeechUnit}
        currentIndex={currentUnitIndex}
        totalUnits={speechUnits.length}
        speed={audioSpeed}
        autoScroll={autoScroll}
        availableVoices={availableVoices}
        selectedVoiceURI={selectedVoiceURI}
        onTogglePlay={handleTogglePlay}
        onStop={handleStopAudio}
        onClose={handleCloseAudio}
        onPrev={handlePrevUnit}
        onNext={handleNextUnit}
        onChangeSpeed={handleAudioSpeedChange}
        onToggleAutoScroll={handleToggleAutoScroll}
        onSelectVoice={handleSelectVoice}
      />
    </>
  );
};

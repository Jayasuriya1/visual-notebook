export type PaperTheme = 'warm' | 'white';

export type FontPreference = 'atkinson' | 'lexend' | 'sans';

export type FontSizePreference = 'compact' | 'normal' | 'large';

export interface CheckableTakeaway {
  id: string;
  timestamp: string;
  seconds?: number;
  category: 'Key Insight' | 'Aha Moment' | 'Action Rule';
  text: string;
  checked: boolean;
  penKey?: 'check' | 'circle' | 'star';
  sourceQuote?: string;
}

export type ChapterBlockType =
  | 'explanation'
  | 'definition'
  | 'source_evidence'
  | 'diagram'
  | 'comparison'
  | 'caution_trap'
  | 'action_step'
  | 'reflection';

export type ChapterBlock =
  | {
      type: 'explanation';
      title?: string;
      text: string;
      sourceQuote?: string;
      isSpeakerClaim: boolean;
    }
  | {
      type: 'definition';
      term: string;
      definition: string;
      context?: string;
    }
  | {
      type: 'source_evidence';
      claim: string;
      sourceRange?: string;
      exactQuote?: string;
      speakerAttribution?: string;
      confidence?: 'verified' | 'inferred';
    }
  | {
      type: 'diagram';
      title: string;
      mermaidCode: string;
      textFallback?: string;
    }
  | {
      type: 'comparison';
      title?: string;
      headers: string[];
      rows: string[][];
    }
  | {
      type: 'caution_trap';
      title: string;
      trap: string;
      whyItFails: string;
      sourceWarning?: string;
    }
  | {
      type: 'action_step';
      step: string;
      rationale?: string;
      isDirectSpeakerRecommendation: boolean;
    }
  | {
      type: 'reflection';
      prompt: string;
      guidedNotes?: string;
    };

export interface ChapterRecall {
  question: string;
  answer: string;
  coreTakeaway: string;
  explanation?: string;
  sourceContext?: string;
  userAttempt?: string;
  outcome?: 'unattempted' | 'correct' | 'partially_correct' | 'needs_review';
  reviewedAt?: number;
}

export interface TextbookChapter {
  chapterNumber: number;
  title: string;
  timestampRange: string;
  startSeconds: number;
  coreConcepts: string[];
  anchorKeywords: string[];
  mentalModelTitle?: string;
  mentalModelExplanation?: string;
  mermaidDiagram?: string;
  theTrap?: {
    title: string;
    description: string;
  };
  actionSteps?: string[];
  comparisonTable?: {
    headers: string[];
    rows: string[][];
  };
  checkableTakeaways: CheckableTakeaway[];
  quickRecall?: ChapterRecall;
  blocks?: ChapterBlock[];
}

export interface ProtocolTimeBlock {
  id: string;
  timeWindow: string; // e.g. "06:30 - 08:30 AM (0–60 Min Post-Wake)"
  phaseName: string; // e.g. "Waking Baseline & Cortisol Alignment"
  coreConcept: string; // Primary conceptual insight
  doThis: {
    action: string;
    tacticalCue: string;
  };
  dontDoThis: {
    trap: string;
    whyTrapDamages: string;
  };
  biologicalWhy: string;
  completed?: boolean;
  isDirectSpeakerRecommendation?: boolean; // false if heuristic application suggestion
  sourceBasis?: string;
  objective?: string;
  trigger?: string;
  completionCriterion?: string;
}

export interface DailyTimeProtocol {
  title: string;
  subtitle: string;
  dailyAnchorQuote: string;
  blocks: ProtocolTimeBlock[];
  isHeuristicSuggestion?: boolean;
  protocolNotice?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description?: string;
  color?: string;
  createdAt?: number;
}

export type TranscriptStatus =
  | 'verified_full'
  | 'verified_partial'
  | 'user_supplied'
  | 'curated_summary'
  | 'unavailable'
  | 'failed';

export interface SourceMetadata {
  status: TranscriptStatus;
  retrievalMethod?: string;
  wordCount?: number;
  characterCount?: number;
  segmentCount?: number;
  coverageDescription?: string;
  limitations?: string;
  hasTimestamps?: boolean;
  hasSourceTranscript: boolean;
  resolvedAt?: string;
}

export interface LibraryBackup {
  version: number;
  exportedAt: string;
  categories: Category[];
  textbooks: StudyTextbook[];
}

export interface StudyTextbook {
  id: string;
  videoTitle: string;
  speaker: string;
  duration: string;
  videoId: string;
  videoUrl: string;
  thumbnailUrl: string;
  generatedAt: string;
  executiveSummary: string;
  masterMindmapMermaid: string;
  categoryId?: string;
  dailyProtocol?: DailyTimeProtocol;
  chapters: TextbookChapter[];
  isPreset?: boolean;
  createdAt?: number;
  sourceMetadata?: SourceMetadata;
  isFallback?: boolean;
  fallbackNotice?: string;
}

export type EngineProvider = 'algorithmic' | 'gemini' | 'ollama';

export interface AIEngineConfig {
  provider: EngineProvider;
  apiKey?: string;
  ollamaEndpoint?: string;
  ollamaModel?: string;
}

export interface DiagnosticLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  step: string;
  message: string;
  details?: string;
}

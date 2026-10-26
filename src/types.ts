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
}

export interface TextbookChapter {
  chapterNumber: number;
  title: string;
  timestampRange: string;
  startSeconds: number;
  coreConcepts: string[];
  anchorKeywords: string[];
  mentalModelTitle: string;
  mentalModelExplanation: string;
  mermaidDiagram: string;
  theTrap: {
    title: string;
    description: string;
  };
  actionSteps: string[];
  comparisonTable: {
    headers: string[];
    rows: string[][];
  };
  checkableTakeaways: CheckableTakeaway[];
  quickRecall?: {
    question: string;
    answer: string;
    coreTakeaway: string;
  };
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
}

export interface DailyTimeProtocol {
  title: string;
  subtitle: string;
  dailyAnchorQuote: string;
  blocks: ProtocolTimeBlock[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description?: string;
  color?: string;
  createdAt?: number;
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

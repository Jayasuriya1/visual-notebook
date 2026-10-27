import { z } from 'zod';
import { StudyTextbook, TextbookChapter, CheckableTakeaway, DailyTimeProtocol, Category, LibraryBackup } from '../types';

// Zod schemas for runtime validation
export const CheckableTakeawaySchema = z.object({
  id: z.string().default(() => `takeaway-${Math.random().toString(36).substring(2, 9)}`),
  timestamp: z.string().default('00:00'),
  seconds: z.number().optional(),
  category: z.enum(['Key Insight', 'Aha Moment', 'Action Rule']).default('Key Insight'),
  text: z.string().min(1, 'Takeaway text cannot be empty'),
  checked: z.boolean().default(false),
  penKey: z.enum(['check', 'circle', 'star']).optional(),
  sourceQuote: z.string().optional()
});

export const QuickRecallSchema = z.object({
  question: z.string().min(1, 'Recall question cannot be empty'),
  answer: z.string().min(1, 'Recall answer cannot be empty'),
  coreTakeaway: z.string().default(''),
  explanation: z.string().optional(),
  sourceContext: z.string().optional(),
  userAttempt: z.string().optional(),
  outcome: z.enum(['unattempted', 'correct', 'partially_correct', 'needs_review']).optional(),
  reviewedAt: z.number().optional()
});

export const ComparisonTableSchema = z.object({
  headers: z.array(z.string()).default(['Aspect', 'Contrast / Consideration', 'Evidence-Based Approach']),
  rows: z.array(z.array(z.string())).default([])
});

export const ChapterBlockSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('explanation'),
    title: z.string().optional(),
    text: z.string().min(1),
    sourceQuote: z.string().optional(),
    isSpeakerClaim: z.boolean().default(true)
  }),
  z.object({
    type: z.literal('definition'),
    term: z.string().min(1),
    definition: z.string().min(1),
    context: z.string().optional()
  }),
  z.object({
    type: z.literal('source_evidence'),
    claim: z.string().min(1),
    sourceRange: z.string().optional(),
    exactQuote: z.string().optional(),
    speakerAttribution: z.string().optional(),
    confidence: z.enum(['verified', 'inferred']).default('verified')
  }),
  z.object({
    type: z.literal('diagram'),
    title: z.string().min(1),
    mermaidCode: z.string().min(1),
    textFallback: z.string().optional()
  }),
  z.object({
    type: z.literal('comparison'),
    title: z.string().optional(),
    headers: z.array(z.string()),
    rows: z.array(z.array(z.string()))
  }),
  z.object({
    type: z.literal('caution_trap'),
    title: z.string().min(1),
    trap: z.string().min(1),
    whyItFails: z.string().min(1),
    sourceWarning: z.string().optional()
  }),
  z.object({
    type: z.literal('action_step'),
    step: z.string().min(1),
    rationale: z.string().optional(),
    isDirectSpeakerRecommendation: z.boolean().default(true)
  }),
  z.object({
    type: z.literal('reflection'),
    prompt: z.string().min(1),
    guidedNotes: z.string().optional()
  })
]);

export const TextbookChapterSchema = z.object({
  chapterNumber: z.number().int().positive(),
  title: z.string().min(1, 'Chapter title cannot be empty'),
  timestampRange: z.string().default('00:00 - 15:00'),
  startSeconds: z.number().nonnegative().default(0),
  coreConcepts: z.array(z.string()).default([]),
  anchorKeywords: z.array(z.string()).default([]),
  mentalModelTitle: z.string().optional(),
  mentalModelExplanation: z.string().optional(),
  mermaidDiagram: z.string().optional(),
  theTrap: z.object({
    title: z.string().default('Caution / Consideration'),
    description: z.string().default('')
  }).optional(),
  actionSteps: z.array(z.string()).optional(),
  comparisonTable: ComparisonTableSchema.optional(),
  checkableTakeaways: z.array(CheckableTakeawaySchema).default([]),
  quickRecall: QuickRecallSchema.optional(),
  blocks: z.array(ChapterBlockSchema).optional()
});

export const ProtocolTimeBlockSchema = z.object({
  id: z.string().default(() => `block-${Math.random().toString(36).substring(2, 7)}`),
  timeWindow: z.string().min(1),
  phaseName: z.string().min(1),
  coreConcept: z.string().default(''),
  doThis: z.object({
    action: z.string().min(1),
    tacticalCue: z.string().default('')
  }),
  dontDoThis: z.object({
    trap: z.string().min(1),
    whyTrapDamages: z.string().default('')
  }),
  biologicalWhy: z.string().default(''),
  completed: z.boolean().optional(),
  isDirectSpeakerRecommendation: z.boolean().optional(),
  sourceBasis: z.string().optional(),
  objective: z.string().optional(),
  trigger: z.string().optional(),
  completionCriterion: z.string().optional()
});

export const DailyTimeProtocolSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().default(''),
  dailyAnchorQuote: z.string().default(''),
  blocks: z.array(ProtocolTimeBlockSchema).min(1),
  isHeuristicSuggestion: z.boolean().optional(),
  protocolNotice: z.string().optional()
});

export const SourceMetadataSchema = z.object({
  status: z.enum(['verified_full', 'verified_partial', 'user_supplied', 'curated_summary', 'unavailable', 'failed']),
  retrievalMethod: z.string().optional(),
  wordCount: z.number().optional(),
  characterCount: z.number().optional(),
  segmentCount: z.number().optional(),
  coverageDescription: z.string().optional(),
  limitations: z.string().optional(),
  hasTimestamps: z.boolean().optional(),
  hasSourceTranscript: z.boolean().default(false),
  resolvedAt: z.string().optional()
});

export const StudyTextbookSchema = z.object({
  id: z.string().min(1),
  videoTitle: z.string().min(1),
  speaker: z.string().default('Featured Speaker'),
  duration: z.string().default('Full Lecture'),
  videoId: z.string().default(''),
  videoUrl: z.string().default(''),
  thumbnailUrl: z.string().default(''),
  generatedAt: z.string().default('Standard Edition'),
  executiveSummary: z.string().default(''),
  masterMindmapMermaid: z.string().default('graph TD\nA["Lecture Core"] --> B["Key Concepts"]'),
  categoryId: z.string().optional(),
  dailyProtocol: DailyTimeProtocolSchema.optional(),
  chapters: z.array(TextbookChapterSchema).min(1, 'Textbook must have at least one chapter'),
  isPreset: z.boolean().optional(),
  createdAt: z.number().optional(),
  sourceMetadata: SourceMetadataSchema.optional(),
  isFallback: z.boolean().optional(),
  fallbackNotice: z.string().optional()
});

export const CategorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  icon: z.string().default('📁'),
  description: z.string().optional(),
  color: z.string().optional(),
  createdAt: z.number().optional()
});

export const LibraryBackupSchema = z.object({
  version: z.number().int().min(1),
  exportedAt: z.string(),
  categories: z.array(CategorySchema).default([]),
  textbooks: z.array(StudyTextbookSchema).default([])
});

/**
 * Validates and sanitizes a parsed textbook object.
 * Returns { success: true, textbook } or { success: false, errors, fallbackTextbook }.
 */
export function validateAndSanitizeTextbook(raw: unknown): {
  success: boolean;
  textbook: StudyTextbook;
  errors?: string[];
} {
  const result = StudyTextbookSchema.safeParse(raw);
  if (result.success) {
    return { success: true, textbook: result.data as StudyTextbook };
  }

  const issues = (result.error as any)?.issues || (result.error as any)?.errors || [];
  const errors = issues.map((e: any) => `${e.path ? e.path.join('.') : 'root'}: ${e.message}`);

  // Safe fallback repair if raw is at least an object with basic info
  if (raw && typeof raw === 'object') {
    const r = raw as any;
    const repaired: StudyTextbook = {
      id: typeof r.id === 'string' && r.id ? r.id : `guide-${Date.now()}`,
      videoTitle: typeof r.videoTitle === 'string' && r.videoTitle ? r.videoTitle : 'Educational Masterclass',
      speaker: typeof r.speaker === 'string' ? r.speaker : 'Featured Speaker',
      duration: typeof r.duration === 'string' ? r.duration : 'Standard Duration',
      videoId: typeof r.videoId === 'string' ? r.videoId : '',
      videoUrl: typeof r.videoUrl === 'string' ? r.videoUrl : '',
      thumbnailUrl: typeof r.thumbnailUrl === 'string' ? r.thumbnailUrl : '',
      generatedAt: typeof r.generatedAt === 'string' ? r.generatedAt : 'Sanitized Edition',
      executiveSummary: typeof r.executiveSummary === 'string' ? r.executiveSummary : 'Summary not available.',
      masterMindmapMermaid: typeof r.masterMindmapMermaid === 'string' && r.masterMindmapMermaid ? r.masterMindmapMermaid : 'graph TD\nA["Lecture Overview"] --> B["Details"]',
      categoryId: typeof r.categoryId === 'string' ? r.categoryId : undefined,
      chapters: Array.isArray(r.chapters) && r.chapters.length > 0
        ? r.chapters.map((ch: any, idx: number) => ({
            chapterNumber: typeof ch?.chapterNumber === 'number' ? ch.chapterNumber : idx + 1,
            title: typeof ch?.title === 'string' && ch.title ? ch.title : `Chapter ${idx + 1}`,
            timestampRange: typeof ch?.timestampRange === 'string' ? ch.timestampRange : '00:00 - 15:00',
            startSeconds: typeof ch?.startSeconds === 'number' ? ch.startSeconds : idx * 600,
            coreConcepts: Array.isArray(ch?.coreConcepts) ? ch.coreConcepts.filter((c: any) => typeof c === 'string') : [],
            anchorKeywords: Array.isArray(ch?.anchorKeywords) ? ch.anchorKeywords.filter((k: any) => typeof k === 'string') : [],
            mentalModelTitle: typeof ch?.mentalModelTitle === 'string' ? ch.mentalModelTitle : undefined,
            mentalModelExplanation: typeof ch?.mentalModelExplanation === 'string' ? ch.mentalModelExplanation : undefined,
            mermaidDiagram: typeof ch?.mermaidDiagram === 'string' ? ch.mermaidDiagram : undefined,
            theTrap: ch?.theTrap && typeof ch.theTrap === 'object' ? {
              title: typeof ch.theTrap.title === 'string' ? ch.theTrap.title : 'Caution Point',
              description: typeof ch.theTrap.description === 'string' ? ch.theTrap.description : ''
            } : undefined,
            actionSteps: Array.isArray(ch?.actionSteps) ? ch.actionSteps.filter((s: any) => typeof s === 'string') : undefined,
            comparisonTable: ch?.comparisonTable && Array.isArray(ch.comparisonTable.headers) && Array.isArray(ch.comparisonTable.rows)
              ? ch.comparisonTable
              : undefined,
            checkableTakeaways: Array.isArray(ch?.checkableTakeaways)
              ? ch.checkableTakeaways.map((t: any, tIdx: number) => ({
                  id: typeof t?.id === 'string' ? t.id : `takeaway-${idx + 1}-${tIdx + 1}`,
                  timestamp: typeof t?.timestamp === 'string' ? t.timestamp : '00:00',
                  category: t?.category === 'Aha Moment' || t?.category === 'Action Rule' ? t.category : 'Key Insight',
                  text: typeof t?.text === 'string' ? t.text : 'Important concept',
                  checked: Boolean(t?.checked),
                  penKey: t?.penKey || 'star'
                }))
              : [],
            quickRecall: ch?.quickRecall && typeof ch.quickRecall.question === 'string' ? {
              question: ch.quickRecall.question,
              answer: typeof ch.quickRecall.answer === 'string' ? ch.quickRecall.answer : '',
              coreTakeaway: typeof ch.quickRecall.coreTakeaway === 'string' ? ch.quickRecall.coreTakeaway : '',
              explanation: typeof ch.quickRecall.explanation === 'string' ? ch.quickRecall.explanation : undefined
            } : undefined
          }))
        : [
            {
              chapterNumber: 1,
              title: 'Overview',
              timestampRange: '00:00 - 15:00',
              startSeconds: 0,
              coreConcepts: ['General conceptual introduction.'],
              anchorKeywords: ['Overview'],
              checkableTakeaways: [
                {
                  id: 'takeaway-1-1',
                  timestamp: '00:00',
                  category: 'Key Insight',
                  text: 'Source content overview.',
                  checked: false,
                  penKey: 'star'
                }
              ]
            }
          ],
      dailyProtocol: r.dailyProtocol && typeof r.dailyProtocol === 'object' && Array.isArray(r.dailyProtocol.blocks)
        ? r.dailyProtocol
        : undefined,
      sourceMetadata: r.sourceMetadata && typeof r.sourceMetadata === 'object'
        ? r.sourceMetadata
        : {
            status: 'unavailable',
            retrievalMethod: 'Legacy import / fallback repair',
            wordCount: 0,
            characterCount: 0,
            hasSourceTranscript: false,
            hasTimestamps: false,
            limitations: 'Legacy textbook object repaired without source transcript metadata.'
          },
      isFallback: Boolean(r.isFallback),
      fallbackNotice: typeof r.fallbackNotice === 'string' ? r.fallbackNotice : undefined
    };
    return { success: false, textbook: repaired, errors };
  }

  throw new Error('Invalid textbook data: payload is not an object.');
}

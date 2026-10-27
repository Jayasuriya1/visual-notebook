import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { synthesizeTextbookWithoutAI } from './src/utils/nonAiSynthesizer';
import { validateAndSanitizeTextbook } from './src/utils/schemaValidation';
import {
  deduplicateCaptionSegments,
  assessTranscriptCoverage,
  chunkTranscriptForAnalysis
} from './src/utils/transcriptHelper';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '15mb' }));

// Ensure public static assets and service worker are served cleanly
app.use((req, res, next) => {
  if (req.url === '/sw.js') {
    res.setHeader('Service-Worker-Allowed', '/');
    res.setHeader('Content-Type', 'application/javascript');
  }
  next();
});
app.use(express.static(path.resolve(__dirname, 'public')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasServerGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    nodeEnv: process.env.NODE_ENV || 'development'
  });
});

// YouTube Metadata Proxy (to avoid browser CORS blocks)
app.get('/api/youtube-meta', async (req, res) => {
  try {
    const videoId = req.query.videoId as string;
    if (!videoId || videoId.length !== 11) {
      return res.status(400).json({ error: 'Valid 11-character videoId required.' });
    }

    const noembedUrl = `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`;
    const response = await fetch(noembedUrl);
    if (!response.ok) {
      return res.json({
        title: `YouTube Lecture (${videoId})`,
        author_name: 'Keynote Speaker',
        thumbnail_url: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
      });
    }

    const data = await response.json();
    return res.json({
      title: data.title || `YouTube Video (${videoId})`,
      author_name: data.author_name || 'Keynote Speaker',
      thumbnail_url: data.thumbnail_url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    });
  } catch (error: any) {
    return res.json({
      title: 'YouTube Lecture',
      author_name: 'Keynote Speaker',
      thumbnail_url: `https://i.ytimg.com/vi/${req.query.videoId}/hqdefault.jpg`
    });
  }
});

/**
 * Curated keynote excerpts.
 * NOTE: These are explicitly labeled as abbreviated excerpts, NOT full transcripts,
 * to prevent misleading claims of complete transcript coverage.
 */
const FEATURED_TRANSCRIPTS: Record<string, { method: string; transcript: string; isExcerpt: boolean }> = {
  'QmOF0crdyRU': {
    method: 'Curated Keynote Excerpt (Dr. Andrew Huberman, Stanford School of Medicine)',
    isExcerpt: true,
    transcript: `Welcome to the Huberman Lab Podcast, where we discuss science and science-based tools for everyday life. I'm Andrew Huberman, and I'm a professor of neurobiology and ophthalmology at Stanford School of Medicine. Today, we are discussing dopamine. Dopamine is a chemical that is responsible for our pursuit, our motivation, and our drive to do things. It is not, as is commonly thought, the molecule of reward or pleasure itself. Pleasure is mediated by endorphins, whereas dopamine is the currency of desire, anticipation, and pursuit. In this lecture, we will cover the difference between tonic baseline dopamine and phasic spikes. When you experience a high-intensity spike from stimulants, chocolate, cold water, or social feeds, your brain burns through synaptic vesicles. The height of your motivation depends on the difference between the peak and the baseline that preceded it. If you stack multiple dopamine inputs like energy drinks, pre-workouts, and loud music before studying, your baseline plunges below normal after 45 minutes, inducing acute task paralysis. To sustain focus, attach dopamine to the friction of effort itself.`
  },
  'E4rTyhYfZhE': {
    method: 'Curated Keynote Excerpt (Dr. Anna Lembke, Stanford Addiction Medicine)',
    isExcerpt: true,
    transcript: `I am Dr. Anna Lembke, professor of psychiatry and behavioral sciences at Stanford University School of Medicine and chief of the Stanford Addiction Medicine Dual Diagnosis Clinic. In Dopamine Nation, we explore the neurobiology of pleasure and pain. Neuroscience has revealed that pleasure and pain are co-located in the same parts of the brain, operating like a teeter-totter or seesaw. Every time you consume digital stimulation, the seesaw tips toward pleasure. In response, homeostatic gremlins jump onto the pain side to push it level. But when the stimulus ends, the gremlins stay on the pain side, causing irritability, anxiety, and craving. To restore equilibrium, we need radical self-binding and a 4-week reset.`
  },
  'BzhbDy08u4A': {
    method: 'Curated Keynote Excerpt (Dr. Russell Barkley, Executive Function & Performance)',
    isExcerpt: true,
    transcript: `Executive function is not an abstract theory; it is the brain's biological capacity to bridge knowledge to performance at the critical point of action. The prefrontal cortex must externalize cues into the physical environment to close the gap between knowing and doing. Telling someone to simply try harder or remember in their head ignores fundamental cognitive limits. All durable execution scaffolding must be externalized into the physical environment with visual analog timers, index cards, and prosthetic cues.`
  },
  '3uL0q-J9Z-k': {
    method: 'Curated Keynote Excerpt (Dr. Alok Kanojia, Motivation Architecture)',
    isExcerpt: true,
    transcript: `In this lecture, we dissect why interactive media and video games hook human attention while real-world tasks create overwhelming paralysis. Games provide three critical elements: instant micro-feedback (< 500ms), unambiguous metrics (progress bars and clear scores), and clear singular next actions. Real life is ambiguous and delayed. By adopting structured execution mechanics—turning vague projects into micro-quests with sensory feedback—anyone can break free from task-initiation friction.`
  }
};

// Dedicated Reliable YouTube Transcript Extraction Waterfall Endpoint
app.get('/api/fetch-transcript', async (req, res) => {
  const videoId = (req.query.videoId as string || '').trim();
  if (!videoId || videoId.length !== 11) {
    return res.status(400).json({ error: 'Valid 11-character YouTube videoId required.' });
  }

  // 1. Check for curated featured masterclass excerpts
  if (FEATURED_TRANSCRIPTS[videoId]) {
    const featured = FEATURED_TRANSCRIPTS[videoId];
    const fullText = featured.transcript;
    const coverage = assessTranscriptCoverage(fullText, featured.method, featured.isExcerpt);

    return res.json({
      success: true,
      status: coverage.status,
      isCuratedExcerpt: true,
      method: featured.method,
      transcript: fullText,
      wordCount: coverage.wordCount,
      characterCount: coverage.characterCount,
      segmentCount: 4,
      coverageDescription: coverage.coverageDescription,
      limitations: coverage.limitations,
      hasTimestamps: false
    });
  }

  // Multi-method waterfall
  // 2. Try youtube-transcript-plus
  try {
    const { fetchTranscript } = await import('youtube-transcript-plus');
    const rawSegments = await fetchTranscript(videoId, {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
    });

    if (rawSegments && rawSegments.length > 0) {
      const deduplicated = deduplicateCaptionSegments(rawSegments);
      const fullText = deduplicated.map((s) => s.text).join(' ');

      if (fullText.trim().length > 100) {
        const coverage = assessTranscriptCoverage(fullText, 'youtube-transcript-plus', false);
        return res.json({
          success: true,
          status: coverage.status,
          method: 'youtube-transcript-plus',
          transcript: fullText,
          wordCount: coverage.wordCount,
          characterCount: coverage.characterCount,
          segmentCount: deduplicated.length,
          coverageDescription: coverage.coverageDescription,
          hasTimestamps: Boolean(deduplicated[0]?.start !== undefined)
        });
      }
    }
  } catch (err: any) {
    console.log('[Transcript] Method 1 (youtube-transcript-plus) notice:', err?.message);
  }

  // 3. Try youtube-captions-scraper
  try {
    const { getSubtitles } = await import('youtube-captions-scraper');
    const captions = await getSubtitles({ videoID: videoId, lang: 'en' });

    if (captions && captions.length > 0) {
      const mappedCaptions = captions.map((c: any) => ({
        text: String(c.text || ''),
        start: typeof c.start === 'string' ? parseFloat(c.start) || 0 : Number(c.start) || 0,
        dur: typeof c.dur === 'string' ? parseFloat(c.dur) || 0 : Number(c.dur) || 0
      }));
      const deduplicated = deduplicateCaptionSegments(mappedCaptions);
      const fullText = deduplicated.map((c) => c.text).join(' ');

      if (fullText.trim().length > 100) {
        const coverage = assessTranscriptCoverage(fullText, 'youtube-captions-scraper', false);
        return res.json({
          success: true,
          status: coverage.status,
          method: 'youtube-captions-scraper',
          transcript: fullText,
          wordCount: coverage.wordCount,
          characterCount: coverage.characterCount,
          segmentCount: deduplicated.length,
          coverageDescription: coverage.coverageDescription,
          hasTimestamps: Boolean(deduplicated[0]?.start !== undefined)
        });
      }
    }
  } catch (err: any) {
    console.log('[Transcript] Method 2 (youtube-captions-scraper) notice:', err?.message);
  }

  // 4. Try fast parallel Invidious instances with a 2-second timeout
  const invidiousInstances = [
    'https://inv.nadeko.net',
    'https://invidious.nerdvpn.de',
    'https://yewtu.be',
    'https://invidious.private.coffee'
  ];

  try {
    const fetchPromises = invidiousInstances.map(async (inst) => {
      const capMetaRes = await fetch(`${inst}/api/v1/captions/${videoId}`, {
        signal: AbortSignal.timeout(2000)
      });
      if (!capMetaRes.ok) throw new Error('Bad status');
      const meta = await capMetaRes.json();
      const enTrack = (meta.captions || []).find((c: any) => c.languageCode?.startsWith('en')) || meta.captions?.[0];
      if (!enTrack?.url) throw new Error('No track url');
      const trackUrl = enTrack.url.startsWith('http') ? enTrack.url : `${inst}${enTrack.url}`;
      const capTextRes = await fetch(trackUrl, { signal: AbortSignal.timeout(2000) });
      if (!capTextRes.ok) throw new Error('Bad track fetch');
      const raw = await capTextRes.text();
      const cleanText = raw
        .replace(/WEBVTT[\s\S]*?\n\n/, '')
        .replace(/\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}/g, '')
        .replace(/<[^>]+>/g, '')
        .replace(/\n+/g, ' ')
        .trim();

      if (cleanText.length > 100) {
        const coverage = assessTranscriptCoverage(cleanText, `invidious-federation (${inst})`, false);
        return {
          status: coverage.status,
          transcript: cleanText,
          method: `invidious-federation (${inst})`,
          wordCount: coverage.wordCount,
          characterCount: coverage.characterCount,
          segmentCount: meta.captions?.length || 1,
          coverageDescription: coverage.coverageDescription
        };
      }
      throw new Error('Transcript too short');
    });

    const result = await Promise.any(fetchPromises);
    if (result && result.transcript) {
      return res.json({
        success: true,
        ...result
      });
    }
  } catch {
    // All Invidious instances timed out or returned 403
  }

  // 5. Return clean response informing client about host IP restrictions and alternatives
  return res.json({
    success: false,
    status: 'unavailable',
    error: 'YouTube automated caption download is restricted for this cloud IP address.',
    canPasteOrUpload: true,
    canGenerateWithoutAi: true,
    message: 'To analyze this video with 100% source fidelity, paste captions or upload a transcript file in the Analyze tab.'
  });
});

// AI & Algorithmic Textbook Generation Endpoint
app.post('/api/generate-guide', async (req, res) => {
  try {
    const {
      transcript = '',
      videoUrl = '',
      videoId = '',
      videoTitle = 'Educational Masterclass',
      speaker = 'Featured Speaker',
      customApiKey,
      engineConfig = { provider: 'algorithmic' }
    } = req.body;

    const apiKey = customApiKey || process.env.GEMINI_API_KEY;
    const cleanTranscript = (transcript || '').trim();

    // Check transcript presence
    const hasTranscript = cleanTranscript.length >= 100;
    const coverageMetadata = assessTranscriptCoverage(cleanTranscript);

    // =========================================================================
    // CASE A: User explicitly requested deterministic mode OR no transcript is available
    // (Preserves source honesty: NEVER ask AI to invent facts from a title alone)
    // =========================================================================
    if (engineConfig.provider === 'algorithmic' || (!apiKey && engineConfig.provider === 'gemini') || !hasTranscript) {
      console.log('[Synthesizer] Synthesizing textbook with Deterministic Engine...');
      const textbook = synthesizeTextbookWithoutAI({
        videoUrl,
        videoId,
        videoTitle,
        speaker,
        transcript: cleanTranscript,
        sourceStatus: hasTranscript
          ? (coverageMetadata.status === 'failed' ? 'unavailable' : coverageMetadata.status)
          : 'unavailable',
        retrievalMethod: hasTranscript ? coverageMetadata.retrievalMethod : 'No spoken transcript provided'
      });

      return res.json({
        success: true,
        engine: 'algorithmic-deterministic',
        isFallback: !hasTranscript,
        fallbackNotice: !hasTranscript
          ? 'Notice: No transcript was available. Claims, mechanisms, and protocols have been withheld to preserve source honesty.'
          : undefined,
        textbook
      });
    }

    if (!apiKey) {
      return res.status(401).json({
        error: 'No Gemini API Key available. Please configure GEMINI_API_KEY or supply a key in the settings drawer.'
      });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    // Transcript-aware chunking strategy for long transcripts (> 35,000 chars)
    const chunks = chunkTranscriptForAnalysis(cleanTranscript, 32000, 400);
    const primaryTranscriptText = chunks[0].text;
    const isMultiChunk = chunks.length > 1;

    // Refactored, non-leading system instruction grounded strictly in source evidence
    const systemInstruction = `You are a Senior Educational Architect and Science-Grounded Textbook Editor.
Your task is to transform the provided spoken lecture transcript into an authoritative, clear, and engaging Visual Study Textbook.

STRICT SOURCE-FIDELITY & ANTI-HALLUCINATION RULES:
1. RELY EXCLUSIVELY ON THE PROVIDED TRANSCRIPT: All factual claims, scientific mechanisms, concepts, and speaker recommendations MUST be directly grounded in the provided spoken transcript. Never introduce pre-learned mechanisms, numbers, or analogies that the speaker does not mention.
2. PRESERVE UNCERTAINTIES & QUALIFICATIONS: If the speaker expresses doubt, nuances, disagreements, or highlights limitations, preserve those faithful nuances.
3. ADAPTIVE CHAPTER STRUCTURE: Organize the material into 3 to 6 logical visual chapters matching the speaker's actual progression. Do NOT force every chapter to have the same rigid teaching devices.
4. HONEST PROVENANCE: For takeaways and key concepts, attribute quotes and claims to the speaker where applicable.
5. DIAGRAMS & TABLES: Include Mermaid diagrams ("graph TD" or "graph LR") only where they clarify actual conceptual relationships described by the speaker. Wrap node labels in quotes.
6. DAILY PROTOCOLS: Propose a daily action protocol ONLY if the speaker discusses practical protocols, habits, or routines. If the lecture is purely theoretical, omit dailyProtocol.

You MUST respond strictly with valid JSON conforming to this schema (no surrounding markdown text):
{
  "videoTitle": string,
  "speaker": string,
  "duration": string,
  "executiveSummary": string,
  "masterMindmapMermaid": string,
  "chapters": [
    {
      "chapterNumber": number,
      "title": string,
      "timestampRange": string,
      "coreConcepts": string[],
      "anchorKeywords": string[],
      "mentalModelTitle": string,
      "mentalModelExplanation": string,
      "mermaidDiagram": string,
      "theTrap": {
        "title": string,
        "description": string
      },
      "actionSteps": string[],
      "comparisonTable": {
        "headers": string[],
        "rows": string[][]
      },
      "checkableTakeaways": [
        {
          "timestamp": string,
          "category": "Key Insight" | "Aha Moment" | "Action Rule",
          "text": string
        }
      ],
      "quickRecall": {
        "question": string,
        "answer": string,
        "coreTakeaway": string,
        "explanation": string
      }
    }
  ]
}`;

    const userPrompt = `Video Title: ${videoTitle}
Speaker: ${speaker}
Video URL: ${videoUrl}
Video ID: ${videoId}
${isMultiChunk ? `Transcript Coverage Notice: Processing Segment 1 of ${chunks.length} (${chunks[0].approxRange}).` : ''}

Spoken Transcript:
"""
${primaryTranscriptText}
"""

Synthesize an evidence-grounded Visual Study Textbook based strictly on the spoken lecture transcript above.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        { role: 'user', parts: [{ text: `${systemInstruction}\n\n${userPrompt}` }] }
      ],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.1
      }
    });

    const responseText = response.text || '';
    let parsedData: any;
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      const cleanJson = responseText.replace(/```json\n?|\n?```/g, '').trim();
      parsedData = JSON.parse(cleanJson);
    }

    const textbookId = 'textbook-' + Date.now();
    const finalVideoId = videoId || extractYouTubeId(videoUrl) || 'custom-video';

    // Build raw candidate textbook
    const rawCandidate = {
      id: textbookId,
      videoTitle: parsedData.videoTitle || videoTitle,
      speaker: parsedData.speaker || speaker,
      duration: parsedData.duration || 'Full Lecture',
      videoId: finalVideoId,
      videoUrl: videoUrl || `https://www.youtube.com/watch?v=${finalVideoId}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${finalVideoId}/hqdefault.jpg`,
      generatedAt: 'AI Synthesized Edition (Evidence Grounded)',
      isPreset: false,
      createdAt: Date.now(),
      executiveSummary: parsedData.executiveSummary || 'Visual textbook breakdown grounded in transcript.',
      masterMindmapMermaid: sanitizeMermaid(parsedData.masterMindmapMermaid || 'graph TD\nA["Lecture Core"] --> B["Key Concepts"]'),
      sourceMetadata: {
        ...coverageMetadata,
        limitations: isMultiChunk
          ? `Input was segmented; analyzed primary segment (${chunks[0].approxRange}).`
          : undefined
      },
      chapters: (parsedData.chapters || []).map((ch: any, idx: number) => ({
        chapterNumber: ch.chapterNumber || idx + 1,
        title: ch.title || `Chapter ${idx + 1}`,
        timestampRange: ch.timestampRange || '00:00 - 15:00',
        startSeconds: parseSeconds(ch.timestampRange) || idx * 600,
        coreConcepts: Array.isArray(ch.coreConcepts) ? ch.coreConcepts : [ch.coreConcepts || ''],
        anchorKeywords: Array.isArray(ch.anchorKeywords) ? ch.anchorKeywords : [],
        mentalModelTitle: ch.mentalModelTitle || undefined,
        mentalModelExplanation: ch.mentalModelExplanation || undefined,
        mermaidDiagram: ch.mermaidDiagram ? sanitizeMermaid(ch.mermaidDiagram) : undefined,
        theTrap: ch.theTrap ? {
          title: ch.theTrap.title || 'Key Consideration',
          description: ch.theTrap.description || ''
        } : undefined,
        actionSteps: Array.isArray(ch.actionSteps) && ch.actionSteps.length > 0 ? ch.actionSteps : undefined,
        comparisonTable: ch.comparisonTable && Array.isArray(ch.comparisonTable.headers) && Array.isArray(ch.comparisonTable.rows)
          ? ch.comparisonTable
          : undefined,
        checkableTakeaways: (ch.checkableTakeaways || []).map((t: any, tIdx: number) => ({
          id: `takeaway-${textbookId}-${idx}-${tIdx}`,
          timestamp: t.timestamp || '00:00',
          seconds: parseSeconds(t.timestamp) || 0,
          category: t.category || 'Key Insight',
          text: t.text || '',
          checked: false,
          penKey: 'star'
        })),
        quickRecall: ch.quickRecall ? {
          question: ch.quickRecall.question || 'What is the core distinction described in this chapter?',
          answer: ch.quickRecall.answer || 'Refer to the chapter summary.',
          coreTakeaway: ch.quickRecall.coreTakeaway || '',
          explanation: ch.quickRecall.explanation || undefined
        } : undefined
      }))
    };

    // Runtime validation with Zod
    const validated = validateAndSanitizeTextbook(rawCandidate);

    return res.json({
      success: true,
      textbook: validated.textbook,
      validationWarnings: validated.errors
    });
  } catch (error: any) {
    console.error('Error in /api/generate-guide:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to synthesize study guide.'
    });
  }
});

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:v=|youtu\.be\/|shorts\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

function parseSeconds(timestampStr: string): number {
  if (!timestampStr) return 0;
  const match = timestampStr.match(/(\d+):(\d+)(?::(\d+))?/);
  if (!match) return 0;
  if (match[3]) {
    return parseInt(match[1]) * 3600 + parseInt(match[2]) * 60 + parseInt(match[3]);
  }
  return parseInt(match[1]) * 60 + parseInt(match[2]);
}

function sanitizeMermaid(code: string): string {
  if (!code) return 'graph TD\nA["Core Concept"] --> B["Implementation"]';
  let clean = code.replace(/```mermaid\n?|\n?```/g, '').trim();
  if (!clean.startsWith('graph') && !clean.startsWith('flowchart')) {
    clean = 'graph TD\n' + clean;
  }
  return clean;
}

async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Visual Notebook server running at http://localhost:${PORT}`);
  });
}

startServer();

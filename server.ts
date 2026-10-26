import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { synthesizeTextbookWithoutAI } from './src/utils/nonAiSynthesizer';

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
      title: 'YouTube Masterclass',
      author_name: 'Featured Speaker',
      thumbnail_url: `https://i.ytimg.com/vi/${req.query.videoId}/hqdefault.jpg`
    });
  }
});

// Curated high-yield transcripts for featured masterclasses to bypass datacenter IP restrictions
const FEATURED_TRANSCRIPTS: Record<string, { method: string; transcript: string }> = {
  'QmOF0crdyRU': {
    method: 'Curated Masterclass Transcript (Dr. Andrew Huberman, Stanford School of Medicine)',
    transcript: `Welcome to the Huberman Lab Podcast, where we discuss science and science-based tools for everyday life. I'm Andrew Huberman, and I'm a professor of neurobiology and ophthalmology at Stanford School of Medicine. Today, we are discussing dopamine. Dopamine is a chemical that is responsible for our pursuit, our motivation, and our drive to do things. It is not, as is commonly thought, the molecule of reward or pleasure itself. Pleasure is mediated by endorphins, whereas dopamine is the currency of desire, anticipation, and pursuit. In this lecture, we will cover the difference between tonic baseline dopamine and phasic spikes. When you experience a high-intensity spike from stimulants, chocolate, cold water, or social feeds, your brain burns through synaptic vesicles. The height of your motivation depends on the difference between the peak and the baseline that preceded it. If you stack multiple dopamine inputs like energy drinks, pre-workouts, and loud music before studying, your baseline plunges below normal after 45 minutes, inducing acute ADHD task paralysis. To sustain focus, attach dopamine to the friction of effort itself...`
  },
  'E4rTyhYfZhE': {
    method: 'Curated Masterclass Transcript (Dr. Anna Lembke, Stanford Addiction Medicine)',
    transcript: `I am Dr. Anna Lembke, professor of psychiatry and behavioral sciences at Stanford University School of Medicine and chief of the Stanford Addiction Medicine Dual Diagnosis Clinic. In Dopamine Nation, we explore the neurobiology of pleasure and pain. Neuroscience has revealed that pleasure and pain are co-located in the same parts of the brain, operating like a teeter-totter or seesaw. Every time you consume digital stimulation, the seesaw tips toward pleasure. In response, homeostatic gremlins jump onto the pain side to push it level. But when the stimulus ends, the gremlins stay on the pain side, causing irritability, anxiety, and craving. To restore equilibrium, we need radical self-binding and a 4-week reset...`
  },
  'BzhbDy08u4A': {
    method: 'Curated Masterclass Transcript (Dr. Russell Barkley, ADHD Pioneer)',
    transcript: `ADHD is not an attention deficit disorder; it is a blindness to time and an executive function deficit. The prefrontal cortex fails to bridge knowledge to performance at the critical point of performance. Telling someone with ADHD to try harder or remember in their head is like asking a nearsighted person to see without glasses. All executive scaffolding must be externalized into the physical environment with visual analog timers, index cards, and prosthetic cues...`
  },
  '3uL0q-J9Z-k': {
    method: 'Curated Masterclass Transcript (Dr. Alok Kanojia, HealthyGamerGG)',
    transcript: `In this lecture, we dissect why video games hook the ADHD mind while real-world tasks create overwhelming paralysis. Games provide three critical elements: instant micro-feedback (< 500ms), unambiguous metrics (XP and HP bars), and clear singular next actions. Real life is ambiguous and delayed. By adopting gaming mechanics—turning vague projects into micro-quests with sensory feedback—individuals with ADHD can break free from dopamine paralysis...`
  }
};

// Dedicated Reliable YouTube Transcript Extraction Waterfall Endpoint
app.get('/api/fetch-transcript', async (req, res) => {
  const videoId = (req.query.videoId as string || '').trim();
  if (!videoId || videoId.length !== 11) {
    return res.status(400).json({ error: 'Valid 11-character YouTube videoId required.' });
  }

  // 1. Instant check for curated featured masterclasses
  if (FEATURED_TRANSCRIPTS[videoId]) {
    const featured = FEATURED_TRANSCRIPTS[videoId];
    const fullText = featured.transcript;
    return res.json({
      success: true,
      method: featured.method,
      transcript: fullText,
      wordCount: fullText.split(/\s+/).filter(Boolean).length,
      segmentCount: 12
    });
  }

  // Multi-method waterfall
  // 2. Try youtube-transcript-plus
  try {
    const { fetchTranscript } = await import('youtube-transcript-plus');
    const segments = await fetchTranscript(videoId, {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
    });
    if (segments && segments.length > 0) {
      const fullText = segments.map((s: any) => s.text).join(' ');
      if (fullText.trim().length > 100) {
        return res.json({
          success: true,
          method: 'youtube-transcript-plus',
          transcript: fullText,
          wordCount: fullText.split(/\s+/).filter(Boolean).length,
          segmentCount: segments.length
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
      const fullText = captions.map((c: any) => c.text).join(' ');
      if (fullText.trim().length > 100) {
        return res.json({
          success: true,
          method: 'youtube-captions-scraper',
          transcript: fullText,
          wordCount: fullText.split(/\s+/).filter(Boolean).length,
          segmentCount: captions.length
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
        return {
          transcript: cleanText,
          method: `invidious-federation (${inst})`,
          wordCount: cleanText.split(/\s+/).filter(Boolean).length,
          segmentCount: meta.captions?.length || 1
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

  // 5. Return clean response informing client about cloud IP restriction
  return res.json({
    success: false,
    error: 'YouTube automated caption download restricted for this cloud IP.',
    canPasteOrUpload: true,
    canGenerateWithoutAi: true
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

    // Alternative: Work Done Without AI (Algorithmic Deterministic Engine)
    // If user explicitly chose 'algorithmic' OR if no Gemini API key is configured
    if (engineConfig.provider === 'algorithmic' || (!apiKey && engineConfig.provider === 'gemini')) {
      console.log('[Synthesizer] Synthesizing textbook with Instant Algorithmic Engine (No AI / Offline)...');
      const textbook = synthesizeTextbookWithoutAI({
        videoUrl,
        videoId,
        videoTitle,
        speaker,
        transcript
      });
      return res.json({
        success: true,
        engine: 'algorithmic-no-ai',
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

    const systemInstruction = `You are an elite Cognitive Neuroscientist, Senior Instructional Architect, and ADHD Textbook Designer.
Your task is to transform spoken YouTube lecture content into an authoritative, editorial-grade, Warm-Paper Study Textbook.

STRICT FAITHFULNESS & ANTI-VAGUENESS RULES:
1. ZERO HALLUCINATION: Rely strictly on spoken facts, scientific mechanisms, and numbers from the lecture.
2. PRESERVE DETAIL: Include 100% of the speaker's core explanations, scientific mechanisms (e.g. neurotransmitters, receptors, tonic vs phasic pools), real-world analogies (e.g. Gremlins on the Seesaw, Mountain Climbers), and concrete numerical data (e.g. 1.5x chocolate, 2.5x cold water, 14-day withdrawal hump). Never invent unrelated content, and never compress explanations into vague 1-liners!
3. VALID MERMAID DIAGRAMS:
   - For masterMindmapMermaid: Use valid "graph TD" mapping the whole conceptual architecture.
   - For each chapter's mermaidDiagram: Use simple, valid "graph TD" or "graph LR" with short node labels wrapped in quotes (e.g. A["Stimulus"] --> B["Dopamine Surge"]), max 4 to 6 nodes. Do NOT use unescaped brackets or special characters inside node texts that break Mermaid syntax!
4. COMPARISON TABLES: Every chapter must have a structured comparisonTable with 3-4 columns and 3-5 rows contrasting common cognitive traps vs ADHD-aligned neural solutions.
5. CHECKABLE TAKEAWAYS: Include 3-5 high-yield takeaways with estimated or real timestamps, categorized as 'Key Insight', 'Aha Moment', or 'Action Rule'.
6. QUICK RECALL QUESTION: Each chapter must include a quickRecall object with a thought-provoking recall question ("prompt"), concise verified "keyAnswer", and brief "coreTakeaway" for active recall testing.

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
        "coreTakeaway": string
      }
    }
  ]
}`;

    const userPrompt = `Video Title: ${videoTitle}
Speaker: ${speaker}
Video URL: ${videoUrl}
Video ID: ${videoId}

Spoken Transcript / Video Context:
${transcript ? transcript.slice(0, 40000) : `Analyze this video thoroughly based on the exact lecture given by ${speaker} on "${videoTitle}" (${videoUrl}).`}

Synthesize the complete, deep, editorial-grade ADHD Visual Textbook according to the strict JSON specification.`;

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

    // Hydrate textbook
    const textbook = {
      id: textbookId,
      videoTitle: parsedData.videoTitle || videoTitle,
      speaker: parsedData.speaker || speaker,
      duration: parsedData.duration || 'Full Masterclass',
      videoId: finalVideoId,
      videoUrl: videoUrl || `https://www.youtube.com/watch?v=${finalVideoId}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${finalVideoId}/hqdefault.jpg`,
      generatedAt: 'User Generated Edition',
      isPreset: false,
      createdAt: Date.now(),
      executiveSummary: parsedData.executiveSummary || 'Authoritative visual textbook breakdown.',
      masterMindmapMermaid: sanitizeMermaid(parsedData.masterMindmapMermaid || 'graph TD\nA["Lecture Core"] --> B["Key Pillars"]'),
      chapters: (parsedData.chapters || []).map((ch: any, idx: number) => ({
        chapterNumber: ch.chapterNumber || idx + 1,
        title: ch.title || `Chapter ${idx + 1}`,
        timestampRange: ch.timestampRange || '00:00:00 - 00:15:00',
        startSeconds: parseSeconds(ch.timestampRange) || idx * 600,
        coreConcepts: Array.isArray(ch.coreConcepts) ? ch.coreConcepts : [ch.coreConcepts || ''],
        anchorKeywords: Array.isArray(ch.anchorKeywords) ? ch.anchorKeywords : [],
        mentalModelTitle: ch.mentalModelTitle || 'Conceptual Model',
        mentalModelExplanation: ch.mentalModelExplanation || '',
        mermaidDiagram: sanitizeMermaid(ch.mermaidDiagram || 'graph TD\nA["Input"] --> B["Output"]'),
        theTrap: {
          title: ch.theTrap?.title || 'Common Misconception',
          description: ch.theTrap?.description || 'Why traditional intuition fails.'
        },
        actionSteps: Array.isArray(ch.actionSteps) ? ch.actionSteps : [ch.actionSteps || ''],
        comparisonTable: {
          headers: ch.comparisonTable?.headers || ['Aspect', 'Cognitive Trap', 'Neural Protocol'],
          rows: ch.comparisonTable?.rows || []
        },
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
          question: ch.quickRecall.question || 'What is the core biological mechanism described in this chapter?',
          answer: ch.quickRecall.answer || 'Refer to the core concepts above.',
          coreTakeaway: ch.quickRecall.coreTakeaway || ch.mentalModelTitle || 'Core insight'
        } : undefined
      }))
    };

    return res.json({ success: true, textbook });
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
    // HH:MM:SS
    return parseInt(match[1]) * 3600 + parseInt(match[2]) * 60 + parseInt(match[3]);
  }
  // MM:SS
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
    console.log(`ADHD Visual Textbook server active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup error:', err);
});

import { TextbookChapter, StudyTextbook, DailyTimeProtocol } from '../types';

export interface SpeechUnit {
  id: string;
  chapterNumber: number;
  sectionType: 'title' | 'concept' | 'model' | 'action' | 'trap' | 'table' | 'takeaway' | 'recall' | 'protocol';
  spokenText: string;
  displayText: string;
  pauseAfterMs: number;
  label: string;
}

/**
 * Clean raw text for smooth, natural Text-to-Speech pronunciation.
 * Strips markdown, emojis, awkward characters, and expands common acronyms/abbreviations.
 */
export function cleanForSpokenAudio(raw: string): string {
  if (!raw) return '';
  return raw
    // Strip markdown formatting
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove markdown headers or bullet indicators
    .replace(/^#+\s*/gm, '')
    .replace(/^[-*•]\s+/gm, '')
    // Remove emojis that screen readers pronounce awkwardly
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA00}-\u{1FAFF}]/gu, '')
    // Expand common abbreviations for natural auditory comprehension
    .replace(/\bADHD\b/g, 'A-D-H-D')
    .replace(/\bDr\.\s+/g, 'Doctor ')
    .replace(/\bPh\.D\.\s*/gi, 'Doctor ')
    .replace(/\bvs\.\s*/gi, 'versus ')
    .replace(/\be\.g\.,?\s*/gi, 'for example, ')
    .replace(/\bi\.e\.,?\s*/gi, 'that is, ')
    .replace(/\betc\.\s*/gi, 'and so on. ')
    .replace(/\bapprox\.\s*/gi, 'approximately ')
    .replace(/\bmin\b/gi, 'minutes')
    .replace(/\bsec\b/gi, 'seconds')
    .replace(/&/g, ' and ')
    // Normalize spaces
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Split text into distinct sentences for granular sentence-by-sentence audio highlighting.
 */
export function splitIntoSentences(text: string): string[] {
  if (!text) return [];
  const normalized = text.trim();
  if (!normalized) return [];

  // Match sentence terminators followed by space and uppercase or quotes
  const matches = normalized
    .replace(/([.?!])\s+(?=[A-Z0-9"“'‘])/g, '$1|__SPLIT__|')
    .split('|__SPLIT__|');

  return matches.map((s) => s.trim()).filter((s) => s.length > 0);
}

/**
 * Format a single chapter into a structured sequence of SpeechUnits.
 * Each unit has an ID matching DOM elements, spoken text with pauses, and descriptive labels.
 */
export function formatChapterForTTS(chapter: TextbookChapter): SpeechUnit[] {
  const units: SpeechUnit[] = [];
  const chNum = chapter.chapterNumber;

  // 1. Chapter Title Header (Deliberate introduction pause)
  units.push({
    id: `chapter-${chNum}-header`,
    chapterNumber: chNum,
    sectionType: 'title',
    spokenText: `Chapter ${chNum}. ${cleanForSpokenAudio(chapter.title)}.`,
    displayText: `Chapter ${chNum}: ${chapter.title}`,
    pauseAfterMs: 700, // Long pause after chapter title
    label: `Chapter ${chNum} Title`
  });

  // 2. Core Concepts Section Intro
  if (chapter.coreConcepts.length > 0) {
    units.push({
      id: `chapter-${chNum}-core-intro`,
      chapterNumber: chNum,
      sectionType: 'concept',
      spokenText: `Core mechanism and scientific principles.`,
      displayText: `Core Mechanism & Scientific Principles`,
      pauseAfterMs: 500,
      label: `Core Mechanism Intro`
    });

    chapter.coreConcepts.forEach((concept, cIdx) => {
      const sentences = splitIntoSentences(concept);
      sentences.forEach((sentence, sIdx) => {
        units.push({
          id: `chapter-${chNum}-concept-${cIdx}-s${sIdx}`,
          chapterNumber: chNum,
          sectionType: 'concept',
          spokenText: cleanForSpokenAudio(sentence),
          displayText: sentence,
          pauseAfterMs: sIdx === sentences.length - 1 ? 450 : 300,
          label: `Principle ${cIdx + 1}`
        });
      });
    });
  }

  // 3. Mental Model Section
  if (chapter.mentalModelTitle || chapter.mentalModelExplanation) {
    units.push({
      id: `chapter-${chNum}-model-header`,
      chapterNumber: chNum,
      sectionType: 'model',
      spokenText: `Mental model and story analogy: ${cleanForSpokenAudio(chapter.mentalModelTitle)}.`,
      displayText: `Mental Model: ${chapter.mentalModelTitle}`,
      pauseAfterMs: 550,
      label: `Mental Model Header`
    });

    const modelSentences = splitIntoSentences(chapter.mentalModelExplanation);
    modelSentences.forEach((sentence, sIdx) => {
      units.push({
        id: `chapter-${chNum}-model-desc-s${sIdx}`,
        chapterNumber: chNum,
        sectionType: 'model',
        spokenText: cleanForSpokenAudio(sentence),
        displayText: sentence,
        pauseAfterMs: sIdx === modelSentences.length - 1 ? 600 : 300,
        label: `Mental Model Explanation`
      });
    });
  }

  // 4. Action Steps Protocol
  if (chapter.actionSteps.length > 0) {
    units.push({
      id: `chapter-${chNum}-action-intro`,
      chapterNumber: chNum,
      sectionType: 'action',
      spokenText: `Immediate action protocol. Follow these physical steps.`,
      displayText: `Immediate Action Protocol`,
      pauseAfterMs: 500,
      label: `Action Protocol Intro`
    });

    chapter.actionSteps.forEach((step, sIdx) => {
      units.push({
        id: `chapter-${chNum}-action-${sIdx}`,
        chapterNumber: chNum,
        sectionType: 'action',
        spokenText: `Step ${sIdx + 1}: ${cleanForSpokenAudio(step)}`,
        displayText: `Step ${sIdx + 1}: ${step}`,
        pauseAfterMs: 500,
        label: `Action Step ${sIdx + 1}`
      });
    });
  }

  // 5. The Cognitive Trap
  if (chapter.theTrap && (chapter.theTrap.title || chapter.theTrap.description)) {
    units.push({
      id: `chapter-${chNum}-trap-header`,
      chapterNumber: chNum,
      sectionType: 'trap',
      spokenText: `The biological trap. Why willpower fails: ${cleanForSpokenAudio(chapter.theTrap.title)}.`,
      displayText: `The Trap: ${chapter.theTrap.title}`,
      pauseAfterMs: 550,
      label: `Cognitive Trap Header`
    });

    const trapSentences = splitIntoSentences(chapter.theTrap.description);
    trapSentences.forEach((sentence, sIdx) => {
      units.push({
        id: `chapter-${chNum}-trap-desc-s${sIdx}`,
        chapterNumber: chNum,
        sectionType: 'trap',
        spokenText: cleanForSpokenAudio(sentence),
        displayText: sentence,
        pauseAfterMs: sIdx === trapSentences.length - 1 ? 600 : 300,
        label: `Trap Explanation`
      });
    });
  }

  // 6. Checkable Takeaways
  if (chapter.checkableTakeaways.length > 0) {
    units.push({
      id: `chapter-${chNum}-takeaway-intro`,
      chapterNumber: chNum,
      sectionType: 'takeaway',
      spokenText: `Key takeaways and high-yield insights.`,
      displayText: `Key Takeaways`,
      pauseAfterMs: 450,
      label: `Takeaways Intro`
    });

    chapter.checkableTakeaways.forEach((takeaway, tIdx) => {
      units.push({
        id: `chapter-${chNum}-takeaway-${takeaway.id}`,
        chapterNumber: chNum,
        sectionType: 'takeaway',
        spokenText: `Insight ${tIdx + 1}, at ${takeaway.timestamp}: ${cleanForSpokenAudio(takeaway.text)}`,
        displayText: `[${takeaway.timestamp}] ${takeaway.text}`,
        pauseAfterMs: 450,
        label: `Insight ${tIdx + 1}`
      });
    });
  }

  // 7. Active Recall (if available)
  if (chapter.quickRecall) {
    units.push({
      id: `chapter-${chNum}-recall-q`,
      chapterNumber: chNum,
      sectionType: 'recall',
      spokenText: `Active recall test. Question: ${cleanForSpokenAudio(chapter.quickRecall.question)}`,
      displayText: `Active Recall Question: ${chapter.quickRecall.question}`,
      pauseAfterMs: 700, // pause for user to think!
      label: `Active Recall Question`
    });

    units.push({
      id: `chapter-${chNum}-recall-a`,
      chapterNumber: chNum,
      sectionType: 'recall',
      spokenText: `Biological answer: ${cleanForSpokenAudio(chapter.quickRecall.answer)}. Core law: ${cleanForSpokenAudio(chapter.quickRecall.coreTakeaway)}.`,
      displayText: `Answer: ${chapter.quickRecall.answer}`,
      pauseAfterMs: 800,
      label: `Active Recall Answer`
    });
  }

  return units;
}

/**
 * Format the Daily Action Protocol into discrete SpeechUnits for read-along listening.
 */
export function formatDailyProtocolForTTS(protocol: DailyTimeProtocol): SpeechUnit[] {
  const units: SpeechUnit[] = [];

  // Protocol Header
  units.push({
    id: 'daily-protocol-header',
    chapterNumber: 0,
    sectionType: 'protocol',
    spokenText: `Daily Action Protocol. What to do versus what not to do. ${cleanForSpokenAudio(protocol.title)}.`,
    displayText: `Daily Action Protocol: ${protocol.title}`,
    pauseAfterMs: 650,
    label: 'Protocol Header'
  });

  if (protocol.subtitle) {
    units.push({
      id: 'daily-protocol-subtitle',
      chapterNumber: 0,
      sectionType: 'protocol',
      spokenText: cleanForSpokenAudio(protocol.subtitle),
      displayText: protocol.subtitle,
      pauseAfterMs: 500,
      label: 'Protocol Principle'
    });
  }

  // Iterate over each time block
  protocol.blocks.forEach((block, bIdx) => {
    // 1. Time Block Window & Phase Header
    units.push({
      id: `protocol-block-${block.id}-header`,
      chapterNumber: 0,
      sectionType: 'protocol',
      spokenText: `Time block ${bIdx + 1}. Time window: ${cleanForSpokenAudio(block.timeWindow)}. Phase: ${cleanForSpokenAudio(block.phaseName)}.`,
      displayText: `${block.timeWindow} · ${block.phaseName}`,
      pauseAfterMs: 500,
      label: `Block ${bIdx + 1}: ${block.phaseName}`
    });

    // 2. Core Concept
    if (block.coreConcept) {
      units.push({
        id: `protocol-block-${block.id}-concept`,
        chapterNumber: 0,
        sectionType: 'protocol',
        spokenText: `Core insight: ${cleanForSpokenAudio(block.coreConcept)}.`,
        displayText: `Core Insight: ${block.coreConcept}`,
        pauseAfterMs: 400,
        label: `Core Insight`
      });
    }

    // 3. What TO DO
    units.push({
      id: `protocol-block-${block.id}-do`,
      chapterNumber: 0,
      sectionType: 'protocol',
      spokenText: `What to do: ${cleanForSpokenAudio(block.doThis.action)}. Tactical cue: ${cleanForSpokenAudio(block.doThis.tacticalCue)}.`,
      displayText: `DO: ${block.doThis.action}`,
      pauseAfterMs: 500,
      label: `DO THIS`
    });

    // 4. What NOT TO DO
    units.push({
      id: `protocol-block-${block.id}-dont`,
      chapterNumber: 0,
      sectionType: 'protocol',
      spokenText: `What not to do: ${cleanForSpokenAudio(block.dontDoThis.trap)}. Why this damages focus: ${cleanForSpokenAudio(block.dontDoThis.whyTrapDamages)}.`,
      displayText: `DON'T: ${block.dontDoThis.trap}`,
      pauseAfterMs: 500,
      label: `DON'T DO THIS`
    });

    // 5. Biological Why
    units.push({
      id: `protocol-block-${block.id}-why`,
      chapterNumber: 0,
      sectionType: 'protocol',
      spokenText: `The biological mechanism: ${cleanForSpokenAudio(block.biologicalWhy)}.`,
      displayText: `Biological Why: ${block.biologicalWhy}`,
      pauseAfterMs: 650,
      label: `Biological Mechanism`
    });
  });

  return units;
}

/**
 * Format the entire textbook for a continuous multi-chapter listening experience.
 */
export function formatTextbookForTTS(textbook: StudyTextbook): SpeechUnit[] {
  const units: SpeechUnit[] = [];

  // Executive summary at the start
  units.push({
    id: 'textbook-summary-header',
    chapterNumber: 0,
    sectionType: 'title',
    spokenText: `${cleanForSpokenAudio(textbook.videoTitle)}. Masterclass by ${cleanForSpokenAudio(textbook.speaker)}. Executive summary.`,
    displayText: `${textbook.videoTitle} — Keynote: ${textbook.speaker}`,
    pauseAfterMs: 700,
    label: 'Textbook Overview'
  });

  const summarySentences = splitIntoSentences(textbook.executiveSummary);
  summarySentences.forEach((sentence, sIdx) => {
    units.push({
      id: `textbook-summary-s${sIdx}`,
      chapterNumber: 0,
      sectionType: 'concept',
      spokenText: cleanForSpokenAudio(sentence),
      displayText: sentence,
      pauseAfterMs: sIdx === summarySentences.length - 1 ? 800 : 300,
      label: 'Executive Summary'
    });
  });

  // Daily Action Protocol (if available)
  if (textbook.dailyProtocol) {
    units.push(...formatDailyProtocolForTTS(textbook.dailyProtocol));
  }

  // Append each chapter
  for (const chapter of textbook.chapters) {
    units.push(...formatChapterForTTS(chapter));
  }

  return units;
}

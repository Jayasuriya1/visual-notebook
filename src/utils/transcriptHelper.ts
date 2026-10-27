import { SourceMetadata, TranscriptStatus } from '../types';

export interface CaptionSegment {
  text: string;
  start?: number;
  duration?: number;
}

/**
 * Deduplicates adjacent or rolling caption lines commonly emitted by automated YouTube caption tracks
 * without mangling deliberate repeated statements.
 */
export function deduplicateCaptionSegments(segments: CaptionSegment[]): CaptionSegment[] {
  if (!segments || segments.length === 0) return [];

  const deduplicated: CaptionSegment[] = [];
  let previousText = '';

  for (const seg of segments) {
    const cleanText = (seg.text || '')
      .replace(/<[^>]+>/g, '') // remove HTML/XML formatting tags
      .replace(/&amp;/g, '&')
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) continue;

    // Direct identical repetition of immediate previous line
    if (cleanText.toLowerCase() === previousText.toLowerCase()) {
      continue;
    }

    // Check for rolling caption overlap (e.g., prev: "in this lecture we", curr: "we will discuss dopamine")
    if (previousText) {
      const prevWords = previousText.split(' ');
      const currWords = cleanText.split(' ');

      // If current line begins with the tail of previous line, strip the overlap
      const maxOverlap = Math.min(prevWords.length, currWords.length, 6);
      let foundOverlap = 0;

      for (let len = maxOverlap; len >= 2; len--) {
        const prevTail = prevWords.slice(-len).join(' ').toLowerCase();
        const currHead = currWords.slice(0, len).join(' ').toLowerCase();
        if (prevTail === currHead) {
          foundOverlap = len;
          break;
        }
      }

      if (foundOverlap > 0) {
        const trimmed = currWords.slice(foundOverlap).join(' ').trim();
        if (trimmed) {
          deduplicated.push({
            text: trimmed,
            start: seg.start,
            duration: seg.duration
          });
          previousText = cleanText;
          continue;
        } else {
          // Entire line was redundant overlap
          continue;
        }
      }
    }

    deduplicated.push({
      text: cleanText,
      start: seg.start,
      duration: seg.duration
    });
    previousText = cleanText;
  }

  return deduplicated;
}

/**
 * Assesses coverage, word count, timestamp presence, and limitations of a transcript
 */
export function assessTranscriptCoverage(
  transcript: string,
  declaredMethodOrIsCurated?: string | boolean,
  isCuratedExcerpt?: boolean
): SourceMetadata {
  const text = (transcript || '').trim();
  const wordCount = text ? text.split(/\s+/).filter(Boolean).length : 0;
  const characterCount = text.length;

  const isCurated =
    typeof declaredMethodOrIsCurated === 'boolean'
      ? declaredMethodOrIsCurated
      : Boolean(isCuratedExcerpt);
  const declaredMethod =
    typeof declaredMethodOrIsCurated === 'string'
      ? declaredMethodOrIsCurated
      : undefined;

  if (characterCount === 0 || (!isCurated && characterCount < 60)) {
    return {
      status: 'unavailable',
      retrievalMethod: declaredMethod || 'None',
      wordCount: 0,
      characterCount: 0,
      hasSourceTranscript: false,
      hasTimestamps: false,
      limitations:
        'Spoken transcript was not available. Content is restricted to verified video title and speaker metadata.'
    };
  }

  if (isCurated) {
    return {
      status: 'curated_summary',
      retrievalMethod: declaredMethod || 'Curated Keynote Excerpt',
      wordCount,
      characterCount,
      hasSourceTranscript: true,
      hasTimestamps: false,
      coverageDescription: `Curated excerpt of core themes (~${wordCount.toLocaleString()} words). Not a verbatim full-length transcript.`,
      limitations:
        'This is an abbreviated keynote excerpt covering primary concepts, not a full verbatim transcript of the entire recording.'
    };
  }

  // Detect timestamp patterns like 00:00 or 12:34
  const timestampMatches = text.match(/\b\d{1,2}:\d{2}(?::\d{2})?\b/g);
  const hasTimestamps = Boolean(timestampMatches && timestampMatches.length >= 2);

  // Status threshold
  let status: TranscriptStatus = 'verified_partial';
  if (wordCount >= 2500) {
    status = 'verified_full';
  } else if (wordCount >= 400) {
    status = 'verified_partial';
  } else {
    status = 'user_supplied';
  }

  return {
    status,
    retrievalMethod: declaredMethod || (hasTimestamps ? 'Timestamped captions' : 'Spoken transcript'),
    wordCount,
    characterCount,
    hasSourceTranscript: true,
    hasTimestamps,
    coverageDescription: `${wordCount.toLocaleString()} words analyzed${hasTimestamps ? ' with verified timestamps' : ''}.`
  };
}

/**
 * Splits long transcripts into structured logical segments for multi-chunk synthesis or coverage analysis
 */
export function chunkTranscriptForAnalysis(
  transcript: string,
  maxCharsPerChunk = 25000,
  overlapChars = 500
): { index: number; text: string; approxRange: string }[] {
  const text = transcript.trim();
  if (text.length <= maxCharsPerChunk) {
    return [{ index: 0, text, approxRange: 'Entire transcript' }];
  }

  const chunks: { index: number; text: string; approxRange: string }[] = [];
  let startIndex = 0;
  let chunkIdx = 0;

  while (startIndex < text.length) {
    let endIndex = Math.min(startIndex + maxCharsPerChunk, text.length);

    // If not at the end of text, find the nearest sentence or paragraph break
    if (endIndex < text.length) {
      const naturalBreak = text.lastIndexOf('\n\n', endIndex);
      if (naturalBreak > startIndex + maxCharsPerChunk * 0.7) {
        endIndex = naturalBreak;
      } else {
        const sentenceBreak = text.lastIndexOf('. ', endIndex);
        if (sentenceBreak > startIndex + maxCharsPerChunk * 0.7) {
          endIndex = sentenceBreak + 1;
        }
      }
    }

    const chunkText = text.slice(startIndex, endIndex).trim();
    const startPct = Math.round((startIndex / text.length) * 100);
    const endPct = Math.round((endIndex / text.length) * 100);

    chunks.push({
      index: chunkIdx,
      text: chunkText,
      approxRange: `${startPct}%–${endPct}% of lecture`
    });

    if (endIndex >= text.length) break;

    startIndex = Math.max(endIndex - overlapChars, startIndex + 1);
    chunkIdx++;
  }

  return chunks;
}

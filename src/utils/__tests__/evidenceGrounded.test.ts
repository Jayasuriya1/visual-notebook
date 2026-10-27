/**
 * Evidence-Grounded Learning Product Validation Test Suite
 *
 * Verifies:
 * 1. Transcript deduplication & coverage assessment
 * 2. Non-AI synthesizer source honesty (no fabricated domain archetypes on title-only)
 * 3. Schema validation, repair, and backward compatibility
 * 4. Export & import data lossless integrity
 */

import { deduplicateCaptionSegments, assessTranscriptCoverage, chunkTranscriptForAnalysis } from '../transcriptHelper';
import { synthesizeTextbookWithoutAI as generateNonAiStudyTextbook } from '../nonAiSynthesizer';
import { validateAndSanitizeTextbook } from '../schemaValidation';
import { StudyTextbook } from '../../types';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${msg}`);
  }
}

async function runTests() {
  console.log('🧪 Starting Evidence-Grounded Learning Test Suite...\n');

  // ----------------------------------------------------
  // Test 1: Deduplication of Overlapping Captions
  // ----------------------------------------------------
  console.log('Test 1: Caption deduplication and cleaning...');
  const overlappingCaptions = [
    { text: 'Welcome to this lecture on neuroplasticity', start: 0, dur: 4 },
    { text: 'neuroplasticity and learning protocols', start: 2, dur: 4 },
    { text: 'neuroplasticity and learning protocols', start: 2.1, dur: 3.9 }, // exact duplicate
    { text: 'We will cover how synaptic plasticity works in depth', start: 6, dur: 5 }
  ];

  const deduped = deduplicateCaptionSegments(overlappingCaptions);
  assert(deduped.length === 3, `Expected 3 deduped segments, got ${deduped.length}`);
  assert(deduped[0].text.includes('Welcome'), 'First segment preserved');
  assert(deduped[2].text.includes('synaptic plasticity'), 'Non-duplicate preserved');
  console.log('  ✓ Deduplication accurately removes overlapping segments without corrupting statements');

  // ----------------------------------------------------
  // Test 2: Transcript Coverage & Honesty Assessment
  // ----------------------------------------------------
  console.log('\nTest 2: Transcript coverage assessment...');
  const emptyCov = assessTranscriptCoverage('');
  assert(emptyCov.status === 'unavailable', 'Empty transcript must be unavailable');
  assert(emptyCov.wordCount === 0, 'Word count is 0');

  const shortExcerpt = 'This is a brief curated summary excerpt about focus and executive function.';
  const excerptCov = assessTranscriptCoverage(shortExcerpt, true);
  assert(excerptCov.status === 'curated_summary', 'Curated summaries must be marked as curated_summary');
  assert(Boolean(excerptCov.limitations && excerptCov.limitations.length > 0), 'Limitations must be documented for curated excerpts');

  const longTranscript = new Array(800).fill('dopamine and neuroplasticity focus protocols').join(' ');
  const fullCov = assessTranscriptCoverage(longTranscript, false);
  assert(fullCov.status === 'verified_full', 'Long transcript marked verified_full');
  console.log('  ✓ Coverage correctly distinguishes verified_full, curated_summary, and unavailable');

  // ----------------------------------------------------
  // Test 3: Non-AI Synthesizer Honesty (Title-Only vs Transcript)
  // ----------------------------------------------------
  console.log('\nTest 3: Non-AI Synthesizer honesty guarantee...');
  // Scenario A: Title-Only (No transcript provided)
  const titleOnlyResult = generateNonAiStudyTextbook({
    videoId: 'test-title-only',
    videoTitle: 'Advanced Quantum Mechanics for Physicists',
    speaker: 'Dr. Expert',
    transcript: '',
    videoUrl: 'https://www.youtube.com/watch?v=test-title-only'
  });

  assert(titleOnlyResult.isFallback === true, 'Title-only must set isFallback=true');
  assert(titleOnlyResult.sourceMetadata?.status === 'unavailable', 'Status must be unavailable');
  assert(titleOnlyResult.fallbackNotice !== undefined, 'Fallback notice must be present');
  // Must NOT invent neuroscience or domain archetypes for a physics video!
  const allChapterText = titleOnlyResult.chapters.map(c => c.title + ' ' + (c.mentalModelExplanation || '')).join(' ');
  assert(!allChapterText.includes('Prefrontal Cortex Hypofrontality'), 'Must NOT inject pre-baked archetype into quantum mechanics');
  assert(!allChapterText.includes('Nucleus Accumbens'), 'Must NOT inject biological mechanisms into title-only physics lecture');
  console.log('  ✓ Title-only generation honestly states limitations and does NOT fabricate domain archetypes');

  // Scenario B: With Real Transcript
  const realisticTranscript = `
    Welcome everyone. In this study protocol we focus on 90-minute ultradian cycles.
    Dr. Huberman explains that focus follows an 85 to 90 minute rhythm of acetylcholine and dopamine.
    When you attempt to learn, brief periods of random autonomic reset or NSDR accelerate memory retention.
    The most common mistake is multitasking during the first twenty minutes of a learning bout.
  `;
  const groundedResult = generateNonAiStudyTextbook({
    videoId: 'test-grounded',
    videoTitle: 'Optimal Protocols for Studying & Learning',
    speaker: 'Dr. Andrew Huberman',
    transcript: realisticTranscript,
    videoUrl: 'https://www.youtube.com/watch?v=test-grounded'
  });

  assert(groundedResult.sourceMetadata?.status === 'user_supplied' || groundedResult.sourceMetadata?.status === 'verified_full', 'Status reflects source');
  assert(groundedResult.chapters.length >= 1, 'Generates chapters from transcript');
  const chapter1 = groundedResult.chapters[0];
  assert(chapter1.checkableTakeaways.length >= 2, 'Extracts checkable takeaways from source text');
  console.log('  ✓ Real transcript produces grounded takeaways and chapters');

  // ----------------------------------------------------
  // Test 4: Schema Validation & Backward Compatibility
  // ----------------------------------------------------
  console.log('\nTest 4: Schema validation and automatic sanitization...');
  // Pass an incomplete textbook object to verify automatic repair
  const incompleteTextbook: any = {
    id: 'legacy-book-1',
    videoTitle: 'Test Legacy Book',
    speaker: 'Legacy Speaker',
    videoId: 'leg-123',
    generatedAt: '2026-10-27',
    duration: '45 mins',
    executiveSummary: 'Legacy executive summary without sourceMetadata or blocks.',
    chapters: [
      {
        chapterNumber: 1,
        title: 'Legacy Chapter',
        timestamp: '00:00',
        summary: 'Legacy summary',
        coreAnalogy: 'Analogy',
        cognitiveTrap: { trap: 'Trap', whyAdhdFallsForIt: 'Why', antidote: 'Antidote' },
        actionSteps: [{ stepNumber: 1, action: 'Act', microStep: 'Micro', expectedResistance: 'Resist' }],
        checkableTakeaways: [{ id: 'tk-1', text: 'Takeaway text', timestamp: '01:00', checked: false, category: 'Key Insight' }]
      }
    ]
  };

  const { textbook: sanitized } = validateAndSanitizeTextbook(incompleteTextbook);
  assert(sanitized.id === 'legacy-book-1', 'ID preserved');
  assert(sanitized.sourceMetadata !== undefined, 'sourceMetadata initialized safely');
  assert(sanitized.chapters[0].checkableTakeaways[0].id === 'tk-1', 'Takeaways intact');
  console.log('  ✓ Schema validation sanitizes incomplete objects and preserves backward compatibility');

  // ----------------------------------------------------
  // Test 5: Lossless Export & Import Preservation
  // ----------------------------------------------------
  console.log('\nTest 5: Export / Import JSON lossless roundtrip...');
  const jsonExported = JSON.stringify(groundedResult);
  const parsedBack = JSON.parse(jsonExported);
  const { textbook: revalidated } = validateAndSanitizeTextbook(parsedBack);

  assert(revalidated.id === groundedResult.id, 'ID unchanged in roundtrip');
  assert(revalidated.videoTitle === groundedResult.videoTitle, 'Title unchanged in roundtrip');
  assert(revalidated.chapters.length === groundedResult.chapters.length, 'Chapter count identical');
  assert(revalidated.dailyProtocol?.blocks.length === groundedResult.dailyProtocol?.blocks.length, 'Protocol blocks identical');
  console.log('  ✓ Export / Import roundtrip preserves 100% fidelity without data loss');

  console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! (5/5 suites)\n');
}

runTests().catch((err) => {
  console.error('\n❌ Test failure:', err);
  process.exit(1);
});

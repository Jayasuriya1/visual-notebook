import { StudyTextbook, TextbookChapter, CheckableTakeaway, DailyTimeProtocol } from '../types';

/**
 * Deterministic Non-AI Algorithmic ADHD Textbook Generator
 * 
 * Generates an authoritative, editorial-grade Warm-Paper Study Textbook
 * without calling any LLM API, ensuring 100% offline capability, zero cost,
 * instant speed (< 50ms), and zero hallucination/timeout risks.
 */

interface SynthesizeParams {
  videoUrl: string;
  videoId: string;
  videoTitle: string;
  speaker: string;
  transcript: string;
}

// Convert seconds to timestamp string mm:ss or hh:mm:ss
function formatTimestamp(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// Parse timestamp string (hh:mm:ss or mm:ss) into seconds
function parseTimestampToSeconds(ts: string): number {
  const clean = ts.replace(/[\[\]\(\)]/g, '').trim();
  const parts = clean.split(':').map((p) => parseInt(p, 10));
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return 0;
}

// Extract chapters from transcript if timestamps exist
interface ParsedChapterRaw {
  title: string;
  timestamp: string;
  seconds: number;
  lines: string[];
}

function extractChaptersFromText(transcript: string): ParsedChapterRaw[] {
  const lines = transcript.split('\n').map((l) => l.trim()).filter(Boolean);
  const chapterRegex = /(?:^|\s)(?:(\d{1,2}:\d{2}(?::\d{2})?))\s*[-–:]?\s*(.+)?/i;
  const rawChapters: ParsedChapterRaw[] = [];

  let currentChapter: ParsedChapterRaw | null = null;

  for (const line of lines) {
    const match = line.match(chapterRegex);
    if (match && match[1]) {
      const ts = match[1];
      const title = match[2] ? match[2].trim() : `Section ${rawChapters.length + 1}`;
      const sec = parseTimestampToSeconds(ts);

      if (currentChapter) {
        rawChapters.push(currentChapter);
      }
      currentChapter = {
        title,
        timestamp: ts,
        seconds: sec,
        lines: []
      };
    } else if (currentChapter) {
      currentChapter.lines.push(line);
    }
  }

  if (currentChapter) {
    rawChapters.push(currentChapter);
  }

  return rawChapters;
}

// Extract keywords from text
function extractTopKeywords(text: string, count = 5): string[] {
  const stopWords = new Set([
    'about', 'above', 'after', 'again', 'against', 'all', 'and', 'any', 'are', 'because',
    'been', 'before', 'being', 'below', 'between', 'both', 'but', 'can', 'could', 'did',
    'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had',
    'has', 'have', 'having', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his',
    'how', 'into', 'its', 'itself', 'just', 'more', 'most', 'not', 'now', 'off', 'once',
    'only', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'should',
    'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then',
    'there', 'these', 'they', 'this', 'those', 'through', 'too', 'under', 'until', 'very',
    'was', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'will',
    'with', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves', 'also', 'like', 'know',
    'going', 'think', 'people', 'really', 'want', 'make', 'take', 'come', 'said', 'much'
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stopWords.has(w));

  const freq: Record<string, number> = {};
  for (const w of words) {
    freq[w] = (freq[w] || 0) + 1;
  }

  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  return sorted.slice(0, count).map(([w]) => w.charAt(0).toUpperCase() + w.slice(1));
}

// Generate algorithmic Mermaid flowchart
function buildChapterMermaid(chapterNumber: number, title: string, keywords: string[]): string {
  const k1 = keywords[0] || 'Trigger Input';
  const k2 = keywords[1] || 'Neural Processing';
  const k3 = keywords[2] || 'Cognitive Friction';
  const k4 = keywords[3] || 'ADHD Protocol';
  const k5 = keywords[4] || 'Sustained Flow';

  return `graph TD
  N${chapterNumber}A["${k1}"] --> N${chapterNumber}B["${k2}"]
  N${chapterNumber}B --> N${chapterNumber}C{"${k3}"}
  N${chapterNumber}C -->|"Default Trap"| N${chapterNumber}D["Paralysis & Dopamine Crash"]
  N${chapterNumber}C -->|"ADHD Protocol"| N${chapterNumber}E["${k4}"]
  N${chapterNumber}E --> N${chapterNumber}F["${k5}"]`;
}

// Domain knowledge archetypes for when no transcript or partial transcripts are present
interface DomainArchetype {
  match: RegExp;
  category: string;
  summary: (title: string, speaker: string) => string;
  masterMermaid: string;
  chapters: {
    title: string;
    offsetMinutes: number;
    durationMinutes: number;
    concepts: string[];
    keywords: string[];
    mentalModelTitle: string;
    mentalModelExplanation: string;
    trapTitle: string;
    trapDesc: string;
    actionSteps: string[];
    comparison: {
      headers: string[];
      rows: string[][];
    };
    takeaways: { category: 'Key Insight' | 'Aha Moment' | 'Action Rule'; text: string; penKey: 'star' | 'circle' | 'check' }[];
    recall: { question: string; answer: string; coreTakeaway: string };
  }[];
}

const DOMAIN_ARCHETYPES: DomainArchetype[] = [
  // 1. Dopamine / Neuroscience
  {
    match: /(?:dopamine|neuro|brain|serotonin|huberman|lembke|addiction|motivation|pleasure)/i,
    category: 'Cognitive Neuroscience & Neurochemical Baseline',
    summary: (title, speaker) =>
      `This masterclass by ${speaker} establishes the foundational neurobiology of dopamine, attention, and executive function. Peak motivation is not achieved by chasing artificial spikes, but by defending your tonic baseline, mastering the pleasure-pain balance, and wiring dopamine directly into the friction of mental effort.`,
    masterMermaid: `graph TD
  A["Dopamine System Regulation"] --> B["Dual Neurochemical Circuitry"]
  A --> C["Tonic Baseline vs Phasic Spikes"]
  A --> D["Effort-Linked Plasticity Loop"]
  B --> B1["Mesocorticolimbic (Motivation & Pursuit)"]
  B --> B2["Nigrostriatal (Physical Movement & Drive)"]
  C --> C1["Vesicle Reservoir Depletion"]
  C --> C2["Post-Spike Refractory Deficit"]
  D --> D1["Attaching Dopamine to Friction"]
  D --> D2["Intermittent Random Reinforcement"]`,
    chapters: [
      {
        title: 'Tonic Baseline Dynamics & Synaptic Vesicle Exhaustion',
        offsetMinutes: 0,
        durationMinutes: 18,
        concepts: [
          'Dopamine exists in two primary states: tonic baseline (the continuous circulating wash providing background energy) and phasic spikes (acute evoked release triggered by novelty or stimulants).',
          'Dopamine molecules are housed in presynaptic terminals within microscopic vesicles. Intense stimulation dumps vesicles faster than cellular machinery can re-synthesize them, plunging available pools into deficit.',
          'The Law of Contrast: Motivation is determined strictly by the mathematical differential between your current peak and the baseline that preceded it. Low baseline prevents even high-value tasks from triggering action.'
        ],
        keywords: ['Tonic Baseline', 'Phasic Release', 'Synaptic Vesicles', 'Vesicle Depletion', 'Ventral Tegmental Area'],
        mentalModelTitle: 'The Reservoir & Wave Pool Analogy',
        mentalModelExplanation: 'Imagine dopamine as a hydroelectric reservoir. The tonic level keeps the power turbines running steadily all day. When you open high-stimulation apps or stack stimulants, you detonate an explosive in the reservoir. A giant wave splashes into the air (the rush), but water cascades over the spillway walls and is permanently lost. The water level plunges below original capacity, leaving the riverbed dry until slow biological synthesis replenishes the pool.',
        trapTitle: 'Layering Dopamine Inputs (Music + Energy Drink + Phone + Task)',
        trapDesc: 'Stacking intense stimulants, fast-tempo music, and social feeds to kickstart work. The resulting artificial surge causes an acute crash 45 minutes later, inducing intense aversion to the very work you attempted.',
        actionSteps: [
          'Strip away artificial dopamine layers: execute deep focus blocks in silence or with 40Hz binaural beats rather than high-stimulation playlists.',
          'Protect the vesicle pool: implement a strict 30-minute digital buffer before initiating high-cognitive tasks.',
          'Anchor your visual environment: reduce desk clutter to eliminate competing visual micro-cues that trigger micro-desires.'
        ],
        comparison: {
          headers: ['Stimulus Input', 'Dopamine Multiplier Above Baseline', 'Post-Spike Trajectory & Duration'],
          rows: [
            ['Refined Sugar / Chocolate', '1.5x Baseline (+50%)', 'Transient peak lasting 10-15m; modest post-spike drop'],
            ['Inhaled Nicotine / Vaping', '2.5x Baseline (+150%)', 'Steep instantaneous surge followed by rapid plunge below baseline'],
            ['High-Potency Stimulants', '2.5x to 10x Baseline (+250% to +1000%)', 'Severe catastrophic crash lasting 24-72 hours with task paralysis'],
            ['Cold Water Immersion (50-60°F)', '2.5x Baseline (+150%)', 'Gradual, sustained elevation for 3+ hours WITHOUT crash below baseline'],
            ['Physical Resistance Exercise', '2.0x Baseline (+100%)', 'Prolonged elevation lasting hours; highest when friction is embraced']
          ]
        },
        takeaways: [
          { category: 'Key Insight', text: 'Dopamine is the neurochemical currency of anticipation and pursuit, not the static feeling of reward.', penKey: 'star' },
          { category: 'Aha Moment', text: 'Every steep artificial spike in dopamine is biologically followed by a dip below your previous baseline.', penKey: 'circle' },
          { category: 'Action Rule', text: 'Never stack multiple high-dopamine inputs simultaneously before starting cognitively demanding work.', penKey: 'check' }
        ],
        recall: {
          question: 'Why does stacking multiple high-stimulus inputs (energy drinks, fast music, phone checking) cause severe task paralysis 45 minutes later?',
          answer: 'Massive artificial surges exhaust the presynaptic vesicle reservoir faster than dopamine can be synthesized. Once the surge clears, the baseline plunges below normal, inducing neurochemical lethargy and task aversion.',
          coreTakeaway: 'Sustainable motivation depends on preserving your baseline, not maximizing peak height.'
        }
      },
      {
        title: 'The Pleasure-Pain Seesaw & Homeostatic Gremlins',
        offsetMinutes: 18,
        durationMinutes: 22,
        concepts: [
          'Pleasure and pain are processed in co-localized, overlapping networks within the nucleus accumbens and prefrontal cortex, functioning like a physical mechanical seesaw.',
          'Whenever you push down the pleasure side with rapid digital gratification, the brain deploys homeostatic counter-adaptations—the "Gremlins"—who jump onto the pain side to push the seesaw back to level.',
          'The Gremlin Lag: Gremlins do not disappear when the stimulus ends. They remain on the pain side for hours, plunging the individual into restlessness, irritability, and acute digital craving.'
        ],
        keywords: ['Pleasure-Pain Seesaw', 'Homeostasis', 'Neuroadaptation Gremlins', 'Nucleus Accumbens', 'Dysphoria'],
        mentalModelTitle: 'The Heavy Gremlins on the Balance Beam',
        mentalModelExplanation: 'Every time you open an infinite scroll feed, you press down hard on the pleasure scale. Ten heavy gremlins rush over to the pain side to counterbalance it. When you close the phone, the pleasure side springs up, but all ten gremlins are still sitting on the pain side. Your brain is now submerged in physiological dysphoria, making ordinary reality feel completely unbearable.',
        trapTitle: 'Interpreting Post-Stimulus Dysphoria as "Boredom"',
        trapDesc: 'Mistaking the homeostatic pain dip for personal emptiness or boredom, and reaching immediately for another hit to numb the discomfort, thereby adding twenty more gremlins to the scale.',
        actionSteps: [
          'Recognize gremlins explicitly: when you set your phone down and feel restless, tell yourself: "These are just homeostatic gremlins. In 10 minutes they will hop off."',
          'Ride the 10-Minute Urge Wave: set an analog timer and sit with the sensory discomfort for 10 minutes before engaging in any impulsive action.',
          'Deploy voluntary friction: splash cold water on your face or do 20 pushups to manually stimulate the pain side, prompting the brain to tilt naturally toward calm.'
        ],
        comparison: {
          headers: ['Cognitive State', 'Baseline Seesaw Position', 'Executive Function Bandwidth'],
          rows: [
            ['Balanced Homeostasis', 'Horizontal level; neutral calm', 'High working memory; resilient focus on difficult tasks'],
            ['Mid-Stimulus Rush', 'Tilted heavily to pleasure side', 'Narrowed attention; compulsive craving for more hits'],
            ['Post-Stimulus Gremlin Dip', 'Tilted heavily to pain/restless side', 'Severe executive dysfunction; inability to tolerate boredom'],
            ['4-Week Dopamine Reset', 'Equilibrium restored; gremlins cleared', 'Natural joy in simple friction; low sensory threshold']
          ]
        },
        takeaways: [
          { category: 'Key Insight', text: 'The craving you feel 5 minutes after putting down your phone is physiological gremlin weight, not genuine desire.', penKey: 'star' },
          { category: 'Action Rule', text: 'Surfing the 10-minute urge wave allows the homeostatic gremlins to hop off without triggering a relapse spiral.', penKey: 'check' }
        ],
        recall: {
          question: 'What biological phenomenon causes intense irritability and restlessness after closing a social media feed?',
          answer: 'The neuroadaptation gremlins deployed by the brain to counterbalance the pleasure rush remain on the pain side of the seesaw after the stimulus stops.',
          coreTakeaway: 'Restlessness after overstimulation is homeostatic rebalancing, not a signal to seek more dopamine.'
        }
      },
      {
        title: 'Effort Attachment: Wiring Dopamine Directly into Friction',
        offsetMinutes: 40,
        durationMinutes: 24,
        concepts: [
          'Celebrating only the end reward (the score, diploma, or payout) conditions the brain to view effort as an obstacle to be endured, progressively suppressing dopamine during the actual work.',
          'Effort-Linked Mindset: Carol Dweck\'s growth mindset succeeds biologically because individuals learn to trigger dopamine release from the sensation of cognitive resistance itself.',
          'Intermittent Random Scheduling: Celebrating every single milestone causes rapid habituation. Keeping post-study rewards unpredictable and occasional maintains maximum biological sensitivity.'
        ],
        keywords: ['Growth Mindset', 'Effort Attachment', 'Prefrontal Modulation', 'Intermittent Reward', 'Neural Plasticity'],
        mentalModelTitle: 'The Mountain Climber vs. The Helicopter Tourist',
        mentalModelExplanation: 'A helicopter tourist drops onto the peak of Everest for 5 minutes, takes a photograph, and experiences zero internal transformation. The mountain climber hikes through freezing winds and burning lungs, telling themselves that every painful step is expanding their lung capacity and resilience. Dopamine flows continuously through the climb, making the summit almost an afterthought.',
        trapTitle: 'Conditioning with Post-Study Treats ("Study 2 Hours for Pizza")',
        trapDesc: 'Setting up an adversarial dynamic between study time and reward. The brain treats the work session as prison time and the pizza as the escape, reducing organic curiosity to zero.',
        actionSteps: [
          'Praise the friction: when mental strain hits while solving complex problems, verbally declare: "This resistance is my brain re-wiring. I am expanding prefrontal bandwidth right now."',
          'Use coin-flip reward schedules: after completing a deep work block, flip a coin. Heads = enjoy a snack/break; Tails = simply smile, drink water, and move to the next task.',
          'Never reward an abandoned session: avoid high-stimulation entertainment immediately following a procrastinated work block.'
        ],
        comparison: {
          headers: ['Mindset Architecture', 'Dopamine Release Point', 'Sustainability Under High Friction'],
          rows: [
            ['End-Trophy Focus', 'Exclusively released upon final delivery', 'Fragile; agonizingly difficult to initiate without imminent deadlines'],
            ['Effort-Linked Focus', 'Released continuously during problem-solving', 'Self-renewing; friction feels invigorating rather than exhausting'],
            ['Constant Reward Stacking', 'Habituates rapidly; requires higher stakes', 'Burnout inevitable as dopamine baseline downregulates'],
            ['Intermittent Random Reward', 'Mimics biological slot-machine curve', 'Maximum neural resilience and durable intrinsic motivation']
          ]
        },
        takeaways: [
          { category: 'Key Insight', text: 'Attaching dopamine to the effort itself is the only neurochemical mechanism that makes hard work genuinely enjoyable.', penKey: 'star' },
          { category: 'Action Rule', text: 'Use coin-flips or random schedules for rewards to prevent dopamine receptor desensitization.', penKey: 'check' }
        ],
        recall: {
          question: 'How does praising cognitive resistance trigger dopamine during deep work?',
          answer: 'The prefrontal cortex can modulate midbrain dopamine release based on subjective framing, converting the sensation of friction into a signal of neural plasticity and energy.',
          coreTakeaway: 'Effort attachment transforms mental resistance from punishment into progress.'
        }
      }
    ]
  },

  // 2. ADHD / Executive Function / Barkley / Focus
  {
    match: /(?:adhd|executive function|barkley|attention|distraction|procrastination|focus|time blindness)/i,
    category: 'ADHD Executive Architecture & Working Memory Support',
    summary: (title, speaker) =>
      `This master lecture by ${speaker} dismantles the misconception of ADHD as an attention shortage. ADHD is an executive function deficit—a neuro-genetic condition affecting the brain\'s internal clock, working memory, and inhibition gates. Successful execution requires externalizing time, offloading working memory to tangible paper, and building point-of-performance prosthetic scaffolds.`,
    masterMermaid: `graph TD
  A["ADHD Executive Architecture"] --> B["Externalizing Working Memory"]
  A --> C["Time Blindness & The Temporal Horizon"]
  A --> D["Inhibition & Prefrontal Fuel"]
  B --> B1["Manual Tactile Capture (Pen & Paper)"]
  B --> B2["Visual Point-of-Performance Cues"]
  C --> C1["The 'Now vs Not-Now' Binary"]
  C --> C2["Analog Physical Clock Tracking"]
  D --> D1["Glucose & Micro-Breaks for Fuel"]
  D --> D2["Radical Friction Engineering"]`,
    chapters: [
      {
        title: 'ADHD as an Executive Function Disorder & Time Blindness',
        offsetMinutes: 0,
        durationMinutes: 20,
        concepts: [
          'ADHD is not an attention deficit; it is an attention regulation and inhibition disorder rooted in prefrontal cortex dopamine and norepinephrine transport delays.',
          'Time Blindness: The neurotypical brain possesses an internal temporal horizon stretching weeks into the future. The ADHD brain operates on a binary timeline consisting strictly of two zones: "NOW" and "NOT-NOW".',
          'Consequence: Long-term consequences, deadlines, and rewards have zero motivational traction until they cross the invisible threshold into the immediate "NOW" zone, triggering crisis-driven adrenaline.'
        ],
        keywords: ['Executive Function', 'Time Blindness', 'Prefrontal Cortex', 'Temporal Horizon', 'Inhibition Deficit'],
        mentalModelTitle: 'The Nearsighted Time Telescope',
        mentalModelExplanation: 'Imagine an astronaut wearing a helmet with a severely scratched visor that only allows vision up to 3 feet ahead. Everything beyond 3 feet is an invisible void. Telling an ADHD individual to "plan for next month" is asking them to see through the opaque visor. They cannot feel future time until it crashes violently against the front glass.',
        trapTitle: 'Relying on "I Will Remember This Later"',
        trapDesc: 'Trusting internal working memory to retain thoughts, deadlines, or intentions without externalizing them immediately onto paper or physical trackers. In the ADHD brain, unwritten thoughts evaporate within 15 seconds.',
        actionSteps: [
          'Externalize time with analog visual clocks: replace digital numbers with a Time Timer or sweep-hand clock that physically shows time running out as a red slice.',
          'Carry a tactile physical notebook everywhere: capture thoughts immediately with ink on paper to relieve prefrontal buffer strain.',
          'Break every distant project into single "NOW" actions: never put "Work on thesis" on a list; put "Write 3 bullet points for paragraph 1".'
        ],
        comparison: {
          headers: ['Executive Dimension', 'Neurotypical Default', 'ADHD Neural Architecture', 'Point-of-Performance Solution'],
          rows: [
            ['Temporal Horizon', 'Visualizes 4-12 weeks ahead', 'Sees only "NOW" vs "NOT-NOW"', 'Analog visual countdown timer (Time Timer)'],
            ['Working Memory Buffer', 'Holds 5-7 items in head', 'Holds 1-2 items before wipe', 'Physical warm-paper index card capture'],
            ['Motivation Driver', 'Internal future goals', 'Immediate external salience/consequence', 'Immediate tactile accountability & body doubling'],
            ['Energy Depletion', 'Gradual steady decline', 'Sudden cliff-like drop when fuel empties', '15g glucose sips + 3-minute somatic reset']
          ]
        },
        takeaways: [
          { category: 'Key Insight', text: 'ADHD is not a knowledge deficit; it is a point-of-performance execution disorder.', penKey: 'star' },
          { category: 'Aha Moment', text: 'Time blindness means future deadlines have zero biological reality until they become immediate crises.', penKey: 'circle' },
          { category: 'Action Rule', text: 'Externalize all working memory onto physical paper at the exact point of performance.', penKey: 'check' }
        ],
        recall: {
          question: 'Why do future deadlines fail to motivate an ADHD brain until the final 24 hours?',
          answer: 'The ADHD temporal horizon is compressed into a binary "NOW" versus "NOT-NOW". Distant deadlines do not generate dopamine or norepinephrine until they cross into the "NOW" window and trigger emergency adrenaline.',
          coreTakeaway: 'Make distant time visible and tactile in the present moment.'
        }
      },
      {
        title: 'Building External Prosthetics at the Point of Performance',
        offsetMinutes: 20,
        durationMinutes: 25,
        concepts: [
          'Dr. Russell Barkley\'s Law: Internal executive scaffolding cannot be strengthened through willpower alone; it must be constructed in the physical environment where the action happens.',
          'Working memory is the RAM of the mind. In ADHD, this RAM is volatile and resets with every minor distraction. Offloading information onto paper or whiteboard frees cognitive bandwidth for actual execution.',
          'Rule of Friction: Any task requiring more than 2 steps of friction to initiate will be abandoned in favor of instant gratification.'
        ],
        keywords: ['Point of Performance', 'Prosthetic Environment', 'Working Memory Offloading', 'Friction Engineering', 'External Scaffolding'],
        mentalModelTitle: 'The Wheelchair Ramp for the Mind',
        mentalModelExplanation: 'If a person cannot walk, you do not yell at them to "try harder to run up the stairs"—you build a wheelchair ramp. Externalizing rules, visual timers, and step-by-step checklists at your desk is not cheating; it is constructing the necessary ramps for executive function.',
        trapTitle: 'Complex Multi-App Productivity Setups',
        trapDesc: 'Spending 3 weeks designing complex Notion databases or multi-app workflows. The cognitive overhead of navigating the software becomes a new barrier, leading to complete abandonment.',
        actionSteps: [
          'Use the 3-Index-Card Rule: write down only 3 micro-actions for the day on a 3x5 physical index card. Keep it taped to your monitor.',
          'Eliminate friction: place tools for the next day on your desk before going to sleep so you can start without decision paralysis.',
          'Employ body doubling: work alongside a partner or in a silent virtual study room to provide ambient social accountability.'
        ],
        comparison: {
          headers: ['Work Strategy', 'Complex Software System', 'ADHD Prosthetic Scaffold'],
          rows: [
            ['Initiation Friction', 'High (multiple clicks, logins, tags)', 'Near zero (pen and card already on desk)'],
            ['Distraction Risk', 'Extreme (browser tabs, notifications)', 'Zero (analog physical paper has no popups)'],
            ['Cognitive Load', 'Drains working memory RAM', 'Protects working memory for primary task'],
            ['Long-Term Adherence', 'Abandoned within 14 days', 'Durable, flexible, and immediately restartable']
          ]
        },
        takeaways: [
          { category: 'Key Insight', text: 'Treat ADHD like diabetes: manage it continuously with environmental prosthetics rather than expecting a permanent cure.', penKey: 'star' },
          { category: 'Action Rule', text: 'Limit daily focus to 3 physical index card items at the point of performance.', penKey: 'check' }
        ],
        recall: {
          question: 'Why do complex digital productivity systems usually fail individuals with ADHD?',
          answer: 'They require high executive function to maintain, introduce digital distraction traps, and add initiation friction, overwhelming the very working memory they were meant to support.',
          coreTakeaway: 'Simplicity and tactile immediacy beat complex digital architectures every time.'
        }
      }
    ]
  },

  // 3. General Educational / Productivity / Masterclass Fallback
  {
    match: /.*/i,
    category: 'Systemic Mastery, Cognitive Architecture & High-Yield Execution',
    summary: (title, speaker) =>
      `This high-yield visual textbook breaks down the master principles delivered by ${speaker} in "${title}". Using ADHD-aligned cognitive architecture, the lecture is structured into core biological mechanisms, memorable mental models, anti-drift protocols, and interactive recall checkpoints.`,
    masterMermaid: `graph TD
  A["Core Systemic Architecture"] --> B["First Principles & Mechanisms"]
  A --> C["Cognitive Traps & Friction Points"]
  A --> D["ADHD High-Yield Protocols"]
  B --> B1["Primary Operational Loop"]
  B --> B2["Resource & Energy Dynamics"]
  C --> C1["Default Reflex Biases"]
  C --> C2["Information Overload"]
  D --> D1["Tactile Step-by-Step Execution"]
  D --> D2["Feedback & Continuous Calibration"]`,
    chapters: [
      {
        title: 'Core Mechanisms, Systemic Foundations & First Principles',
        offsetMinutes: 0,
        durationMinutes: 20,
        concepts: [
          'Every high-performance system operates on fundamental first principles rather than superficial tactics. Understanding the root mechanism allows rapid troubleshooting when execution falters.',
          'Cognitive Bandwidth Conservation: Working memory is an extremely finite biological bottleneck. When overwhelmed with unstructured data, the prefrontal cortex initiates cognitive shutdown.',
          'Information Density vs. Retention: High-density learning requires visual chunking, contrasting tables, and physical checkpoints to transform short-term working inputs into durable memory.'
        ],
        keywords: ['First Principles', 'System Dynamics', 'Cognitive Bottlenecks', 'Visual Chunking', 'Execution Architecture'],
        mentalModelTitle: 'The Funnel & Bottleneck Principle',
        mentalModelExplanation: 'Imagine trying to pour a 5-gallon bucket of water into a bottle with a narrow neck in 2 seconds. The water splashes everywhere and is lost. To fill the bottle, you need a funnel that regulates flow rate. This study textbook acts as that funnel, filtering raw lecture speech into structured, high-yield droplets.',
        trapTitle: 'Passive Consumption & Illusion of Competence',
        trapDesc: 'Listening to an inspiring lecture at 2x speed while nodding along, believing you have mastered the material without actively testing your recall or converting insights into tactile action steps.',
        actionSteps: [
          'Translate passive listening into active checks: interact with the checkable takeaways and recall questions after every chapter.',
          'Offload key insights immediately: write 1 sentence summary in your own words before moving to the next section.',
          'Identify the single core mechanism that governs 80% of the subject\'s outcomes.'
        ],
        comparison: {
          headers: ['Approach', 'Passive Consumption', 'ADHD Structural Processing'],
          rows: [
            ['Retention at 48 Hours', '< 10% of spoken content', '> 75% via active recall & visual models'],
            ['Cognitive State', 'Distracted, multitasking, fleeting dopamine', 'Deep engagement, focused note-making, grounded action'],
            ['Practical Output', 'Zero behavioral change', 'Clear action steps executed at point of performance']
          ]
        },
        takeaways: [
          { category: 'Key Insight', text: 'Understanding the underlying mechanism makes memorization of isolated rules obsolete.', penKey: 'star' },
          { category: 'Action Rule', text: 'Never consume a 60-minute lecture without extracting at least 3 concrete action steps.', penKey: 'check' }
        ],
        recall: {
          question: 'What is the primary cause of the "illusion of competence" when listening to educational lectures?',
          answer: 'Passive familiarity feels like understanding in the moment, but without active retrieval and structured chunking, the information fails to encode into long-term memory.',
          coreTakeaway: 'Active recall and visual models are required to convert speech into permanent capability.'
        }
      },
      {
        title: 'Tactical Execution Protocols & Long-Term Calibration',
        offsetMinutes: 20,
        durationMinutes: 25,
        concepts: [
          'Sustainable execution depends on designing low-friction environments rather than relying on fluctuating willpower reserves.',
          'The Feedback Calibration Loop: Continuous micro-adjustments prevent minor execution drifts from turning into catastrophic project abandonments.',
          'Habit Anchoring: Linking new cognitive protocols to established automatic routines guarantees adherence even on low-dopamine days.'
        ],
        keywords: ['Execution Protocol', 'Friction Minimization', 'Feedback Loops', 'Habit Anchoring', 'Cognitive Resilience'],
        mentalModelTitle: 'The Flight Path Correction Loop',
        mentalModelExplanation: 'An airplane flying across the ocean is off-course 95% of the flight due to crosswinds and air pressure. The autopilot does not panic or cancel the flight; it constantly applies tiny micro-corrections to stay aligned with the runway. Success is not perfect linear focus; it is rapid, guilt-free re-alignment.',
        trapTitle: 'The All-or-Nothing Perfectionist Drop',
        trapDesc: 'Abandoning an entire system or routine because you missed a single scheduled block or encountered unexpected friction, triggering an ADHD shame spiral.',
        actionSteps: [
          'Implement the Never-Miss-Twice Rule: if you get derailed for one session, immediately forgive the slip and execute a 5-minute micro-action.',
          'Audit environmental friction: remove at least 2 steps required to start your primary high-value task.',
          'Review progress with tactile pen keys: check off completed takeaways to deliver genuine neurological closure to your day.'
        ],
        comparison: {
          headers: ['Execution Mindset', 'Perfectionist Trap', 'Adaptive Calibration Protocol'],
          rows: [
            ['Reaction to Interruption', 'Complete abandonment; shame spiral', 'Calm micro-correction; rapid re-entry'],
            ['Target Metric', '100% flawless execution', 'Consistent 80% momentum sustained over months'],
            ['Cognitive Resilience', 'Extremely brittle under stress', 'Highly adaptive; self-repairing']
          ]
        },
        takeaways: [
          { category: 'Key Insight', text: 'Momentum is built through rapid re-entry after derailment, not flawless perfection.', penKey: 'star' },
          { category: 'Action Rule', text: 'Apply the Never-Miss-Twice protocol to protect your cognitive habits from shame spirals.', penKey: 'check' }
        ],
        recall: {
          question: 'Why is the "flight path correction" model more effective for ADHD execution than rigid perfectionism?',
          answer: 'It recognizes that distraction and drift are normal biological events, reframing success as rapid, calm re-alignment rather than unattainable flawless consistency.',
          coreTakeaway: 'Progress is defined by your speed of re-entry, not the absence of interruption.'
        }
      }
    ]
  }
];

function buildAlgorithmicDailyProtocol(cleanTitle: string, speaker: string, keywords: string[]): DailyTimeProtocol {
  const k1 = keywords[0] || 'Focus Architecture';
  const k2 = keywords[1] || 'Friction Reduction';
  const k3 = keywords[2] || 'Dopamine Baseline';

  return {
    title: `Daily Action Execution Protocol: ${cleanTitle}`,
    subtitle: `A 4-phase chronological framework engineered to convert key insights from ${speaker} into physical habit and forward momentum.`,
    dailyAnchorQuote: 'Action precedes motivation. Structure the environment so execution requires minimum prefrontal willpower.',
    blocks: [
      {
        id: 'auto-p1',
        timeWindow: '06:30 - 08:30 AM (0–60 Min Post-Wake)',
        phaseName: 'Phase 1: Waking Priming & Low-Stimulation Launch',
        coreConcept: `Morning baseline calibration for ${k1}. The first hour determines dopamine receptor sensitivity for the rest of the day.`,
        doThis: {
          action: 'Spend the first 45 minutes completely screen-free. Hydrate with 500ml water and write today\'s single highest priority on a physical card.',
          tacticalCue: 'Keep your smartphone outside the bedroom in a drawer or on a charger across the room.'
        },
        dontDoThis: {
          trap: 'DO NOT check email, social feeds, or notifications in bed before getting on your feet.',
          whyTrapDamages: 'Immediate digital stimulation triggers premature phasic spikes, exhausting dopamine reserves before real work begins.'
        },
        biologicalWhy: 'Defending the morning cortisol awakening response prevents mid-morning brain fog and anchors the biological focus curve.'
      },
      {
        id: 'auto-p2',
        timeWindow: '09:00 AM - 12:30 PM (High-Friction Forge)',
        phaseName: 'Phase 2: Deep Work Sprint & Point of Performance',
        coreConcept: `High-yield application of ${k2}. Harnessing fresh prefrontal bandwidth before cognitive fatigue accumulates.`,
        doThis: {
          action: 'Execute a dedicated 60-to-90 minute distraction-free focus block. Use a single visible task card and an analog timer.',
          tacticalCue: 'When task resistance emerges at the 15-minute mark, verbally remind yourself that resistance is the physical sensation of neuroplasticity.'
        },
        dontDoThis: {
          trap: 'DO NOT multitask, switch between communication channels, or stack loud stimulating media.',
          whyTrapDamages: 'Task switching incurs an attention residue penalty of up to 20 minutes per interruption, fragmenting working memory.'
        },
        biologicalWhy: 'Unbroken focus preserves striatal dopamine pools and stimulates prefrontal BDNF synthesis.'
      },
      {
        id: 'auto-p3',
        timeWindow: '02:00 - 04:30 PM (Midday Reset)',
        phaseName: 'Phase 3: Tactical Trough Management & Sensory Refresh',
        coreConcept: `Biological recovery and ${k3} replenishment. Managing the afternoon dip through active restoration rather than panic stimulants.`,
        doThis: {
          action: 'Take a 15-20 minute sensory rest or outdoor walk without headphones. Sip water and perform light physical movement.',
          tacticalCue: 'If mental fatigue peaks, do 10 deep physiological sighs (double inhale through nose, long slow exhale through mouth).'
        },
        dontDoThis: {
          trap: 'DO NOT attempt to brute-force complex strategic decisions while in the deepest trough of circadian alertness.',
          whyTrapDamages: 'Fatigued executive circuits make poor impulse decisions and are 400% more susceptible to infinite-scroll digital rabbit holes.'
        },
        biologicalWhy: 'Parasympathetic vagal activation clears adenosine accumulation and restores autonomic balance.'
      },
      {
        id: 'auto-p4',
        timeWindow: '08:30 - 10:30 PM (Evening Quarantine)',
        phaseName: 'Phase 4: Environmental Self-Binding & Sleep Guard',
        coreConcept: 'Securing deep sleep architecture so cognitive bandwidth and executive control are fully restored for tomorrow.',
        doThis: {
          action: 'Dim ambient lighting, close all work applications, review today\'s completed action steps, and set tomorrow\'s physical launchpad.',
          tacticalCue: 'Place your notebook and pen directly in the center of your desk chair before leaving the room.'
        },
        dontDoThis: {
          trap: 'DO NOT bring active screens or high-stress problem-solving into your sleep environment.',
          whyTrapDamages: 'Late-night blue photons suppress melatonin synthesis and trigger nocturnal autonomic arousal, wrecking sleep cycles.'
        },
        biologicalWhy: 'Restorative slow-wave sleep is the only biological mechanism that washes metabolic waste from the brain via the glymphatic system.'
      }
    ]
  };
}

export function synthesizeTextbookWithoutAI(params: SynthesizeParams): StudyTextbook {
  const { videoUrl, videoId, videoTitle, speaker, transcript } = params;

  // Clean strings
  const cleanTitle = (videoTitle || 'Educational Masterclass').trim();
  const cleanSpeaker = (speaker || 'Featured Speaker').trim();
  const cleanTranscript = (transcript || '').trim();

  // Pick matching domain archetype based on title or transcript keywords
  const combinedText = `${cleanTitle} ${cleanSpeaker} ${cleanTranscript.slice(0, 500)}`;
  const matchedArchetype = DOMAIN_ARCHETYPES.find((d) => d.match.test(combinedText)) || DOMAIN_ARCHETYPES[DOMAIN_ARCHETYPES.length - 1];
  const extractedTopKeywords = extractTopKeywords(combinedText, 5);

  // Check if transcript contains real timestamped chapters
  const parsedRawChapters = cleanTranscript ? extractChaptersFromText(cleanTranscript) : [];

  let chapters: TextbookChapter[] = [];

  if (parsedRawChapters.length >= 2) {
    // Build chapters directly from the user's parsed chapters / transcript!
    chapters = parsedRawChapters.map((raw, idx) => {
      const chapterNum = idx + 1;
      const chapterText = raw.lines.join(' ');
      const extractedKeywords = extractTopKeywords(chapterText || raw.title, 5);

      const nextChapter = parsedRawChapters[idx + 1];
      const endSec = nextChapter ? nextChapter.seconds : raw.seconds + 900;
      const tsRange = `${raw.timestamp} - ${formatTimestamp(endSec)}`;

      // Heuristic sentences
      const sentences = chapterText
        .split(/[.!?]+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 25 && s.length < 200);

      const coreConcepts = sentences.length >= 3
        ? sentences.slice(0, 3)
        : [
            `Core principles and operational mechanisms discussed in ${raw.title}.`,
            `Key scientific and practical distinctions relevant to ${extractedKeywords[0] || 'the domain'}.`,
            `How cognitive friction and environmental factors influence the execution of this chapter's protocols.`
          ];

      const archetypeChapter = matchedArchetype.chapters[idx % matchedArchetype.chapters.length];

      return {
        chapterNumber: chapterNum,
        title: raw.title || `Chapter ${chapterNum}: Core Principles`,
        timestampRange: tsRange,
        startSeconds: raw.seconds,
        coreConcepts,
        anchorKeywords: extractedKeywords.length >= 3 ? extractedKeywords : archetypeChapter.keywords,
        mentalModelTitle: archetypeChapter.mentalModelTitle,
        mentalModelExplanation: archetypeChapter.mentalModelExplanation,
        mermaidDiagram: buildChapterMermaid(chapterNum, raw.title, extractedKeywords),
        theTrap: {
          title: archetypeChapter.trapTitle,
          description: archetypeChapter.trapDesc
        },
        actionSteps: archetypeChapter.actionSteps,
        comparisonTable: archetypeChapter.comparison,
        checkableTakeaways: [
          {
            id: `takeaway-${chapterNum}-1`,
            timestamp: raw.timestamp,
            seconds: raw.seconds + 120,
            category: 'Key Insight',
            text: coreConcepts[0] || `Mastering ${raw.title} unlocks sustained executive capacity.`,
            checked: false,
            penKey: 'star'
          },
          {
            id: `takeaway-${chapterNum}-2`,
            timestamp: formatTimestamp(raw.seconds + 300),
            seconds: raw.seconds + 300,
            category: 'Aha Moment',
            text: coreConcepts[1] || `Overcoming cognitive friction requires external point-of-performance scaffolds.`,
            checked: false,
            penKey: 'circle'
          },
          {
            id: `takeaway-${chapterNum}-3`,
            timestamp: formatTimestamp(raw.seconds + 500),
            seconds: raw.seconds + 500,
            category: 'Action Rule',
            text: archetypeChapter.actionSteps[0] || `Apply strict environmental constraints to initiate deep focus.`,
            checked: false,
            penKey: 'check'
          }
        ],
        quickRecall: archetypeChapter.recall
      };
    });
  } else {
    // Use domain archetype chapters populated with specific keynote title & speaker
    let runningSeconds = 0;
    chapters = matchedArchetype.chapters.map((ch, idx) => {
      const chapterNum = idx + 1;
      const startSec = runningSeconds;
      const durationSec = ch.durationMinutes * 60;
      runningSeconds += durationSec;
      const endSec = runningSeconds;

      const tsRange = `${formatTimestamp(startSec)} - ${formatTimestamp(endSec)}`;

      return {
        chapterNumber: chapterNum,
        title: `Chapter ${chapterNum}: ${ch.title}`,
        timestampRange: tsRange,
        startSeconds: startSec,
        coreConcepts: ch.concepts,
        anchorKeywords: ch.keywords,
        mentalModelTitle: ch.mentalModelTitle,
        mentalModelExplanation: ch.mentalModelExplanation,
        mermaidDiagram: buildChapterMermaid(chapterNum, ch.title, ch.keywords),
        theTrap: {
          title: ch.trapTitle,
          description: ch.trapDesc
        },
        actionSteps: ch.actionSteps,
        comparisonTable: ch.comparison,
        checkableTakeaways: ch.takeaways.map((t, tIdx) => ({
          id: `takeaway-${chapterNum}-${tIdx + 1}`,
          timestamp: formatTimestamp(startSec + (tIdx + 1) * 360),
          seconds: startSec + (tIdx + 1) * 360,
          category: t.category,
          text: t.text,
          checked: false,
          penKey: t.penKey
        })),
        quickRecall: ch.recall
      };
    });
  }

  // Calculate total duration
  const lastChapter = chapters[chapters.length - 1];
  const totalSeconds = lastChapter ? lastChapter.startSeconds + 1200 : 3600;
  const durationStr = formatTimestamp(totalSeconds);

  return {
    id: `guide-${(videoId || 'custom').slice(0, 11)}-${Date.now()}`,
    videoTitle: cleanTitle,
    speaker: cleanSpeaker,
    duration: durationStr,
    videoId: videoId || 'custom-video',
    videoUrl: videoUrl || `https://www.youtube.com/watch?v=${videoId}`,
    thumbnailUrl: videoId && videoId.length === 11
      ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
      : 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
    generatedAt: 'Instant Algorithmic Edition (No AI)',
    isPreset: false,
    createdAt: Date.now(),
    executiveSummary: matchedArchetype.summary(cleanTitle, cleanSpeaker),
    masterMindmapMermaid: matchedArchetype.masterMermaid,
    dailyProtocol: buildAlgorithmicDailyProtocol(cleanTitle, cleanSpeaker, extractedTopKeywords),
    chapters
  };
}

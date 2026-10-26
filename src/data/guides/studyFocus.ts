import { StudyTextbook } from '../../types';

export const STUDY_FOCUS_GUIDES: StudyTextbook[] = [
  {
    id: 'huberman-learning-memory-neuroplasticity',
    categoryId: 'cat-study-focus-execution',
    videoTitle: 'Cognitive Neuroplasticity & Memory Retention',
    speaker: 'Dr. Andrew Huberman, Ph.D. (Stanford School of Medicine)',
    duration: '2h 14m',
    videoId: 'ddq8JIMhz7c',
    videoUrl: 'https://www.youtube.com/watch?v=ddq8JIMhz7c',
    thumbnailUrl: 'https://i.ytimg.com/vi/ddq8JIMhz7c/hqdefault.jpg',
    generatedAt: 'Master Reference Edition',
    isPreset: true,
    createdAt: 1700000020000,
    executiveSummary: 'Neuroplasticity—the brain’s ability to structurally rewire in response to experience—requires a two-phase protocol: an acute high-focus state marked by norepinephrine and acetylcholine, followed by immediate consolidation during idle rest gaps and slow-wave sleep. By introducing random 10-second micro-rest gaps during study sessions, hippocampal replay speeds up by 20x.',
    masterMindmapMermaid: `graph TD
  NP["Neuroplasticity Architecture"] --> NP1["Trigger Phase (Wake)"]
  NP --> NP2["Consolidation Phase (Sleep/Rest)"]
  NP --> NP3["Micro-Rest Acceleration"]
  NP1 --> NP1A["Epinephrine (Alertness & Energy)"]
  NP1 --> NP1B["Acetylcholine (Spatial/Focal Highlighting)"]
  NP2 --> NP2A["Non-Sleep Deep Rest (NSDR)"]
  NP2 --> NP2B["Slow-Wave Sleep Spindles"]
  NP3 --> NP3A["10-Sec Random Gaps (Gap Effect)"]
  NP3 --> NP3B["20x Hippocampal Backward Replay"]`,
    dailyProtocol: {
      title: 'Neuroplasticity Trigger & Memory Consolidation Protocol',
      subtitle: 'Engineered intervals of high-friction learning paired with accelerated hippocampal replay gaps.',
      dailyAnchorQuote: 'You trigger neuroplasticity while awake and straining; you wire the actual synaptic circuits while resting.',
      blocks: [
        {
          id: 'np-p1',
          timeWindow: '08:30 - 10:30 AM (High-Alert Plasticity Window)',
          phaseName: 'Phase 1: The Gap-Effect Learning Forge',
          coreConcept: 'Injecting random 10-second pauses during cognitive practice multiplies memory acquisition speed.',
          doThis: {
            action: 'During your 60-90 min study sprint, pause every 3-5 minutes for exactly 10 seconds. Close your eyes and do absolutely nothing.',
            tacticalCue: 'Set a quiet, random interval chime on your phone or computer to cue 10-second freeze pauses.'
          },
          dontDoThis: {
            trap: 'DO NOT check your phone or look at different text during the 10-second gap.',
            whyTrapDamages: 'Any incoming sensory data disrupts the hippocampal backward replay loop and overrides consolidation.'
          },
          biologicalWhy: 'During waking micro-rests, the hippocampus replays the learned sequence in reverse at 20 times normal speed.'
        },
        {
          id: 'np-p2',
          timeWindow: '11:00 - 11:30 AM (Immediate Post-Learning Reset)',
          phaseName: 'Phase 2: Post-Learning Sensory Idle / NSDR',
          coreConcept: 'The 20 minutes immediately following high-intensity study determine what percentage of memories become permanent.',
          doThis: {
            action: 'Immediately after closing your books, recline for 15-20 minutes in a quiet room or do an NSDR session without audio or screens.',
            tacticalCue: 'Put a "Do Not Disturb" sign on your door for 20 minutes post-study.'
          },
          dontDoThis: {
            trap: 'DO NOT jump straight into high-stimulation video games, podcast listening, or driving through heavy traffic.',
            whyTrapDamages: 'Retroactive cognitive interference wipes newly formed synaptic tags before long-term potentiation occurs.'
          },
          biologicalWhy: 'Synaptic consolidation requires low acetylcholine and low epinephrine to transfer memories from hippocampus to cortex.'
        },
        {
          id: 'np-p3',
          timeWindow: '10:00 - 11:00 PM (Nocturnal Synaptic Rewiring)',
          phaseName: 'Phase 3: Slow-Wave Sleep Consolidation Defense',
          coreConcept: 'Deep slow-wave sleep is when the brain physically alters synaptic morphology.',
          doThis: {
            action: 'Ensure your bedroom is completely cool (65-68°F) and pitch dark to maximize slow-wave delta sleep in the first half of the night.',
            tacticalCue: 'Set your thermostat to drop 2 degrees 60 minutes before bedtime.'
          },
          dontDoThis: {
            trap: 'DO NOT drink alcohol within 4 hours of bed to "wind down" from studying.',
            whyTrapDamages: 'Alcohol fragments sleep architecture and obliterates sleep spindle activity, extinguishing memory consolidation.'
          },
          biologicalWhy: 'Sleep spindles and delta slow waves coordinate the structural protein synthesis necessary for permanent synaptic growth.'
        }
      ]
    },
    chapters: [
      {
        chapterNumber: 1,
        title: 'The Chemical Cocktail of Neuroplasticity: Epinephrine, Acetylcholine & The Gap Effect',
        timestampRange: '00:06:00 - 00:38:20',
        startSeconds: 360,
        coreConcepts: [
          'Adult neuroplasticity requires three concurrent signals: Epinephrine (arousal), Acetylcholine (focus spotlight), and Dopamine (error correction & reward).',
          'Errors and mistakes are the biological trigger: when you make an error, the anterior cingulate cortex signals the release of norepinephrine, signaling "this friction is critical."',
          'The Gap Effect: Taking a random 10-second micro-rest every few minutes during learning causes the hippocampus to replay newly acquired patterns at 20x speed.'
        ],
        anchorKeywords: ['Neuroplasticity', 'Acetylcholine', 'Norepinephrine', 'The Gap Effect', 'Hippocampal Replay'],
        mentalModelTitle: 'The Highlighter and The Construction Crew',
        mentalModelExplanation: 'Imagine studying like marking blueprints. Acetylcholine is a bright neon highlighter marking which specific synapses need renovation. Epinephrine provides the high-voltage generator to power the job site. But the construction crew (synaptic growth enzymes) only arrives after hours when the power tools are turned off—during NSDR and deep sleep.',
        mermaidDiagram: `graph TD
  E1["Cognitive Error / Resistance"] --> E2["Norepinephrine Release (Arousal)"]
  E2 --> E3["Basal Forebrain Drops Acetylcholine (Focus Highlighter)"]
  E3 --> E4["10-Sec Micro-Rest Gap"]
  E4 --> E5["20x Hippocampal Backward Replay"]
  E5 --> E6["Rapid Synaptic Plasticity"]`,
        theTrap: {
          title: 'Quitting When You Feel Dumb or Agitated',
          description: 'Interpreting mental strain and confusion as proof of inadequacy, when in fact that agitation is the exact neurochemical gateway required to unlock plasticity.'
        },
        actionSteps: [
          'Welcome confusion: declare out loud "This friction is my brain opening the plasticity window."',
          'Insert 10-second zero-input micro-pauses every 3 minutes of intense study.',
          'Schedule an NSDR or 20-minute sensory deprivation rest immediately following hard cognitive sessions.'
        ],
        comparisonTable: {
          headers: ['Learning Variable', 'Conventional Passive Study', 'Huberman Neuroplasticity Engine'],
          rows: [
            ['Reaction to Errors', 'Frustration, discouragement, quitting', 'Celebrated as the biological trigger for acetylcholine'],
            ['Interval Design', 'Continuous 3-hour marathon with phone checks', '90-min ultradian sprint with random 10-sec micro-rest gaps'],
            ['Post-Study Behavior', 'Immediately scroll social media or YouTube', '15-20 min screen-free NSDR for hippocampal replay'],
            ['Retention Rate', 'Rapid exponential forgetting within 48h', 'High synaptic consolidation into long-term neocortex']
          ]
        },
        checkableTakeaways: [
          {
            id: 'np-tk-1',
            timestamp: '00:14:10',
            seconds: 850,
            category: 'Key Insight',
            text: 'Errors are the mandatory biological signal that instructs adult brain circuits to change.',
            checked: false,
            penKey: 'star'
          },
          {
            id: 'np-tk-2',
            timestamp: '00:26:45',
            seconds: 1605,
            category: 'Action Rule',
            text: 'Pause for 10 seconds of complete stillness during study sessions to trigger 20x hippocampal replay.',
            checked: false,
            penKey: 'check'
          }
        ],
        quickRecall: {
          question: 'Why are mistakes and confusion necessary for adult brain rewiring?',
          answer: 'Making mistakes stimulates the locus coeruleus and anterior cingulate to release norepinephrine, which marks the neural circuits for structural change.',
          coreTakeaway: 'No friction, no neuroplasticity. Agitation is the entry fee.'
        }
      }
    ]
  },
  {
    id: 'newport-deep-work-execution',
    categoryId: 'cat-study-focus-execution',
    videoTitle: 'Deep Work & Professional Execution',
    speaker: 'Dr. Cal Newport, Ph.D. (MIT / Professor of Computer Science, Georgetown)',
    duration: '1h 32m',
    videoId: 'p4ZfkezDTXQ',
    videoUrl: 'https://www.youtube.com/watch?v=p4ZfkezDTXQ',
    thumbnailUrl: 'https://i.ytimg.com/vi/p4ZfkezDTXQ/hqdefault.jpg',
    generatedAt: 'Master Reference Edition',
    isPreset: true,
    createdAt: 1700000021000,
    executiveSummary: 'Deep Work is the ability to focus without distraction on a cognitively demanding task. In an economy addicted to rapid, shallow communication (The Hyperactive Hive Mind), the ability to perform deep work is becoming increasingly rare and simultaneously increasingly valuable. Eliminating attention residue by batching shallow obligations creates an insurmountable professional advantage.',
    masterMindmapMermaid: `graph TD
  DW["Deep Work Philosophy"] --> DW1["Attention Residue Law"]
  DW --> DW2["The Hive Mind Trap"]
  DW --> DW3["Execution Frameworks"]
  DW1 --> DW1A["Switching Penalty (15-25 Minutes)"]
  DW1 --> DW1B["Myelin Sheath Formation"]
  DW2 --> DW2A["Async Ping-Pong Overhead"]
  DW2 --> DW2B["Shallow Cognitive Drift"]
  DW3 --> DW3A["Rhythmic Scheduling (Fixed Time Blocks)"]
  DW3 --> DW3B["Shutdown Rituals (Hard Disconnect)"]`,
    dailyProtocol: {
      title: 'Deep Work Pacing & Attention Residue Shield',
      subtitle: 'A tactical operating framework to eradicate attention residue and protect 3 hours of high-cognitive output daily.',
      dailyAnchorQuote: 'If you don’t produce at the peak of your cognitive ability, you will be replaced by automation or those who do.',
      blocks: [
        {
          id: 'dw-p1',
          timeWindow: '08:00 - 11:30 AM (Sacred Deep Work Forge)',
          phaseName: 'Phase 1: Zero-Residue Monastic Focus Block',
          coreConcept: 'Checking an inbox for even 5 seconds leaves a sticky attention residue that degrades IQ for 20 minutes.',
          doThis: {
            action: 'Lock your email and chat applications. Work on a single high-value intellectual deliverable for 90 to 120 minutes with zero tab switching.',
            tacticalCue: 'Keep a physical notepad beside your keyboard labeled "Distraction Parking Lot" to jot stray thoughts without opening a browser.'
          },
          dontDoThis: {
            trap: 'DO NOT check Slack, Teams, or your inbox "just for 30 seconds" to see if something urgent arrived.',
            whyTrapDamages: 'Even glancing at a single incoming email introduces open loops in working memory, degrading executive performance by 25%.'
          },
          biologicalWhy: 'Uninterrupted neural firing along the same circuit stimulates oligodendrocytes to wrap the axon in thick layers of myelin, permanently accelerating processing speed.'
        },
        {
          id: 'dw-p2',
          timeWindow: '01:30 - 03:00 PM (Shallow Work Batching)',
          phaseName: 'Phase 2: Consolidated Administrative Sprints',
          coreConcept: 'Shallow logistical tasks should be compressed into bounded batches rather than smeared across the entire workday.',
          doThis: {
            action: 'Process all emails, replies, scheduling, and administrative logistics in one concentrated 60-minute burst.',
            tacticalCue: 'Use process-centric replies: answer who, what, when, and next steps in one message to terminate ping-pong loops.'
          },
          dontDoThis: {
            trap: 'DO NOT leave communication tools open while returning to creative or analytical work.',
            whyTrapDamages: 'Continuous partial attention locks the nervous system in fight-or-flight hypervigilance.'
          },
          biologicalWhy: 'Batching eliminates the metabolic cost of cognitive context-switching between executive control and social scanning.'
        },
        {
          id: 'dw-p3',
          timeWindow: '05:30 PM (The Hard Shutdown Ritual)',
          phaseName: 'Phase 3: The Complete Cognitive Shutdown Ritual',
          coreConcept: 'Work hours must conclude with an explicit ritual to release the Zeigarnik effect and protect evening recovery.',
          doThis: {
            action: 'Review your calendar, confirm tomorrow’s launchpad, close your laptop, and state aloud: "Shutdown Complete."',
            tacticalCue: 'Never check work messages after stating "Shutdown Complete."'
          },
          dontDoThis: {
            trap: 'DO NOT check work email while sitting on the sofa watching TV in the evening.',
            whyTrapDamages: 'Evening semi-work prevents the prefrontal cortex from ever reaching true restorative rest, guaranteeing morning brain fog.'
          },
          biologicalWhy: 'The Zeigarnik effect maintains active neural tension until an uncompleted task is filed into a trusted, concrete plan.'
        }
      ]
    },
    chapters: [
      {
        chapterNumber: 1,
        title: 'The Law of Attention Residue & The Hyperactive Hive Mind',
        timestampRange: '00:04:15 - 00:29:30',
        startSeconds: 255,
        coreConcepts: [
          'Attention Residue: When you switch from Task A to Task B, your attention does not follow immediately. A significant portion of your cognitive bandwidth remains stuck on the previous task.',
          'The Hyperactive Hive Mind: Modern knowledge work has devolved into unstructured, relentless back-and-forth communication, mistaking rapid responsiveness for valuable output.',
          'Deep work requires protected temporal blocks. You cannot produce elite results in 15-minute fragmented snippets between meetings.'
        ],
        anchorKeywords: ['Attention Residue', 'Deep Work', 'Hyperactive Hive Mind', 'Cognitive Context-Switching', 'Myelination'],
        mentalModelTitle: 'The Heavy Train Switching Tracks',
        mentalModelExplanation: 'Your cognitive focus is like a 100-ton freight train moving at 80 miles per hour down a track. Stopping the train, backing up, and switching rails to check a 10-second Slack ping takes 20 minutes and enormous amounts of fuel. Trying to drive a freight train through a busy city intersection of notifications causes catastrophic derailments.',
        mermaidDiagram: `graph TD
  D1["Deep Task Focus"] --> D2["Quick Check: Email / Slack (10 Sec)"]
  D2 --> D3["Attention Residue Trapped on Message"]
  D3 --> D4["Return to Task at 60% Cognitive Bandwidth"]
  D4 --> D5["Superficial Output & Cognitive Fatigue"]`,
        theTrap: {
          title: 'The "Quick Check" Illusion',
          description: 'Believing that looking at your phone or inbox for 10 seconds has zero cost because you didn’t reply immediately.'
        },
        actionSteps: [
          'Work in isolated 90-minute blocks with internet disconnected or blockers enabled.',
          'Batch administrative tasks into designated 45-minute windows in the late afternoon.',
          'Establish a non-negotiable end-of-day shutdown ritual to quiet the Zeigarnik effect.'
        ],
        comparisonTable: {
          headers: ['Work Dimension', 'The Hyperactive Hive Mind', 'Deep Work Professional Execution'],
          rows: [
            ['Communication Style', 'Constant, unstructured ping-pong all day', 'Batched, process-centric, asynchronous'],
            ['Metric of Success', 'Speed of response to colleagues', 'Quality and volume of high-value deliverables'],
            ['Cognitive State', 'Fragmented, distracted, exhausted', 'Calm, focused, deeply absorbed flow'],
            ['Economic Value', 'Easily replicable / low marginal value', 'Rare, durable, high economic leverage']
          ]
        },
        checkableTakeaways: [
          {
            id: 'dw-tk-1',
            timestamp: '00:11:30',
            seconds: 690,
            category: 'Key Insight',
            text: 'Every quick check of your inbox leaves attention residue that impairs cognitive performance for 20 minutes.',
            checked: false,
            penKey: 'star'
          },
          {
            id: 'dw-tk-2',
            timestamp: '00:22:15',
            seconds: 1335,
            category: 'Action Rule',
            text: 'Institute an explicit evening shutdown ritual to eliminate the Zeigarnik effect and protect recovery.',
            checked: false,
            penKey: 'check'
          }
        ],
        quickRecall: {
          question: 'What is attention residue and how does it destroy analytical productivity?',
          answer: 'Attention residue occurs when switching tasks; part of your working memory remains anchored to the previous message or task, significantly degrading performance on the new task.',
          coreTakeaway: 'Single-task with zero switches to keep 100% of your cognitive horsepower online.'
        }
      }
    ]
  }
];

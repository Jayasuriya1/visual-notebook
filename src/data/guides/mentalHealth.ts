import { StudyTextbook } from '../../types';

export const MENTAL_HEALTH_GUIDES: StudyTextbook[] = [
  {
    id: 'huberman-adhd-focus-protocols',
    categoryId: 'cat-mental-health-adhd',
    videoTitle: 'Executive Focus & Attentional Protocols',
    speaker: 'Dr. Andrew Huberman, Ph.D. (Stanford School of Medicine)',
    duration: '2h 18m',
    videoId: 'LAwBdRR4wQk',
    videoUrl: 'https://www.youtube.com/watch?v=LAwBdRR4wQk',
    thumbnailUrl: 'https://i.ytimg.com/vi/LAwBdRR4wQk/hqdefault.jpg',
    generatedAt: 'Master Reference Edition',
    isPreset: true,
    createdAt: 1700000010000,
    executiveSummary: 'Focus is not a mysterious gift or moral virtue; it is an executive regulatory system where the brain allocates attention to high-value goals. By tuning the dopamine-to-norepinephrine ratio, leveraging visual gaze anchoring, and applying structured focus intervals, any learner can unlock sustained deep execution while eliminating task-initiation paralysis.',
    masterMindmapMermaid: `graph TD
  A["Executive Focus Architecture"] --> B["Prefrontal Regulation"]
  A --> C["Dopamine Tuning"]
  A --> D["Behavioral Anchors"]
  B --> B1["Default Mode vs. Task-Positive Network"]
  B --> B2["Top-Down Attentional Gating"]
  C --> C1["Low Tonic Dopamine Pool"]
  C --> C2["High Phasic Salience Seeking"]
  D --> D1["Visual Gaze Restraint (Focal Point)"]
  D --> D2["40Hz Binaural Beats & White Noise"]
  D --> D3["Timed 90-Min Ultradian Cycles"]`,
    dailyProtocol: {
      title: 'Executive Focus & Attentional Gating Protocol',
      subtitle: 'Circadian neurochemical tuning designed to stabilize dopamine baselines and eliminate task-initiation paralysis.',
      dailyAnchorQuote: 'Focus follows visual gaze. Restrain your physical field of view to restrain your mental drift.',
      blocks: [
        {
          id: 'adhd-p1',
          timeWindow: '06:30 - 08:00 AM (0–60 Min Post-Wake)',
          phaseName: 'Phase 1: Tonic Dopamine Priming & Photic Trigger',
          coreConcept: 'Morning ocular sunlight triggers an early peak in cortisol and resets dopamine receptors across the ventral striatum.',
          doThis: {
            action: 'View 10-15 minutes of direct morning sunlight outdoors without sunglasses. Drink 500ml water with 1/4 tsp mineral salt. Delay morning caffeine 90 minutes.',
            tacticalCue: 'Place sneakers and a water bottle directly beside your bed the night before; step outside immediately upon waking.'
          },
          dontDoThis: {
            trap: 'DO NOT touch social media feeds, text messages, or notifications while lying in bed.',
            whyTrapDamages: 'Early morning digital hits deliver unearned phasic dopamine surges, exhausting synaptic vesicle reserves before cognitive work begins.'
          },
          biologicalWhy: 'Suprachiasmatic nucleus stimulation via melanopsin retinal ganglion cells synchronizes autonomic arousal and prevents mid-morning dopamine crashes.'
        },
        {
          id: 'adhd-p2',
          timeWindow: '09:00 AM - 12:00 PM (High-Friction Sprint)',
          phaseName: 'Phase 2: Visual Gaze Anchoring & 40Hz Audio Shield',
          coreConcept: 'Visual focal point determines cognitive focus. The eyes and prefrontal cortex share identical neural steering circuits.',
          doThis: {
            action: 'Stare at a single focal point (crosshair on screen or wall) for 60 seconds before initiating work. Play 40Hz binaural beats or low-intensity brown noise during your 90-minute sprint.',
            tacticalCue: 'When mental resistance peaks around minute 15, whisper: "Friction is the chemical signature of neuroplasticity; my circuits are rewiring."'
          },
          dontDoThis: {
            trap: 'DO NOT leave open email, messaging, or multi-tab browsers visible on screen.',
            whyTrapDamages: 'Visual clutter fractures attentional gating and forces the prefrontal cortex to exhaust its glucose reserves on micro-inhibition.'
          },
          biologicalWhy: 'Visual fixation activates the frontal eye fields (FEF) and locus coeruleus, elevating local acetylcholine and norepinephrine for sharp attentional focus.'
        },
        {
          id: 'adhd-p3',
          timeWindow: '01:30 - 03:00 PM (Afternoon Recovery)',
          phaseName: 'Phase 3: Striatal Reset via Non-Sleep Deep Rest (NSDR)',
          coreConcept: 'The afternoon circadian dip depletes striatal neurotransmitters. Passive autonomic relaxation recharges reserves faster than stimulants.',
          doThis: {
            action: 'Recline in a quiet room with an eye mask and perform 15-20 minutes of NSDR (guided body scan / Yoga Nidra).',
            tacticalCue: 'Set an alarm for 1:45 PM labeled "Striatal Vesicle Recharge". Recline with feet slightly elevated.'
          },
          dontDoThis: {
            trap: 'DO NOT drink a high-sugar energy drink or take late stimulants after 2:00 PM.',
            whyTrapDamages: 'Late caffeine blocks adenosine receptors without clearing cellular fatigue and disrupts tonight’s slow-wave sleep architecture.'
          },
          biologicalWhy: 'Brain imaging confirms NSDR increases dopamine pools in the ventral striatum by up to 65% without biochemical exhaustion.'
        },
        {
          id: 'adhd-p4',
          timeWindow: '08:30 - 10:30 PM (Evening Quarantine)',
          phaseName: 'Phase 4: Melatonin Defense & Launchpad Staging',
          coreConcept: 'Tomorrow morning’s executive function is manufactured tonight by eliminating overhead photons and setting sensory cues.',
          doThis: {
            action: 'Switch off overhead lights. Use floor-level amber lighting. Write tomorrow’s single primary task on one physical yellow card and place it centered on your keyboard.',
            tacticalCue: 'Charge your phone in the kitchen or bathroom outside the bedroom so morning impulse use is impossible.'
          },
          dontDoThis: {
            trap: 'DO NOT view blue-lit screens in bed or engage in emotionally intense debates after 9:00 PM.',
            whyTrapDamages: 'Blue photons between 10 PM and 4 AM trigger the lateral habenula, suppressing dopamine output for the subsequent 48 hours.'
          },
          biologicalWhy: 'Lateral habenula activation suppresses VTA dopamine neurons, inducing waking dread and acute executive paralysis the following morning.'
        }
      ]
    },
    chapters: [
      {
        chapterNumber: 1,
        title: 'Neural Circuits of Focus: Top-Down Gating & The Attentional Spotlight',
        timestampRange: '00:05:00 - 00:32:15',
        startSeconds: 300,
        coreConcepts: [
          'Attention is governed by a tripartite network: the Default Mode Network (mind-wandering), the Central Executive Network (goal-directed action), and the Salience Network (filtering relevant stimuli).',
          'When baseline dopamine in the prefrontal cortex drops, inhibitory signals required to quiet down the Default Mode Network weaken, resulting in intrusive sensory thoughts and hyper-distractibility.',
          'Dopamine and norepinephrine act in concert: dopamine narrows the attentional spotlight, while norepinephrine increases the brightness and signal-to-noise ratio.'
        ],
        anchorKeywords: ['Default Mode Network', 'Central Executive Network', 'Top-Down Gating', 'Locus Coeruleus', 'Signal-to-Noise Ratio'],
        mentalModelTitle: 'The Spotlight and Dimmer Switch',
        mentalModelExplanation: 'Imagine your prefrontal cortex operating a stage spotlight. In high-focus states, dopamine tightens the spotlight to a narrow beam on the lead actor while dimming the background stage. When baseline dopamine is low or unfocused, the spotlight is wide, flickering, and illuminated everywhere at once. The goal of focus protocols is not to work harder, but to turn the neurochemical dimmer knob to tighten the focal beam.',
        mermaidDiagram: `graph TD
  A1["Low Tonic Dopamine Pool"] --> A2["Weak Prefrontal Gating"]
  A2 --> A3["Default Mode Network Stays Active"]
  A3 --> A4["Sensory Intrusions & Mind Wandering"]
  A4 --> A5["Acute Task Initiation Paralysis"]`,
        theTrap: {
          title: 'The Willpower Myth: "I Just Need to Try Harder"',
          description: 'Believing that sheer moral willpower can compensate for neurochemical exhaustion. This creates cognitive fatigue, shame spirals, and chronic burnout.'
        },
        actionSteps: [
          'Externalize executive memory: keep instructions at eye level on physical sticky notes.',
          'Adopt the 60-second visual fixation drill prior to launching demanding tasks.',
          'Use 40Hz binaural audio during cognitively demanding sprints to stimulate gamma oscillations.'
        ],
        comparisonTable: {
          headers: ['Attentional State', 'Default/Distracted State', 'Applied Focus Protocol State'],
          rows: [
            ['Tonic Dopamine', 'Low, fragmented circulating baseline', 'Optimized circulating baseline through circadian photic triggers'],
            ['Task Initiation', 'High friction requiring novelty, urgency, or fear', 'Low activation barrier using visual gaze fixation drills'],
            ['Blinking Rate', 'Elevated blinking; correlates with dopamine dips', 'Stabilized blinking rate indicating sustained engagement'],
            ['Recovery State', 'Prolonged cognitive delay after interruptions', 'Rapid 60-second re-anchoring to primary focus target']
          ]
        },
        checkableTakeaways: [
          {
            id: 'adhd-tk-1',
            timestamp: '00:12:45',
            seconds: 765,
            category: 'Key Insight',
            text: 'Focus is not an inability to try hard; it is an executive skill of regulating where attention is allocated.',
            checked: false,
            penKey: 'star'
          },
          {
            id: 'adhd-tk-2',
            timestamp: '00:24:10',
            seconds: 1450,
            category: 'Action Rule',
            text: 'Stare at a single physical point for 60 seconds before initiating deep work to manually recruit the frontal eye fields.',
            checked: false,
            penKey: 'check'
          }
        ],
        quickRecall: {
          question: 'Why does visual gaze fixation directly enhance cognitive focus?',
          answer: 'Because the neural circuits controlling eye position (frontal eye fields) directly overlap with prefrontal attentional networks. Locking your visual gaze physically commands prefrontal circuits to lock onto the task.',
          coreTakeaway: 'Focus follows visual gaze. Narrow the eyes to narrow the mind.'
        }
      },
      {
        chapterNumber: 2,
        title: 'Blinking, Time Perception & The 40Hz Gamma Auditory Entrainment',
        timestampRange: '00:45:00 - 01:15:30',
        startSeconds: 2700,
        coreConcepts: [
          'Dopamine controls our internal clock and subjective perception of time. When dopamine is low, time feels agonizingly slow during boring tasks, inducing intense agitation.',
          'Spontaneous eye blink rate is a direct biological readout of central dopamine levels in the striatum. More frequent blinking indicates declining dopamine reserves.',
          'Acoustic stimulation at 40Hz (gamma oscillation) synchronizes cortical pyramidal neurons, enhancing local cerebral blood flow and focus stamina.'
        ],
        anchorKeywords: ['Blink Rate', 'Striatal Dopamine', 'Time Perception', '40Hz Gamma Beats', 'Pyramidal Neurons'],
        mentalModelTitle: 'The Movie Shutter Speed Analogy',
        mentalModelExplanation: 'Your brain slices time into chronological frames through eye blinks and saccades, just like a film projector shutter. When dopamine surges, the shutter speed speeds up and you capture crisp, high-framerate moments. When dopamine drops, the shutter slows and stutters, making seconds feel like minutes. 40Hz audio acts like an external metronome, steadying the projector gears.',
        mermaidDiagram: `graph TD
  B1["40Hz Acoustic Stimulation"] --> B2["Auditory Cortex Entrainment"]
  B2 --> B3["Prefrontal Gamma Wave Synchronization"]
  B3 --> B4["Enhanced Pyramidal Neuron Coherence"]
  B4 --> B5["Sustained Attentional Endurance"]`,
        theTrap: {
          title: 'Working in Over-Stimulating Audio Environments',
          description: 'Listening to fast-tempo music with lyrics while attempting cognitively complex work, which depletes working memory buffers.'
        },
        actionSteps: [
          'Download pure 40Hz binaural beats or use brown noise generators during reading blocks.',
          'Set a 90-minute hard timer to respect the brain’s ultradian focus rhythm.',
          'Take a 3-minute screen-free gap every 30 minutes to allow spontaneous dopamine replenishment.'
        ],
        comparisonTable: {
          headers: ['Audio Environment', 'Dopamine Impact', 'Cognitive Focus Utility'],
          rows: [
            ['Lyrics & Pop Music', 'Causes attention residue & lyrical processing', 'Harmful for high-friction learning'],
            ['White / Brown Noise', 'Suppresses sensory background chatter', 'Excellent for task initiation'],
            ['40Hz Binaural Beats', 'Promotes gamma wave cortical coherence', 'Superior for 60-90 min focus sprints'],
            ['Complete Silence', 'Can amplify internal Default Mode mind-wandering', 'Effective only in zero-distraction zones']
          ]
        },
        checkableTakeaways: [
          {
            id: 'adhd-tk-3',
            timestamp: '00:54:20',
            seconds: 3260,
            category: 'Key Insight',
            text: 'Your eye blink rate is a real-time biological indicator of dopamine levels in the brain.',
            checked: false,
            penKey: 'circle'
          },
          {
            id: 'adhd-tk-4',
            timestamp: '01:08:15',
            seconds: 4095,
            category: 'Action Rule',
            text: 'Limit focus work blocks to 90 minutes maximum to align with internal ultradian biological cycles.',
            checked: false,
            penKey: 'check'
          }
        ],
        quickRecall: {
          question: 'What is the biological mechanism behind 40Hz binaural beats for focus?',
          answer: '40Hz acoustic frequencies entrain cortical networks to oscillate in the gamma band, enhancing local synchrony among prefrontal pyramidal neurons and improving working memory capacity.',
          coreTakeaway: 'Sound frequencies can physically synchronize cognitive neural oscillations.'
        }
      }
    ]
  },
  {
    id: 'huberman-bipolar-mood-regulation',
    categoryId: 'cat-mental-health-adhd',
    videoTitle: 'Clinical Psychiatry & Severe Mood Regulation (Bipolar Disorder)',
    speaker: 'Dr. Andrew Huberman, Ph.D. (Stanford School of Medicine)',
    duration: '2h 19m',
    videoId: 'm_OazsImOiI',
    videoUrl: 'https://www.youtube.com/watch?v=m_OazsImOiI',
    thumbnailUrl: 'https://i.ytimg.com/vi/m_OazsImOiI/hqdefault.jpg',
    generatedAt: 'Master Reference Edition',
    isPreset: true,
    createdAt: 1700000011000,
    executiveSummary: 'Bipolar disorder (Type 1 and Type 2) represents a severe dysregulation of the neural circuits governing energy, mood, and circadian pacing. By understanding the fronto-limbic architecture and enforcing strict Social Rhythm Therapy (SRT) alongside medical care, individuals can anchor their circadian rhythms and defend cognitive stability.',
    masterMindmapMermaid: `graph TD
  BP["Bipolar Neural Regulation"] --> BP1["Circuitry Architecture"]
  BP --> BP2["Circadian Vulnerability"]
  BP --> BP3["Therapeutic Scaffolding"]
  BP1 --> BP1A["Hyperactive Amygdala & Ventral Striatum"]
  BP1 --> BP1B["Blunted Dorsolateral Prefrontal Inhibition"]
  BP2 --> BP2A["Suprachiasmatic Desynchronization"]
  BP2 --> BP2B["Sleep Deprivation as Manic Trigger"]
  BP3 --> BP3A["Social Rhythm Therapy (SRT)"]
  BP3 --> BP3B["Photic Dark Therapy at Night"]
  BP3 --> BP3C["Medical & Inositol Stabilization"]`,
    dailyProtocol: {
      title: 'Circadian Stabilization & Mood Rhythm Protocol',
      subtitle: 'Strict social and biological pacing designed to guard sleep architecture and prevent neural hyper-arousal.',
      dailyAnchorQuote: 'For mood stability, the clock in your eye must match the clock on your wall with zero variability.',
      blocks: [
        {
          id: 'bp-p1',
          timeWindow: '07:00 - 08:30 AM (Strict Awakening Window)',
          phaseName: 'Phase 1: Invariable Rise Time & Lux Anchor',
          coreConcept: 'Awakening at the exact same minute every single day is the single most potent non-pharmacological mood stabilizer in psychiatry.',
          doThis: {
            action: 'Wake up at the exact same time 7 days a week (variance < 15 minutes). View 15-20 minutes of morning sunlight outside within 30 minutes of waking.',
            tacticalCue: 'Never use blackout curtains without a sunrise simulation alarm clock.'
          },
          dontDoThis: {
            trap: 'DO NOT sleep in on weekends or lie in bed for hours after waking up.',
            whyTrapDamages: 'Shifting awakening time by even 60 minutes disrupts the suprachiasmatic nucleus, triggering rapid mood phase shifts.'
          },
          biologicalWhy: 'Fixed morning photic stimulation prevents phase-advance or phase-delay anomalies in melatonin and cortisol rhythmicity.'
        },
        {
          id: 'bp-p2',
          timeWindow: '12:00 - 01:30 PM (Social Rhythm Anchor)',
          phaseName: 'Phase 2: Regularized Meal & Social Contact Timing',
          coreConcept: 'Peripheral cellular clocks in the liver and muscles are calibrated by meal timing and social cues (zeitgebers).',
          doThis: {
            action: 'Eat lunch at the exact same hour every day. Engage in at least 5 minutes of low-stress, positive social interaction.',
            tacticalCue: 'Schedule lunch in your calendar as a non-negotiable medical appointment.'
          },
          dontDoThis: {
            trap: 'DO NOT skip meals or engage in erratic intermittent fasting during periods of high stress.',
            whyTrapDamages: 'Erratic metabolic signaling destabilizes glycogen availability in the frontal cortex, heightening irritability.'
          },
          biologicalWhy: 'Social Rhythm Therapy demonstrates that consistent daily zeitgebers dramatically reduce the frequency of depressive and hypomanic relapses.'
        },
        {
          id: 'bp-p3',
          timeWindow: '08:30 - 10:00 PM (Dark Therapy Protection)',
          phaseName: 'Phase 3: Dark Therapy & Blue-Light Shielding',
          coreConcept: 'The bipolar brain is hypersensitive to evening light. Virtual darkness stabilizes manic vulnerability.',
          doThis: {
            action: 'Turn off all overhead lighting at 8:30 PM sharp. Wear certified amber/orange blue-blocking glasses if using any screen.',
            tacticalCue: 'Install low-wattage red nightlights in the hallway and bathroom.'
          },
          dontDoThis: {
            trap: 'DO NOT expose your eyes to bright ceiling lights or phone screens after 9:00 PM.',
            whyTrapDamages: 'Evening photic stimulation suppresses melatonin synthesis and acts as a biological spark for hypomanic sleep loss.'
          },
          biologicalWhy: 'Clinical dark therapy enforces melatonin onset and prevents nocturnal dopamine release in the ventral striatum.'
        }
      ]
    },
    chapters: [
      {
        chapterNumber: 1,
        title: 'Bipolar Types 1 vs 2, Brain Circuitry & The Fronto-Limbic Seesaw',
        timestampRange: '00:08:00 - 00:36:40',
        startSeconds: 480,
        coreConcepts: [
          'Bipolar 1 involves full-blown manic episodes lasting at least 7 days, often accompanied by psychosis, grandiosity, and dangerous impulsivity. Bipolar 2 is characterized by hypomanic states and protracted, severe depressive episodes.',
          'Neuroimaging shows an imbalance: hyper-reactivity in the amygdala and nucleus accumbens combined with blunted inhibitory control from the dorsolateral prefrontal cortex.',
          'Sleep reduction is not merely a symptom of mania; it is the primary causal trigger that drives brain circuits into uncontrolled feedback loops.'
        ],
        anchorKeywords: ['Bipolar 1', 'Bipolar 2', 'Hypomania', 'Amygdala Hyperactivity', 'Prefrontal Inhibition'],
        mentalModelTitle: 'The Accelerator and Broken Brake Pedal',
        mentalModelExplanation: 'Imagine driving a race car where the gas pedal (ventral striatum and limbic dopamine) gets jammed to the floorboard during mania, while the hydraulic brakes (prefrontal cortex) lose fluid. In depressive phases, the engine stalls completely. Clinical stabilization repairs the hydraulic brake line so the vehicle stays within safe highway lanes.',
        mermaidDiagram: `graph TD
  M1["Sleep Deprivation / Photoperiod Shift"] --> M2["Hyper-Arousal in Limbic Circuits"]
  M2 --> M3["Loss of Prefrontal Brake Function"]
  M3 --> M4["Uncontrolled Manic / Hypomanic Escalation"]
  M4 --> M5["Severe Depressive Crash & Exhaustion"]`,
        theTrap: {
          title: 'Romancing the Hypomanic High',
          description: 'Believing that hypomania is a harmless superpower of pure creativity, while ignoring the catastrophic biological depression and relationship damage that inevitably follows.'
        },
        actionSteps: [
          'Track daily sleep duration with an objective wearable or paper sleep log.',
          'Identify personal prodromal warning signs (e.g., waking at 4 AM full of energy, speaking faster than usual).',
          'Coordinate closely with a psychiatrist for mood-stabilizing medication protocols.'
        ],
        comparisonTable: {
          headers: ['Diagnostic Dimension', 'Bipolar Type 1', 'Bipolar Type 2'],
          rows: [
            ['Manic Severity', 'Full mania (often requires hospitalization)', 'Hypomania (no psychosis; highly energized)'],
            ['Depressive Burden', 'Severe depressive crashes common', 'Predominantly chronic, protracted depressive episodes'],
            ['Sleep Behavior', 'Severe reduction (< 3 hours with zero fatigue)', 'Noticeably reduced sleep with elevated goal activity'],
            ['Diagnostic Marker', 'At least 1 full manic episode in lifetime', 'At least 1 hypomanic + 1 major depressive episode']
          ]
        },
        checkableTakeaways: [
          {
            id: 'bp-tk-1',
            timestamp: '00:16:30',
            seconds: 990,
            category: 'Key Insight',
            text: 'Sleep deprivation is the most potent biological trigger for manic phase shifts.',
            checked: false,
            penKey: 'star'
          },
          {
            id: 'bp-tk-2',
            timestamp: '00:31:00',
            seconds: 1860,
            category: 'Action Rule',
            text: 'Treat consistent sleep timing as a medical imperative, not a lifestyle preference.',
            checked: false,
            penKey: 'check'
          }
        ],
        quickRecall: {
          question: 'What is the primary neurocircuit difference during a manic episode?',
          answer: 'The amygdala and striatum become hyperactive with high dopamine signalling, while the dorsolateral prefrontal cortex fails to provide top-down inhibitory control.',
          coreTakeaway: 'Mania is an over-accelerated limbic engine with disconnected cognitive brakes.'
        }
      }
    ]
  },
  {
    id: 'lembke-dopamine-nation',
    categoryId: 'cat-mental-health-adhd',
    videoTitle: 'Addiction Medicine, Self-Control & Dopamine Fasting',
    speaker: 'Dr. Anna Lembke, M.D. (Chief of Addiction Medicine, Stanford) & Mel Robbins',
    duration: '1h 08m',
    videoId: 'E4rTyhYfZhE',
    videoUrl: 'https://www.youtube.com/watch?v=E4rTyhYfZhE',
    thumbnailUrl: 'https://i.ytimg.com/vi/E4rTyhYfZhE/hqdefault.jpg',
    generatedAt: 'Master Reference Edition',
    isPreset: true,
    createdAt: 1700000012000,
    executiveSummary: 'Pleasure and pain are co-localized on the exact same neurological seesaw. In our hyper-digital environment, continuous consumption of cheap digital dopamine summons homeostatic neuroadaptation gremlins that weigh down the pain side, locking the modern mind into perpetual restlessness, anxiety, and task paralysis.',
    masterMindmapMermaid: `graph TD
  L1["The Pleasure-Pain Seesaw"] --> L2["The Gremlin Effect"]
  L1 --> L3["Modern Digital Traps"]
  L1 --> L4["The 4-Week Reset"]
  L2 --> L2A["Homeostatic Neuroadaptation"]
  L2 --> L2B["Protracted Pain Dip (Craving)"]
  L3 --> L3A["Infinite Access & Potency"]
  L3 --> L3B["Novelty & Uncertainty Loops"]
  L4 --> L4A["Days 1-14: The Withdrawal Hump"]
  L4 --> L4B["Days 15-30: Homeostasis Restored"]
  L4 --> L4C["Night-Before Self-Binding"]`,
    dailyProtocol: {
      title: 'Pleasure-Pain Seesaw Equilibrium & Self-Binding Protocol',
      subtitle: 'Defeating neuroadaptation gremlins and establishing homeostatic balance in a high-dopamine world.',
      dailyAnchorQuote: 'The price of chronic digital indulgence is protracted neurochemical pain. Guard your balance.',
      blocks: [
        {
          id: 'lem-p1',
          timeWindow: '07:00 - 08:30 AM (Morning Buffer)',
          phaseName: 'Phase 1: Dopamine Fasting Zone (Zero Cheap Hits)',
          coreConcept: 'Morning hours set the baseline tilt of your pleasure-pain seesaw. Early digital hits attract gremlins that weigh down the rest of your day.',
          doThis: {
            action: 'Maintain a 60-minute analog buffer upon waking: make your bed, take a warm/cold contrast shower, eat protein, read physical print.',
            tacticalCue: 'Keep your phone inside a physical time-lock container or high kitchen cabinet until 8:30 AM.'
          },
          dontDoThis: {
            trap: 'DO NOT use your smartphone as your bedroom alarm clock or touch it before breakfast.',
            whyTrapDamages: 'Reaching for your phone first thing slams the pleasure side down, summoning a swarm of gremlins that linger on the pain side all morning.'
          },
          biologicalWhy: 'Homeostatic neuroadaptation downregulates dopamine D2 receptors within minutes of hyper-stimulation, inducing acute attentional deficit.'
        },
        {
          id: 'lem-p2',
          timeWindow: '09:30 AM - 01:00 PM (Deep Engagement)',
          phaseName: 'Phase 2: Categorical Self-Binding at the Point of Work',
          coreConcept: 'Willpower is an exhaustible cognitive myth; physical and digital barriers (self-binding) remove the decision from conscious will.',
          doThis: {
            action: 'Activate app blockers across all devices and disconnect Wi-Fi for 45-minute blocks. Work on one physical document.',
            tacticalCue: 'Place your phone inside a zipped drawer in another room before opening your computer.'
          },
          dontDoThis: {
            trap: 'DO NOT allow open browser tabs with news, messaging, or YouTube running in the background.',
            whyTrapDamages: 'Visual cues trigger anticipatory dopamine surges that fragment working memory and induce micro-cravings every 90 seconds.'
          },
          biologicalWhy: 'Self-binding closes the open loops in the nucleus accumbens, preventing prefrontal ego depletion and eliminating decision friction.'
        },
        {
          id: 'lem-p3',
          timeWindow: '04:00 - 06:00 PM (The Gremlin Influx Hour)',
          phaseName: 'Phase 3: The 10-Minute Urge Surf & Voluntary Discomfort',
          coreConcept: 'Late afternoon brings dopamine depletion and intense craving for relief. Pressing into mild discomfort resets the seesaw toward pleasure.',
          doThis: {
            action: 'When a strong craving for games, social media, or snacking hits, set an analog timer for 10 minutes and execute 20 pushups, air squats, or clean your desk.',
            tacticalCue: 'Say out loud: "These are just homeostatic gremlins. If I wait 10 minutes, they will hop off the seesaw."'
          },
          dontDoThis: {
            trap: 'DO NOT give in immediately to take the edge off the evening exhaustion.',
            whyTrapDamages: 'Relieving gremlin pain with the very substance that caused it deepens the deficit and reinforces the craving neural highway.'
          },
          biologicalWhy: 'Engaging in voluntary mild physical effort pays the dopamine toll upfront on the pain side, prompting the brain to naturally swing to lasting pleasure.'
        },
        {
          id: 'lem-p4',
          timeWindow: '08:30 - 10:30 PM (Evening Quarantine)',
          phaseName: 'Phase 4: Radical Honesty & Evening Self-Binding',
          coreConcept: 'Tomorrow\'s success is engineered tonight when the prefrontal cortex is calm, not tomorrow morning when desires run wild.',
          doThis: {
            action: 'Execute your evening lock-down: shut down computers, log any slips with radical honesty in your journal, and set out tomorrow\'s clothes and notebook.',
            tacticalCue: 'Have an accountability partner or physical lockbox to store devices at 9:00 PM sharp.'
          },
          dontDoThis: {
            trap: 'DO NOT bring laptops, tablets, or phones into the bedroom.',
            whyTrapDamages: 'Bedtime digital browsing floods the ventral striatum with unpredictability, triggering gremlin swarms that ruin deep restorative sleep.'
          },
          biologicalWhy: 'Radical honesty activates the dorsolateral prefrontal cortex, strengthening inhibitory control over impulsive limbic desires.'
        }
      ]
    },
    chapters: [
      {
        chapterNumber: 1,
        title: 'The Pleasure-Pain Seesaw & The Neuroadaptation Gremlins',
        timestampRange: '00:08:30 - 00:27:15',
        startSeconds: 510,
        coreConcepts: [
          'Pleasure and pain are processed in overlapping regions of the nucleus accumbens and prefrontal cortex, operating like a finely calibrated teeter-totter.',
          'Whenever you consume high-dopamine digital content, the seesaw tips toward pleasure. To restore balance, the brain deploys homeostatic counter-measures (Neuroadaptation Gremlins).',
          'The gremlins stay on the pain side long after the pleasure stops, tipping the brain into anxiety, restlessness, and craving.'
        ],
        anchorKeywords: ['Pleasure-Pain Seesaw', 'Homeostasis', 'Neuroadaptation Gremlins', 'Nucleus Accumbens', 'Dysphoria'],
        mentalModelTitle: 'The Heavy Gremlins on the Seesaw',
        mentalModelExplanation: 'Imagine little heavy gremlins sitting beside your brain scale. Every time you binge on reels, you shove the pleasure side down. Ten gremlins scramble onto the pain side to push it level. When you close the app, the pleasure snaps up, but all ten gremlins are still sitting on the pain side. Your brain is now submerged in neurochemical pain, making even basic tasks feel intolerable.',
        mermaidDiagram: `graph TD
  G1["Quick Hit: TikTok / Shorts"] --> G2["Seesaw Tips Toward Pleasure"]
  G2 --> G3["Brain Deploys Neuroadaptation Gremlins"]
  G3 --> G4["Gremlins Pile on Pain Side for Homeostasis"]
  G4 --> G5["App Closed: Pleasure Ends Abruptly"]
  G5 --> G6["Gremlins Remain: Deep Pain / Restlessness Dip"]
  G6 --> G7["Compulsive Craving to Relieve Agitation"]`,
        theTrap: {
          title: 'Treating Restlessness as "I Must Be Bored or Broken"',
          description: 'Interpreting the post-stimulus gremlin dip as personal failure or boredom, and immediately reaching for your phone to numb the discomfort.'
        },
        actionSteps: [
          'Recognize the gremlins out loud: say "These are just homeostatic gremlins; in 10 minutes they hop off."',
          'Use cold physical counter-stimuli: splash cold water or do pushups to stimulate mild discomfort that tips the seesaw to pleasure.',
          'Implement the 10-Minute Urge Surfing Rule before picking up any digital device.'
        ],
        comparisonTable: {
          headers: ['Condition', 'Homeostatic Equilibrium State', 'Dopamine Overload & Dysregulation State'],
          rows: [
            ['Baseline State', 'Seesaw sits near horizontal level', 'Seesaw chronically tilted to the pain/restless side'],
            ['Reaction to Quiet', 'Neutral calm; reflective thought', 'Intense dysphoria and physical sensory hunger'],
            ['Gremlin Population', 'Few gremlins; quick return to baseline', 'Swarm of heavy gremlins requiring hours to clear'],
            ['Solution Path', 'Mild moderation is sufficient', 'Strict radical self-binding and 4-week dopamine fast']
          ]
        },
        checkableTakeaways: [
          {
            id: 'lem-tk-1',
            timestamp: '00:12:45',
            seconds: 765,
            category: 'Key Insight',
            text: 'Pleasure and pain are co-localized on the same neurochemical seesaw in your brain.',
            checked: false,
            penKey: 'star'
          },
          {
            id: 'lem-tk-2',
            timestamp: '00:18:20',
            seconds: 1100,
            category: 'Aha Moment',
            text: 'The craving you feel 5 minutes after putting down your phone is physiological gremlin weight, not genuine desire.',
            checked: false,
            penKey: 'circle'
          }
        ],
        quickRecall: {
          question: 'Why does constant phone checking cause chronic low-grade anxiety and task paralysis?',
          answer: 'Because continuous spikes in dopamine trigger homeostatic counter-weights (gremlins) that camp on the pain side of the neural seesaw, leaving the brain in anhedonia and craving.',
          coreTakeaway: 'Every unearned spike in pleasure is paid back in equal or greater pain.'
        }
      }
    ]
  }
];

import { StudyTextbook } from '../../types';

export const SLEEP_RECOVERY_GUIDES: StudyTextbook[] = [
  {
    id: 'huberman-master-your-sleep',
    categoryId: 'cat-sleep-autonomic-reset',
    videoTitle: 'Circadian Physiology & Sleep Optimization',
    speaker: 'Dr. Andrew Huberman, Ph.D. (Stanford School of Medicine)',
    duration: '2h 08m',
    videoId: 'RTgJSQtvo88',
    videoUrl: 'https://www.youtube.com/watch?v=RTgJSQtvo88',
    thumbnailUrl: 'https://i.ytimg.com/vi/RTgJSQtvo88/hqdefault.jpg',
    generatedAt: 'Master Reference Edition',
    isPreset: true,
    createdAt: 1700000030000,
    executiveSummary: 'Sleep is the fundamental bedrock of mental health, immune capability, memory consolidation, and neurochemical replenishment. By leveraging biological levers—morning photic viewing, adenosine clearing, core body temperature manipulation, and evening dark therapy—anyone can reliably fall asleep within minutes and wake up refreshed.',
    masterMindmapMermaid: `graph TD
  S["Sleep Optimization Engine"] --> S1["Light & Photic Triggers"]
  S --> S2["Adenosine Dynamics"]
  S --> S3["Temperature Rhythm"]
  S1 --> S1A["Morning Sunlight (Melanopsin)"]
  S1 --> S1B["Evening Overhead Darkness"]
  S2 --> S2A["90-Min Caffeine Delay"]
  S2 --> S2B["Homeostatic Sleep Pressure"]
  S3 --> S3A["Drop 1-3°F for Sleep Initiation"]
  S3 --> S3B["Hot Bath Paradox (Vasodilation)"]`,
    dailyProtocol: {
      title: 'Circadian Light & Temperature Sleep Protocol',
      subtitle: 'The non-negotiable biological framework to master sleep onset, deep sleep spindles, and rapid waking energy.',
      dailyAnchorQuote: 'The quality of tonight’s sleep is determined by the light you view within 60 minutes of waking this morning.',
      blocks: [
        {
          id: 'slp-p1',
          timeWindow: '06:30 - 08:00 AM (0–60 Min Post-Wake)',
          phaseName: 'Phase 1: Photic Clock Set & 90-Min Caffeine Delay',
          coreConcept: 'Natural sunlight resets the suprachiasmatic nucleus and starts the 14-hour timer for nocturnal melatonin release.',
          doThis: {
            action: 'Get 10-15 minutes of direct sunlight in your eyes outside. Wait 90-120 minutes before consuming your first cup of coffee.',
            tacticalCue: 'Drink 500ml water before coffee; go outside while holding your water.'
          },
          dontDoThis: {
            trap: 'DO NOT view morning sun through a window, and DO NOT drink coffee immediately upon waking.',
            whyTrapDamages: 'Window glass filters out critical blue/orange wavelengths; immediate caffeine binds adenosine receptors before clearance, guaranteeing an afternoon crash.'
          },
          biologicalWhy: 'Delaying caffeine allows remaining morning adenosine to be naturally metabolized, preventing severe 2 PM fatigue.'
        },
        {
          id: 'slp-p2',
          timeWindow: '06:00 - 07:30 PM (Sunset / Evening Grounding)',
          phaseName: 'Phase 2: Evening Sunset Photic Transition',
          coreConcept: 'Viewing low-angle sunlight in the evening protects retinal ganglion cells from the damaging effects of late-night light.',
          doThis: {
            action: 'Step outside for 5-10 minutes around sunset to view the low-angle orange/yellow horizon light.',
            tacticalCue: 'Combine evening sunset viewing with an easy 10-minute walk.'
          },
          dontDoThis: {
            trap: 'DO NOT sit under 1000-lux fluorescent ceiling lights during dinner.',
            whyTrapDamages: 'Harsh overhead light signals the brain that it is midday, delaying melatonin synthesis by hours.'
          },
          biologicalWhy: 'Sunset light recalibrates the sensitivity of retinal ganglion cells, making your eyes more resilient to evening screens.'
        },
        {
          id: 'slp-p3',
          timeWindow: '09:00 - 10:30 PM (Thermal Drop & Melatonin Surge)',
          phaseName: 'Phase 3: Core Body Temperature Drop & Sleep Launch',
          coreConcept: 'The brain must drop core body temperature by 1 to 3 degrees Fahrenheit to enter deep slow-wave sleep.',
          doThis: {
            action: 'Take a hot bath or shower 60 minutes before bed; make the bedroom cold (65-68°F). Keep lamps below eye level.',
            tacticalCue: 'The hot bath causes vasodilation, dumping heat from your hands and feet to rapidly drop your core temperature.'
          },
          dontDoThis: {
            trap: 'DO NOT exercise intensely or eat a massive heavy meal within 2 hours of bedtime.',
            whyTrapDamages: 'Digestion and heavy exercise elevate core body temperature and sympathetic tone, inhibiting sleep initiation.'
          },
          biologicalWhy: 'Peripheral vasodilation triggers rapid core cooling, activating the ventrolateral preoptic nucleus (VLPO) sleep center.'
        }
      ]
    },
    chapters: [
      {
        chapterNumber: 1,
        title: 'Photic Entrainment: The Suprachiasmatic Nucleus & Retinal Melanopsin',
        timestampRange: '00:05:00 - 00:34:10',
        startSeconds: 300,
        coreConcepts: [
          'The master circadian clock lives in the Suprachiasmatic Nucleus (SCN) of the hypothalamus, entrained specifically by light detected by intrinsically photosensitive retinal ganglion cells (ipRGCs).',
          'Morning sunlight delivers massive lux values (10,000 to 50,000+ lux) that indoor artificial lights (200-500 lux) cannot replicate.',
          'Viewing sunlight within 60 minutes of waking triggers an optimal cortisol spike that anchors wakefulness and starts the internal timer for melatonin.'
        ],
        anchorKeywords: ['Suprachiasmatic Nucleus', 'Retinal Ganglion Cells', 'Melanopsin', 'Cortisol Awakening Spike', 'Melatonin Rhythm'],
        mentalModelTitle: 'The Master Ship Chronometer',
        mentalModelExplanation: 'Imagine an old sailing ship on the ocean with hundreds of clocks in the cabins. If the captain does not calibrate the master chronometer every morning at sunrise using the sextant, each individual clock drifts. Within a few days, the crew is eating and sleeping at chaotic hours. Your eyes are the sextant; morning sunlight is the reading that resets the ship’s master clock.',
        mermaidDiagram: `graph TD
  P1["Morning Photons Enter Eye (No Window)"] --> P2["ipRGCs Detect Blue/Orange Light"]
  P2 --> P3["Retinohypothalamic Tract Signals SCN"]
  P3 --> P4["Sharp Morning Cortisol Pulse (Alertness)"]
  P4 --> P5["14-Hour Melatonin Synthesis Timer Initiated"]`,
        theTrap: {
          title: 'Viewing Sunlight Through Window Glass or Sunglasses',
          description: 'Window glass filters out over 50x of the photons required to stimulate ipRGCs, rendering the light ineffective for circadian resetting.'
        },
        actionSteps: [
          'Step outside for 10-15 minutes every morning without sunglasses.',
          'On overcast days, increase exposure time to 20-30 minutes.',
          'Dim all overhead indoor lights starting at sunset; rely exclusively on low-level amber lamps.'
        ],
        comparisonTable: {
          headers: ['Light Environment', 'Typical Lux Value', 'Circadian Biological Impact'],
          rows: [
            ['Direct Outdoor Sunlight', '50,000 - 100,000 Lux', 'Instant, perfect SCN entrainment & peak alertness'],
            ['Cloudy Outdoor Morning', '10,000 - 20,000 Lux', 'Sufficient for SCN with 20-30 min exposure'],
            ['Behind a Glass Window', '1,000 - 2,500 Lux', 'Significantly attenuated; takes 5x longer to work'],
            ['Standard Indoor Room', '200 - 500 Lux', 'Completely inadequate for waking; catastrophic at night']
          ]
        },
        checkableTakeaways: [
          {
            id: 'slp-tk-1',
            timestamp: '00:12:15',
            seconds: 735,
            category: 'Key Insight',
            text: 'Morning sunlight sets both your daytime alertness and your nighttime melatonin release timer.',
            checked: false,
            penKey: 'star'
          },
          {
            id: 'slp-tk-2',
            timestamp: '00:28:40',
            seconds: 1720,
            category: 'Action Rule',
            text: 'Delay caffeine for 90 to 120 minutes after waking to eliminate the afternoon energy crash.',
            checked: false,
            penKey: 'check'
          }
        ],
        quickRecall: {
          question: 'Why does delaying morning caffeine by 90-120 minutes prevent the dreaded afternoon crash?',
          answer: 'Because caffeine does not eliminate adenosine; it only blocks adenosine receptors. Waiting 90 minutes allows remaining morning adenosine to be naturally cleared before caffeine binds the receptors.',
          coreTakeaway: 'Clear adenosine naturally first; then introduce caffeine for pure alertness.'
        }
      }
    ]
  },
  {
    id: 'huberman-20-min-nsdr-recovery',
    categoryId: 'cat-sleep-autonomic-reset',
    videoTitle: 'Deep Autonomic Recovery (20-Min NSDR)',
    speaker: 'Dr. Andrew Huberman, Ph.D. (Stanford School of Medicine)',
    duration: '21m',
    videoId: 'hEypv90GzDE',
    videoUrl: 'https://www.youtube.com/watch?v=hEypv90GzDE',
    thumbnailUrl: 'https://i.ytimg.com/vi/hEypv90GzDE/hqdefault.jpg',
    generatedAt: 'Master Reference Edition',
    isPreset: true,
    createdAt: 1700000031000,
    executiveSummary: 'Non-Sleep Deep Rest (NSDR / Yoga Nidra) is a deliberate physiological tool that places the brain into an autonomic state of deep physical relaxation while retaining conscious awareness. Scientific studies show that a single 20-minute NSDR session restores striatal dopamine reserves by up to 65% and compensates for acute sleep debt.',
    masterMindmapMermaid: `graph TD
  N20["20-Min NSDR Architecture"] --> N20A["Parasympathetic Braking"]
  N20 --> N20B["Striatal Dopamine Reset"]
  N20 --> N20C["Neuroplasticity Consolidation"]
  N20A --> N20A1["Long Exhalations (Vagus Activation)"]
  N20A --> N20A2["Reduced Heart Rate Variability Recovery"]
  N20B --> N20B1["65% Increase in Ventral Striatal Dopamine"]
  N20C --> N20C1["Accelerated Memory Consolidation"]`,
    dailyProtocol: {
      title: '20-Minute Deep Autonomic NSDR Protocol',
      subtitle: 'The master restorative practice to offset sleep deprivation, conquer brain fog, and accelerate learning.',
      dailyAnchorQuote: 'Rest is not the absence of work; it is the biological process that allows work to occur.',
      blocks: [
        {
          id: 'nsdr20-p1',
          timeWindow: '12:30 - 02:30 PM (Midday Circadian Dip)',
          phaseName: 'Phase 1: 20-Minute Recline & Breath Deceleration',
          coreConcept: 'Entering a semi-conscious theta wave state resets the autonomic nervous system without sleep inertia.',
          doThis: {
            action: 'Recline in a quiet room, put on an eye mask, play the 20-minute guided NSDR track, and emphasize long slow exhalations.',
            tacticalCue: 'Exhale twice as long as you inhale to stimulate the vagus nerve and slow heart rate.'
          },
          dontDoThis: {
            trap: 'DO NOT fall into a 90-minute deep sleep nap that leaves you groggy and ruins night sleep.',
            whyTrapDamages: 'Entering Stage 3 and 4 delta sleep in the late afternoon produces severe sleep inertia and delays night sleep onset.'
          },
          biologicalWhy: 'NSDR preserves light alpha/theta states, allowing dopamine replenishment without disrupting sleep pressure.'
        }
      ]
    },
    chapters: [
      {
        chapterNumber: 1,
        title: 'The Science of Non-Sleep Deep Rest: Vagal Tone & Striatal Dopamine',
        timestampRange: '00:00:00 - 00:21:00',
        startSeconds: 0,
        coreConcepts: [
          'NSDR guides the brain from alert beta waves down through alpha waves and into deeply restorative theta oscillations.',
          'Unlike traditional napping, NSDR does not produce sleep inertia (grogginess), allowing you to immediately return to deep work.',
          'Dopamine replenishment in the ventral striatum enables prolonged cognitive stamina for the second half of the day.'
        ],
        anchorKeywords: ['NSDR', 'Yoga Nidra', 'Theta Waves', 'Parasympathetic Tone', 'Vagus Nerve'],
        mentalModelTitle: 'The Pit Stop Tire Change',
        mentalModelExplanation: 'Imagine running a Formula 1 race. You cannot drive all 70 laps without tires wearing down to the rims. Trying to brute-force through afternoon brain fog is like racing on shredded rubber. A 20-minute NSDR session is a lightning-fast pit stop: new tires, full tank, zero damage.',
        mermaidDiagram: `graph TD
  R1["20-Min NSDR Guidance"] --> R2["Prolonged Exhalations Trigger Vagus Nerve"]
  R2 --> R3["Heart Rate Slows (Parasympathetic Dominance)"]
  R3 --> R4["Cortical Theta Wave Emergence"]
  R4 --> R5["Ventral Striatal Dopamine Replenished by 65%"]`,
        theTrap: {
          title: 'Thinking "I Don’t Have 20 Minutes to Spare"',
          description: 'Believing you are too busy to rest for 20 minutes, then spending the next 3 hours sluggish, scrolling, and operating at 20% efficiency.'
        },
        actionSteps: [
          'Schedule a daily 20-minute NSDR block into your calendar between 12:30 and 2:30 PM.',
          'Use headphones and an eye mask to eliminate external auditory and visual distractions.',
          'Focus on slow, full belly exhalations to quickly drop sympathetic nervous tone.'
        ],
        comparisonTable: {
          headers: ['Afternoon Reset Tool', 'Sleep Inertia Risk', 'Dopamine Replenishment', 'Night Sleep Impact'],
          rows: [
            ['20-Minute NSDR', 'Zero grogginess / instant alertness', 'Increases by up to 65%', 'Zero negative impact / enhances night sleep'],
            ['90-Minute Heavy Nap', 'High grogginess (30+ min to wake up)', 'Moderate recovery', 'Can delay bedtime and reduce sleep pressure'],
            ['Energy Drink / 200mg Caffeine', 'Zero grogginess (masked fatigue)', 'Depletes vesicle stores further', 'Catastrophic for slow-wave sleep'],
            ['Passive Scrolling Break', 'High mental fatigue & dopamine crash', 'Reduces dopamine baseline', 'Adds blue light & neurological arousal']
          ]
        },
        checkableTakeaways: [
          {
            id: 'n20-tk-1',
            timestamp: '00:05:30',
            seconds: 330,
            category: 'Key Insight',
            text: 'NSDR restores dopamine reserves in the striatum by up to 65% without biochemical exhaustion.',
            checked: false,
            penKey: 'star'
          },
          {
            id: 'n20-tk-2',
            timestamp: '00:15:00',
            seconds: 900,
            category: 'Action Rule',
            text: 'Use 20-min NSDR anytime you sleep less than 6 hours to recover cognitive function.',
            checked: false,
            penKey: 'check'
          }
        ],
        quickRecall: {
          question: 'How does 20 minutes of NSDR fundamentally differ from taking a nap?',
          answer: 'NSDR keeps the brain in a conscious theta/alpha state without dropping into slow-wave delta sleep. This replenishes dopamine and resets autonomic tone with zero post-nap grogginess.',
          coreTakeaway: 'Deep autonomic relaxation without sleep inertia.'
        }
      }
    ]
  },
  {
    id: 'huberman-10-min-nsdr-rapid-recovery',
    categoryId: 'cat-sleep-autonomic-reset',
    videoTitle: 'Rapid Autonomic Recovery (10-Min NSDR)',
    speaker: 'Dr. Andrew Huberman, Ph.D. (Stanford School of Medicine)',
    duration: '11m',
    videoId: 'KHIbgSN2qAU',
    videoUrl: 'https://www.youtube.com/watch?v=KHIbgSN2qAU',
    thumbnailUrl: 'https://i.ytimg.com/vi/KHIbgSN2qAU/hqdefault.jpg',
    generatedAt: 'Master Reference Edition',
    isPreset: true,
    createdAt: 1700000032000,
    executiveSummary: 'The 10-Minute Rapid NSDR protocol is an ultra-compact physiological circuit breaker designed for acute stress de-escalation, rapid autonomic braking, and instant cognitive re-alignment. Perfect for busy professionals, students between exams, or anyone needing an instant executive function reset.',
    masterMindmapMermaid: `graph TD
  N10["10-Min Rapid NSDR"] --> N10A["Autonomic Circuit Breaker"]
  N10 --> N10B["Physiological Sighs"]
  N10 --> N10C["Sensory Decoupling"]
  N10A --> N10A1["Instant Sympathetic Down-Regulation"]
  N10B --> N10B1["Double Inhale + Long Exhale"]
  N10C --> N10C1["Prefrontal Attentional Recharge"]`,
    dailyProtocol: {
      title: '10-Minute Rapid Autonomic Reset Protocol',
      subtitle: 'The emergency 10-minute micro-tool to kill acute agitation, reset focus, and conquer mid-day friction.',
      dailyAnchorQuote: 'Ten minutes of deliberate stillness can save four hours of unproductive flailing.',
      blocks: [
        {
          id: 'nsdr10-p1',
          timeWindow: 'Anytime Acute Stress / Fatigue Hits',
          phaseName: 'Phase 1: The 10-Minute Emergency Autonomic Brake',
          coreConcept: 'Two physiological sighs followed by 8 minutes of body scanning drops heart rate within seconds.',
          doThis: {
            action: 'Close your eyes at your desk, recline your chair, take two deep inhales through your nose followed by a long, slow sigh out the mouth.',
            tacticalCue: 'Put on noise-cancelling headphones and set a 10-minute timer.'
          },
          dontDoThis: {
            trap: 'DO NOT check quick social feeds or email "to rest your eyes."',
            whyTrapDamages: 'Visual feeds bombard working memory and amplify cortical agitation.'
          },
          biologicalWhy: 'Physiological sighs pop open collapsed alveoli in the lungs and rapidly offload carbon dioxide, triggering an immediate parasympathetic response.'
        }
      ]
    },
    chapters: [
      {
        chapterNumber: 1,
        title: 'The 10-Minute Physiological Circuit Breaker: Alveolar Gas Exchange & Vagal Brake',
        timestampRange: '00:00:00 - 00:11:00',
        startSeconds: 0,
        coreConcepts: [
          'The physiological sigh (two inhales through the nose, one long exhale through the mouth) is the fastest biological way to reduce autonomic arousal in real time.',
          'A 10-minute session completely decouples sensory inputs from the motor system, resetting prefrontal stamina.',
          'Consistent use builds autonomic resilience, making you far less susceptible to sudden panic or ADHD task freeze.'
        ],
        anchorKeywords: ['Physiological Sigh', 'Alveolar Re-inflation', 'Vagal Brake', 'Sensory Decoupling', 'Rapid Reset'],
        mentalModelTitle: 'The Electrical Circuit Breaker',
        mentalModelExplanation: 'When too many appliances run on the same electrical circuit, the fuse box trips to prevent an electrical fire. Your nervous system is the same: when you run too many mental applications, stress builds up. A 10-minute NSDR is flipping the main breaker to clear the surge before rebooting cleanly.',
        mermaidDiagram: `graph TD
  F1["Acute Stress / Brain Fog"] --> F2["2x Physiological Sighs"]
  F2 --> F3["Rapid Carbon Dioxide Offload"]
  F3 --> F4["Vagus Nerve Slows Sinoatrial Node"]
  F4 --> F5["Executive Mental Clarity Restored"]`,
        theTrap: {
          title: 'Waiting Until You Collapse to Rest',
          description: 'Pushing through exhaustion until you experience an emotional meltdown or complete executive freeze, rather than taking a proactive 10-minute reset.'
        },
        actionSteps: [
          'Deploy the 10-minute NSDR protocol immediately whenever task paralysis strikes.',
          'Practice two physiological sighs whenever you notice shallow chest breathing.',
          'Return to work immediately after the 10-minute chime with your single next action.'
        ],
        comparisonTable: {
          headers: ['Intervention', 'Time Required', 'Autonomic Heart Rate Drop', 'Friction Level'],
          rows: [
            ['10-Minute NSDR', '10 Minutes', 'Significant (drops 10-15 bpm)', 'Extremely low'],
            ['Drinking Coffee', '2 Minutes', 'None (increases heart rate & jitters)', 'Low initially / high crash'],
            ['Scrolling Phone', '15 Minutes', 'Zero (increases cognitive strain)', 'Deceptively effortless'],
            ['Going for Run', '30 Minutes', 'Elevates heart rate (sympathetic)', 'High friction when exhausted']
          ]
        },
        checkableTakeaways: [
          {
            id: 'n10-tk-1',
            timestamp: '00:03:10',
            seconds: 190,
            category: 'Key Insight',
            text: 'The physiological sigh is the fastest way to manually engage the parasympathetic nervous system.',
            checked: false,
            penKey: 'star'
          },
          {
            id: 'n10-tk-2',
            timestamp: '00:08:40',
            seconds: 520,
            category: 'Action Rule',
            text: 'Use 10-minute NSDR as a non-negotiable circuit breaker before making high-stakes decisions under stress.',
            checked: false,
            penKey: 'check'
          }
        ],
        quickRecall: {
          question: 'What is a physiological sigh and why does it reduce anxiety in seconds?',
          answer: 'Two deep nasal inhales followed by an extended oral exhale. It re-inflates collapsed pulmonary alveoli and stimulates the vagus nerve to slow down the heart.',
          coreTakeaway: 'Double inhale, long slow exhale. Instant autonomic brake.'
        }
      }
    ]
  }
];

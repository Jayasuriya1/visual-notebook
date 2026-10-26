import { StudyTextbook } from '../../types';

export const NEURO_WEALTH_GUIDES: StudyTextbook[] = [
  {
    id: 'huberman-optimize-brain-chemistry',
    categoryId: 'cat-neurochemistry-wealth',
    videoTitle: 'Neurochemistry of Drive & Neuromodulators',
    speaker: 'Dr. Andrew Huberman, Ph.D. (Stanford School of Medicine)',
    duration: '2h 10m',
    videoId: 'xKvlK7OqZso',
    videoUrl: 'https://www.youtube.com/watch?v=xKvlK7OqZso',
    thumbnailUrl: 'https://i.ytimg.com/vi/xKvlK7OqZso/hqdefault.jpg',
    generatedAt: 'Master Reference Edition',
    isPreset: true,
    createdAt: 1700000050000,
    executiveSummary: 'Human behavior, mood, and drive are governed by four master neuromodulators: Dopamine (craving, motivation, forward pursuit), Acetylcholine (focal attention), Epinephrine/Adrenaline (physical energy & alertness), and Serotonin (satiety, contentment & social cohesion). Learning to manipulate these chemical levers through behavior, photic inputs, and breathing unlocks complete sovereignty over your mental state.',
    masterMindmapMermaid: `graph TD
  NM["The 4 Master Neuromodulators"] --> NM1["Dopamine (Drive & Pursuit)"]
  NM --> NM2["Acetylcholine (Focus Spotlight)"]
  NM --> NM3["Epinephrine (Energy & Alertness)"]
  NM --> NM4["Serotonin (Contentment & Satiety)"]
  NM1 --> NM1A["Ventral Tegmental Area -> Striatum"]
  NM2 --> NM2A["Basal Forebrain -> Sensory Cortex"]
  NM3 --> NM3A["Locus Coeruleus (Arousal Gate)"]
  NM4 --> NM4A["Raphe Nuclei (Present-Moment Satiety)"]`,
    dailyProtocol: {
      title: 'Neuromodulator Quad-Pacing Daily Protocol',
      subtitle: 'Chronologically sequencing dopamine, acetylcholine, epinephrine, and serotonin across 24 hours.',
      dailyAnchorQuote: 'Neuromodulators don’t create thoughts; they determine which thoughts get amplified into action.',
      blocks: [
        {
          id: 'chem-p1',
          timeWindow: '07:00 - 11:00 AM (Epinephrine & Dopamine Window)',
          phaseName: 'Phase 1: High Energy, Pursuit & Cold Exposure',
          coreConcept: 'Morning biology is optimized for catecholamines (dopamine and epinephrine). Harness this for hard physical and analytical tasks.',
          doThis: {
            action: 'Cold shower (2-3 min at 55-60°F) or cold water face splash, view morning sunlight, and engage in high-effort pursuits.',
            tacticalCue: 'Deliberate cold exposure increases circulating dopamine and epinephrine by 250% for up to 3 hours.'
          },
          dontDoThis: {
            trap: 'DO NOT spend the morning lying on the couch waiting to "feel motivated."',
            whyTrapDamages: 'Motivation does not precede action; physical movement is required to trigger dopamine release from the substantia nigra.'
          },
          biologicalWhy: 'Nigrostriatal and mesolimbic circuits release dopamine in response to forward physical propulsion.'
        },
        {
          id: 'chem-p2',
          timeWindow: '11:00 AM - 02:00 PM (Acetylcholine Focal Gating)',
          phaseName: 'Phase 2: Acetylcholine High-Fidelity Learning',
          coreConcept: 'Midday is when the brain can best utilize acetylcholine to highlight specific synapses for modification.',
          doThis: {
            action: 'Execute a dedicated 90-minute focus block with minimal auditory distractions. Narrow your visual gaze to a single window.',
            tacticalCue: 'Sip water with a touch of electrolytes to support cellular hydration.'
          },
          dontDoThis: {
            trap: 'DO NOT consume high-carbohydrate meals before your acetylcholine focus block.',
            whyTrapDamages: 'High carbs trigger insulin and parasympathetic activation, blunting acetylcholine output in the basal forebrain.'
          },
          biologicalWhy: 'Basal forebrain cholinergic projections sharpen signal-to-noise ratios in cortical sensory processing regions.'
        },
        {
          id: 'chem-p3',
          timeWindow: '06:00 - 09:30 PM (Serotonin Contentment & Satiety)',
          phaseName: 'Phase 3: Serotonin Social Cohesion & Present-Focus',
          coreConcept: 'Evening requires a transition from dopamine (future-oriented craving) to serotonin (present-oriented gratitude and connection).',
          doThis: {
            action: 'Engage with family, friends, or pets; eat a nourishing meal with loved ones; express genuine gratitude for today’s effort.',
            tacticalCue: 'Look loved ones in the eye; physical touch and warm connection stimulate oxytocin and dorsal raphe serotonin.'
          },
          dontDoThis: {
            trap: 'DO NOT continue checking business analytics, stock tickers, or competitive feeds past 8:00 PM.',
            whyTrapDamages: 'Continuous dopamine chasing late at night suppresses serotonin, inducing chronic dissatisfaction and insomnia.'
          },
          biologicalWhy: 'Serotonergic signaling shifts neural processing from the dopaminergic mesolimbic pathway to default social and introspective networks.'
        }
      ]
    },
    chapters: [
      {
        chapterNumber: 1,
        title: 'The Neuromodulator Quartet: Dopamine, Acetylcholine, Epinephrine & Serotonin',
        timestampRange: '00:04:30 - 00:36:15',
        startSeconds: 270,
        coreConcepts: [
          'Dopamine is the molecule of anticipation, craving, and movement towards goals. It is never about enjoying the trophy; it is about the pursuit.',
          'Epinephrine (adrenaline) provides the fuel and arousal, while Acetylcholine directs the lens to focus on what matters.',
          'Serotonin represents the opposing axis: contentment with what you already possess in your immediate physical space (Here-and-Now). Understanding this balance prevents chronic emotional burnout.'
        ],
        anchorKeywords: ['Neuromodulators', 'Dopamine', 'Epinephrine', 'Acetylcholine', 'Serotonin', 'Here-and-Now Circuits'],
        mentalModelTitle: 'The Film Crew Analogy',
        mentalModelExplanation: 'Think of your brain as a movie set. Epinephrine is the high-voltage electrical generator providing power to the set. Acetylcholine is the spotlight operator who aims the beam at the actor’s face. Dopamine is the director shouting "Keep going! We’re making history!" And Serotonin is the wrap party at the end of the day where the crew sits together, shares food, and celebrates what was made.',
        mermaidDiagram: `graph TD
  N1["Neuromodulatory System"] --> N2["Epinephrine (Power Generator)"]
  N1 --> N3["Acetylcholine (Spotlight Operator)"]
  N1 --> N4["Dopamine (Motivating Director)"]
  N1 --> N5["Serotonin (Evening Wrap Party)"]
  N2 & N3 & N4 --> N6["High-Friction Daytime Achievement"]
  N5 --> N7["Restorative Nighttime Cohesion & Recovery"]`,
        theTrap: {
          title: 'Living Exclusively on the Dopamine Axis',
          description: 'Believing that endless pursuit of future goals without ever activating serotonin contentment will lead to happiness, resulting in severe clinical anhedonia.'
        },
        actionSteps: [
          'Use deliberate cold exposure to sustainably boost dopamine and epinephrine without crashes.',
          'Dedicate evenings to social connection and physical gratitude to elevate serotonin.',
          'Balance future-oriented ambition with present-oriented awareness daily.'
        ],
        comparisonTable: {
          headers: ['Neuromodulator', 'Subjective Experience', 'Biological Trigger', 'Optimal Time of Day'],
          rows: [
            ['Dopamine', 'Drive, craving, ambition, forward pursuit', 'Effort, cold exposure, intermittent rewards', 'Morning to Midday'],
            ['Epinephrine', 'Alertness, vigilance, physiological arousal', 'Sunlight, physical movement, cold water', 'Morning to Early Afternoon'],
            ['Acetylcholine', 'Intense laser-like focal concentration', 'Visual fixation, cognitive friction, binaural audio', 'Midday Study Blocks'],
            ['Serotonin', 'Contentment, satisfaction, social warmth', 'Social connection, gratitude, sunset, complex carbs', 'Evening to Night']
          ]
        },
        checkableTakeaways: [
          {
            id: 'chem-tk-1',
            timestamp: '00:15:20',
            seconds: 920,
            category: 'Key Insight',
            text: 'Dopamine is the molecule of pursuit; serotonin is the molecule of contentment with what you have.',
            checked: false,
            penKey: 'star'
          },
          {
            id: 'chem-tk-2',
            timestamp: '00:30:10',
            seconds: 1810,
            category: 'Action Rule',
            text: 'Deliberately switch from the dopamine axis during the day to the serotonin axis in the evening.',
            checked: false,
            penKey: 'check'
          }
        ],
        quickRecall: {
          question: 'What is the relationship between the dopamine system and the serotonin system in emotional regulation?',
          answer: 'Dopamine drives future-oriented pursuit of external rewards, while Serotonin signals present-oriented contentment with what you currently possess. High dopamine suppresses serotonin, and vice versa.',
          coreTakeaway: 'Hunt with dopamine by day; restore with serotonin by night.'
        }
      }
    ]
  },
  {
    id: 'conti-huberman-adult-attachment-biology',
    categoryId: 'cat-neurochemistry-wealth',
    videoTitle: 'Adult Attachment & Relational Biology',
    speaker: 'Dr. Paul Conti, M.D. (Psychiatrist, Stanford & Harvard) & Dr. Huberman',
    duration: '2h 14m',
    videoId: 'gMRph_BvHB4',
    videoUrl: 'https://www.youtube.com/watch?v=gMRph_BvHB4',
    thumbnailUrl: 'https://i.ytimg.com/vi/gMRph_BvHB4/hqdefault.jpg',
    generatedAt: 'Master Reference Edition',
    isPreset: true,
    createdAt: 1700000051000,
    executiveSummary: 'Human beings are neurobiologically wired for attachment. Dr. Paul Conti maps the architecture of the human self, detailing how childhood trauma and defensive adaptations warp adult attachment styles (Anxious, Avoidant, and Secure). By developing internal agency, self-curiosity, and radical emotional honesty, individuals can dismantle unconscious defenses and build deeply secure, generative relationships.',
    masterMindmapMermaid: `graph TD
  AT["Architecture of the Self"] --> AT1["Internal Pillars"]
  AT --> AT2["Attachment Styles"]
  AT --> AT3["Generative Healing"]
  AT1 --> AT1A["Agency (Power to Effect Change)"]
  AT1 --> AT1B["Gratitude (Appreciation of Reality)"]
  AT2 --> AT2A["Anxious (Hyper-Vigilant Alarm)"]
  AT2 --> AT2B["Avoidant (Compulsive Self-Reliance)"]
  AT2 --> AT2C["Secure (Comfort with Interdependence)"]
  AT3 --> AT3A["Self-Curiosity over Self-Judgement"]
  AT3 --> AT3B["Vulnerability & Honest Boundary Mapping"]`,
    dailyProtocol: {
      title: 'Relational Agency & Attachment Repair Protocol',
      subtitle: 'Daily cognitive practices to cultivate agency, dismantle avoidant/anxious defensiveness, and anchor secure attachment.',
      dailyAnchorQuote: 'True security is not invulnerability; it is the courage to be honest without expecting the other to rescue you.',
      blocks: [
        {
          id: 'att-p1',
          timeWindow: 'Morning Reflection (5 Minutes)',
          phaseName: 'Phase 1: The Two Pillars: Agency & Gratitude Check',
          coreConcept: 'Agency (I have power to act) and Gratitude (I appreciate what is) form the bedrock of a resilient ego.',
          doThis: {
            action: 'Write down 1 concrete action you have full agency over today, and 1 non-trivial reality you are genuinely grateful for.',
            tacticalCue: 'Say aloud: "I have agency in this situation; I am not a passive passenger in my life."'
          },
          dontDoThis: {
            trap: 'DO NOT slip into passive victimhood or blame external figures for your current emotional baseline.',
            whyTrapDamages: 'Abdication of agency shuts down prefrontal problem-solving and traps the limbic system in learned helplessness.'
          },
          biologicalWhy: 'Conscious agency recruits the medial prefrontal cortex to down-regulate hyperactive amygdala alarm circuits.'
        },
        {
          id: 'att-p2',
          timeWindow: 'Interpersonal Interactions (Throughout Day)',
          phaseName: 'Phase 2: Self-Curiosity vs. Defensive Reactivity',
          coreConcept: 'Defensive anger or withdrawal is an automated childhood protective shield against vulnerability.',
          doThis: {
            action: 'When you feel triggered or defensive during a conversation, pause for 5 seconds and ask internally: "What am I actually afraid of right now?"',
            tacticalCue: 'Exhale slowly before speaking; replace an accusation with an honest "I feel" statement.'
          },
          dontDoThis: {
            trap: 'DO NOT stonewall, ghost, or attack the character of your partner when feeling insecure.',
            whyTrapDamages: 'Defensive withdrawal reinforces avoidant pathways and destroys the interpersonal trust bank.'
          },
          biologicalWhy: 'Curiosity activates the anterior cingulate cortex, overriding primitive fight-or-flight hypothalamic reactions.'
        }
      ]
    },
    chapters: [
      {
        chapterNumber: 1,
        title: 'The Architecture of the Self: Agency, Gratitude & Attachment Conditioning',
        timestampRange: '00:06:00 - 00:39:00',
        startSeconds: 360,
        coreConcepts: [
          'The Self is constructed upon two primary pillars: Agency (the knowledge that your choices matter and you can influence your life) and Gratitude (the ability to recognize the good in your reality).',
          'Trauma is not just what happened to you; it is the lasting distortion of your worldview that leads to defensive adaptations like emotional numbing, cynicism, or hyper-vigilance.',
          'Secure attachment is characterized by comfort with interdependence—knowing you can rely on others without losing your individual agency.'
        ],
        anchorKeywords: ['Agency', 'Gratitude', 'Attachment Theory', 'Defense Mechanisms', 'Interdependence'],
        mentalModelTitle: 'The Fortress and The Drawbridge',
        mentalModelExplanation: 'An avoidant person builds a massive stone fortress with archery slits and a permanently locked iron drawbridge, declaring "I need no one." An anxious person stands outside the walls with no armor, begging passersby to let them in. A secure person lives in a warm stone house with a functional drawbridge: they can lower it to welcome trusted travelers, and raise it when danger approaches.',
        mermaidDiagram: `graph TD
  C1["Early Childhood / Relational Trauma"] --> C2["Defensive Adaptation (Anxious or Avoidant)"]
  C2 --> C3["Adult Intimacy Triggers Defense Mechanisms"]
  C3 --> C4["Relational Conflict & Isolation"]
  C1 -->|"Conti Therapeutic Framework"| C5["Cultivate Agency + Gratitude + Self-Curiosity"]
  C5 --> C6["Secure Attachment & Emotional Sovereignty"]`,
        theTrap: {
          title: 'The False Independence Trap',
          description: 'Believing that needing nobody is the ultimate sign of strength, when in neurobiological reality, it is a trauma-induced avoidant defense against intimacy.'
        },
        actionSteps: [
          'Identify your dominant attachment response under stress: do you grasp and panic (anxious) or numb and withdraw (avoidant)?',
          'Practice daily self-curiosity: replace "Why am I like this?" with "What is this defense trying to protect me from?"',
          'Communicate boundaries calmly and clearly before emotional resentment accumulates.'
        ],
        comparisonTable: {
          headers: ['Attachment Dimension', 'Anxious Attachment', 'Avoidant Attachment', 'Secure Relational Sovereignty'],
          rows: [
            ['Reaction to Conflict', 'Over-communicates, hyper-vigilant, panics', 'Stonewalls, retreats, minimizes importance', 'Stays present, curious, seeks collaborative repair'],
            ['View of Self', '"I am only worthy if you reassure me"', '"I can only depend on myself; others will fail me"', '"I have intrinsic agency and value regardless of outcomes"'],
            ['View of Other', 'Unpredictable, scarce, desperately sought', 'Intrusive, demanding, potentially suffocating', 'Autonomous partner capable of mutual care'],
            ['Core Defensive Fear', 'Fear of abandonment and isolation', 'Fear of engulfment and loss of autonomy', 'Comfort with vulnerability and healthy boundaries']
          ]
        },
        checkableTakeaways: [
          {
            id: 'att-tk-1',
            timestamp: '00:16:40',
            seconds: 1000,
            category: 'Key Insight',
            text: 'Agency and gratitude are the two non-negotiable pillars of a healthy psychological self.',
            checked: false,
            penKey: 'star'
          },
          {
            id: 'att-tk-2',
            timestamp: '00:32:15',
            seconds: 1935,
            category: 'Action Rule',
            text: 'Replace self-judgement with self-curiosity: ask what fear your defensive behavior is trying to protect.',
            checked: false,
            penKey: 'check'
          }
        ],
        quickRecall: {
          question: 'What are the two foundational pillars of the self according to Dr. Paul Conti?',
          answer: 'Agency (the belief and practice that your actions have efficacy and influence your life) and Gratitude (the capacity to see and appreciate the good in your reality without envy).',
          coreTakeaway: 'Agency powers action; gratitude anchors peace.'
        }
      }
    ]
  },
  {
    id: 'voss-tactical-negotiation-influence',
    categoryId: 'cat-neurochemistry-wealth',
    videoTitle: 'Interpersonal Communication & Social Influence',
    speaker: 'Chris Voss (Former FBI Lead Hostage Negotiator / Black Swan Group)',
    duration: '1h 28m',
    videoId: 'rvgS9jTGbp4',
    videoUrl: 'https://www.youtube.com/watch?v=rvgS9jTGbp4',
    thumbnailUrl: 'https://i.ytimg.com/vi/rvgS9jTGbp4/hqdefault.jpg',
    generatedAt: 'Master Reference Edition',
    isPreset: true,
    createdAt: 1700000052000,
    executiveSummary: 'Negotiation is not about dominating or debating with logic; it is the art of emotional intelligence applied under extreme pressure. Former lead international kidnapping negotiator Chris Voss reveals the core FBI communication tools—Tactical Empathy, Mirroring, Emotional Labeling, Calibrated Questions, and the Accusation Audit—to disarm hostility and transform adversaries into collaborative partners.',
    masterMindmapMermaid: `graph TD
  TN["Tactical Empathy Architecture"] --> TN1["Active Listening Arsenal"]
  TN --> TN2["Calibrated Inquiries"]
  TN --> TN3["The Psychological Breakthrough"]
  TN1 --> TN1A["Mirroring (Repeat Last 3 Words)"]
  TN1 --> TN1B["Labeling ('It sounds like / looks like...')"]
  TN1 --> TN1C["The Late-Night FM DJ Voice"]
  TN2 --> TN2A["'How am I supposed to do that?'"]
  TN2 --> TN2B["'No'-Oriented Framing ('Is it ridiculous to suggest...')"]
  TN3 --> TN3A["'That's Right' (True Epiphany)"]
  TN3 --> TN3B["Avoid 'You're Right' (Cheap Escape)"]`,
    dailyProtocol: {
      title: 'FBI Tactical Empathy & Influence Protocol',
      subtitle: 'Daily communication tools to defuse hostility, uncover hidden leverage, and reach win-win agreements.',
      dailyAnchorQuote: 'He who has control of his own voice and emotions controls the outcome of the room.',
      blocks: [
        {
          id: 'voss-p1',
          timeWindow: 'Before Any High-Stakes Conversation',
          phaseName: 'Phase 1: The Accusation Audit & Voice Warmup',
          coreConcept: 'Proactively defuse every negative accusation the other person could possibly think or say about you before they utter it.',
          doThis: {
            action: 'List the 3 worst things the other party could think about you, and state them upfront: "You probably think I’m being unreasonable, pushy, and unfair..."',
            tacticalCue: 'Lower your vocal pitch and slow your cadence into the soothing "Late-Night FM DJ Voice".'
          },
          dontDoThis: {
            trap: 'DO NOT get defensive, explain your good intentions, or use the word "compromise" right away.',
            whyTrapDamages: 'Defensiveness triggers the counterpart’s amygdala, shutting down their listening apparatus.'
          },
          biologicalWhy: 'Calling out negative emotions by name triggers neural labeling in the counterpart’s ventrolateral prefrontal cortex, extinguishing their fear.'
        },
        {
          id: 'voss-p2',
          timeWindow: 'During Dialogue / Conflict',
          phaseName: 'Phase 2: Mirroring & Emotional Labeling',
          coreConcept: 'Mirroring creates subconscious bonding without giving up ground; labeling demonstrates deep emotional understanding.',
          doThis: {
            action: 'Repeat the last 1 to 3 critical words spoken by the counterpart with an upward inflection. Follow with a label: "It sounds like you feel underappreciated here."',
            tacticalCue: 'After dropping a mirror or label, remain completely silent for 4 full seconds to allow them to fill the void.'
          },
          dontDoThis: {
            trap: 'DO NOT argue facts or debate logic while the counterpart is emotionally agitated.',
            whyTrapDamages: 'When emotions are high, cognitive IQ drops by 30%. Logic delivered to an angry person is perceived as an attack.'
          },
          biologicalWhy: 'Mirroring activates the mirror neuron system, creating visceral neurochemical rapport.'
        },
        {
          id: 'voss-p3',
          timeWindow: 'Closing / Agreement Phase',
          phaseName: 'Phase 3: Triggering "That’s Right" & Calibrated Questions',
          coreConcept: 'The goal of negotiation is not to hear "Yes" or "You’re right"; it is to hear the transformative words "That’s right."',
          doThis: {
            action: 'Summarize their perspective and feelings so accurately that their only response is "That’s right." Then ask: "How would you like us to proceed?"',
            tacticalCue: 'Use calibrated questions starting with "What" or "How"; never start with an accusatory "Why".'
          },
          dontDoThis: {
            trap: 'DO NOT settle for "You’re right." It is a polite dismissal used to make you go away.',
            whyTrapDamages: 'Hearing "You’re right" means they haven’t bought in; agreement without genuine buy-in leads to broken commitments.'
          },
          biologicalWhy: '"That’s right" signals that cognitive defense mechanisms have dropped and deep psychological buy-in has occurred.'
        }
      ]
    },
    chapters: [
      {
        chapterNumber: 1,
        title: 'Tactical Empathy: Mirroring, Labeling & The Late-Night FM DJ Voice',
        timestampRange: '00:04:00 - 00:32:00',
        startSeconds: 240,
        coreConcepts: [
          'Tactical Empathy is not about agreeing or being nice; it is the calculated demonstration that you understand the emotional and cognitive state of your counterpart.',
          'Mirroring: Repeating the last 1 to 3 words (or the critical words) of what someone just said. It prompts elaboration without confrontation.',
          'Labeling: Identifying emotions with neutral language ("It seems like...", "It sounds like..."). Neuroimaging proves that verbalizing an emotion de-escalates amygdala activity.',
          'The Late-Night FM DJ Voice: A downward-inflected, calm, deep vocal tone that conveys absolute calm, stability, and authority.'
        ],
        anchorKeywords: ['Tactical Empathy', 'Mirroring', 'Emotional Labeling', 'Late-Night FM DJ Voice', 'Amygdala De-escalation'],
        mentalModelTitle: 'The Mirror and The Megaphone',
        mentalModelExplanation: 'When two people argue, both grab megaphones and scream louder, trying to force logic through thick armor. Tactical empathy means putting down your megaphone and holding up a crystal-clear mirror. When the counterpart sees their exact reflection in your words—and hears you calmly name their deepest fears—their armor drops instantly.',
        mermaidDiagram: `graph TD
  V1["Counterpart Speaks with Emotion / Hostility"] --> V2["Adopt Late-Night FM DJ Voice"]
  V2 --> V3["Mirror: Repeat Last 3 Words + Upward Inflection"]
  V3 --> V4["Label: 'It sounds like you feel...'"]
  V4 --> V5["Dynamic Silence (Let Them Fill the Vacuum)"]
  V5 --> V6["Counterpart Exclaims: 'That’s Right!' (Breakthrough)"]`,
        theTrap: {
          title: 'The "You’re Right" Trap',
          description: 'Believing you won the argument when someone says "You’re right." In reality, they are using it as an emotional escape hatch to end the conversation without any intent to follow through.'
        },
        actionSteps: [
          'Practice mirroring in casual daily conversations: repeat the last 3 words someone says and remain quiet.',
          'Never use "Why" when asking questions; replace with "What led you to that conclusion?" or "How can we solve this?"',
          'Deploy the Accusation Audit at the beginning of difficult meetings to neutralize grievances.'
        ],
        comparisonTable: {
          headers: ['Communication Tool', 'Amateur Debater Approach', 'FBI Tactical Empathy Approach'],
          rows: [
            ['Tone of Voice', 'High-pitched, rapid, assertive, urgent', 'Deep, slow, downward-inflected Late-Night FM DJ Voice'],
            ['Listening Behavior', 'Waiting for turn to speak; formulating rebuttal', 'Deep silence; hunting for underlying emotional drivers'],
            ['Response to Objections', 'Argues why the objection is logically invalid', 'Labels the objection: "It seems like you have major reservations"'],
            ['Goal of Interaction', 'Getting them to say "Yes" or admit defeat', 'Getting them to say "That’s Right" with genuine buy-in']
          ]
        },
        checkableTakeaways: [
          {
            id: 'voss-tk-1',
            timestamp: '00:11:15',
            seconds: 675,
            category: 'Key Insight',
            text: 'Labeling a negative emotion defuses it; labeling a positive emotion reinforces it.',
            checked: false,
            penKey: 'star'
          },
          {
            id: 'voss-tk-2',
            timestamp: '00:24:50',
            seconds: 1490,
            category: 'Action Rule',
            text: 'After mirroring or labeling, practice dynamic silence: shut up and let them talk.',
            checked: false,
            penKey: 'check'
          }
        ],
        quickRecall: {
          question: 'Why should you avoid hearing "You’re right" in a negotiation, and what should you aim for instead?',
          answer: '"You’re right" is a polite dismissal where the other person agrees just to get you to stop talking. You should aim for "That’s right," which indicates that you have fully understood their perspective.',
          coreTakeaway: 'Hunt for "That’s right", never "You’re right."'
        }
      }
    ]
  },
  {
    id: 'housel-psychology-of-money-autonomy',
    categoryId: 'cat-neurochemistry-wealth',
    videoTitle: 'Behavioral Finance, Contentment & Autonomy',
    speaker: 'Morgan Housel (Author of The Psychology of Money / Partner at Collaborative Fund)',
    duration: '1h 18m',
    videoId: 'YjfDQmA30Po',
    videoUrl: 'https://www.youtube.com/watch?v=YjfDQmA30Po',
    thumbnailUrl: 'https://i.ytimg.com/vi/YjfDQmA30Po/hqdefault.jpg',
    generatedAt: 'Master Reference Edition',
    isPreset: true,
    createdAt: 1700000053000,
    executiveSummary: 'Doing well with money has a little to do with how smart you are and a lot to do with how you behave. Morgan Housel demonstrates that the highest form of wealth is not owning lavish possessions, but waking up every morning and saying: "I can do whatever I want today." Discover the laws of compounding, the critical distinction between rich vs. wealthy, and how to build unshakeable room for error.',
    masterMindmapMermaid: `graph TD
  PF["Psychology of Money"] --> PF1["The Highest Dividend: Autonomy"]
  PF --> PF2["Rich vs. Wealthy"]
  PF --> PF3["Compounding & Room for Error"]
  PF1 --> PF1A["Independence Over Status"]
  PF1 --> PF1B["Waking Up with Sovereign Time"]
  PF2 --> PF2A["Rich = Current Income Displayed"]
  PF2 --> PF2B["Wealth = Unspent Financial Options"]
  PF3 --> PF3A["Survival as the Primary Strategy"]
  PF3 --> PF3B["Room for Error (Margin of Safety)"]`,
    dailyProtocol: {
      title: 'Financial Autonomy & Behavioral Sovereignty Protocol',
      subtitle: 'Daily cognitive and financial principles to eliminate status anxiety and engineer complete personal autonomy.',
      dailyAnchorQuote: 'The highest dividend that money pays is the ability to control your own time.',
      blocks: [
        {
          id: 'pf-p1',
          timeWindow: 'Daily Mindset & Consumption Check',
          phaseName: 'Phase 1: Rich vs. Wealthy Differentiation',
          coreConcept: 'Being rich is showing current high income through purchases; being wealthy is the hidden options you choose not to spend.',
          doThis: {
            action: 'Before any non-essential purchase, ask: "Am I buying this for its utility, or am I buying it to signal something to people whose opinions I don’t care about?"',
            tacticalCue: 'Wait 72 hours before completing any impulse online shopping purchase.'
          },
          dontDoThis: {
            trap: 'DO NOT compare your behind-the-scenes financial life with other people’s curated highlight reels on social media.',
            whyTrapDamages: 'Status anxiety leads to lifestyle creep, locking you onto a financial hedonic treadmill where autonomy is permanently traded for outward appearance.'
          },
          biologicalWhy: 'Social comparison activates the primate hierarchy circuits in the amygdala, triggering artificial status anxiety.'
        },
        {
          id: 'pf-p2',
          timeWindow: 'Monthly Capital Allocation',
          phaseName: 'Phase 2: The Room for Error (Survival Asset)',
          coreConcept: 'The single most important variable in financial compounding is endurance: never being forced to sell during a crash.',
          doThis: {
            action: 'Maintain an emergency cash buffer that feels "irrationally large" to conventional spreadsheets (6-12 months of living expenses).',
            tacticalCue: 'Automate a fixed percentage of income to low-cost broad index funds the day you receive income.'
          },
          dontDoThis: {
            trap: 'DO NOT attempt to time the market, trade on leverage, or chase speculative hot assets.',
            whyTrapDamages: 'Leverage and market timing eliminate room for error; one catastrophic event resets compounding to zero.'
          },
          biologicalWhy: 'A large cash buffer creates psychological security, dramatically lowering chronic cortisol and prefrontal panic.'
        }
      ]
    },
    chapters: [
      {
        chapterNumber: 1,
        title: 'Freedom as the Ultimate Dividend: Rich vs. Wealthy & The Seduction of Pessimism',
        timestampRange: '00:05:00 - 00:34:00',
        startSeconds: 300,
        coreConcepts: [
          'The greatest intrinsic value of money is its ability to give you control over your time. Independence and autonomy are the greatest drivers of human happiness.',
          'Spending money to show people how much money you have is the fastest way to have less money. Wealth is what you don’t see: the unbought cars, the unpurchased jewelry, the unspent investments.',
          'Pessimism always sounds smarter than optimism, but optimism is the only stance backed by the multi-century historical record of human problem-solving.'
        ],
        anchorKeywords: ['Autonomy', 'Rich vs Wealthy', 'Compounding', 'Room for Error', 'Lifestyle Creep'],
        mentalModelTitle: 'The Ice Age and The Snowball',
        mentalModelExplanation: 'Ice ages were not caused by brutally cold winters; they were caused by summers that were just slightly cool enough that the winter snow didn’t melt. The leftover snow reflected sunlight, making the next summer cooler, allowing more snow to build up year after year. Compounding in wealth is the same: small, consistent, unglamorous returns repeated over decades create astronomical results.',
        mermaidDiagram: `graph TD
  H1["Earn Income"] --> H2{"Choice of Behavior"}
  H2 -->|"Display Status (Rich)"| H3["Lifestyle Creep -> Zero Financial Buffer -> Golden Handcuffs"]
  H2 -->|"Retain Options (Wealthy)"| H4["Invest in Compounding Assets + Emergency Buffer"]
  H4 --> H5["Unshakeable Room for Error"]
  H5 --> H6["Complete Sovereignty Over Time (Highest Dividend)"]`,
        theTrap: {
          title: 'Moving the Goalposts of "Enough"',
          description: 'Constantly increasing your financial desires every time your income increases, ensuring you stay trapped in financial anxiety regardless of net worth.'
        },
        actionSteps: [
          'Calculate your baseline monthly survival number and secure a 6-month buffer in high-yield cash.',
          'Automate your investments into broad diversified index funds and ignore financial media headlines.',
          'Define your personal definition of "Enough" on paper to prevent unconscious lifestyle inflation.'
        ],
        comparisonTable: {
          headers: ['Financial Dimension', 'Being Rich (Visible Display)', 'Being Wealthy (Hidden Sovereignty)'],
          rows: [
            ['Visibility', 'Flashy cars, luxury watches, expensive homes', 'Invisible bank accounts, unspent equity, low stress'],
            ['Relationship to Time', 'Tied to demanding jobs to fund high burn-rate', 'Complete freedom to choose work, projects, and hours'],
            ['Reaction to Market Crash', 'Panic and forced selling due to lack of cash', 'Calm endurance; opportunistic deployment of capital'],
            ['Ultimate Objective', 'Impression management and social status', 'Sovereignty, independence, and peace of mind']
          ]
        },
        checkableTakeaways: [
          {
            id: 'pf-tk-1',
            timestamp: '00:12:10',
            seconds: 730,
            category: 'Key Insight',
            text: 'The ability to do what you want, when you want, with whom you want, for as long as you want, is the highest dividend money pays.',
            checked: false,
            penKey: 'star'
          },
          {
            id: 'pf-tk-2',
            timestamp: '00:25:30',
            seconds: 1530,
            category: 'Action Rule',
            text: 'Wealth is the money you haven’t spent. Build wealth for freedom, not rich appearances for validation.',
            checked: false,
            penKey: 'check'
          }
        ],
        quickRecall: {
          question: 'What is the critical distinction between being "rich" and being "wealthy"?',
          answer: 'Being rich is about current income and visible consumption (what you spend). Being wealthy is hidden options, financial freedom, and unspent assets that give you control over your time.',
          coreTakeaway: 'Rich is what you show; wealthy is the freedom you hold.'
        }
      }
    ]
  }
];

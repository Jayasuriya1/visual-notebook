import { StudyTextbook } from '../../types';

export const PHYSICAL_HEALTH_GUIDES: StudyTextbook[] = [
  {
    id: 'huberman-foundational-nutrition-metabolism',
    categoryId: 'cat-physical-health-nutrition',
    videoTitle: 'Foundational Nutrition & Metabolism',
    speaker: 'Dr. Andrew Huberman, Ph.D. (Stanford School of Medicine)',
    duration: '2h 12m',
    videoId: 'K4Ze-Sp6aUE',
    videoUrl: 'https://www.youtube.com/watch?v=K4Ze-Sp6aUE',
    thumbnailUrl: 'https://i.ytimg.com/vi/K4Ze-Sp6aUE/hqdefault.jpg',
    generatedAt: 'Master Reference Edition',
    isPreset: true,
    createdAt: 1700000040000,
    executiveSummary: 'Nutrition is not just about calories; it is a complex biochemical communication system between the gut microbiome, enteric nervous system, and brain. By structuring protein distribution to support neurotransmitter synthesis, defending insulin sensitivity, and managing the gut-brain axis, you can achieve unwavering cognitive stamina and metabolic health.',
    masterMindmapMermaid: `graph TD
  N["Metabolic Nutrition Architecture"] --> N1["Gut-Brain Axis"]
  N --> N2["Protein & Neurotransmitters"]
  N --> N3["Insulin & Glycemia Dynamics"]
  N1 --> N1A["Vagus Nerve Direct Pathway"]
  N1 --> N1B["Microbial Short-Chain Fatty Acids"]
  N2 --> N2A["Tyrosine -> Dopamine (1g/lb Protein)"]
  N2 --> N2B["Tryptophan -> Serotonin (Evening Carbs)"]
  N3 --> N3A["Post-Meal 10-Min Walk (Glucose Clearance)"]
  N3 --> N3B["Avoidance of Rapid Glucose Spikes"]`,
    dailyProtocol: {
      title: 'Metabolic & Cognitive Nutrition Protocol',
      subtitle: 'Nutrient timing engineered to stabilize blood glucose, maximize neurotransmitter synthesis, and nourish the microbiome.',
      dailyAnchorQuote: 'Food is neurochemical information. Eat to fuel your brain’s neurotransmitter factories.',
      blocks: [
        {
          id: 'nut-p1',
          timeWindow: '11:00 AM - 12:30 PM (First Meal / High-Protein Launch)',
          phaseName: 'Phase 1: High-Protein & Low-Glycemic Fueling',
          coreConcept: 'Morning and midday meals should be rich in L-tyrosine (dopamine precursor) and low in refined sugars to avoid postprandial crashes.',
          doThis: {
            action: 'Break your fast with 30-40g high-quality protein (eggs, meat, fish, or clean plant protein) and healthy fats/fibers. Keep fast carbs minimal.',
            tacticalCue: 'Prepare protein sources the night before to eliminate friction when breaking your fast.'
          },
          dontDoThis: {
            trap: 'DO NOT consume high-glycemic bagels, pastries, or sweet drinks for your first meal.',
            whyTrapDamages: 'A massive glucose spike triggers an insulin surge followed by reactive hypoglycemia, inducing intense brain fog within 60 minutes.'
          },
          biologicalWhy: 'Dietary tyrosine crosses the blood-brain barrier via LAT1 transporters to synthesize dopamine and norepinephrine for daytime focus.'
        },
        {
          id: 'nut-p2',
          timeWindow: 'Post-Meal (Immediately Following Food)',
          phaseName: 'Phase 2: The 10-Minute Postprandial Glucose Walk',
          coreConcept: 'Contracting large skeletal muscles after eating clears glucose from the bloodstream independently of insulin.',
          doThis: {
            action: 'Walk at a brisk pace for 10-15 minutes immediately after completing your lunch or dinner.',
            tacticalCue: 'Walk outside or pace your living room while listening to a podcast.'
          },
          dontDoThis: {
            trap: 'DO NOT sit motionless at your desk or recline on a sofa immediately after eating a large meal.',
            whyTrapDamages: 'Motionless digestion redirects massive blood volume to the splanchnic circulation, causing extreme post-meal lethargy.'
          },
          biologicalWhy: 'Muscle contraction activates GLUT4 glucose transporters via AMPK signaling, reducing the insulin spike by up to 50%.'
        },
        {
          id: 'nut-p3',
          timeWindow: '06:30 - 08:30 PM (Evening Dinner / Serotonin Shift)',
          phaseName: 'Phase 3: Complex Carbohydrates for Sleep Induction',
          coreConcept: 'Evening complex carbohydrates facilitate tryptophan entry into the brain to synthesize serotonin and melatonin.',
          doThis: {
            action: 'Include complex carbohydrates (sweet potatoes, rice, oats) with dinner. Finish eating at least 2.5 to 3 hours before sleep.',
            tacticalCue: 'Add 1-2 servings of fermented foods (sauerkraut, kimchi, kefir) to support gut microbiome diversity.'
          },
          dontDoThis: {
            trap: 'DO NOT snack on sugary processed foods right before getting into bed.',
            whyTrapDamages: 'Late-night eating elevates nocturnal metabolic rate and suppresses human growth hormone (HGH) release during sleep.'
          },
          biologicalWhy: 'Insulin from complex carbs lowers competing branched-chain amino acids (BCAAs), allowing tryptophan to cross the blood-brain barrier for melatonin production.'
        }
      ]
    },
    chapters: [
      {
        chapterNumber: 1,
        title: 'The Gut-Brain Axis, Neuropod Cells & Glucose Regulation',
        timestampRange: '00:06:00 - 00:35:00',
        startSeconds: 360,
        coreConcepts: [
          'The gut contains its own nervous system (Enteric Nervous System) with over 500 million neurons that communicate directly with the brainstem via the vagus nerve.',
          'Neuropod cells in the intestinal wall sense the presence of sugar and amino acids within milliseconds, signaling the brain to seek more or feel satiated.',
          'Post-meal physical movement uses the GLUT4 transporter system to clear glucose from blood directly into muscle tissue, eliminating the afternoon slump.'
        ],
        anchorKeywords: ['Enteric Nervous System', 'Neuropod Cells', 'Vagus Nerve', 'GLUT4 Transporter', 'Postprandial Glycemia'],
        mentalModelTitle: 'The Chemical Pipeline and the Sponge',
        mentalModelExplanation: 'Imagine your bloodstream as a garden hose and sugar as high-pressure water. If the pressure gets too high, the hose bursts (cellular damage). Your pancreas releases insulin to pump the water out, which takes time. But your leg muscles are giant dry sponges! Taking a 10-minute walk opens the pores of the sponges immediately, soaking up the water without needing the pump.',
        mermaidDiagram: `graph TD
  M1["Nutrient Ingestion in Gut"] --> M2["Neuropod Cells Detect Amino Acids/Sugars"]
  M2 --> M3["Vagus Nerve Transmits Satiety to Brain"]
  M1 --> M4["Glucose Rises in Bloodstream"]
  M4 --> M5{"Post-Meal Action"}
  M5 -->|"Sit Stagnant"| M6["High Insulin Surge -> Brain Fog & Crash"]
  M5 -->|"10-Min Walk"| M7["Muscle GLUT4 Translocation -> Stable Alertness"]`,
        theTrap: {
          title: 'The "Food Coma" Acceptance Trap',
          description: 'Believing that feeling exhausted after lunch is inevitable and normal, rather than a direct consequence of high glycemic spikes and post-meal immobility.'
        },
        actionSteps: [
          'Prioritize 1 gram of protein per pound of target body weight daily.',
          'Take a 10-minute walk immediately following your two largest meals.',
          'Include 2 to 3 servings of naturally fermented foods daily to reduce inflammatory markers.'
        ],
        comparisonTable: {
          headers: ['Nutritional Variable', 'High Glycemic Diet (Crash)', 'Foundational Metabolic Protocol (Steady)'],
          rows: [
            ['Post-Meal Alertness', 'Sharp spike followed by severe lethargy', 'Stable, sustained mental clarity for 4+ hours'],
            ['Neurotransmitter Supply', 'Erratic; dopamine depleted', 'Consistent tyrosine and tryptophan availability'],
            ['Microbiome Status', 'Low diversity; elevated endotoxins', 'Rich microbial diversity producing protective SCFAs'],
            ['Insulin Sensitivity', 'Progressive insulin resistance', 'High insulin sensitivity and efficient fuel utilization']
          ]
        },
        checkableTakeaways: [
          {
            id: 'nut-tk-1',
            timestamp: '00:14:30',
            seconds: 870,
            category: 'Key Insight',
            text: 'A 10-minute walk after meals clears glucose through muscle contractions independently of insulin.',
            checked: false,
            penKey: 'star'
          },
          {
            id: 'nut-tk-2',
            timestamp: '00:27:00',
            seconds: 1620,
            category: 'Action Rule',
            text: 'Consume high-protein, low-carb meals early in the day; shift complex carbs to dinner to promote sleep.',
            checked: false,
            penKey: 'check'
          }
        ],
        quickRecall: {
          question: 'How does walking for 10 minutes after a meal eliminate the post-lunch "food coma"?',
          answer: 'Muscle contraction physically mobilizes GLUT4 glucose transporters to the cell surface, soaking up blood glucose directly into muscle tissue without triggering a massive insulin spike.',
          coreTakeaway: 'Contract your leg muscles after eating to stabilize blood sugar.'
        }
      }
    ]
  },
  {
    id: 'attia-huberman-longevity-biomechanics',
    categoryId: 'cat-physical-health-nutrition',
    videoTitle: 'Physical Longevity & Biomechanics',
    speaker: 'Dr. Peter Attia, M.D. (Author of Outlive / Longevity Medicine) & Dr. Huberman',
    duration: '2h 26m',
    videoId: 'ufsIA5NARIo',
    videoUrl: 'https://www.youtube.com/watch?v=ufsIA5NARIo',
    thumbnailUrl: 'https://i.ytimg.com/vi/ufsIA5NARIo/hqdefault.jpg',
    generatedAt: 'Master Reference Edition',
    isPreset: true,
    createdAt: 1700000041000,
    executiveSummary: 'Longevity is defined not just by lifespan, but by healthspan—the quality of cognitive, emotional, and physical function in the final decades of life. Dr. Peter Attia reveals the four horsemen of chronic disease and proves that cardiovascular fitness (VO2 Max & Zone 2) combined with muscular strength and stability is the single most potent health intervention known to science.',
    masterMindmapMermaid: `graph TD
  L["Longevity Architecture"] --> L1["Cardiorespiratory Engines"]
  L --> L2["Musculoskeletal Armor"]
  L --> L3["The Centenarian Decathlon"]
  L1 --> L1A["Zone 2 (Mitochondrial Efficiency)"]
  L1 --> L1B["VO2 Max (Peak Aerobic Capacity)"]
  L2 --> L2A["Muscle Mass (Appendicular Lean Mass)"]
  L2 --> L2B["Grip Strength & Dead Hang"]
  L3 --> L3A["Floor-to-Stand Independence"]
  L3 --> L3B["Carrying Groceries at Age 85"]`,
    dailyProtocol: {
      title: 'Centenarian Decathlon & Zone 2 Training Protocol',
      subtitle: 'The non-pharmacological prescription for exceptional lifespan, mitochondrial density, and physical resilience.',
      dailyAnchorQuote: 'Exercise is the single most potent longevity drug ever discovered. There is no close second.',
      blocks: [
        {
          id: 'lon-p1',
          timeWindow: 'Zone 2 Foundation (3-4 Days / Week, 45-60 Min)',
          phaseName: 'Phase 1: Zone 2 Mitochondrial Efficiency Training',
          coreConcept: 'Zone 2 is the highest work intensity where you can sustain energy exclusively through fat oxidation in mitochondria.',
          doThis: {
            action: 'Perform 45-60 minutes of low-intensity steady-state cardio (jog, rucking, cycling) where you can hold a conversation with mild effort.',
            tacticalCue: 'The "Talk Test": you can speak in full sentences, but the person on the other end of the phone knows you are exercising.'
          },
          dontDoThis: {
            trap: 'DO NOT push into Zone 3 where you are breathing too hard to speak comfortably.',
            whyTrapDamages: 'Creeping into higher zones recruits fast-twitch fibers, generates excess lactate, and halts mitochondrial fat-burning adaptations.'
          },
          biologicalWhy: 'Zone 2 stimulates mitochondrial biogenesis and enhances the ability of cells to clear lactate, reducing risk of all metabolic diseases.'
        },
        {
          id: 'lon-p2',
          timeWindow: 'VO2 Max Pulse (1 Day / Week, 20 Min)',
          phaseName: 'Phase 2: 4x4 VO2 Max High-Intensity Intervals',
          coreConcept: 'VO2 Max is the single strongest epidemiological predictor of all-cause mortality known to medical science.',
          doThis: {
            action: 'Warm up, then execute four 4-minute maximum sustainable efforts on a bike or rower, separated by 3 minutes of easy recovery.',
            tacticalCue: 'Pick a stationary bike or rowing machine to protect joints while pushing maximal cardiovascular output.'
          },
          dontDoThis: {
            trap: 'DO NOT perform all-out VO2 max sprints without a proper 10-minute cardiovascular warmup.',
            whyTrapDamages: 'Sudden maximal intensity without arterial dilation creates acute hemodynamic strain.'
          },
          biologicalWhy: 'Elite VO2 max is associated with a 400% to 500% reduction in all-cause mortality compared to the bottom 25th percentile.'
        },
        {
          id: 'lon-p3',
          timeWindow: 'Strength & Stability (3 Days / Week, 45 Min)',
          phaseName: 'Phase 3: Grip Strength, Carries & Eccentric Control',
          coreConcept: 'Loss of muscle mass and balance is the primary cause of fatal falls and loss of autonomy in old age.',
          doThis: {
            action: 'Perform heavy carries (farmer’s walks), dead hangs for grip strength, and deep eccentric squats for knee and hip integrity.',
            tacticalCue: 'Aim for a 60-second bodyweight dead hang from a pullup bar as a baseline stability test.'
          },
          dontDoThis: {
            trap: 'DO NOT neglect foot, hip, and shoulder stability while chasing heavy ego numbers on fixed machines.',
            whyTrapDamages: 'Machine training without balance stability leaves stabilizers weak, leading to catastrophic tears.'
          },
          biologicalWhy: 'Muscular strength and grip strength serve as a biological metabolic sink for glucose and protect the skeleton from fractures.'
        }
      ]
    },
    chapters: [
      {
        chapterNumber: 1,
        title: 'The Four Horsemen of Chronic Disease & The Power of VO2 Max',
        timestampRange: '00:08:00 - 00:42:00',
        startSeconds: 480,
        coreConcepts: [
          'The Four Horsemen responsible for 80% of deaths in non-smokers: Cardiovascular Disease, Cancer, Neurodegenerative Disease (Alzheimer’s), and Type 2 Diabetes / Metabolic Dysfunction.',
          'VO2 Max (maximum rate of oxygen consumption) is the single most powerful predictor of longevity. Moving from low to high VO2 Max cuts all-cause mortality in half.',
          'The Centenarian Decathlon: Defining the exact 10 physical tasks you want to be able to perform in your 80s and 90s, then reverse-engineering today’s training program to ensure you exceed those physical benchmarks.'
        ],
        anchorKeywords: ['Four Horsemen', 'VO2 Max', 'Centenarian Decathlon', 'Healthspan vs Lifespan', 'Mitochondrial Density'],
        mentalModelTitle: 'The Crumbling Bridge and The Suspension Cables',
        mentalModelExplanation: 'Imagine you must cross a bridge in your 80s. Medicine 2.0 waits until the bridge is cracking, then stands below with a safety net (treating disease after symptoms emerge). Medicine 3.0 inspects the steel suspension cables decades in advance. VO2 Max and muscle mass are the thick steel cables. By over-building the cables in your 30s and 40s, the bridge never cracks in the first place.',
        mermaidDiagram: `graph TD
  C1["Sedentary Aging"] --> C2["Mitochondrial Decay & Muscle Loss"]
  C2 --> C3["The Four Horsemen (Heart Disease, Alzheimer's, Diabetes, Cancer)"]
  C3 --> C4["Loss of Autonomy & Early Mortality"]
  C1 -->|"Medicine 3.0 Training"| C5["Zone 2 (Mitochondria) + VO2 Max (Heart) + Strength"]
  C5 --> C6["400% Reduction in All-Cause Mortality"]
  C6 --> C7["Centenarian Decathlon Mastery (Age 90+ Independence)"]`,
        theTrap: {
          title: 'Thinking "I’ll Start Exercising When I Get Older"',
          description: 'Muscle mass declines by 8-10% per decade after age 40; VO2 Max declines by 10% per decade. You must bank physical capacity early to survive natural age-related decay.'
        },
        actionSteps: [
          'Accumulate at least 150-180 minutes of true Zone 2 cardio every week.',
          'Dedicate one session weekly to high-intensity VO2 Max intervals (4x4 protocol).',
          'Practice getting up off the floor without using your hands or knees as a daily mobility check.'
        ],
        comparisonTable: {
          headers: ['Longevity Indicator', 'Low Fitness (Bottom 25%)', 'Elite Fitness (Top 2.5%)'],
          rows: [
            ['All-Cause Mortality Hazard', 'Baseline 1.0 (Highest Risk)', '0.2 (5x lower risk of death from any cause)'],
            ['Alzheimer’s Disease Risk', 'High neurodegenerative vulnerability', 'Marked reduction via cerebral vascular perfusion'],
            ['Metabolic Health', 'Frequent insulin resistance & fatty liver', 'Exceptional mitochondrial insulin sensitivity'],
            ['Fall & Fracture Survival', 'High risk of fatal hip fracture', 'Robust bone mineral density and protective muscle armor']
          ]
        },
        checkableTakeaways: [
          {
            id: 'lon-tk-1',
            timestamp: '00:18:20',
            seconds: 1100,
            category: 'Key Insight',
            text: 'High VO2 Max provides a greater reduction in all-cause mortality than quitting smoking or curing diabetes.',
            checked: false,
            penKey: 'star'
          },
          {
            id: 'lon-tk-2',
            timestamp: '00:35:10',
            seconds: 2110,
            category: 'Action Rule',
            text: 'Train for the Centenarian Decathlon: build the capacity today to lift your own luggage and climb stairs at age 85.',
            checked: false,
            penKey: 'check'
          }
        ],
        quickRecall: {
          question: 'What is the "Centenarian Decathlon" concept developed by Dr. Peter Attia?',
          answer: 'It is a list of 10 physical tasks you want to be able to execute at age 85-90 (e.g. lifting a 30lb bag into an overhead bin, getting up off the floor unassisted). You then train today with enough buffer to account for the natural 10% per decade physical decline.',
          coreTakeaway: 'Reverse-engineer your physical training from the final decade of your life.'
        }
      }
    ]
  }
];

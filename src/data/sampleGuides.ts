import { StudyTextbook } from '../types';
import { MENTAL_HEALTH_GUIDES } from './guides/mentalHealth';
import { STUDY_FOCUS_GUIDES } from './guides/studyFocus';
import { SLEEP_RECOVERY_GUIDES } from './guides/sleepRecovery';
import { PHYSICAL_HEALTH_GUIDES } from './guides/physicalHealth';
import { NEURO_WEALTH_GUIDES } from './guides/neuroWealth';

export const SAMPLE_TEXTBOOKS: StudyTextbook[] = [
  ...MENTAL_HEALTH_GUIDES,
  ...STUDY_FOCUS_GUIDES,
  ...SLEEP_RECOVERY_GUIDES,
  ...PHYSICAL_HEALTH_GUIDES,
  ...NEURO_WEALTH_GUIDES
];

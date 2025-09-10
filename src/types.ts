/**
 * Type definitions for the Two-Step Task
 */

/**
 * Type definitions for the Two-Step Task
 */

// Base trial data that all trials share
export interface BaseTrialData {
  trialNumber: number;
  trialStartTime: number;
  trialEndTime: number;
}

// Fixation trial data
export interface FixationTrialData extends BaseTrialData {
  trialStage: 'fixation';
  isPractice: boolean;
  stimulus: string;
  duration: number;
}

// Choice trial data (for both rocket and alien choices)
export interface ChoiceTrialData extends BaseTrialData {
  trialStage: '1' | '2';
  isPractice: boolean;
  leftStimulus: string;
  rightStimulus: string;
  planetStimulus: string;
  rewardStimulus?: string;
  keyPress: string; // empty string if timeout
  choice: 0 | 1 | 2; // 0 = timeout, 1 = left, 2 = right
  rt: number; // 0 if timeout
  transitionType: 'none' | 'common' | 'rare';
  wasRewarded: boolean; // false if timeout
  timeout: boolean; // true if trial timed out
}

// Union type for all trial data
export type TrialData = FixationTrialData | ChoiceTrialData;

export interface ProbabilityData {
  alien1: number;
  alien2: number;
  alien3: number;
  alien4: number;
}

export interface StimuliMap {
  [key: string]: string;
}

export interface ExperimentState {
  practiceReward: number;
  realReward: number;
  currentTrial: number;
}


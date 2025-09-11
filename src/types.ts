/**
 * Type definitions for the Two-Step Task
 */

// Constants
export type TrialType = 'training-rocket' | 'training-alien' | 'training-full' | 'full';

// Base trial data that all trials share
export interface BaseTrialData {
  trialStartTime: number;
  trialEndTime: number;
}

// Fixation plugin data
export interface FixationTrialData extends BaseTrialData {
  duration: number;
}

// Choice trial data
export interface ChoiceTrialData extends BaseTrialData {
  trialType: TrialType;
  leftKey: string;
  rightKey: string;
  rewardLikelihoods: number[]; // Array of 4 floats representing reward probabilities
  transitionLikelihood: number; // Probability of common vs rare transitions
  responseWindow: number;

  // Response data
  levelOneChoice: 0 | 1 | 2; // 0 = timeout, 1 = left, 2 = right
  levelTwoChoice: 0 | 1 | 2; // 0 = timeout, 1 = left, 2 = right
  levelOneRT: number; // 0 if timeout
  levelTwoRT: number; // 0 if timeout
  timeout: boolean; // true if trial timed out

  // Computed data
  wasRewarded: boolean; // computed from reward logic
  transitionType: 'none' | 'common' | 'rare'; // computed from transition logic
}

// Comprehension trial data
export interface ComprehensionTrialData extends BaseTrialData {
  question: {
    prompt: string;
    correct: string; // 'true' or 'false'
  };
  response: string;
  correctAnswer: string;
  responseTime: number;
  isCorrect: boolean;
}

// Union type for all trial data
export type TrialData = FixationTrialData | ChoiceTrialData | ComprehensionTrialData;

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


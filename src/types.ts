/**
 * @fileoverview Type definitions for the Two-Step Task experiment
 *
 * This file contains all TypeScript interfaces and type definitions used
 * throughout the Two-Step Task experiment, including trial data structures,
 * configuration types, and utility interfaces.
 *
 * @author Henry Burgess
 */

/** Trial type enumeration */
export type TrialType = 'training-rocket' | 'training-alien' | 'training-full' | 'full';

/**
 * Base trial data interface that all trials share
 */
export interface BaseTrialData {
  trialStartTime: number;
  trialEndTime: number;
}

/**
 * Fixation trial data interface
 */
export interface FixationTrialData extends BaseTrialData {
  duration: number;
}

/**
 * Choice trial data interface for rocket and alien selection trials
 */
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

/**
 * Comprehension trial data interface for quiz questions
 */
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

/** Union type for all trial data */
export type TrialData = FixationTrialData | ChoiceTrialData | ComprehensionTrialData;

/**
 * Probability data interface for alien reward likelihoods
 */
export interface ProbabilityData {
  alien1: number;
  alien2: number;
  alien3: number;
  alien4: number;
}

/**
 * Stimuli mapping interface for image file paths
 */
export interface StimuliMap {
  [key: string]: string;
}

/**
 * Experiment state interface for tracking progress
 */
export interface ExperimentState {
  practiceReward: number;
  realReward: number;
  currentTrial: number;
}

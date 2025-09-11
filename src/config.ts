/**
 * @fileoverview Configuration for the Two-Step Task experiment
 *
 * This file contains the main configuration interface and default settings
 * for the Two-Step Task experiment, including trial counts, timing parameters,
 * control mappings, and counterbalancing options.
 *
 * @author Henry Burgess
 */

/**
 * Main configuration interface for the Two-Step Task experiment
 */
export interface ExperimentConfig {
  /** Trial counts - configurable for easy adjustment */
  trainingTrials: {
    rocket: number;
    alien: number;
    full: number;
  };

  /** Main experiment trial configuration */
  mainTrials: {
    blockSize: number;
    blockCount: number;
  };

  /** Timing parameters in milliseconds */
  timing: {
    fixation: number;
    choice: number;
    reward: number;
    transition: number;
  };

  /** Keyboard control mappings */
  controls: {
    left: string;
    right: string;
  };

  /** Probability of common vs rare transitions */
  transitionLikelihood: number;

  /** Experiment metadata */
  name: string;
  studyName: string;
  contact: string;

  /** Counterbalancing configuration for stimulus presentation */
  counterbalancing: {
    swapMainRockets: boolean;
    swapTrainingRockets: boolean;
    swapRedAliens: boolean;
    swapPurpleAliens: boolean;
    swapGreenAliens: boolean;
    swapYellowAliens: boolean;
    swapRocketPreference: boolean;
  };
}

/**
 * Default experiment configuration with randomized counterbalancing
 */
export const config: ExperimentConfig = {
  trainingTrials: {
    rocket: 8,
    alien: 8,
    full: 8,
  },
  mainTrials: {
    blockSize: 50,
    blockCount: 4,
  },
  timing: {
    fixation: 1000,
    choice: 3000,
    reward: 1000,
    transition: 1500,
  },
  controls: {
    left: 'f',
    right: 'j',
  },
  transitionLikelihood: 0.7,
  name: 'Two-Step Task',
  studyName: 'task_two_step',
  contact: 'henry.burgess@wustl.edu',
  counterbalancing: {
    swapMainRockets: Math.random() < 0.5,
    swapTrainingRockets: Math.random() < 0.5,
    swapRedAliens: Math.random() < 0.5,
    swapPurpleAliens: Math.random() < 0.5,
    swapGreenAliens: Math.random() < 0.5,
    swapYellowAliens: Math.random() < 0.5,
    swapRocketPreference: Math.random() < 0.5,
  },
};

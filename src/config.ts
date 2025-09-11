/**
 * Configuration for the Two-Step Task experiment
 */

export interface ExperimentConfig {
  // Trial counts - configurable for easy adjustment
  trainingTrials: {
    rocket: number;
    alien: number;
    full: number;
  };
  mainTrials: {
    blockSize: number;
    blockCount: number;
  };

  // Timing (in milliseconds)
  timing: {
    fixation: number;
    choice: number;
    reward: number;
    transition: number;
  };

  // Controls
  controls: {
    left: string;
    right: string;
  };

  // Transition likelihood
  transitionLikelihood: number;

  // Experiment metadata
  name: string;
  studyName: string;
  contact: string;

  // Counterbalancing configuration
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

  // Counterbalancing stimuli presentation
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


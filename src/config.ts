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
  mainTrials: number;

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

  // Transition probability
  transitionProbability: number;

  // Experiment metadata
  name: string;
  studyName: string;
  contact: string;
}

export const config: ExperimentConfig = {
  trainingTrials: {
    rocket: 4,
    alien: 4,
    full: 4,
  },
  mainTrials: 4,

  timing: {
    fixation: 500,
    choice: 3000,
    reward: 1000,
    transition: 90,
  },

  controls: {
    left: 'f',
    right: 'j',
  },

  transitionProbability: 0.7,

  name: 'Two-Step Task',
  studyName: 'task_two_step',
  contact: 'henry.burgess@wustl.edu',
};


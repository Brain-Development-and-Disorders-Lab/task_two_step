/**
 * @fileoverview Configuration for the Two-Step Task experiment
 *
 * This file contains the main configuration interface and default settings
 * for the Two-Step Task experiment, including trial counts, timing parameters,
 * control mappings, and counterbalancing options.
 *
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// Custom types
import { ExperimentConfig } from "../types";

/**
 * Default experiment configuration with randomized counterbalancing
 */
export const config: ExperimentConfig = {
  trainingTrials: {
    rocket: 2,
    alien: 2,
    full: 2,
  },
  mainTrials: {
    blockSize: 8,
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

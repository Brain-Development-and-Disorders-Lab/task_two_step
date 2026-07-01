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

// Configure random number generator with initial seed
import Prando from "prando";
export const random = new Prando("two-step-2026");

/**
 * Default experiment configuration with randomized counterbalancing
 */
export const config: ExperimentConfig = {
  debug: {
    enableDebugLogging: false,
  },
  trainingTrials: {
    rocket: 4,
    alien: 4,
    full: 4,
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
  requireID: true, // Require participant LUID prior to experiment start
  fullscreen: true, // Run the experiment in fullscreen mode
  enableLocalStorage: true, // Allow the experiment to cache data in `localStorage`
  enablePreviousExperimentPrompt: false, // Prompt the user if the previous experiment did not finish
  counterbalancing: {
    swapMainRockets: random.next() < 0.5,
    swapTrainingRockets: random.next() < 0.5,
    swapRedAliens: random.next() < 0.5,
    swapPurpleAliens: random.next() < 0.5,
    swapGreenAliens: random.next() < 0.5,
    swapYellowAliens: random.next() < 0.5,
    swapRocketPreference: random.next() < 0.5,
  },
  stimuli: {
    // Main aliens
    'main_alien_1.png': 'stimuli/main_alien_1.png',
    'main_alien_2.png': 'stimuli/main_alien_2.png',
    'main_alien_3.png': 'stimuli/main_alien_3.png',
    'main_alien_4.png': 'stimuli/main_alien_4.png',

    // Tutorial aliens
    'tutorial_alien_1.png': 'stimuli/tutorial_alien_1.png',
    'tutorial_alien_2.png': 'stimuli/tutorial_alien_2.png',
    'tutorial_alien_3.png': 'stimuli/tutorial_alien_3.png',
    'tutorial_alien_4.png': 'stimuli/tutorial_alien_4.png',

    // Main rockets
    'main_rocket_1.png': 'stimuli/main_rocket_1.png',
    'main_rocket_2.png': 'stimuli/main_rocket_2.png',

    // Tutorial rockets
    'tutorial_rocket_1.png': 'stimuli/tutorial_rocket_1.png',
    'tutorial_rocket_2.png': 'stimuli/tutorial_rocket_2.png',

    // Backgrounds and planets
    'earth.png': 'stimuli/earth.png',
    'tutorial_planet_green.png': 'stimuli/tutorial_planet_green.png',
    'tutorial_planet_yellow.png': 'stimuli/tutorial_planet_yellow.png',
    'main_planet_red.png': 'stimuli/main_planet_red.png',
    'main_planet_purple.png': 'stimuli/main_planet_purple.png',

    // Rewards and other elements
    'no_reward.png': 'stimuli/no_reward.png',
    'reward.png': 'stimuli/reward.png',
  }
};

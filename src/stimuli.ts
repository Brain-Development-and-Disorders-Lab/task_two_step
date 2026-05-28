/**
 * @fileoverview Stimuli mapping for the Two-Step Task experiment
 *
 * This file contains the mapping of stimulus filenames to their actual file paths
 * for all images used in the Two-Step Task experiment, including aliens, rockets,
 * planets, and other visual elements.
 *
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// Custom types
import { StimuliMap } from '../types';

/**
 * Complete mapping of stimulus filenames to file paths
 */
export const stimuli: StimuliMap = {
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
};

/**
 * @fileoverview Counterbalancing utilities for the Two-Step Task experiment
 *
 * This file provides simplified counterbalancing functions for stimulus presentation
 * in the Two-Step Task. It uses simple swap flags instead of complex mapping
 * to determine which stimuli appear on which sides and which rockets lead to which planets.
 *
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// Custom types
import { PlanetType } from "../types";

/**
 * Get rocket stimuli with optional side swapping
 * @param {boolean} isTraining Whether to use training rocket stimuli
 * @param {boolean} swapSides Whether to swap left and right rocket positions
 * @return Object containing left and right stimulus filenames
 */
export const getRocketStimuli = (isTraining: boolean, swapSides: boolean): { leftStimulus: string; rightStimulus: string } => {
  if (isTraining) {
    return swapSides
      ? { leftStimulus: 'tutorial_rocket_2.png', rightStimulus: 'tutorial_rocket_1.png' }
      : { leftStimulus: 'tutorial_rocket_1.png', rightStimulus: 'tutorial_rocket_2.png' };
  } else {
    return swapSides
      ? { leftStimulus: 'main_rocket_2.png', rightStimulus: 'main_rocket_1.png' }
      : { leftStimulus: 'main_rocket_1.png', rightStimulus: 'main_rocket_2.png' };
  }
};

/**
 * Get alien stimuli for a planet with optional side swapping
 * @param {PlanetType} planet The planet type ('red', 'purple', 'green', 'yellow')
 * @param {boolean} swapSides Whether to swap left and right alien positions
 * @return {{ leftStimulus: string, rightStimulus: string }} Object containing left and right stimulus filenames
 * @throws Error if planet type is unknown
 */
export const getAlienStimuli = (planet: PlanetType, swapSides: boolean): { leftStimulus: string; rightStimulus: string } => {
  if (planet === PlanetType.RED) {
    return swapSides
      ? { leftStimulus: 'main_alien_2.png', rightStimulus: 'main_alien_1.png' }
      : { leftStimulus: 'main_alien_1.png', rightStimulus: 'main_alien_2.png' };
  } else if (planet === PlanetType.PURPLE) {
    return swapSides
      ? { leftStimulus: 'main_alien_4.png', rightStimulus: 'main_alien_3.png' }
      : { leftStimulus: 'main_alien_3.png', rightStimulus: 'main_alien_4.png' };
  } else if (planet === PlanetType.GREEN) {
    return swapSides
      ? { leftStimulus: 'tutorial_alien_2.png', rightStimulus: 'tutorial_alien_1.png' }
      : { leftStimulus: 'tutorial_alien_1.png', rightStimulus: 'tutorial_alien_2.png' };
  } else if (planet === PlanetType.YELLOW) {
    return swapSides
      ? { leftStimulus: 'tutorial_alien_4.png', rightStimulus: 'tutorial_alien_3.png' }
      : { leftStimulus: 'tutorial_alien_3.png', rightStimulus: 'tutorial_alien_4.png' };
  }

  throw new Error(`Unknown 'PlanetType': ${planet}`);
};

/**
 * Determine which planet a rocket choice leads to
 * @param {number} rocketChoice The rocket choice (1 = left, 2 = right)
 * @param {boolean} swapPreference Whether rocket-to-planet mapping is swapped
 * @param {boolean} isTraining Whether this is a training trial (uses green/yellow planets)
 * @return The destination planet
 */
export const getPlanetFromRocketChoice = (
  rocketChoice: 1 | 2,
  swapPreference: boolean,
  isTraining: boolean = false
): PlanetType => {
  if (isTraining) {
    return rocketChoice === 1 ? PlanetType.GREEN : PlanetType.YELLOW;
  }

  if (swapPreference) {
    // Swapped: left rocket goes to purple, right rocket goes to red
    return rocketChoice === 1 ? PlanetType.PURPLE : PlanetType.RED;
  } else {
    // Default: left rocket goes to red, right rocket goes to purple
    return rocketChoice === 1 ? PlanetType.RED : PlanetType.PURPLE;
  }
};

/**
 * Get planet stimulus filename
 * @param {PlanetType} planet The planet type
 * @returns {string} The planet stimulus filename
 * @throws Error if planet type is unknown
 */
export const getPlanetStimulus = (planet: PlanetType): string => {
  switch (planet) {
    case PlanetType.RED: return 'main_planet_red.png';
    case PlanetType.PURPLE: return 'main_planet_purple.png';
    case PlanetType.GREEN: return 'tutorial_planet_green.png';
    case PlanetType.YELLOW: return 'tutorial_planet_yellow.png';
    default: throw new Error(`Unknown 'PlanetType': ${planet}`);
  }
};

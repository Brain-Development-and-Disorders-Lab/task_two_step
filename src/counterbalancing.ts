/**
 * @fileoverview Counterbalancing utilities for the Two-Step Task experiment
 *
 * This file provides simplified counterbalancing functions for stimulus presentation
 * in the Two-Step Task. It uses simple swap flags instead of complex mapping
 * to determine which stimuli appear on which sides and which rockets lead to which planets.
 *
 * @author Henry Burgess
 */

// Custom types
import { PlanetType } from "./types";

/**
 * Get rocket stimuli with optional side swapping
 *
 * @param {boolean} isTraining - Whether to use training rocket stimuli
 * @param {boolean} swapSides - Whether to swap left and right rocket positions
 * @returns Object containing left and right stimulus filenames
 */
export function getRocketStimuli(isTraining: boolean, swapSides: boolean): { leftStimulus: string; rightStimulus: string } {
  if (isTraining) {
    return swapSides
      ? { leftStimulus: 'tutrocket2_norm.png', rightStimulus: 'tutrocket1_norm.png' }
      : { leftStimulus: 'tutrocket1_norm.png', rightStimulus: 'tutrocket2_norm.png' };
  } else {
    return swapSides
      ? { leftStimulus: 'rocket2_norm.png', rightStimulus: 'rocket1_norm.png' }
      : { leftStimulus: 'rocket1_norm.png', rightStimulus: 'rocket2_norm.png' };
  }
}

/**
 * Get alien stimuli for a planet with optional side swapping
 *
 * @param {PlanetType} planet - The planet type ('red', 'purple', 'green', 'yellow')
 * @param {boolean} swapSides - Whether to swap left and right alien positions
 * @returns {{ leftStimulus: string, rightStimulus: string }} Object containing left and right stimulus filenames
 * @throws Error if planet type is unknown
 */
export function getAlienStimuli(planet: PlanetType, swapSides: boolean): { leftStimulus: string; rightStimulus: string } {
  if (planet === PlanetType.RED) {
    return swapSides
      ? { leftStimulus: 'alien2_norm.png', rightStimulus: 'alien1_norm.png' }
      : { leftStimulus: 'alien1_norm.png', rightStimulus: 'alien2_norm.png' };
  } else if (planet === PlanetType.PURPLE) {
    return swapSides
      ? { leftStimulus: 'alien4_norm.png', rightStimulus: 'alien3_norm.png' }
      : { leftStimulus: 'alien3_norm.png', rightStimulus: 'alien4_norm.png' };
  } else if (planet === PlanetType.GREEN) {
    return swapSides
      ? { leftStimulus: 'tutalien2_norm.png', rightStimulus: 'tutalien1_norm.png' }
      : { leftStimulus: 'tutalien1_norm.png', rightStimulus: 'tutalien2_norm.png' };
  } else if (planet === PlanetType.YELLOW) {
    return swapSides
      ? { leftStimulus: 'tutalien4_norm.png', rightStimulus: 'tutalien3_norm.png' }
      : { leftStimulus: 'tutalien3_norm.png', rightStimulus: 'tutalien4_norm.png' };
  }

  throw new Error(`Unknown 'PlanetType': ${planet}`);
}

/**
 * Determine which planet a rocket choice leads to
 *
 * @param {number} rocketChoice - The rocket choice (1 = left, 2 = right)
 * @param {boolean} swapPreference - Whether rocket-to-planet mapping is swapped
 * @param {boolean} isTraining - Whether this is a training trial (uses green/yellow planets)
 * @returns The destination planet
 */
export function getPlanetFromRocketChoice(
  rocketChoice: 1 | 2,
  swapPreference: boolean,
  isTraining: boolean = false
): PlanetType {
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
}

/**
 * Get planet stimulus filename
 *
 * @param {PlanetType} planet - The planet type
 * @returns {string} The planet stimulus filename
 * @throws Error if planet type is unknown
 */
export function getPlanetStimulus(planet: PlanetType): string {
  switch (planet) {
    case PlanetType.RED: return 'redplanet1.png';
    case PlanetType.PURPLE: return 'purpleplanet.png';
    case PlanetType.GREEN: return 'tutgreenplanet.png';
    case PlanetType.YELLOW: return 'tutyellowplanet.png';
    default: throw new Error(`Unknown 'PlanetType': ${planet}`);
  }
}

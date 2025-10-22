/**
 * @fileoverview Counterbalancing utilities for the Two-Step Task experiment
 *
 * This file provides simplified counterbalancing functions for stimulus presentation
 * in the Two-Step Task. It uses simple swap flags instead of complex mapping
 * to determine which stimuli appear on which sides and which rockets lead to which planets.
 *
 * @author Henry Burgess
 */

/**
 * Get rocket stimuli with optional side swapping
 *
 * @param isTraining - Whether to use training rocket stimuli
 * @param swapSides - Whether to swap left and right rocket positions
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
 * @param planet - The planet type ('red', 'purple', 'green', 'yellow')
 * @param swapSides - Whether to swap left and right alien positions
 * @returns Object containing left and right stimulus filenames
 * @throws Error if planet type is unknown
 */
export function getAlienStimuli(planet: 'red' | 'purple' | 'green' | 'yellow', swapSides: boolean): { leftStimulus: string; rightStimulus: string } {
  if (planet === 'red') {
    return swapSides
      ? { leftStimulus: 'alien2_norm.png', rightStimulus: 'alien1_norm.png' }
      : { leftStimulus: 'alien1_norm.png', rightStimulus: 'alien2_norm.png' };
  } else if (planet === 'purple') {
    return swapSides
      ? { leftStimulus: 'alien4_norm.png', rightStimulus: 'alien3_norm.png' }
      : { leftStimulus: 'alien3_norm.png', rightStimulus: 'alien4_norm.png' };
  } else if (planet === 'green') {
    return swapSides
      ? { leftStimulus: 'tutalien2_norm.png', rightStimulus: 'tutalien1_norm.png' }
      : { leftStimulus: 'tutalien1_norm.png', rightStimulus: 'tutalien2_norm.png' };
  } else if (planet === 'yellow') {
    return swapSides
      ? { leftStimulus: 'tutalien4_norm.png', rightStimulus: 'tutalien3_norm.png' }
      : { leftStimulus: 'tutalien3_norm.png', rightStimulus: 'tutalien4_norm.png' };
  }

  throw new Error(`Unknown planet: ${planet}`);
}

/**
 * Determine which planet a rocket choice leads to
 *
 * @param rocketChoice - The rocket choice (1 = left, 2 = right)
 * @param swapPreference - Whether rocket-to-planet mapping is swapped
 * @param isTraining - Whether this is a training trial (uses green/yellow planets)
 * @returns The destination planet
 */
export function getPlanetFromRocketChoice(
  rocketChoice: 1 | 2,
  swapPreference: boolean,
  isTraining: boolean = false
): 'red' | 'purple' | 'green' | 'yellow' {
  if (isTraining) {
    return rocketChoice === 1 ? 'green' : 'yellow';
  }

  if (swapPreference) {
    // Swapped: left rocket goes to purple, right rocket goes to red
    return rocketChoice === 1 ? 'purple' : 'red';
  } else {
    // Default: left rocket goes to red, right rocket goes to purple
    return rocketChoice === 1 ? 'red' : 'purple';
  }
}

/**
 * Get planet stimulus filename
 *
 * @param planet - The planet type
 * @returns The planet stimulus filename
 * @throws Error if planet type is unknown
 */
export function getPlanetStimulus(planet: 'red' | 'purple' | 'green' | 'yellow'): string {
  switch (planet) {
    case 'red': return 'redplanet1.png';
    case 'purple': return 'purpleplanet.png';
    case 'green': return 'tutgreenplanet.png';
    case 'yellow': return 'tutyellowplanet.png';
    default: throw new Error(`Unknown planet: ${planet}`);
  }
}

/**
 * Core experiment logic for the Two-Step Task
 * Handles transition calculations and counter-balancing
 */

import { TrialData, ProbabilityData } from './types';
import { config } from './config';

export class ExperimentLogic {
  // Counter-balancing variables (randomized at start)
  public readonly rocketSides: boolean;
  public readonly practiceRocketSides: boolean;
  public readonly swapRedPlanet: boolean;
  public readonly swapPurplePlanet: boolean;
  public readonly swapGreenPlanet: boolean;
  public readonly swapYellowPlanet: boolean;
  public readonly redPlanetFirstRocket: boolean;

  // State tracking
  private stageState: any[] = [];
  private practiceReward: number = 0;
  private realReward: number = 0;

  constructor() {
    // Randomize counter-balancing variables
    this.rocketSides = Math.random() < 0.5;
    this.practiceRocketSides = Math.random() < 0.5;
    this.swapRedPlanet = Math.random() < 0.5;
    this.swapPurplePlanet = Math.random() < 0.5;
    this.swapGreenPlanet = Math.random() < 0.5;
    this.swapYellowPlanet = Math.random() < 0.5;
    this.redPlanetFirstRocket = Math.random() < 0.5;

    console.log('Counter-balancing variables:', {
      rocketSides: this.rocketSides,
      practiceRocketSides: this.practiceRocketSides,
      swapRedPlanet: this.swapRedPlanet,
      swapPurplePlanet: this.swapPurplePlanet,
      swapGreenPlanet: this.swapGreenPlanet,
      swapYellowPlanet: this.swapYellowPlanet,
      redPlanetFirstRocket: this.redPlanetFirstRocket,
    });
  }

  /**
   * Calculate transition from rocket choice to planet/aliens
   */
  calculateTransition(chosenStimulus: string, isPractice: boolean): any[] {
    let firstPlanet = '';
    let secondPlanet = '';

    if (isPractice) {
      firstPlanet = 'green';
      secondPlanet = 'yellow';
    } else {
      firstPlanet = 'red';
      secondPlanet = 'purple';
    }

    // Determine which rocket was chosen
    const firstShipChosen = chosenStimulus.includes('rocket1') || chosenStimulus.includes('tutrocket1');
    const goodTransition = Math.random() < config.transitionProbability;

    // Determine the resulting planet based on ship choice and transition type
    let planet = '';
    const isCommonTransition = goodTransition;

    if (this.redPlanetFirstRocket) {
      // If rocket 1 goes to red planet
      planet = firstShipChosen === isCommonTransition ? firstPlanet : secondPlanet;
    } else {
      // If rocket 2 goes to red planet
      planet = firstShipChosen === isCommonTransition ? secondPlanet : firstPlanet;
    }

    // Return appropriate aliens and planet based on counter-balancing
    return this.getAliensForPlanet(planet, isPractice, goodTransition, chosenStimulus);
  }

  /**
   * Get aliens and planet configuration based on counter-balancing
   */
  private getAliensForPlanet(planet: string, isPractice: boolean, goodTransition: boolean, chosenStimulus: string): any[] {
    if (planet === 'red') {
      const counterbalanced = isPractice ? true : this.swapRedPlanet;

      if (counterbalanced) {
        return [
          'alien2',
          'alien1',
          'redplanet1.png',
          chosenStimulus,
          goodTransition,
        ];
      } else {
        return [
          'alien1',
          'alien2',
          'redplanet1.png',
          chosenStimulus,
          goodTransition,
        ];
      }
    } else if (planet === 'purple') {
      const counterbalanced = isPractice ? true : this.swapPurplePlanet;

      if (counterbalanced) {
        return [
          'alien4',
          'alien3',
          'purpleplanet.png',
          chosenStimulus,
          goodTransition,
        ];
      } else {
        return [
          'alien3',
          'alien4',
          'purpleplanet.png',
          chosenStimulus,
          goodTransition,
        ];
      }
    } else if (planet === 'green') {
      const counterbalanced = isPractice ? true : this.swapGreenPlanet;

      if (counterbalanced) {
        return [
          'tutalien2',
          'tutalien1',
          'tutgreenplanet.png',
          chosenStimulus,
          goodTransition,
        ];
      } else {
        return [
          'tutalien1',
          'tutalien2',
          'tutgreenplanet.png',
          chosenStimulus,
          goodTransition,
        ];
      }
    } else if (planet === 'yellow') {
      const counterbalanced = isPractice ? true : this.swapYellowPlanet;

      if (counterbalanced) {
        return [
          'tutalien4',
          'tutalien3',
          'tutyellowplanet.png',
          chosenStimulus,
          goodTransition,
        ];
      } else {
        return [
          'tutalien3',
          'tutalien4',
          'tutyellowplanet.png',
          chosenStimulus,
          goodTransition,
        ];
      }
    }

    console.error('Error in transition calculation!');
    return [];
  }

  /**
   * Determine reward outcome based on alien choice and probability data
   */
  determineReward(alienChoice: string, probabilityData: ProbabilityData): boolean {
    let probability = 0;

    if (alienChoice.includes('alien1') || alienChoice.includes('tutalien1')) {
      probability = probabilityData.alien1;
    } else if (alienChoice.includes('alien2') || alienChoice.includes('tutalien2')) {
      probability = probabilityData.alien2;
    } else if (alienChoice.includes('alien3') || alienChoice.includes('tutalien3')) {
      probability = probabilityData.alien3;
    } else if (alienChoice.includes('alien4') || alienChoice.includes('tutalien4')) {
      probability = probabilityData.alien4;
    }

    return Math.random() < probability;
  }

  /**
   * Update reward counters
   */
  updateReward(isPractice: boolean, wasRewarded: boolean): void {
    if (wasRewarded) {
      if (isPractice) {
        this.practiceReward++;
      } else {
        this.realReward++;
      }
    }
  }

  /**
   * Get current reward counts
   */
  getRewards(): { practiceReward: number; realReward: number } {
    return {
      practiceReward: this.practiceReward,
      realReward: this.realReward,
    };
  }

  /**
   * Reset stage state
   */
  resetStageState(): void {
    this.stageState = [];
  }

  /**
   * Set stage state
   */
  setStageState(state: any[]): void {
    this.stageState = state;
  }

  /**
   * Get stage state
   */
  getStageState(): any[] {
    return this.stageState;
  }

  /**
   * Generate a random stage state for alien-only trials
   */
  generateRandomStageState(isPractice: boolean): any[] {
    // Randomly choose a planet and aliens
    const planets = isPractice
      ? [['tutalien1', 'tutalien2', 'tutgreenplanet.png'], ['tutalien3', 'tutalien4', 'tutyellowplanet.png']]
      : [['alien1', 'alien2', 'redplanet1.png'], ['alien3', 'alien4', 'purpleplanet.png']];

    const randomIndex = Math.floor(Math.random() * planets.length);
    const randomPlanet = planets[randomIndex]!; // Non-null assertion since we know the array has elements
    const randomTransition = Math.random() < 0.5;

    return [
      randomPlanet[0], // left alien
      randomPlanet[1], // right alien
      randomPlanet[2], // planet image
      '', // chosen stimulus (empty for alien-only trials)
      randomTransition, // transition type
    ];
  }
}

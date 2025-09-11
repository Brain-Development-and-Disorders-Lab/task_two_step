/**
 * @fileoverview Choice plugin for the Two-Step Task experiment
 *
 * This plugin handles the main choice trials in the Two-Step Task, including
 * rocket selection, alien selection, and the two-stage decision process.
 * It manages stimulus presentation, response collection, and reward calculation.
 *
 * @author Henry Burgess
 */

// Custom types
import { ChoiceTrialData } from '../types';

// Configuration
import { config } from '../config';

// Counterbalancing utilities
import {
  getPlanetFromRocketChoice,
  getAlienStimuli,
  getRocketStimuli,
  getPlanetStimulus
} from '../counterbalancing';

// jsPsych
import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from 'jspsych';

/**
 * Choice plugin class for handling rocket and alien selection trials
 */
class ChoicePlugin implements JsPsychPlugin<typeof ChoicePlugin.info> {
  static info = {
    name: 'two-step-choice' as const,
    parameters: {
      trialType: {
        type: ParameterType.COMPLEX,
        default: 'full',
      },
      leftKey: {
        type: ParameterType.KEY,
        default: 'f',
      },
      rightKey: {
        type: ParameterType.KEY,
        default: 'j',
      },
      rewardLikelihoods: {
        type: ParameterType.COMPLEX,
        default: [0.5, 0.5, 0.5, 0.5],
      },
      transitionLikelihood: {
        type: ParameterType.FLOAT,
        default: 1.0,
      },
      responseWindow: {
        type: ParameterType.INT,
        default: undefined,
      },
      onStart: {
        type: ParameterType.FUNCTION,
        default: undefined,
      },
      onFinish: {
        type: ParameterType.FUNCTION,
        default: undefined,
      },
    },
  } as const;

  private jsPsych: JsPsych;
  private data: ChoiceTrialData;
  private currentStage: 'rocket' | 'alien' = 'rocket';
  private levelOneStartTime: number = 0;
  private levelTwoStartTime: number = 0;

  constructor(jsPsych: JsPsych) {
    this.jsPsych = jsPsych;
    this.data = this.createDefaultData();
  }

  /**
   * Create default trial data structure
   *
   * @returns Default choice trial data
   */
  private createDefaultData(): ChoiceTrialData {
    return {
      trialStartTime: 0,
      trialEndTime: 0,
      trialType: 'full',
      leftKey: 'f',
      rightKey: 'j',
      rewardLikelihoods: [0.5, 0.5, 0.5, 0.5],
      transitionLikelihood: 1.0,
      responseWindow: 3000,
      levelOneChoice: 0,
      levelTwoChoice: 0,
      levelOneRT: 0,
      levelTwoRT: 0,
      timeout: false,
      wasRewarded: false,
      transitionType: 'none',
    };
  }

  /**
   * Convert keyboard input to choice value
   *
   * @param key - The pressed key
   * @returns Choice value (0 = timeout/invalid, 1 = left, 2 = right)
   */
  private convertKeyToChoice(key: string): 0 | 1 | 2 {
    if (key === this.data.leftKey) return 1;
    if (key === this.data.rightKey) return 2;
    return 0; // timeout or invalid key
  }

  /**
   * Reset all level data (both rocket and alien choices)
   */
  private resetAllLevelData(): void {
    this.data.levelOneChoice = 0;
    this.data.levelOneRT = 0;
    this.data.levelTwoChoice = 0;
    this.data.levelTwoRT = 0;
  }

  /**
   * Reset data for the current stage only
   */
  private resetCurrentLevelData(): void {
    if (this.currentStage === 'rocket') {
      this.data.levelOneChoice = 0;
      this.data.levelOneRT = 0;
    } else {
      this.data.levelTwoChoice = 0;
      this.data.levelTwoRT = 0;
    }
  }

  /**
   * Get the full stimulus path for a filename
   *
   * @param filename - The stimulus filename
   * @returns The full stimulus path
   */
  private getStimulusPath(filename: string): string {
    return this.jsPsych.extensions.Neurocog.getStimulus(filename);
  }

  /**
   * Get rocket stimuli with counterbalancing applied
   *
   * @param isTraining - Whether to use training rocket stimuli
   * @returns Object containing left and right rocket stimuli and planet stimulus
   */
  private getRocketStimuli(isTraining: boolean): { leftStimulus: string; rightStimulus: string; planetStimulus: string } {
    const swapSides = isTraining ? config.counterbalancing.swapTrainingRockets : config.counterbalancing.swapMainRockets;
    const rocketStimuli = getRocketStimuli(isTraining, swapSides);
    return {
      leftStimulus: rocketStimuli.leftStimulus,
      rightStimulus: rocketStimuli.rightStimulus,
      planetStimulus: 'earth.png'
    };
  }

  /**
   * Get alien stimuli based on rocket choice and counterbalancing
   *
   * @param isTraining - Whether this is a training trial
   * @param rocketChoice - Whether the left rocket was chosen
   * @returns Object containing left and right alien stimuli and planet stimulus
   */
  private getAlienStimuli(isTraining: boolean, rocketChoice: boolean): { leftStimulus: string; rightStimulus: string; planetStimulus: string } {
    if (isTraining && !this.data.trialType.includes('full')) {
      // Only training-rocket and training-alien use deterministic transitions
      const planet = rocketChoice ? 'green' : 'yellow';
      const swapSides = planet === 'green' ? config.counterbalancing.swapGreenAliens : config.counterbalancing.swapYellowAliens;
      const alienStimuli = getAlienStimuli(planet, swapSides);
      return {
        leftStimulus: alienStimuli.leftStimulus,
        rightStimulus: alienStimuli.rightStimulus,
        planetStimulus: getPlanetStimulus(planet)
      };
    } else {
      // training-full and full trials use probabilistic transitions
      const rocketChoiceNum = this.data.levelOneChoice === 1 ? 1 : 2;
      const isCommonTransition = this.jsPsych.extensions.Neurocog.random() < this.data.transitionLikelihood;

      // Determine planet based on counterbalancing and transition
      let planet: 'red' | 'purple' | 'green' | 'yellow';
      if (isCommonTransition) {
        planet = getPlanetFromRocketChoice(rocketChoiceNum, config.counterbalancing.swapRocketPreference, false);
      } else {
        // Rare transition: opposite planet
        const commonPlanet = getPlanetFromRocketChoice(rocketChoiceNum, config.counterbalancing.swapRocketPreference, false);
        planet = commonPlanet === 'red' ? 'purple' : 'red';
      }

      // Set transition type for data logging
      this.data.transitionType = isCommonTransition ? 'common' : 'rare';

      // Debug transition computation
      console.debug("---- Transition Computation ----\n",
        "Rocket Choice:", rocketChoiceNum === 1 ? "Left" : "Right", "\n",
        "Swap Preference:", config.counterbalancing.swapRocketPreference, "\n",
        "Common Planet:", getPlanetFromRocketChoice(rocketChoiceNum, config.counterbalancing.swapRocketPreference, false), "\n",
        "Transition Type:", this.data.transitionType, "\n",
        "Final Destination Planet:", planet);

      // Use training stimuli for training-full trials, main stimuli for full trials
      if (this.data.trialType === 'training-full') {
        // Map main planets to training planets for training-full trials
        const trainingPlanet = planet === 'red' ? 'green' : 'yellow';
        const swapSides = trainingPlanet === 'green' ? config.counterbalancing.swapGreenAliens : config.counterbalancing.swapYellowAliens;
        const alienStimuli = getAlienStimuli(trainingPlanet, swapSides);
        return {
          leftStimulus: alienStimuli.leftStimulus,
          rightStimulus: alienStimuli.rightStimulus,
          planetStimulus: getPlanetStimulus(trainingPlanet)
        };
      } else {
        const swapSides = planet === 'red' ? config.counterbalancing.swapRedAliens : config.counterbalancing.swapPurpleAliens;
        const alienStimuli = getAlienStimuli(planet, swapSides);
        return {
          leftStimulus: alienStimuli.leftStimulus,
          rightStimulus: alienStimuli.rightStimulus,
          planetStimulus: getPlanetStimulus(planet)
        };
      }
    }
  }

  /**
   * Generate appropriate stimuli based on trial type and current stage
   *
   * @param trialType - The type of trial being run
   * @param isTraining - Whether this is a training trial
   * @returns Object containing left and right stimuli and planet stimulus
   */
  private generateStimuli(trialType: string, isTraining: boolean): { leftStimulus: string; rightStimulus: string; planetStimulus: string } {
    if (trialType === 'training-rocket') {
      return this.getRocketStimuli(isTraining);
    } else if (trialType === 'training-alien') {
      const alienStimuli = getAlienStimuli('green', config.counterbalancing.swapGreenAliens);
      return {
        leftStimulus: alienStimuli.leftStimulus,
        rightStimulus: alienStimuli.rightStimulus,
        planetStimulus: getPlanetStimulus('green')
      };
    } else if (trialType === 'training-full' || trialType === 'full') {
      if (this.currentStage === 'rocket') {
        return this.getRocketStimuli(isTraining);
      } else {
        return this.getAlienStimuli(isTraining, this.data.levelOneChoice === 1);
      }
    }
    return this.getRocketStimuli(false);
  }

  /**
   * Set instruction text in the display element
   *
   * @param displayElement - The display element containing instructions
   * @param text - The instruction text to display
   */
  private setInstructions(displayElement: HTMLElement, text: string): void {
    const instructionsElement = displayElement.querySelector('#instructions') as HTMLElement;
    if (instructionsElement) {
      instructionsElement.innerHTML = text;
    }
  }

  /**
   * Create HTML for the trial display
   *
   * @param leftStimulus - Path to the left stimulus image
   * @param rightStimulus - Path to the right stimulus image
   * @param planetStimulus - Path to the planet background image
   * @param rewardStimulus - Path to the reward symbol image
   * @param trialType - The type of trial to determine reward display
   * @returns HTML string for the trial display
   */
  private createDisplayHTML(leftStimulus: string, rightStimulus: string, planetStimulus: string, rewardStimulus: string, trialType: string): string {
    const showRewardSymbol = trialType === 'training-alien' || trialType === 'training-full' || trialType === 'full';

    return `
      <style>
        @keyframes glideToCenter {
          0% { transform: translate(-50%, -50%); }
          100% { transform: translate(-50%, -50%); }
        }
        .stimulus-container { transition: all 0.5s ease-in-out; }
        .stimulus-container.glide-left { left: 50% !important; top: 35% !important; transform: translate(-50%, -50%) !important; }
        .stimulus-container.glide-right { right: 50% !important; top: 35% !important; transform: translate(50%, -50%) !important; }
        .fade-out { opacity: 0.3; }
        img {
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          pointer-events: none;
          -webkit-user-drag: none;
          -khtml-user-drag: none;
          -moz-user-drag: none;
          -o-user-drag: none;
          user-drag: none;
        }
      </style>
      <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: #000; color: #fff;">
        <img src="${planetStimulus}" draggable="false" style="width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0;" />
        <div id="left-stimulus" class="stimulus-container" style="position: absolute; left: 25%; top: 60%; transform: translate(-50%, -50%);">
          <img src="${leftStimulus}" draggable="false" style="width: 173px; height: 173px; object-fit: contain;" />
        </div>
        <div id="right-stimulus" class="stimulus-container" style="position: absolute; right: 25%; top: 60%; transform: translate(50%, -50%);">
          <img src="${rightStimulus}" draggable="false" style="width: 173px; height: 173px; object-fit: contain;" />
        </div>
        ${showRewardSymbol ? `
          <div id="reward-symbol" style="position: absolute; opacity: 0; transition: opacity 0.2s ease-in-out;">
            <img src="${rewardStimulus}" draggable="false" style="width: 72px; height: 72px; object-fit: contain;" />
          </div>
        ` : ''}
        <div id="instructions" style="position: absolute; bottom: 15%; left: 50%; width: 100%; transform: translateX(-50%); color: #fff; font-size: 24px; text-align: center; font-weight: semibold;"></div>
      </div>
    `;
  }

  /**
   * Calculate and display reward based on alien choice
   *
   * @param isLeftChoice - Whether the left alien was chosen
   * @param rewardSymbolElement - The reward display element
   */
  private calculateAndShowReward(isLeftChoice: boolean, rewardSymbolElement: HTMLElement | null): void {
    if (!rewardSymbolElement) return;

    // Determine which alien was selected based on planet and choice
    const alienIndex = this.getAlienIndex(isLeftChoice);
    const probability = this.data.rewardLikelihoods[alienIndex] || 0.5;
    const randomNumber = this.jsPsych.extensions.Neurocog.random();

    // Include debugging information
    console.debug("---- Reward Calculation ----\nRandom Number:", randomNumber, "\nProbability:", probability, "\nwasRewarded:", randomNumber < probability);

    const wasRewarded = randomNumber < probability;
    const rewardStimulus = this.getStimulusPath(wasRewarded ? 't.png' : 'nothing.png');

    // Show reward stimulus
    rewardSymbolElement.querySelector('img')!.src = rewardStimulus;
    rewardSymbolElement.style.left = '50%';
    rewardSymbolElement.style.top = '20%';
    rewardSymbolElement.style.transform = 'translate(-50%, -50%)';
    rewardSymbolElement.style.opacity = '1';
    this.data.wasRewarded = wasRewarded;
  }

  /**
   * Get the alien index for reward calculation based on choice and planet
   *
   * @param isLeftChoice - Whether the left alien was chosen
   * @returns The alien index (0-3) for reward probability lookup
   */
  private getAlienIndex(isLeftChoice: boolean): number {
    // Determine planet type based on rocket choice and transition
    const isCommonTransition = this.data.transitionType === 'common';
    const rocketChoiceNum = this.data.levelOneChoice === 1 ? 1 : 2;

    // Get the actual planet based on counterbalancing and transition
    let planet: 'red' | 'purple' | 'green' | 'yellow';
    if (isCommonTransition) {
      planet = getPlanetFromRocketChoice(rocketChoiceNum, config.counterbalancing.swapRocketPreference, false);
    } else {
      // Rare transition: opposite planet
      const commonPlanet = getPlanetFromRocketChoice(rocketChoiceNum, config.counterbalancing.swapRocketPreference, false);
      planet = commonPlanet === 'red' ? 'purple' : 'red';
    }

    // Map planet to alien index based on counterbalancing
    if (planet === 'red') {
      return isLeftChoice ? 0 : 1;
    } else if (planet === 'purple') {
      return isLeftChoice ? 2 : 3;
    } else if (planet === 'green') {
      return isLeftChoice ? 0 : 1; // Training planets map to same indices as red
    } else if (planet === 'yellow') {
      return isLeftChoice ? 2 : 3; // Training planets map to same indices as purple
    }

    return 0; // fallback
  }

  /**
   * Create and display timeout overlay when trial times out
   *
   * @param element - The element to add the timeout overlay to
   */
  private createTimeoutOverlay(element: HTMLElement): void {
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = '50%';
    overlay.style.left = '50%';
    overlay.style.transform = 'translate(-50%, -50%)';
    overlay.style.fontSize = '80px';
    overlay.style.color = 'red';
    overlay.style.fontWeight = 'bold';
    overlay.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
    overlay.style.zIndex = '1000';
    overlay.innerHTML = '✕';
    element.appendChild(overlay);
  }

  /**
   * Update trial data with parameters from the trial configuration
   *
   * @param trial - The trial configuration object
   */
  private updateTrialData(trial: TrialType<typeof ChoicePlugin.info>): void {
    this.data.trialStartTime = Date.now();
    this.data.trialType = trial.trialType;
    this.data.leftKey = trial.leftKey || 'f';
    this.data.rightKey = trial.rightKey || 'j';
    this.data.rewardLikelihoods = trial.rewardLikelihoods;
    this.data.transitionLikelihood = trial.transitionLikelihood || 1.0;
    this.data.responseWindow = trial.responseWindow || 3000;
  }

  /**
   * Handle transition from rocket stage to alien stage
   *
   * @param isLeftChoice - Whether the left rocket was chosen
   * @param trialType - The type of trial being run
   * @param isTraining - Whether this is a training trial
   * @param displayElement - The display element to update
   */
  private handleStageTransition(isLeftChoice: boolean, trialType: string, isTraining: boolean, displayElement: HTMLElement): void {
    this.currentStage = 'alien';
    // Note: levelOneChoice and levelOneRT are now set immediately when key is pressed

    const alienStimuli = this.generateStimuli(trialType, isTraining);
    const leftStimulus = this.getStimulusPath(alienStimuli.leftStimulus);
    const rightStimulus = this.getStimulusPath(alienStimuli.rightStimulus);
    const planetStimulus = this.getStimulusPath(alienStimuli.planetStimulus);

    displayElement.innerHTML = this.createDisplayHTML(leftStimulus, rightStimulus, planetStimulus, this.getStimulusPath('nothing.png'), trialType);

    // Set start time for level two (alien choice)
    this.levelTwoStartTime = Date.now();
  }

  /**
   * Finalize trial data based on response and trial type
   *
   * @param response - The participant's response (null if timeout)
   * @param trialType - The type of trial being run
   */
  private finalizeTrialData(response: { key: string; rt: number } | null, trialType: string): void {
    this.data.trialEndTime = Date.now();

    if (response) {
      this.data.timeout = false;
      const choice = this.convertKeyToChoice(response.key);

      if ((trialType === 'training-full' || trialType === 'full') && this.currentStage === 'alien') {
        // Level 2 (alien) choice in two-stage trials
        this.data.levelTwoChoice = choice;
        this.data.levelTwoRT = response.rt;
      } else if (trialType === 'training-rocket') {
        // Level 1 only
        this.data.levelOneChoice = choice;
        this.data.levelOneRT = response.rt;
        this.data.levelTwoChoice = 0;
        this.data.levelTwoRT = 0;
      } else if (trialType === 'training-alien') {
        // Level 2 only
        this.data.levelOneChoice = 0;
        this.data.levelOneRT = 0;
        this.data.levelTwoChoice = choice;
        this.data.levelTwoRT = response.rt;
      }
    } else {
      // Timeout case - reset appropriate level data
      this.data.timeout = true;

      if ((trialType === 'training-full' || trialType === 'full') && this.currentStage === 'alien') {
        // Timeout on alien stage - only reset level two data, preserve level one
        this.data.levelTwoChoice = 0;
        this.data.levelTwoRT = 0;
      } else {
        // Timeout on rocket stage or single-stage trials - reset all data
        this.resetAllLevelData();
      }
    }
  }

  /**
   * Execute the choice trial
   *
   * @param displayElement - The HTML element to display content in
   * @param trial - The trial parameters
   */
  trial(displayElement: HTMLElement, trial: TrialType<typeof ChoicePlugin.info>) {
    // Debugging information
    console.debug("---- Trial Information ----\nTrial Type:", trial.trialType, "\nProbability Data:", trial.rewardLikelihoods, "\nTransition Likelihood:", trial.transitionLikelihood);

    if (trial.onStart) trial.onStart();
    this.updateTrialData(trial);

    let response: { key: string; rt: number } | null = null;
    let isAnimating = false;
    const trialType = trial.trialType || 'full';
    const isTraining = trialType.startsWith('training-');
    this.currentStage = trialType === 'training-alien' ? 'alien' : 'rocket';

    // Generate initial stimuli
    let { leftStimulus, rightStimulus, planetStimulus } = this.generateStimuli(trialType, isTraining);
    let rewardStimulus: string = this.getStimulusPath('nothing.png');

    // Update to use the actual stimuli paths
    leftStimulus = this.getStimulusPath(leftStimulus);
    rightStimulus = this.getStimulusPath(rightStimulus);
    planetStimulus = this.getStimulusPath(planetStimulus);

    // Render the initial display
    displayElement.innerHTML = this.createDisplayHTML(leftStimulus, rightStimulus, planetStimulus, rewardStimulus, trialType);

    // Set the initial instructions if applicable
    this.setInstructions(displayElement, ''); // Clear any previous instructions
    if (trialType === 'training-rocket') {
      this.setInstructions(displayElement, 'Press <b>"F"</b> to select the left rocket, or <b>"J"</b> to select the right rocket.');
    } else if (trialType === 'training-alien') {
      this.setInstructions(displayElement, 'Press <b>"F"</b> to select the left alien, or <b>"J"</b> to select the right alien.');
    }

    // Set start time based on trial type
    if (trialType === 'training-alien') {
      // Only level two (alien choice) for training-alien trials
      this.levelTwoStartTime = Date.now();
    } else {
      // Level one (rocket choice) for all other trials
      this.levelOneStartTime = Date.now();
    }

    // Animation handler for two-stage flow
    const animateSelection = (isLeftChoice: boolean) => {
      if (isAnimating) return;
      isAnimating = true;

      // Remove keyboard listener
      document.removeEventListener('keydown', keyboardListener);

      // Clear timeout
      this.jsPsych.pluginAPI.clearAllTimeouts();

      // Get stimulus elements
      const leftStimulusElement = displayElement.querySelector('#left-stimulus') as HTMLElement;
      const rightStimulusElement = displayElement.querySelector('#right-stimulus') as HTMLElement;
      const rewardSymbolElement = displayElement.querySelector('#reward-symbol') as HTMLElement;

      if (isLeftChoice) {
        // Fade out right stimulus and glide left to center
        if (rightStimulusElement) {
          rightStimulusElement.classList.add('fade-out');
        }
        if (leftStimulusElement) {
          leftStimulusElement.classList.add('glide-left');
        }
      } else {
        // Fade out left stimulus and glide right to center
        if (leftStimulusElement) {
          leftStimulusElement.classList.add('fade-out');
        }
        if (rightStimulusElement) {
          rightStimulusElement.classList.add('glide-right');
        }
      }

      // Handle different trial types
      if (trialType === 'training-rocket') {
        // Single stage - show planet preview then finish
        setTimeout(() => {
          setTimeout(() => {
            // Determine destination planet based on rocket choice
            const rocketChoice = isLeftChoice ? 1 : 2;

            // Training: left rocket → green planet, right rocket → yellow planet
            const planet = rocketChoice === 1 ? 'green' : 'yellow';
            const swapSides = planet === 'green' ? config.counterbalancing.swapGreenAliens : config.counterbalancing.swapYellowAliens;
            const alienStimuli = getAlienStimuli(planet, swapSides);

            // Update display to show planet with aliens
            const planetStimulus = this.getStimulusPath(getPlanetStimulus(planet));
            const leftStimulus = this.getStimulusPath(alienStimuli.leftStimulus);
            const rightStimulus = this.getStimulusPath(alienStimuli.rightStimulus);

            displayElement.innerHTML = this.createDisplayHTML(leftStimulus, rightStimulus, planetStimulus, this.getStimulusPath('nothing.png'), trialType);

            this.setInstructions(displayElement, `You have arrived at the <b>${planet}</b> planet!`);

            // Wait for preview duration (same as reward display), then finish
            setTimeout(() => finishTrial(), config.timing.reward);
          }, config.timing.reward); // Brief pause before planet appears
        }, config.timing.reward);
      } else if (trialType === 'training-alien') {
        // Single stage with reward
        setTimeout(() => {
          this.calculateAndShowReward(isLeftChoice, rewardSymbolElement);

          // Update instructions
          if (this.data.wasRewarded) {
            this.setInstructions(displayElement, 'The alien shared their space resources with you!');
          } else {
            this.setInstructions(displayElement, 'The alien did not have space resources to share with you.');
          }

          // Wait for reward display, then finish
          setTimeout(() => finishTrial(), config.timing.reward);
        }, config.timing.reward);
      } else if (trialType === 'training-full' || trialType === 'full') {
        // Two-stage trials
        if (this.currentStage === 'rocket') {
          // Rocket stage - transition to alien stage
          setTimeout(() => {
            this.handleStageTransition(isLeftChoice, trialType, isTraining, displayElement);

            // Reset animation state and add new keyboard listener
            isAnimating = false;
            response = null;
            document.addEventListener('keydown', keyboardListener);

            // Set up timeout for alien stage
            if (trialType === 'full' || trialType === 'training-full') {
              setupTimeout();
            }
          }, config.timing.transition);
        } else {
          // Alien stage - show reward
          setTimeout(() => {
            this.calculateAndShowReward(isLeftChoice, rewardSymbolElement);
            setTimeout(() => finishTrial(), config.timing.reward);
          }, config.timing.reward);
        }
      }
    };

    // Keyboard event handler
    const keyboardListener = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (key === trial.leftKey || key === trial.rightKey) {
        // Calculate RT based on current stage
        const currentStartTime = this.currentStage === 'rocket' ? this.levelOneStartTime : this.levelTwoStartTime;
        const calculatedRT = Date.now() - currentStartTime;

        // Check if response is within the response window (for full and training-full trials)
        const isWithinResponseWindow = (trialType === 'full' || trialType === 'training-full') ? calculatedRT <= this.data.responseWindow : true;

        if (isWithinResponseWindow) {
          response = {
            key: key,
            rt: calculatedRT,
          };

          // For full trials, store level one RT immediately when rocket key is pressed
          if ((trialType === 'training-full' || trialType === 'full') && this.currentStage === 'rocket') {
            this.data.levelOneChoice = this.convertKeyToChoice(key);
            this.data.levelOneRT = calculatedRT;
          }

          // Clear timeout only if response is valid
          this.jsPsych.pluginAPI.clearAllTimeouts();

          // Trigger animation
          animateSelection(key === trial.leftKey);
        }
        // If response is after timeout window, ignore it (timeout will handle it)
      }
    };

    // Timeout handler function
    const setupTimeout = () => {
      if (trialType === 'full' || trialType === 'training-full') {
        this.jsPsych.pluginAPI.setTimeout(() => {
          if (!isAnimating) {
            document.removeEventListener('keydown', keyboardListener);

            const leftStimulusElement = displayElement.querySelector('#left-stimulus') as HTMLElement;
            const rightStimulusElement = displayElement.querySelector('#right-stimulus') as HTMLElement;

            if (leftStimulusElement) this.createTimeoutOverlay(leftStimulusElement);
            if (rightStimulusElement) this.createTimeoutOverlay(rightStimulusElement);

            this.data.timeout = true;
            this.data.trialEndTime = Date.now();
            this.resetCurrentLevelData();
            setTimeout(() => finishTrial(), config.timing.reward);
          }
        }, this.data.responseWindow);
      }
    };

    // Set up initial timeout (for full and training-full trials)
    if (trialType === 'full' || trialType === 'training-full') {
      setupTimeout();
    }

    // Add keyboard listener
    document.addEventListener('keydown', keyboardListener);

    const finishTrial = () => {
      this.finalizeTrialData(response, trialType);
      if (trial.onFinish) trial.onFinish(this.data);
      displayElement.innerHTML = '';
      this.jsPsych.finishTrial(this.data);
    };
  }
}

export default ChoicePlugin;

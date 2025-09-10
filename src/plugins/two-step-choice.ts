/**
 * Two-step choice plugin for the Two-Step Task
 * Handles both rocket selection (stage 1) and alien selection (stage 2)
 */

// Custom types
import { ChoiceTrialData } from '../types';

// Configuration
import { config } from '../config';

// jsPsych
import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from 'jspsych';

class ChoicePlugin implements JsPsychPlugin<typeof ChoicePlugin.info> {
  static info = {
    name: 'two-step-choice' as const,
    parameters: {
      trialType: {
        type: ParameterType.COMPLEX,
        default: 'full',
      },
      trialNumber: {
        type: ParameterType.INT,
        default: undefined,
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

  private createDefaultData(): ChoiceTrialData {
    return {
      trialNumber: 0,
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

  private convertKeyToChoice(key: string): 0 | 1 | 2 {
    if (key === this.data.leftKey) return 1;
    if (key === this.data.rightKey) return 2;
    return 0; // timeout or invalid key
  }

  private resetAllLevelData(): void {
    this.data.levelOneChoice = 0;
    this.data.levelOneRT = 0;
    this.data.levelTwoChoice = 0;
    this.data.levelTwoRT = 0;
  }

  private resetCurrentLevelData(): void {
    if (this.currentStage === 'rocket') {
      this.data.levelOneChoice = 0;
      this.data.levelOneRT = 0;
    } else {
      this.data.levelTwoChoice = 0;
      this.data.levelTwoRT = 0;
    }
  }

  private getStimulusPath(filename: string): string {
    return this.jsPsych.extensions.Neurocog.getStimulus(filename);
  }

  private getRocketStimuli(isPractice: boolean): { leftStimulus: string; rightStimulus: string; planetStimulus: string } {
    return {
      leftStimulus: isPractice ? 'tutrocket1_norm.png' : 'rocket1_norm.png',
      rightStimulus: isPractice ? 'tutrocket2_norm.png' : 'rocket2_norm.png',
      planetStimulus: 'earth.png'
    };
  }

  private getAlienStimuli(isPractice: boolean, rocketChoice: boolean): { leftStimulus: string; rightStimulus: string; planetStimulus: string } {
    if (isPractice) {
      const planet = rocketChoice ? 'tutgreenplanet.png' : 'tutyellowplanet.png';
      return {
        leftStimulus: planet.includes('green') ? 'tutalien1_norm.png' : 'tutalien3_norm.png',
        rightStimulus: planet.includes('green') ? 'tutalien2_norm.png' : 'tutalien4_norm.png',
        planetStimulus: planet
      };
    } else {
      const isCommonTransition = this.jsPsych.extensions.Neurocog.random() < this.data.transitionLikelihood;
      let planet: string;
      if (isCommonTransition) {
        planet = rocketChoice ? 'purpleplanet.png' : 'redplanet1.png';
      } else {
        planet = rocketChoice ? 'redplanet1.png' : 'purpleplanet.png';
      }

      // Set transition type for data logging
      this.data.transitionType = isCommonTransition ? 'common' : 'rare';

      return {
        leftStimulus: planet.includes('red') ? 'alien1_norm.png' : 'alien3_norm.png',
        rightStimulus: planet.includes('red') ? 'alien2_norm.png' : 'alien4_norm.png',
        planetStimulus: planet
      };
    }
  }

  private generateStimuli(trialType: string, isPractice: boolean): { leftStimulus: string; rightStimulus: string; planetStimulus: string } {
    if (trialType === 'training-rocket') {
      return this.getRocketStimuli(isPractice);
    } else if (trialType === 'training-alien') {
      return {
        leftStimulus: isPractice ? 'tutalien1_norm.png' : 'alien1_norm.png',
        rightStimulus: isPractice ? 'tutalien2_norm.png' : 'alien2_norm.png',
        planetStimulus: isPractice ? 'tutgreenplanet.png' : 'redplanet1.png'
      };
    } else if (trialType === 'training-full' || trialType === 'full') {
      if (this.currentStage === 'rocket') {
        return this.getRocketStimuli(isPractice);
      } else {
        return this.getAlienStimuli(isPractice, this.data.levelOneChoice === 1);
      }
    }
    return this.getRocketStimuli(false);
  }

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
      </style>
      <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: #000; color: #fff;">
        <img src="${planetStimulus}" style="width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0;" />
        <div id="left-stimulus" class="stimulus-container" style="position: absolute; left: 25%; top: 60%; transform: translate(-50%, -50%);">
          <img src="${leftStimulus}" style="width: 173px; height: 173px; object-fit: contain;" />
        </div>
        <div id="right-stimulus" class="stimulus-container" style="position: absolute; right: 25%; top: 60%; transform: translate(50%, -50%);">
          <img src="${rightStimulus}" style="width: 173px; height: 173px; object-fit: contain;" />
        </div>
        ${showRewardSymbol ? `
          <div id="reward-symbol" style="position: absolute; opacity: 0; transition: opacity 0.2s ease-in-out;">
            <img src="${rewardStimulus}" style="width: 72px; height: 72px; object-fit: contain;" />
          </div>
        ` : ''}
      </div>
    `;
  }

  private calculateAndShowReward(isLeftChoice: boolean, rewardSymbolElement: HTMLElement | null): void {
    if (!rewardSymbolElement) return;

    const probability = isLeftChoice ? (this.data.rewardLikelihoods[0] || 0.5) : (this.data.rewardLikelihoods[1] || 0.5);
    const wasRewarded = this.jsPsych.extensions.Neurocog.random() < probability;
    const rewardStimulus = this.getStimulusPath(wasRewarded ? 't.png' : 'nothing.png');

    rewardSymbolElement.querySelector('img')!.src = rewardStimulus;
    rewardSymbolElement.style.left = '50%';
    rewardSymbolElement.style.top = '20%';
    rewardSymbolElement.style.transform = 'translate(-50%, -50%)';
    rewardSymbolElement.style.opacity = '1';
    this.data.wasRewarded = wasRewarded;
  }

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

  private updateTrialData(trial: TrialType<typeof ChoicePlugin.info>): void {
    this.data.trialStartTime = Date.now();
    this.data.trialType = trial.trialType;
    this.data.leftKey = trial.leftKey || 'f';
    this.data.rightKey = trial.rightKey || 'j';
    this.data.rewardLikelihoods = trial.rewardLikelihoods;
    this.data.transitionLikelihood = trial.transitionLikelihood || 1.0;
    this.data.responseWindow = trial.responseWindow || 3000;
  }

  private handleStageTransition(isLeftChoice: boolean, trialType: string, isPractice: boolean, displayElement: HTMLElement): void {
    this.currentStage = 'alien';
    // Note: levelOneChoice and levelOneRT are now set immediately when key is pressed

    const alienStimuli = this.generateStimuli(trialType, isPractice);
    const leftStimulus = this.getStimulusPath(alienStimuli.leftStimulus);
    const rightStimulus = this.getStimulusPath(alienStimuli.rightStimulus);
    const planetStimulus = this.getStimulusPath(alienStimuli.planetStimulus);

    displayElement.innerHTML = this.createDisplayHTML(leftStimulus, rightStimulus, planetStimulus, this.getStimulusPath('nothing.png'), trialType);

    // Set start time for level two (alien choice)
    this.levelTwoStartTime = Date.now();
  }

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

  trial(displayElement: HTMLElement, trial: TrialType<typeof ChoicePlugin.info>) {
    if (trial.onStart) trial.onStart();
    this.updateTrialData(trial);

    let response: { key: string; rt: number } | null = null;
    let isAnimating = false;
    const trialType = trial.trialType || 'full';
    const isPractice = trialType.startsWith('training-');
    this.currentStage = trialType === 'training-alien' ? 'alien' : 'rocket';

    // Generate initial stimuli
    let { leftStimulus, rightStimulus, planetStimulus } = this.generateStimuli(trialType, isPractice);
    let rewardStimulus: string = this.getStimulusPath('nothing.png');

    // Update to use the actual stimuli paths
    leftStimulus = this.getStimulusPath(leftStimulus);
    rightStimulus = this.getStimulusPath(rightStimulus);
    planetStimulus = this.getStimulusPath(planetStimulus);

    displayElement.innerHTML = this.createDisplayHTML(leftStimulus, rightStimulus, planetStimulus, rewardStimulus, trialType);

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
            const planet = rocketChoice === 1 ? 'tutgreenplanet.png' : 'tutyellowplanet.png';
            const leftAlien = planet.includes('green') ? 'tutalien1_norm.png' : 'tutalien3_norm.png';
            const rightAlien = planet.includes('green') ? 'tutalien2_norm.png' : 'tutalien4_norm.png';

            // Update display to show planet with aliens
            const planetStimulus = this.getStimulusPath(planet);
            const leftStimulus = this.getStimulusPath(leftAlien);
            const rightStimulus = this.getStimulusPath(rightAlien);

            displayElement.innerHTML = this.createDisplayHTML(leftStimulus, rightStimulus, planetStimulus, this.getStimulusPath('nothing.png'), trialType);

            // Wait for preview duration (same as reward display), then finish
            setTimeout(() => finishTrial(), config.timing.reward);
          }, config.timing.reward); // Brief pause before planet appears
        }, config.timing.reward);
      } else if (trialType === 'training-alien') {
        // Single stage with reward
        setTimeout(() => {
          this.calculateAndShowReward(isLeftChoice, rewardSymbolElement);
          setTimeout(() => finishTrial(), config.timing.reward);
        }, config.timing.reward);
      } else if (trialType === 'training-full' || trialType === 'full') {
        // Two-stage trials
        if (this.currentStage === 'rocket') {
          // Rocket stage - transition to alien stage
          setTimeout(() => {
            this.handleStageTransition(isLeftChoice, trialType, isPractice, displayElement);

            // Reset animation state and add new keyboard listener
            isAnimating = false;
            response = null;
            document.addEventListener('keydown', keyboardListener);

            // Set up timeout for alien stage
            if (trialType === 'full') {
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

        // Check if response is within the response window (only for full trials)
        const isWithinResponseWindow = trialType === 'full' ? calculatedRT <= this.data.responseWindow : true;

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

    // Timeout handler function - only for full trials, works for both stages
    const setupTimeout = () => {
      if (trialType === 'full') {
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

    // Set up initial timeout (only for full trials, not training trials)
    if (trialType === 'full') {
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

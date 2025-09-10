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
      keyPress: '',
      choice: 0,
      rt: 0,
      timeout: false,
      wasRewarded: false,
      transitionType: 'none',
    };
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
      const planet = (rocketChoice === isCommonTransition) ? 'redplanet1.png' : 'purpleplanet.png';
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
        return this.getAlienStimuli(isPractice, this.data.choice === 1);
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
          <img src="${leftStimulus}" style="width: 144px; height: 144px; object-fit: contain;" />
        </div>
        <div id="right-stimulus" class="stimulus-container" style="position: absolute; right: 25%; top: 60%; transform: translate(50%, -50%);">
          <img src="${rightStimulus}" style="width: 144px; height: 144px; object-fit: contain;" />
        </div>
        ${showRewardSymbol ? `
          <div id="reward-symbol" style="position: absolute; opacity: 0; transition: opacity 0.2s ease-in-out;">
            <img src="${rewardStimulus}" style="width: 60px; height: 60px; object-fit: contain;" />
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
    rewardSymbolElement.style.top = '25%';
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
    this.data.choice = isLeftChoice ? 1 : 2;
    this.data.keyPress = isLeftChoice ? this.data.leftKey : this.data.rightKey;
    this.data.rt = Date.now() - this.data.trialStartTime;

    const alienStimuli = this.generateStimuli(trialType, isPractice);
    const leftStimulus = this.getStimulusPath(alienStimuli.leftStimulus);
    const rightStimulus = this.getStimulusPath(alienStimuli.rightStimulus);
    const planetStimulus = this.getStimulusPath(alienStimuli.planetStimulus);

    displayElement.innerHTML = this.createDisplayHTML(leftStimulus, rightStimulus, planetStimulus, this.getStimulusPath('nothing.png'), trialType);
  }

  private finalizeTrialData(response: { key: string; rt: number } | null, trialType: string): void {
    this.data.trialEndTime = Date.now();

    if ((trialType === 'training-full' || trialType === 'full') && this.currentStage === 'alien') {
      if (response) {
        this.data.keyPress = response.key;
        this.data.rt = response.rt;
        this.data.timeout = false;
        this.data.choice = response.key === this.data.leftKey ? 1 : 2;
      } else {
        this.data.keyPress = '';
        this.data.choice = 0;
        this.data.rt = 0;
        this.data.timeout = true;
      }
    } else if (response) {
      this.data.keyPress = response.key;
      this.data.rt = response.rt;
      this.data.timeout = false;
      this.data.choice = response.key === this.data.leftKey ? 1 : 2;
    } else {
      this.data.keyPress = '';
      this.data.choice = 0;
      this.data.rt = 0;
      this.data.timeout = true;
    }
  }

  trial(displayElement: HTMLElement, trial: TrialType<typeof ChoicePlugin.info>) {
    if (trial.onStart) trial.onStart();
    this.updateTrialData(trial);

    let response: { key: string; rt: number } | null = null;
    let isAnimating = false;
    const trialType = trial.trialType || 'full';
    const isPractice = trialType.startsWith('training-');
    this.currentStage = 'rocket';

    // Generate initial stimuli
    let { leftStimulus, rightStimulus, planetStimulus } = this.generateStimuli(trialType, isPractice);
    let rewardStimulus: string = this.getStimulusPath('nothing.png');

    // Update to use the actual stimuli paths
    leftStimulus = this.getStimulusPath(leftStimulus);
    rightStimulus = this.getStimulusPath(rightStimulus);
    planetStimulus = this.getStimulusPath(planetStimulus);

    displayElement.innerHTML = this.createDisplayHTML(leftStimulus, rightStimulus, planetStimulus, rewardStimulus, trialType);

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
        response = {
          key: key,
          rt: Date.now() - this.data.trialStartTime,
        };

        // Trigger animation
        animateSelection(key === trial.leftKey);
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
            setTimeout(() => finishTrial(), config.timing.reward);
          }
        }, this.data.responseWindow);
      }
    };

    // Set up initial timeout
    setupTimeout();

    // Add keyboard listener
    document.addEventListener('keydown', keyboardListener);

    const finishTrial = () => {
      this.finalizeTrialData(response, trialType);
      if (trial.onFinish) trial.onFinish(this.data);
      displayElement.innerHTML = '';
      console.log(this.data);
      this.jsPsych.finishTrial(this.data);
    };
  }
}

export default ChoicePlugin;

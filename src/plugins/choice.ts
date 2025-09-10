/**
 * Two-step choice plugin for the Two-Step Task
 * Handles both rocket selection (stage 1) and alien selection (stage 2)
 */

import { ChoiceTrialData } from '../types';
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

  constructor(jsPsych: JsPsych) {
    this.jsPsych = jsPsych;

    // Initialize data structure with default values
    this.data = {
      // Core data
      trialNumber: 0,
      trialStartTime: 0,
      trialEndTime: 0,
      // Parameters
      trialType: 'full',
      leftKey: 'f',
      rightKey: 'j',
      rewardLikelihoods: [0.5, 0.5, 0.5, 0.5],
      transitionLikelihood: 1.0,
      responseWindow: 3000,
      // Response data
      keyPress: '',
      choice: 0,
      rt: 0,
      timeout: false,
      // Computed data
      wasRewarded: false,
      transitionType: 'none',
    };
  }

  trial(displayElement: HTMLElement, trial: TrialType<typeof ChoicePlugin.info>) {
    // Call onStart callback if provided
    if (trial.onStart) {
      trial.onStart();
    }
    this.data.trialStartTime = Date.now();
    this.data.trialType = trial.trialType;
    this.data.leftKey = trial.leftKey || 'f';
    this.data.rightKey = trial.rightKey || 'j';
    this.data.rewardLikelihoods = trial.rewardLikelihoods || [0.5, 0.5, 0.5, 0.5];
    this.data.transitionLikelihood = trial.transitionLikelihood || 1.0;
    this.data.responseWindow = trial.responseWindow || 3000;

    // Initialize response data
    let response: { key: string; rt: number } | null = null;
    let isAnimating = false;

    // Determine stimuli based on trial type
    const trialType = trial.trialType || 'full';
    const isPractice = trialType.startsWith('training-');

    // Generate the stimuli
    let leftStimulus: string;
    let rightStimulus: string;
    let planetStimulus: string;
    let rewardStimulus: string = 'nothing.png';

    // Centralized logic based on trial type
    if (trialType === 'training-rocket') {
      // Rocket training: left rocket goes to green planet 100%, right rocket goes to yellow planet 100%
      leftStimulus = isPractice ? 'tutrocket1_norm.png' : 'rocket1_norm.png';
      rightStimulus = isPractice ? 'tutrocket2_norm.png' : 'rocket2_norm.png';
      planetStimulus = 'earth.png';
    } else if (trialType === 'training-alien') {
      // Alien training: use rewardLikelihoods for first two aliens
      const alien1 = isPractice ? 'tutalien1_norm.png' : 'alien1_norm.png';
      const alien2 = isPractice ? 'tutalien2_norm.png' : 'alien2_norm.png';
      const planet = isPractice ? 'tutgreenplanet.png' : 'redplanet1.png';

      leftStimulus = alien1;
      rightStimulus = alien2;
      planetStimulus = planet;
    } else if (trialType === 'training-full') {
      // Full training: combine rocket and alien logic
      leftStimulus = isPractice ? 'tutrocket1_norm.png' : 'rocket1_norm.png';
      rightStimulus = isPractice ? 'tutrocket2_norm.png' : 'rocket2_norm.png';
      planetStimulus = 'earth.png';
    } else if (trialType === 'full') {
      // Full trial: use transitionLikelihood for rocket transitions
      leftStimulus = 'rocket1_norm.png';
      rightStimulus = 'rocket2_norm.png';
      planetStimulus = 'earth.png';
    } else {
      // Default fallback
      leftStimulus = 'rocket1_norm.png';
      rightStimulus = 'rocket2_norm.png';
      planetStimulus = 'earth.png';
    }

    // Update to use the actual stimuli paths
    leftStimulus = this.jsPsych.extensions.Neurocog.getStimulus(leftStimulus);
    rightStimulus = this.jsPsych.extensions.Neurocog.getStimulus(rightStimulus);
    planetStimulus = this.jsPsych.extensions.Neurocog.getStimulus(planetStimulus);

    // Create the display HTML based on trial type
    const html = `
      <style>
        @keyframes glideToCenter {
          0% {
            transform: translate(-50%, -50%);
          }
          100% {
            transform: translate(-50%, -50%);
          }
        }

        .stimulus-container {
          transition: all 0.5s ease-in-out;
        }

        .stimulus-container.glide-left {
          left: 50% !important;
          top: 40% !important;
          transform: translate(-50%, -50%) !important;
        }

        .stimulus-container.glide-right {
          right: 50% !important;
          top: 40% !important;
          transform: translate(50%, -50%) !important;
        }

        .fade-out {
          opacity: 0.3;
        }
      </style>
      <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: #000; color: #fff;">
        <!-- Background planet -->
        <img src="${planetStimulus}" style="width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0;" />

        <!-- Left stimulus -->
        <div id="left-stimulus" class="stimulus-container" style="position: absolute; left: 25%; top: 50%; transform: translate(-50%, -50%);">
          <img src="${leftStimulus}" style="width: 120px; height: 120px; object-fit: contain;" />
        </div>

        <!-- Right stimulus -->
        <div id="right-stimulus" class="stimulus-container" style="position: absolute; right: 25%; top: 50%; transform: translate(50%, -50%);">
          <img src="${rightStimulus}" style="width: 120px; height: 120px; object-fit: contain;" />
        </div>

        <!-- Reward symbol (positioned dynamically above selected alien) -->
        ${(trialType === 'training-alien' || trialType === 'training-full' || trialType === 'full') ? `
          <div id="reward-symbol" style="position: absolute; opacity: 0; transition: opacity 0.2s ease-in-out;">
            <img src="${rewardStimulus}" style="width: 60px; height: 60px; object-fit: contain;" />
          </div>
        ` : ''}

        <!-- Instructions -->
        <div id="instructions" style="position: absolute; bottom: 20%; left: 50%; transform: translateX(-50%); color: white; font-size: 24px; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); text-align: center;">
          Press <strong>F</strong> for left, <strong>J</strong> for right
        </div>
      </div>
    `;

    displayElement.innerHTML = html;

    // Animation handler
    const animateSelection = (isLeftChoice: boolean) => {
      if (isAnimating) return;
      isAnimating = true;

      // Remove keyboard listener
      document.removeEventListener('keydown', keyboardListener);

      // Clear timeout
      this.jsPsych.pluginAPI.clearAllTimeouts();

      // Hide instructions
      const instructionsElement = displayElement.querySelector('#instructions') as HTMLElement;
      if (instructionsElement) {
        instructionsElement.style.opacity = '0';
      }

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

      // Position reward symbol above the selected alien after glide completes
      setTimeout(() => {
        if (rewardSymbolElement && (trialType === 'training-alien' || trialType === 'training-full' || trialType === 'full')) {
          // Determine reward based on trial type and choice
          let wasRewarded = false;

          if (trialType === 'training-alien') {
            // Use rewardLikelihoods for first two aliens
            const probability = isLeftChoice ? trial.rewardLikelihoods[0] : trial.rewardLikelihoods[1];
            wasRewarded = Math.random() < probability;
          } else if (trialType === 'training-full' || trialType === 'full') {
            // For full trials, determine reward based on alien choice
            // This would need to be implemented based on the transition logic
            // For now, use a simple probability
            const probability = isLeftChoice ? trial.rewardLikelihoods[0] : trial.rewardLikelihoods[1];
            wasRewarded = Math.random() < probability;
          }

          // Update reward stimulus
          rewardStimulus = wasRewarded ? 't.png' : 'nothing.png';
          rewardSymbolElement.querySelector('img')!.src = rewardStimulus;

          // Position reward symbol above the selected alien (at 40% top position)
          rewardSymbolElement.style.left = '50%';
          rewardSymbolElement.style.top = '25%'; // Above the alien at 40%
          rewardSymbolElement.style.transform = 'translate(-50%, -50%)';
          rewardSymbolElement.style.opacity = '1';

          // Update computed data
          this.data.wasRewarded = wasRewarded;
        }
      }, 500); // After glide animation completes

      // Calculate total wait time based on trial type
      const totalWaitTime = (trialType === 'training-alien' || trialType === 'training-full' || trialType === 'full')
        ? 1700 // 500ms animation + 200ms delay + 1000ms reward display
        : 1500; // 500ms animation + 1000ms hold (no reward)

      // Wait for animation + reward display, then finish trial
      setTimeout(() => {
        finishTrial();
      }, totalWaitTime);
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

    // Timeout handler - only for full trials
    if (trialType === 'full') {
      this.jsPsych.pluginAPI.setTimeout(() => {
        if (!isAnimating) {
          document.removeEventListener('keydown', keyboardListener);

          // Show red X for timeout - overlay on both stimuli
          const leftStimulusElement = displayElement.querySelector('#left-stimulus') as HTMLElement;
          const rightStimulusElement = displayElement.querySelector('#right-stimulus') as HTMLElement;

          // Create red X overlay for left stimulus
          if (leftStimulusElement) {
            const leftTimeoutOverlay = document.createElement('div');
            leftTimeoutOverlay.style.position = 'absolute';
            leftTimeoutOverlay.style.top = '50%';
            leftTimeoutOverlay.style.left = '50%';
            leftTimeoutOverlay.style.transform = 'translate(-50%, -50%)';
            leftTimeoutOverlay.style.fontSize = '80px';
            leftTimeoutOverlay.style.color = 'red';
            leftTimeoutOverlay.style.fontWeight = 'bold';
            leftTimeoutOverlay.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
            leftTimeoutOverlay.style.zIndex = '1000';
            leftTimeoutOverlay.innerHTML = '✕';
            leftStimulusElement.appendChild(leftTimeoutOverlay);
          }

          // Create red X overlay for right stimulus
          if (rightStimulusElement) {
            const rightTimeoutOverlay = document.createElement('div');
            rightTimeoutOverlay.style.position = 'absolute';
            rightTimeoutOverlay.style.top = '50%';
            rightTimeoutOverlay.style.left = '50%';
            rightTimeoutOverlay.style.transform = 'translate(-50%, -50%)';
            rightTimeoutOverlay.style.fontSize = '80px';
            rightTimeoutOverlay.style.color = 'red';
            rightTimeoutOverlay.style.fontWeight = 'bold';
            rightTimeoutOverlay.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
            rightTimeoutOverlay.style.zIndex = '1000';
            rightTimeoutOverlay.innerHTML = '✕';
            rightStimulusElement.appendChild(rightTimeoutOverlay);
          }

          // Set timeout data
          this.data.timeout = true;
          this.data.trialEndTime = Date.now();

          // Wait a moment to show the X, then finish
          setTimeout(() => {
            finishTrial();
          }, 1000);
        }
      }, trial.responseWindow);
    }

    // Add keyboard listener
    document.addEventListener('keydown', keyboardListener);

    const finishTrial = () => {
      if (response) {
        this.data.trialEndTime = Date.now();
        this.data.keyPress = response.key;
        this.data.rt = response.rt;
        this.data.timeout = false;

        // Determine choice (1 = left, 2 = right)
        if (response.key === trial.leftKey) {
          this.data.choice = 1;
        } else if (response.key === trial.rightKey) {
          this.data.choice = 2;
        }
      } else {
        // No response - this is a timeout (only possible in full trials)
        this.data.trialEndTime = Date.now();
        this.data.keyPress = '';
        this.data.choice = 0;
        this.data.rt = 0;
        this.data.timeout = true;
      }

      // Call onFinish callback if provided
      if (trial.onFinish) {
        trial.onFinish(this.data);
      }

      // Clear display
      displayElement.innerHTML = '';

      console.log(this.data);

      // End trial
      this.jsPsych.finishTrial(this.data);
    };
  }
}

export default ChoicePlugin;

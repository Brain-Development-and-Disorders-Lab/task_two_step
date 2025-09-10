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
      trialStage: {
        type: ParameterType.COMPLEX,
        default: undefined,
      },
      trialType: {
        type: ParameterType.STRING,
        default: 'complete',
      },
      trialNumber: {
        type: ParameterType.INT,
        default: undefined,
      },
      isPractice: {
        type: ParameterType.BOOL,
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
      leftStimulus: {
        type: ParameterType.STRING,
        default: undefined,
      },
      rightStimulus: {
        type: ParameterType.STRING,
        default: undefined,
      },
      planetStimulus: {
        type: ParameterType.STRING,
        default: undefined,
      },
      rewardStimulus: {
        type: ParameterType.STRING,
        default: undefined,
      },
      probabilityData: {
        type: ParameterType.OBJECT,
        default: undefined,
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

  constructor(jsPsych: JsPsych) {
    this.jsPsych = jsPsych;
  }

  trial(displayElement: HTMLElement, trial: TrialType<typeof ChoicePlugin.info>) {
    // Call onStart callback if provided
    if (trial.onStart) {
      trial.onStart();
    }

    const startTime = Date.now();
    let response: { key: string; rt: number } | null = null;
    let isAnimating = false;

    // Resolve dynamic stimulus values
    const leftStimulus = trial.leftStimulus;
    const rightStimulus = trial.rightStimulus;
    const planetStimulus = trial.planetStimulus;
    const rewardStimulus = trial.rewardStimulus;

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
        ${(trial.trialType === 'alien-only' || trial.trialType === 'complete') ? `
          <div id="reward-symbol" style="position: absolute; opacity: 0; transition: opacity 0.2s ease-in-out;">
            <img src="${rewardStimulus || 'nothing.png'}" style="width: 60px; height: 60px; object-fit: contain;" />
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
        if (rewardSymbolElement && (trial.trialType === 'alien-only' || trial.trialType === 'complete')) {
          // Position reward symbol above the selected alien (at 40% top position)
          rewardSymbolElement.style.left = '50%';
          rewardSymbolElement.style.top = '25%'; // Above the alien at 40%
          rewardSymbolElement.style.transform = 'translate(-50%, -50%)';
          rewardSymbolElement.style.opacity = '1';
        }
      }, 500); // After glide animation completes

      // Calculate total wait time based on trial type
      const totalWaitTime = (trial.trialType === 'alien-only' || trial.trialType === 'complete')
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
          rt: Date.now() - startTime,
        };

        // Trigger animation
        animateSelection(key === trial.leftKey);
      }
    };

    // Timeout handler
    this.jsPsych.pluginAPI.setTimeout(() => {
      if (!isAnimating) {
        document.removeEventListener('keydown', keyboardListener);
        finishTrial();
      }
    }, trial.responseWindow);

    // Add keyboard listener
    document.addEventListener('keydown', keyboardListener);

    const finishTrial = () => {
      const trialData: ChoiceTrialData = {
        trialNumber: trial.trialNumber,
        trialStage: trial.trialStage,
        trialType: trial.trialType as 'rocket-only' | 'alien-only' | 'complete',
        isPractice: trial.isPractice,
        leftStimulus: leftStimulus,
        rightStimulus: rightStimulus,
        planetStimulus: planetStimulus,
        trialStartTime: startTime,
        trialEndTime: Date.now(),
        // Default values for response fields
        keyPress: '',
        choice: 0,
        rt: 0,
        transitionType: 'none',
        wasRewarded: false,
        timeout: !response, // true if no response
      };

      if (rewardStimulus) {
        trialData.rewardStimulus = rewardStimulus;
      }

      if (response) {
        trialData.keyPress = response.key;
        trialData.rt = response.rt;
        trialData.timeout = false;

        // Determine choice (1 = left, 2 = right)
        if (response.key === trial.leftKey) {
          trialData.choice = 1;
        } else if (response.key === trial.rightKey) {
          trialData.choice = 2;
        }
      }

      // Call onFinish callback if provided
      if (trial.onFinish) {
        trial.onFinish(trialData);
      }

      // Clear display
      displayElement.innerHTML = '';

      // End trial
      this.jsPsych.finishTrial(trialData);
    };
  }
}

export default ChoicePlugin;

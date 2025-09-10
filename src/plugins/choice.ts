/**
 * Two-step choice plugin for the Two-Step Task
 * Handles both rocket selection (stage 1) and alien selection (stage 2)
 */

import { ChoiceTrialData } from '../types';
import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from 'jspsych';

const info = {
  name: 'two-step-choice' as const,
  parameters: {
    trialStage: {
      type: ParameterType.COMPLEX,
      default: undefined,
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
type Info = typeof info;

class ChoicePlugin implements JsPsychPlugin<Info> {
  private jsPsych: JsPsych;

  constructor(jsPsych: JsPsych) {
    this.jsPsych = jsPsych;
  }

  trial(displayElement: HTMLElement, trial: TrialType<Info>) {
    // Call onStart callback if provided
    if (trial.onStart) {
      trial.onStart();
    }

    const startTime = Date.now();
    let response: { key: string; rt: number } | null = null;

    // Resolve dynamic stimulus values
    const leftStimulus = trial.leftStimulus;
    const rightStimulus = trial.rightStimulus;
    const planetStimulus = trial.planetStimulus;
    const rewardStimulus = trial.rewardStimulus;

    // Create the display HTML
    const html = `
      <div style="position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
        <!-- Background planet -->
        <img src="${planetStimulus}" style="width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0;" />

        <!-- Left stimulus -->
        <div style="position: absolute; left: 25%; top: 50%; transform: translate(-50%, -50%);">
          <img src="${leftStimulus}" style="width: 120px; height: 120px; object-fit: contain;" />
        </div>

        <!-- Right stimulus -->
        <div style="position: absolute; right: 25%; top: 50%; transform: translate(50%, -50%);">
          <img src="${rightStimulus}" style="width: 120px; height: 120px; object-fit: contain;" />
        </div>

        <!-- Reward stimulus (if stage 2 and reward exists) -->
        ${rewardStimulus ? `
          <div style="position: absolute; top: 30%; left: 50%; transform: translate(-50%, -50%);">
            <img src="${rewardStimulus}" style="width: 60px; height: 60px; object-fit: contain;" />
          </div>
        ` : ''}

        <!-- Instructions -->
        <div style="position: absolute; bottom: 20%; left: 50%; transform: translateX(-50%); color: white; font-size: 24px; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); text-align: center;">
          Press <strong>F</strong> for left, <strong>J</strong> for right
        </div>
      </div>
    `;

    displayElement.innerHTML = html;

    // Keyboard event handler
    const keyboardListener = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (key === trial.leftKey || key === trial.rightKey) {
        response = {
          key: key,
          rt: Date.now() - startTime,
        };

        // Remove listener
        document.removeEventListener('keydown', keyboardListener);

        // Clear timeout
        this.jsPsych.pluginAPI.clearAllTimeouts();

        // Finish trial
        finishTrial();
      }
    };

    // Timeout handler
    this.jsPsych.pluginAPI.setTimeout(() => {
      document.removeEventListener('keydown', keyboardListener);
      finishTrial();
    }, trial.responseWindow);

    // Add keyboard listener
    document.addEventListener('keydown', keyboardListener);

    const finishTrial = () => {
      const trialData: ChoiceTrialData = {
        trialNumber: trial.trialNumber,
        trialStage: trial.trialStage,
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

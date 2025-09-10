/**
 * Fixation plugin for the Two-Step Task
 * Displays a fixation cross for a specified duration
 */

import { FixationTrialData } from '../types';
import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from 'jspsych';

class FixationPlugin implements JsPsychPlugin<typeof FixationPlugin.info> {
  static info = {
    name: 'fixation' as const,
    parameters: {
      stimulus: {
        type: ParameterType.STRING,
        default: undefined,
      },
      duration: {
        type: ParameterType.INT,
        default: undefined,
      },
      trialNumber: {
        type: ParameterType.INT,
        default: undefined,
      },
    },
  } as const;

  private jsPsych: JsPsych;

  constructor(jsPsych: JsPsych) {
    this.jsPsych = jsPsych;
  }

  trial(displayElement: HTMLElement, trial: TrialType<typeof FixationPlugin.info>) {
    // Create the display
    const html = `
      <div style="position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
        <img src="${trial.stimulus}" style="width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0;" />
        <div style="position: relative; z-index: 10; font-size: 48px; color: white; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">
          +
        </div>
      </div>
    `;

    displayElement.innerHTML = html;

    // Store trial data
    const trialData: FixationTrialData = {
      trialNumber: trial.trialNumber,
      trialStage: 'fixation',
      isPractice: false,
      stimulus: trial.stimulus,
      duration: trial.duration,
      trialStartTime: Date.now(),
      trialEndTime: Date.now(),
    };

    // End trial after duration
    this.jsPsych.pluginAPI.setTimeout(() => {
      trialData.trialEndTime = Date.now();
      this.jsPsych.finishTrial(trialData);
    }, trial.duration);
  }
}

export default FixationPlugin;

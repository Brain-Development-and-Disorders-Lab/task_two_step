/**
 * @fileoverview Test application entry point
 *
 * Trial results are written to `window.__LAST_TRIAL_DATA__` and accumulated in
 * `window.__ALL_TRIAL_DATA__` so that Playwright tests can read them with
 * `page.evaluate()`
 */

import { initJsPsych } from 'jspsych';
import ChoicePlugin from '../../src/plugins/two-step-choice';
import Neurocog from './setup/mocks';
import { ChoiceTrialData } from '../../src/types';

// Setup interface for the test configuration
export interface TestConfig {
  trialType: 'full' | 'training-full' | 'training-rocket' | 'training-alien';
  transitionLikelihood: number;
  rewardLikelihoods: [number, number, number, number];
  numTrials: number;
}

// Specify variables attached to the window for trial data storage and jsPsych
declare global {
  interface Window {
    __TEST_CONFIG__?: TestConfig;
    __LAST_TRIAL_DATA__?: ChoiceTrialData;
    __ALL_TRIAL_DATA__: ChoiceTrialData[];
    jsPsych?: ReturnType<typeof initJsPsych>;
  }
}
window.__ALL_TRIAL_DATA__ = [];

// Create a default test configuration
const testConfig: TestConfig = window.__TEST_CONFIG__ ?? {
  trialType: 'full',
  transitionLikelihood: 1.0,
  rewardLikelihoods: [0.5, 0.5, 0.5, 0.5],
  numTrials: 1,
};

// Create jsPsych instance and assign to window
const jsPsych = initJsPsych({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extensions: [{ type: Neurocog as any }],
  on_finish: () => {
    document.body.innerHTML = '<div id="experiment-complete">COMPLETE</div>';
  },
});
window.jsPsych = jsPsych;

// Construct the test timeline
const timeline: unknown[] = [];
for (let i = 0; i < testConfig.numTrials; i++) {
  timeline.push({
    type: ChoicePlugin,
    trialType: testConfig.trialType,
    leftKey: 'f',
    rightKey: 'j',
    rewardLikelihoods: testConfig.rewardLikelihoods,
    transitionLikelihood: testConfig.transitionLikelihood,
    responseWindow: 3000,
    onFinish: (data: ChoiceTrialData) => {
      window.__LAST_TRIAL_DATA__ = data;
      window.__ALL_TRIAL_DATA__.push(data);
    },
  });
}

jsPsych.run(timeline);

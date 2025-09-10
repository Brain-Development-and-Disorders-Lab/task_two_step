/**
 * Timeline implementation for the Two-Step Task
 * Creates the simplified timeline as specified
 */

import { initJsPsych } from 'jspsych';
import instructions from '@jspsych/plugin-instructions';
import NeurocogExtension from 'neurocog';
import { ChoiceTrialData } from './types';
import { ExperimentLogic } from './experiment';
import FixationPlugin from './plugins/fixation';
import ChoicePlugin from './plugins/choice';
import { config } from './config';
import { stimuli } from './stimuli';
import { mainTrialProbabilities, tutorialTrialProbabilities } from './data';

// Initialize experiment logic
const experimentLogic = new ExperimentLogic();

// Initialize jsPsych instance
const jsPsych = initJsPsych({
  plugins: [FixationPlugin, ChoicePlugin],
  extensions: [
    {
      type: NeurocogExtension,
      params: {
        name: config.name,
        studyName: config.studyName,
        contact: config.contact,
        allowParticipantContact: false,
        manipulations: {},
        resources: {},
        stimuli: stimuli,
        seed: 0.4735,
      }
    }
  ],
});

/**
 * Create a complete trial block (rocket choice + alien choice + fixation)
 */
function createTrialBlock(
  trialNumber: number,
  isPractice: boolean,
  probabilityData?: any
): any[] {
  const trials: any[] = [];

  // Stage 1: Rocket choice
  trials.push({
    type: ChoicePlugin,
    trialStage: '1',
    trialNumber: trialNumber,
    isPractice: isPractice,
    leftKey: config.controls.left,
    rightKey: config.controls.right,
    leftStimulus: jsPsych.extensions.Neurocog.getStimulus(isPractice ? 'tutrocket1_norm.png' : 'rocket1_norm.png'),
    rightStimulus: jsPsych.extensions.Neurocog.getStimulus(isPractice ? 'tutrocket2_norm.png' : 'rocket2_norm.png'),
    planetStimulus: jsPsych.extensions.Neurocog.getStimulus('earth.png'),
    responseWindow: config.timing.choice,
    onStart: () => {
      experimentLogic.resetStageState();
    },
    onFinish: (data: ChoiceTrialData) => {
      // Calculate transition and set stage state
      const chosenStimulus = data.choice === 1 ? data.leftStimulus : data.rightStimulus;
      const stageState = experimentLogic.calculateTransition(chosenStimulus, isPractice);
      experimentLogic.setStageState(stageState);
    },
    extensions: [{
      type: NeurocogExtension,
    }],
  });

  // Stage 2: Alien choice
  trials.push({
    type: ChoicePlugin,
    trialStage: '2',
    trialNumber: trialNumber,
    isPractice: isPractice,
    leftKey: config.controls.left,
    rightKey: config.controls.right,
    leftStimulus: () => {
      const state = experimentLogic.getStageState();
      return state[1] ? jsPsych.extensions.Neurocog.getStimulus(state[1] + '_norm.png') : '';
    },
    rightStimulus: () => {
      const state = experimentLogic.getStageState();
      return state[0] ? jsPsych.extensions.Neurocog.getStimulus(state[0] + '_norm.png') : '';
    },
    planetStimulus: () => {
      const state = experimentLogic.getStageState();
      return state[2] ? jsPsych.extensions.Neurocog.getStimulus(state[2]) : '';
    },
    rewardStimulus: () => {
      const state = experimentLogic.getStageState();
      if (state[3]) {
        // Determine if reward should be shown
        const alienChoice = state[3];
        const probData = probabilityData || tutorialTrialProbabilities[trialNumber % tutorialTrialProbabilities.length];
        const wasRewarded = experimentLogic.determineReward(alienChoice, probData);

        if (wasRewarded) {
          experimentLogic.updateReward(isPractice, true);
          return jsPsych.extensions.Neurocog.getStimulus('t.png');
        } else {
          return jsPsych.extensions.Neurocog.getStimulus('nothing.png');
        }
      }
      return '';
    },
    responseWindow: config.timing.choice,
    onFinish: (data: ChoiceTrialData) => {
      // Add transition and reward data
      const state = experimentLogic.getStageState();
      if (state[4] !== undefined) {
        data.transitionType = state[4] ? 'common' : 'rare';
      }

      // Determine if was rewarded (only if not a timeout)
      if (!data.timeout && data.rewardStimulus) {
        data.wasRewarded = data.rewardStimulus === jsPsych.extensions.Neurocog.getStimulus('t.png');
      }
    },
  });

  // Fixation
  trials.push({
    type: FixationPlugin,
    stimulus: jsPsych.extensions.Neurocog.getStimulus('earth.png'),
    text: '+',
    duration: config.timing.fixation,
    trialNumber: trialNumber,
  });

  return trials;
}

/**
 * Create the experiment timeline
 */
function createTimeline(): any[] {
  const timeline: any[] = [];
  let trialNumber = 0;

  // Initial instructions
  timeline.push({
    type: instructions,
    pages: [
      'Welcome to the Two-Step Task!<br><br>' +
      'This is a space exploration game where you will:<br>' +
      '1. Choose between two rockets on Earth<br>' +
      '2. Fly to a planet and choose between two aliens<br>' +
      '3. See if the alien shares space resources with you<br><br>' +
      'Use F for left choices and J for right choices.<br>' +
      'You have limited time to make each choice.<br><br>' +
      'Let\'s start with some practice trials!',
    ],
    show_clickable_nav: true,
    button_label_next: 'Continue',
  });

  // Training Phase 1: Rocket to Alien (4 trials)
  timeline.push({
    type: instructions,
    pages: [
      'Practice Phase 1: Rocket Selection<br><br>' +
      'Choose between two rockets on Earth.<br>' +
      'After your choice, you\'ll see which planet you fly to.<br>' +
      'This helps you learn which rocket goes where.<br><br>' +
      'Press F for left rocket, J for right rocket.',
    ],
    show_clickable_nav: true,
    button_label_next: 'Start Practice',
  });

  for (let i = 0; i < config.trainingTrials.rocketToAlien; i++) {
    timeline.push(...createTrialBlock(trialNumber++, true));
  }

  // Training Phase 2: Alien to Reward (4 trials)
  timeline.push({
    type: instructions,
    pages: [
      'Practice Phase 2: Alien Selection<br><br>' +
      'You\'ll land directly on a planet with two aliens.<br>' +
      'Choose one alien and see if they share resources.<br><br>' +
      'Some aliens share resources more often than others.<br>' +
      'Pay attention to which aliens are more generous!',
    ],
    show_clickable_nav: true,
    button_label_next: 'Start Practice',
  });

  for (let i = 0; i < config.trainingTrials.alienToReward; i++) {
    timeline.push(...createTrialBlock(trialNumber++, true));
  }

  // Training Phase 3: Complete trials (4 trials)
  timeline.push({
    type: instructions,
    pages: [
      'Practice Phase 3: Complete Missions<br><br>' +
      'Now you\'ll do the full sequence:<br>' +
      '1. Choose a rocket on Earth<br>' +
      '2. Fly to a planet<br>' +
      '3. Choose an alien<br>' +
      '4. See if you get resources<br><br>' +
      'Pay attention to which rockets take you to better planets!',
    ],
    show_clickable_nav: true,
    button_label_next: 'Start Practice',
  });

  for (let i = 0; i < config.trainingTrials.complete; i++) {
    timeline.push(...createTrialBlock(trialNumber++, true));
  }

  // Pre-main instructions
  timeline.push({
    type: instructions,
    pages: [
      'Great job with practice!<br><br>' +
      'Now for the real game:<br>' +
      '- New rocket and alien colors<br>' +
      '- Same rules as practice<br>' +
      '- We\'ll count your total resources<br><br>' +
      'Ready to begin the real missions?',
    ],
    show_clickable_nav: true,
    button_label_next: 'Start Real Game',
  });

  // Main trials (4 trials)
  for (let i = 0; i < config.mainTrials; i++) {
    const probData = mainTrialProbabilities[i % mainTrialProbabilities.length];
    timeline.push(...createTrialBlock(trialNumber++, false, probData));
  }

  // Final instructions with score
  const rewards = experimentLogic.getRewards();
  timeline.push({
    type: instructions,
    pages: [
      'Congratulations! You\'ve completed all missions!<br><br>' +
      `You collected: <strong>${rewards.realReward} space resources</strong><br><br>` +
      'Thank you for participating in this research.',
    ],
    show_clickable_nav: true,
    button_label_next: 'Finish',
  });

  return timeline;
}

// Start the experiment
const timeline = createTimeline();

jsPsych.run(timeline);

export { experimentLogic };

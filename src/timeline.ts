/**
 * Simplified timeline implementation for the Two-Step Task
 * Creates trials iteratively without complex blocks
 */

// jsPsych
import { initJsPsych } from 'jspsych';
import instructions from '@jspsych/plugin-instructions';

// Custom plugins and extensions
import NeurocogExtension from 'neurocog';
import FixationPlugin from './plugins/two-step-fixation';
import ChoicePlugin from './plugins/two-step-choice';

// Configuration and data
import { config } from './config';
import { stimuli } from './stimuli';
import { tutorialTrialProbabilities, fullTrialProbabilities } from './data';

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
        seed: 0.2846,
      }
    }
  ],
});

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

  // Training Phase 1: Select a rocket and preview the planet
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

  for (let i = 0; i < config.trainingTrials.rocket; i++) {
    timeline.push({
      type: ChoicePlugin,
      trialType: 'training-rocket',
      trialNumber: trialNumber++,
      leftKey: config.controls.left,
      rightKey: config.controls.right,
      rewardLikelihoods: [0.5, 0.5, 0.5, 0.5],
      transitionLikelihood: 1.0,
      responseWindow: config.timing.choice,
      extensions: [{
        type: NeurocogExtension,
      }],
    });

    // Fixation after each trial
    timeline.push({
      type: FixationPlugin,
      stimulus: jsPsych.extensions.Neurocog.getStimulus('earth.png'),
      text: '+',
      duration: config.timing.fixation,
      trialNumber: trialNumber - 1,
      extensions: [{
        type: NeurocogExtension,
      }],
    });
  }

  // Training Phase 2: Select an alien and see if they share resources
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

  for (let i = 0; i < config.trainingTrials.alien; i++) {
    const probData = tutorialTrialProbabilities[i % tutorialTrialProbabilities.length];
    timeline.push({
      type: ChoicePlugin,
      trialType: 'training-alien',
      trialNumber: trialNumber++,
      leftKey: config.controls.left,
      rightKey: config.controls.right,
      rewardLikelihoods: [probData?.alien1 || 0.5, probData?.alien2 || 0.5, probData?.alien3 || 0.5, probData?.alien4 || 0.5],
      transitionLikelihood: 1.0,
      responseWindow: config.timing.choice,
      extensions: [{
        type: NeurocogExtension,
      }],
    });

    // Fixation after each trial
    timeline.push({
      type: FixationPlugin,
      stimulus: jsPsych.extensions.Neurocog.getStimulus('earth.png'),
      text: '+',
      duration: config.timing.fixation,
      trialNumber: trialNumber - 1,
      extensions: [{
        type: NeurocogExtension,
      }],
    });
  }

  // Training Phase 3: Complete trials
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

  for (let i = 0; i < config.trainingTrials.full; i++) {
    const probData = tutorialTrialProbabilities[i % tutorialTrialProbabilities.length];
    timeline.push({
      type: ChoicePlugin,
      trialType: 'training-full',
      trialNumber: trialNumber++,
      leftKey: config.controls.left,
      rightKey: config.controls.right,
      rewardLikelihoods: [probData?.alien1 || 0.5, probData?.alien2 || 0.5, probData?.alien3 || 0.5, probData?.alien4 || 0.5],
      transitionLikelihood: 1.0,
      responseWindow: config.timing.choice,
      extensions: [{
        type: NeurocogExtension,
      }],
    });

    // Fixation after each trial
    timeline.push({
      type: FixationPlugin,
      stimulus: jsPsych.extensions.Neurocog.getStimulus('earth.png'),
      text: '+',
      duration: config.timing.fixation,
      trialNumber: trialNumber - 1,
      extensions: [{
        type: NeurocogExtension,
      }],
    });
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

  // Main trials with block design
  for (let i = 0; i < config.mainTrials.blockCount; i++) {
    for (let j = 0; j < config.mainTrials.blockSize; j++) {
      // Increment trial number
      const currentTrialNumber = trialNumber++;

      // Add fixation trial
      timeline.push({
        type: FixationPlugin,
        stimulus: jsPsych.extensions.Neurocog.getStimulus('earth.png'),
        text: '+',
        duration: config.timing.fixation,
        trialNumber: currentTrialNumber,
        extensions: [{
          type: NeurocogExtension,
        }],
      });

      // Add choice trial
    const probData = fullTrialProbabilities[i % fullTrialProbabilities.length];
      timeline.push({
      type: ChoicePlugin,
      trialType: 'full',
        trialNumber: currentTrialNumber,
      leftKey: config.controls.left,
      rightKey: config.controls.right,
      rewardLikelihoods: [probData?.alien1 || 0.5, probData?.alien2 || 0.5, probData?.alien3 || 0.5, probData?.alien4 || 0.5],
      transitionLikelihood: config.transitionLikelihood,
      responseWindow: config.timing.choice,
      extensions: [{
        type: NeurocogExtension,
      }],
    });
  }

    // Add break screen
    timeline.push({
      type: instructions,
      pages: [
        'That is the end of this block!<br><br>' +
        'Please take a break and then continue with the next block.',
      ],
      show_clickable_nav: true,
      button_label_next: 'Continue',
  });
  }

  // Final instructions
  timeline.push({
    type: instructions,
    pages: [
      'Congratulations! You\'ve completed all missions!<br><br>' +
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

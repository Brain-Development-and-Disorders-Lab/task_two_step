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
    },
  ],
  on_finish: () => {
    // For testing purposes
    jsPsych.data.get().localSave('csv',`${config.studyName}_data.csv`);
  }
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
      '<b>Before commencing the task, please review these instructions carefully.</b><br><br>' +
      'This task requires access to a keyboard and mouse.<br>' +
      'Ensure you are in a quiet environment with no distractions.<br><br>' +
      'Click "Continue >" to proceed.',

      '<b>Task Overview</b><br><br>' +
      'Welcome Astronaut! You are in charge of space missions to explore planets<br>' +
      'with aliens who may have valuable space resources to share.<br><br>' +
      'There will be a series of <i>training missions</i> to help you become familiar with<br>' +
      'the task and the controls.<br><br>' +
      'Click "Continue >" to proceed.',

      '<b>Training Stage 1: Rockets</b><br><br>' +
      'At the start of each mission, you will be on Earth and select a rocket to travel to a planet.<br>' +
      'After selecting a rocket, that rocket will take you to a planet inhabited by two aliens.<br><br>' +
      'In the <i>training missions</i>, the rockets will look like this:<br>' +
      `<img src="${jsPsych.extensions.Neurocog.getStimulus('tutrocket1_norm.png')}" alt="Rocket" style="width: 100px; height: 100px;">` +
      `<img src="${jsPsych.extensions.Neurocog.getStimulus('tutrocket2_norm.png')}" alt="Rocket" style="width: 100px; height: 100px;"><br>` +
      'The rockets in the <i>actual missions</i> will look slightly different.<br><br>' +
      'Click "Continue >" to proceed.',

      '<b>Training Stage 1: Rockets</b><br><br>' +
      'For the first set of training missions, you will select a rocket to fly from Earth.<br>' +
      'To select the left rocket, press the "F" key on your keyboard.<br>' +
      'To select the right rocket, press the "J" key on your keyboard.<br><br>' +
      'After selecting a rocket, you will briefly see the planet you will fly to.<br><br>' +
      'Click "Continue >" to proceed.',

      '<b>Training Stage 1: Rockets</b><br><br>' +
      'The green planet will look like this:<br><br>' +
      `<img src="${jsPsych.extensions.Neurocog.getStimulus('tutgreenplanet.png')}" alt="Planet" style="width: 400px;"><br><br>` +
      'Click "Continue >" to proceed.',

      '<b>Training Stage 1: Rockets</b><br><br>' +
      'The yellow planet will look like this:<br><br>' +
      `<img src="${jsPsych.extensions.Neurocog.getStimulus('tutyellowplanet.png')}" alt="Planet" style="width: 400px;"><br><br>` +
      'The planets in the <i>actual missions</i> will be different.<br><br>' +
      'Click "Continue >" to proceed.',

      '<b>Training Stage 1: Rockets</b><br><br>' +
      'At each planet, there will be two aliens.<br>' +
      'The aliens on the green planet in the <i>training missions</i> will look like this:<br><br>' +
      `<img src="${jsPsych.extensions.Neurocog.getStimulus('tutalien1_norm.png')}" alt="Alien" style="width: 100px; height: 100px;">` +
      `<img src="${jsPsych.extensions.Neurocog.getStimulus('tutalien2_norm.png')}" alt="Alien" style="width: 100px; height: 100px;"><br><br>` +
      'Click "Continue >" to proceed.',

      '<b>Training Stage 1: Rockets</b><br><br>' +
      'The aliens on the yellow planet in the <i>training missions</i> will look like this:<br><br>' +
      `<img src="${jsPsych.extensions.Neurocog.getStimulus('tutalien3_norm.png')}" alt="Alien" style="width: 100px; height: 100px;">` +
      `<img src="${jsPsych.extensions.Neurocog.getStimulus('tutalien4_norm.png')}" alt="Alien" style="width: 100px; height: 100px;"><br><br>` +
      'The aliens in the <i>actual missions</i> will look slightly different.<br><br>' +
      'Click "Continue >" to proceed.',

      '<b>Training Stage 1: Rockets</b><br><br>' +
      'You are about to begin the first set of training missions!<br>' +
      'If you need to review the instructions, you can click the "< Previous" button to go back.<br><br>' +
      'Click "Continue >" to begin the training missions.',
    ],
    show_clickable_nav: true,
    button_label_next: 'Continue',
    extensions: [{
      type: NeurocogExtension,
    }],
  });

  // Training Phase 1: Select a rocket and preview the planet
  for (let i = 0; i < config.trainingTrials.rocket; i++) {
    // Fixation before each trial
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

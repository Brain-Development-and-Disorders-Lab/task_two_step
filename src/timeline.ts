/**
 * @fileoverview Timeline implementation for the Two-Step Task experiment
 *
 * This file contains the main timeline creation logic for the Two-Step Task experiment,
 * including training phases, main experiment trials, instructions, and comprehension
 * questions. It creates trials iteratively without complex blocks.
 *
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// jsPsych imports
import { initJsPsych } from 'jspsych';
import instructions from '@jspsych/plugin-instructions';
import surveyHtmlForm from '@jspsych/plugin-survey-html-form';

// Custom plugins and extensions
import NeurocogExtension from 'neurocog';
import FixationPlugin from './plugins/two-step-fixation';
import ChoicePlugin from './plugins/two-step-choice';
import ComprehensionPlugin from './plugins/two-step-comprehension';

// Counterbalancing utilities
import { getRocketStimuli, getAlienStimuli } from './counterbalancing';

// Configuration and data
import { config } from './config';
import { stimuli } from './stimuli';
import { tutorialTrialProbabilities, fullTrialProbabilities } from './data';

// Custom types
import { PlanetType } from '../types';

/**
 * Initialize jsPsych instance with plugins and extensions
 */
const jsPsych = initJsPsych({
  plugins: [FixationPlugin, ChoicePlugin, ComprehensionPlugin],
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
    // Store counterbalancing configuration in jsPsych data
    jsPsych.data.addProperties({
      counterbalancing: config.counterbalancing
    });

    // For testing purposes
    jsPsych.data.get().localSave('csv',`${config.studyName}_data.csv`);
  }
});

/**
 * Create the experiment timeline
 * @return {unknown[]} Array of timeline trials
 */
const createTimeline = (): unknown[] => {
  const timeline: unknown[] = [];

  // Debug counterbalancing state
  console.debug("---- Counterbalancing Configuration ----\n",
    "Swap Main Rockets:", config.counterbalancing.swapMainRockets, "\n",
    "Swap Training Rockets:", config.counterbalancing.swapTrainingRockets, "\n",
    "Swap Red Aliens:", config.counterbalancing.swapRedAliens, "\n",
    "Swap Purple Aliens:", config.counterbalancing.swapPurpleAliens, "\n",
    "Swap Green Aliens:", config.counterbalancing.swapGreenAliens, "\n",
    "Swap Yellow Aliens:", config.counterbalancing.swapYellowAliens, "\n",
    "Swap Rocket Preference:", config.counterbalancing.swapRocketPreference);

  // Initial instructions
  timeline.push({
    type: instructions,
    pages: [
      '<b>Welcome</b><br><br>' +
      'This task requires a keyboard and mouse.<br>Please ensure you are in a quiet, distraction-free environment.<br><br>' +
      'You are an astronaut completing space missions. On each mission, you will choose a rocket<br>' +
      'to fly to a planet, then choose an alien to ask for <b>space resources</b>.<br><br>' +
      'Training missions will help you learn the controls before the main missions begin.<br><br>' +
      'Click "Continue >" to proceed.',

      '<b>Training Stage 1: Rockets</b><br><br>' +
      'In the first training missions, you will choose a rocket to fly to a planet.<br>' +
      'Press <b>"F"</b> to select the left rocket, or <b>"J"</b> to select the right rocket.<br><br>' +
      'The training rockets look like this:<br><br>' +
      `<img src="${jsPsych.extensions.Neurocog.getStimulus(getRocketStimuli(true, config.counterbalancing.swapTrainingRockets).leftStimulus)}" alt="Rocket" style="width: 100px; height: 100px;">` +
      `<img src="${jsPsych.extensions.Neurocog.getStimulus(getRocketStimuli(true, config.counterbalancing.swapTrainingRockets).rightStimulus)}" alt="Rocket" style="width: 100px; height: 100px;"><br><br>` +
      'Each rocket tends to fly to one planet more often, but can fly to either.<br>The rockets in the main missions will look different.<br><br>' +
      'Click "Continue >" to proceed.',

      '<b>Training Stage 1: Planets</b><br><br>' +
      'The training <i>green planet</i> looks like this:<br><br>' +
      `<img src="${jsPsych.extensions.Neurocog.getStimulus('tutgreenplanet.png')}" alt="Planet" style="width: 300px;"><br><br>` +
      'Click "Continue >" to proceed.',

      '<b>Training Stage 1: Planets</b><br><br>' +
      'The training <i>yellow planet</i> looks like this:<br><br>' +
      `<img src="${jsPsych.extensions.Neurocog.getStimulus('tutyellowplanet.png')}" alt="Planet" style="width: 300px;"><br><br>` +
      'The planets in the main missions will look different.<br><br>' +
      'Click "Continue >" to proceed.',

      '<b>Training Stage 1: Aliens</b><br><br>' +
      'Each planet has two aliens. The training aliens on the <i>green planet</i> look like this:<br><br>' +
      `<img src="${jsPsych.extensions.Neurocog.getStimulus(getAlienStimuli(PlanetType.GREEN, config.counterbalancing.swapGreenAliens).leftStimulus)}" alt="Alien" style="width: 100px; height: 100px;">` +
      `<img src="${jsPsych.extensions.Neurocog.getStimulus(getAlienStimuli(PlanetType.GREEN, config.counterbalancing.swapGreenAliens).rightStimulus)}" alt="Alien" style="width: 100px; height: 100px;"><br><br>` +
      'The training aliens on the <i>yellow planet</i> look like this:<br><br>' +
      `<img src="${jsPsych.extensions.Neurocog.getStimulus(getAlienStimuli(PlanetType.YELLOW, config.counterbalancing.swapYellowAliens).leftStimulus)}" alt="Alien" style="width: 100px; height: 100px;">` +
      `<img src="${jsPsych.extensions.Neurocog.getStimulus(getAlienStimuli(PlanetType.YELLOW, config.counterbalancing.swapYellowAliens).rightStimulus)}" alt="Alien" style="width: 100px; height: 100px;"><br><br>` +
      'The aliens in the main missions will look different.<br><br>' +
      'Click "Continue >" to proceed.',

      '<b>Training Stage 1</b><br><br>' +
      'You are about to begin the first training missions.<br><br>' +
      'Click "< Previous" to review the instructions, or "Continue >" to proceed.',
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
      extensions: [{
        type: NeurocogExtension,
      }],
    });

    timeline.push({
      type: ChoicePlugin,
      trialLayout: 'training-rocket',
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
      '<b>Training Stage 2: Aliens</b><br><br>' +
      'In the next training missions, you will practice choosing an alien.<br>' +
      'Each alien has a mine that may contain <b>space resources</b>.<br><br>' +
      'The quality of each alien\'s mine changes slowly over time.<br>' +
      'Press <b>"F"</b> to select the left alien, or <b>"J"</b> to select the right alien.<br><br>' +
      'Click "Continue >" to proceed.',

      '<b>Training Stage 2: Outcomes</b><br><br>' +
      'If an alien shares resources, a space resource will appear above them:<br><br>' +
      `<img src="${jsPsych.extensions.Neurocog.getStimulus('t.png')}" alt="Space Resource" style="width: 60px; height: 60px;"><br><br>` +
      'If an alien has no resources, an empty circle will appear:<br><br>' +
      `<img src="${jsPsych.extensions.Neurocog.getStimulus('nothing.png')}" alt="Empty Circle" style="width: 60px; height: 60px;"><br><br>` +
      'Click "Continue >" to proceed.',

      '<b>Training Stage 2</b><br><br>' +
      'You are about to begin the second training missions.<br><br>' +
      'Click "< Previous" to review the instructions, or "Continue >" to proceed.',
    ],
    show_clickable_nav: true,
    button_label_next: 'Continue',
  });

  for (let i = 0; i < config.trainingTrials.alien; i++) {
    const probData = tutorialTrialProbabilities[i % tutorialTrialProbabilities.length];
    timeline.push({
      type: ChoicePlugin,
      trialLayout: 'training-alien',
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
      extensions: [{
        type: NeurocogExtension,
      }],
    });
  }

  // Training Phase 3: Complete trials
  timeline.push({
    type: instructions,
    pages: [
      '<b>Training Stage 3: Full Missions</b><br><br>' +
      'These training missions combine both previous stages:<br>' +
      'choose a rocket to fly to a planet, then choose an alien to ask for resources.<br><br>' +
      'You have <b>3 seconds</b> to make each choice. If no choice is made in time,<br>' +
      'a red "X" will appear and the mission will end.<br>' +
      'Resources collected during training do not count toward your final score.<br><br>' +
      'Click "Continue >" to proceed.',

      '<b>Training Stage 3</b><br><br>' +
      'You are about to begin the final training missions.<br><br>' +
      'Click "< Previous" to review the instructions, or "Continue >" to proceed.',
    ],
    show_clickable_nav: true,
    button_label_next: 'Continue',
  });

  for (let i = 0; i < config.trainingTrials.full; i++) {
    const probData = tutorialTrialProbabilities[i % tutorialTrialProbabilities.length];
    timeline.push({
      type: ChoicePlugin,
      trialLayout: 'training-full',
      leftKey: config.controls.left,
      rightKey: config.controls.right,
      rewardLikelihoods: [probData?.alien1 || 0.5, probData?.alien2 || 0.5, probData?.alien3 || 0.5, probData?.alien4 || 0.5],
      transitionLikelihood: 0.7,
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
      extensions: [{
        type: NeurocogExtension,
      }],
    });
  }

  // Pre-main instructions
  timeline.push({
    type: instructions,
    pages: [
      '<b>Main Missions</b><br><br>' +
      'Training is complete! The main missions use different rockets, planets, and aliens,<br>' +
      'but the rules are the same.<br><br>' +
      'Resources collected in the main missions will count toward your final score.<br><br>' +
      'Click "Continue >" to proceed.',

      '<b>Main Missions</b><br><br>' +
      'You will answer three questions to confirm your understanding before starting.<br><br>' +
      'Click "< Previous" to review the instructions, or "Continue >" to answer the questions.',
    ],
    show_clickable_nav: true,
    button_label_next: 'Continue',
  });

  // Comprehension Questions
  timeline.push({
    type: ComprehensionPlugin,
    question: {
      prompt: 'Each rocket always flies to the same planet.',
      correct: 'false'
    },
    preamble: 'Please answer the following question:',
    button_label: 'Continue',
    feedback: 'Incorrect. Rockets may sometimes fly to the planet you don\'t expect.',
    extensions: [{
      type: NeurocogExtension,
    }],
  });

  timeline.push({
    type: ComprehensionPlugin,
    question: {
      prompt: 'If an alien shares a space resource in this mission, then they will probably have resources to share in subsequent missions.',
      correct: 'true'
    },
    preamble: 'Please answer the following question:',
    button_label: 'Continue',
    feedback: 'Incorrect. The amount of resources an alien can share will change slowly over multiple missions.',
    extensions: [{
      type: NeurocogExtension,
    }],
  });

  timeline.push({
    type: ComprehensionPlugin,
    question: {
      prompt: 'You will have as much time as you want to make each choice.',
      correct: 'false'
    },
    preamble: 'Please answer the following question:',
    button_label: 'Continue',
    feedback: 'Incorrect. You will have 3 seconds to make each choice.',
    extensions: [{
      type: NeurocogExtension,
    }],
  });

  // Pre-main instructions
  timeline.push({
    type: instructions,
    pages: [
      '<b>Main Missions</b><br><br>' +
      'You are about to begin the main missions.<br>The number of space resources you collect will be shown at the end.<br><br>' +
      'Click "Continue >" to begin.',
    ],
    show_clickable_nav: true,
    button_label_next: 'Continue',
  });

  // Main trials with block design
  for (let i = 0; i < config.mainTrials.blockCount; i++) {
    for (let j = 0; j < config.mainTrials.blockSize; j++) {
      // Add fixation trial
      timeline.push({
        type: FixationPlugin,
        stimulus: jsPsych.extensions.Neurocog.getStimulus('earth.png'),
        text: '+',
        duration: config.timing.fixation,
        extensions: [{
          type: NeurocogExtension,
        }],
      });

      // Add choice trial
      const probData = fullTrialProbabilities[i % fullTrialProbabilities.length];
      timeline.push({
        type: ChoicePlugin,
        trialLayout: 'full',
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

    // Add break screen at the end of all but the last block
    if (i < config.mainTrials.blockCount - 1) {
      timeline.push({
        type: instructions,
        pages: [
          '<b>Break</b><br>' +
          'That is the end of block ' + (i + 1) + ' of ' + config.mainTrials.blockCount + '!<br>' +
          (i === 1 ? 'You are halfway through the main missions!<br><br>' : '') +
          (i === 2 ? 'One last block to go!<br><br>' : '') +
          'Please take a break if you need to, and when you are ready,<br>' +
          'continue with the next block.<br><br>' +
          'Click "Continue >" to commence the next block.',
        ],
        show_clickable_nav: true,
        button_label_next: 'Continue',
      });
    } else {
      // Final instructions
      timeline.push({
        type: instructions,
        pages: [
          '<b>Complete</b><br><br>' +
          'You have completed all the missions.<br><br>' +
          'You collected <b><span id="reward-count">0</span> space resources</b>!<br><br>' +
          'Click "Continue >" to answer a final question.',
        ],
        show_clickable_nav: true,
        button_label_next: 'Continue',
        on_load: () => {
          const rewardCount = jsPsych.data.get().filter({trialLayout: 'full', wasRewarded: true}).values().length;
          const countElement = document.getElementById('reward-count');
          if (countElement) {
            countElement.textContent = rewardCount.toString();
          }
        },
      });
    }
  }

  // Add survey question about the rocket behavior
  timeline.push({
    type: surveyHtmlForm,
    preamble: '<p><b>Please answer the following question:</b></p>',
    html: `
      <p>Select the rocket you think went to the red planet most frequently.</p>
      <div style="display: flex; justify-content: center; gap: 50px; margin: 20px 0;">
        <div style="text-align: center;">
          <label for="rocket1">
            <img src="${jsPsych.extensions.Neurocog.getStimulus(getRocketStimuli(false, config.counterbalancing.swapMainRockets).leftStimulus)}" alt="Rocket 1" style="width: 150px; height: 150px;">
          </label>
          <br>
          <input type="radio" id="rocket1" name="rocket_choice" value="rocket1" required>
        </div>
        <div style="text-align: center;">
          <label for="rocket2">
            <img src="${jsPsych.extensions.Neurocog.getStimulus(getRocketStimuli(false, config.counterbalancing.swapMainRockets).rightStimulus)}" alt="Rocket 2" style="width: 150px; height: 150px;">
          </label>
          <br>
          <input type="radio" id="rocket2" name="rocket_choice" value="rocket2" required>
        </div>
      </div>
    `,
    button_label: 'Continue',
    extensions: [{
      type: NeurocogExtension,
    }],
  });

  // Final instructions
  timeline.push({
    type: instructions,
    pages: [
      '<b>Complete</b><br><br>' +
      'Thank you for participating in this research!<br><br>' +
      'Click "Finish >" to end the experiment.',
    ],
    show_clickable_nav: true,
    button_label_next: 'Finish',
  });

  return timeline;
};

// Start the experiment
const timeline = createTimeline();
jsPsych.run(timeline);

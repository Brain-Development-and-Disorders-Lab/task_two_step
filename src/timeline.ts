/**
 * Simplified timeline implementation for the Two-Step Task
 * Creates trials iteratively without complex blocks
 */

// jsPsych
import { initJsPsych } from 'jspsych';
import instructions from '@jspsych/plugin-instructions';
import surveyHtmlForm from '@jspsych/plugin-survey-html-form';

// Custom plugins and extensions
import NeurocogExtension from 'neurocog';
import FixationPlugin from './plugins/two-step-fixation';
import ChoicePlugin from './plugins/two-step-choice';
import ComprehensionPlugin from './plugins/two-step-comprehension';

// Configuration and data
import { config } from './config';
import { stimuli } from './stimuli';
import { tutorialTrialProbabilities, fullTrialProbabilities } from './data';

// Initialize jsPsych instance
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
    // For testing purposes
    jsPsych.data.get().localSave('csv',`${config.studyName}_data.csv`);
  }
});

/**
 * Create the experiment timeline
 */
function createTimeline(): any[] {
  const timeline: any[] = [];

  // Initial instructions
  timeline.push({
    type: instructions,
    pages: [
      '<b>Task Overview</b><br><br>' +
      'Before commencing the task, please review these instructions carefully.<br><br>' +
      'This task requires access to a keyboard and mouse.<br>' +
      'Ensure you are in a quiet environment with no distractions.<br><br>' +
      'Click "Continue >" to proceed.',

      '<b>Task Overview</b><br><br>' +
      'Welcome Astronaut! You are in charge of space missions to explore planets<br>' +
      'with aliens who may have valuable <b>space resources</b> to share.<br><br>' +
      'There will be a series of <i>training missions</i> to help you become familiar with<br>' +
      'the task and the controls.<br><br>' +
      'Click "Continue >" to proceed.',

      '<b>Instructions</b><br>' +
      '<b><i>Training Stage 1: Rockets</i></b><br><br>' +
      'At the start of each mission, you will be on Earth and select a rocket to travel to a planet.<br>' +
      'After selecting a rocket, that rocket will take you to a planet inhabited by two aliens.<br><br>' +
      'In the <i>training missions</i>, the rockets will look like this:<br>' +
      `<img src="${jsPsych.extensions.Neurocog.getStimulus('tutrocket1_norm.png')}" alt="Rocket" style="width: 100px; height: 100px;">` +
      `<img src="${jsPsych.extensions.Neurocog.getStimulus('tutrocket2_norm.png')}" alt="Rocket" style="width: 100px; height: 100px;"><br>` +
      'The rockets in the <i>actual missions</i> will look slightly different.<br><br>' +
      'Click "Continue >" to proceed.',

      '<b>Instructions</b><br>' +
      '<b><i>Training Stage 1: Rockets</i></b><br><br>' +
      'For the first set of training missions, you will select a rocket to fly from Earth.<br>' +
      'To select the left rocket, press the "F" key on your keyboard.<br>' +
      'To select the right rocket, press the "J" key on your keyboard.<br><br>' +
      'After selecting a rocket, you will briefly see the planet you will fly to.<br><br>' +
      'Click "Continue >" to proceed.',

      '<b>Instructions</b><br>' +
      '<b><i>Training Stage 1: Rockets</i></b><br><br>' +
      'The green planet will look like this:<br><br>' +
      `<img src="${jsPsych.extensions.Neurocog.getStimulus('tutgreenplanet.png')}" alt="Planet" style="width: 400px;"><br><br>` +
      'Click "Continue >" to proceed.',

      '<b>Instructions</b><br>' +
      '<b><i>Training Stage 1: Rockets</i></b><br><br>' +
      'The yellow planet will look like this:<br><br>' +
      `<img src="${jsPsych.extensions.Neurocog.getStimulus('tutyellowplanet.png')}" alt="Planet" style="width: 400px;"><br><br>` +
      'The planets in the <i>actual missions</i> will be different.<br><br>' +
      'Click "Continue >" to proceed.',

      '<b>Instructions</b><br>' +
      '<b><i>Training Stage 1: Rockets</i></b><br><br>' +
      'The rockets can fly to either planet, but one rocket will fly mostly to the green planet,<br>' +
      'and the other rocket will fly mostly to the yellow planet.<br><br>' +
      'The planet a spaceship flies to most often won\'t change during the game.<br><br>' +
      'Click "Continue >" to proceed.',

      '<b>Instructions</b><br>' +
      '<b><i>Training Stage 1: Rockets</i></b><br><br>' +
      'At each planet, there will be two aliens.<br>' +
      'The aliens on the green planet in the <i>training missions</i> will look like this:<br><br>' +
      `<img src="${jsPsych.extensions.Neurocog.getStimulus('tutalien1_norm.png')}" alt="Alien" style="width: 100px; height: 100px;">` +
      `<img src="${jsPsych.extensions.Neurocog.getStimulus('tutalien2_norm.png')}" alt="Alien" style="width: 100px; height: 100px;"><br><br>` +
      'Click "Continue >" to proceed.',

      '<b>Instructions</b><br>' +
      '<b><i>Training Stage 1: Rockets</i></b><br><br>' +
      'The aliens on the yellow planet in the <i>training missions</i> will look like this:<br><br>' +
      `<img src="${jsPsych.extensions.Neurocog.getStimulus('tutalien3_norm.png')}" alt="Alien" style="width: 100px; height: 100px;">` +
      `<img src="${jsPsych.extensions.Neurocog.getStimulus('tutalien4_norm.png')}" alt="Alien" style="width: 100px; height: 100px;"><br><br>` +
      'The aliens in the <i>actual missions</i> will look slightly different.<br><br>' +
      'Click "Continue >" to proceed.',

      '<b>Instructions</b><br>' +
      '<b><i>Training Stage 1: Rockets</i></b><br><br>' +
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
      extensions: [{
        type: NeurocogExtension,
      }],
    });

    timeline.push({
      type: ChoicePlugin,
      trialType: 'training-rocket',
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
      '<b>Instructions</b><br>' +
      '<b><i>Training Stage 2: Aliens</i></b><br><br>' +
      'Now that you know how to travel to planets, the next training missions focus<br>' +
      'on the aliens. As mentioned at the start of these instructions, the aliens<br>' +
      'may have valuable <b>space resources</b> to share.<br><br>' +
      'For the second set of training missions, you will practice selecting an alien<br>' +
      'to see if they have space resources to share.<br><br>' +
      'Click "Continue >" to proceed.',

      '<b>Instructions</b><br>' +
      '<b><i>Training Stage 2: Aliens</i></b><br><br>' +
      'Each alien is responsible for their own mine that they use to mine for space<br>' +
      'resources on the planet. If they have any space resources to share, an alien<br>' +
      'will share them with you when asked.<br><br>' +
      'If an alien has a good mine right now, they will have plenty of space resources<br>' +
      'to share with you. At other times, an alien may not have a good mine, so they<br>' +
      'have not found any space resources to share with you.<br><br>' +
      'The quality of an alien\'s mine changes slowly across missions.<br><br>' +
      'Click "Continue >" to proceed.',

      '<b>Instructions</b><br>' +
      '<b><i>Training Stage 2: Aliens</i></b><br><br>' +
      'To select the left alien, press the "F" key on your keyboard.<br>' +
      'To select the right alien, press the "J" key on your keyboard.<br><br>' +
      'After selecting an alien, you will briefly see if they had space resources to share.<br><br>' +
      'Click "Continue >" to proceed.',

      '<b>Instructions</b><br>' +
      '<b><i>Training Stage 2: Aliens</i></b><br><br>' +
      'If an alien shares space resources with you, a space resource will appear<br>' +
      'above them. A space resource will look like this:<br><br>' +
      `<img src="${jsPsych.extensions.Neurocog.getStimulus('t.png')}" alt="Space Resource" style="width: 60px; height: 60px;"><br><br>` +
      'Click "Continue >" to proceed.',

      '<b>Instructions</b><br>' +
      '<b><i>Training Stage 2: Aliens</i></b><br><br>' +
      'If an alien does not share space resources with you, an empty circle will<br>' +
      'appear above them. The empty circle will look like this:<br><br>' +
      `<img src="${jsPsych.extensions.Neurocog.getStimulus('nothing.png')}" alt="Empty Circle" style="width: 60px; height: 60px;"><br><br>` +
      'Click "Continue >" to proceed.',

      '<b>Instructions</b><br>' +
      '<b><i>Training Stage 2: Aliens</i></b><br><br>' +
      'The amount of resources an alien can share will change during the missions.<br>' +
      'An alien with a good mine in previous missions may dig in a part of their<br>' +
      'mine that has few resources. Another alien with few resources in previous missions<br>' +
      'may discover a lot of resources.<br><br>' +
      'Any changes in an alien\'s mine will happen slowly across multiple missions.<br>' +
      'It is best to focus on retrieving as many resources as possible.<br><br>' +
      'Click "Continue >" to proceed.',

      '<b>Instructions</b><br>' +
      '<b><i>Training Stage 2: Aliens</i></b><br><br>' +
      'You are about to begin the second set of training missions!<br>' +
      'If you need to review the instructions, you can click the "< Previous" button to go back.<br><br>' +
      'Click "Continue >" to begin the training missions.',
    ],
    show_clickable_nav: true,
    button_label_next: 'Continue',
  });

  for (let i = 0; i < config.trainingTrials.alien; i++) {
    const probData = tutorialTrialProbabilities[i % tutorialTrialProbabilities.length];
    timeline.push({
      type: ChoicePlugin,
      trialType: 'training-alien',
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
      '<b>Instructions</b><br>' +
      '<b><i>Training Stage 3: Full Missions</i></b><br><br>' +
      'Now that you know how to travel to planets and how to ask aliens for space resources,<br>' +
      'the last training missions will combine both of the previous training stages!<br><br>' +
      'You will start on Earth, choose a rocket, arrive at a planet, and then choose<br>' +
      'an alien to ask to share their space resources.<br><br>' +
      'The space resource you receive during the training missions will not count<br>' +
      'towards your final score.<br><br>' +
      'Click "Continue >" to proceed.',

      '<b>Instructions</b><br>' +
      '<b><i>Training Stage 3: Full Missions</i></b><br><br>' +
      'During the last <i>training missions</i> and the <i>actual missions</i>, you will<br>' +
      'have <b>3 seconds</b> to select a rocket and <b>3 seconds</b> to select an alien.<br>' +
      'If you do not make a choice within 3 seconds, the mission will fail. A red "X" will<br>' +
      'appear on the rockets or aliens briefly before the next mission commences.<br><br>' +
      'Remember, you still want to find as many space resources as possible!<br><br>' +
      'Click "Continue >" to proceed.',

      '<b>Instructions</b><br>' +
      '<b><i>Training Stage 3: Full Missions</i></b><br><br>' +
      'You are about to begin the last set of training missions!<br>' +
      'If you need to review the instructions, you can click the "< Previous" button to go back.<br><br>' +
      'Click "Continue >" to begin the training missions.',
    ],
    show_clickable_nav: true,
    button_label_next: 'Continue',
  });

  for (let i = 0; i < config.trainingTrials.full; i++) {
    const probData = tutorialTrialProbabilities[i % tutorialTrialProbabilities.length];
    timeline.push({
      type: ChoicePlugin,
      trialType: 'training-full',
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
      '<b>Instructions</b><br>' +
      '<b><i>Main Missions</i></b><br><br>' +
      'You have completed the training missions! In the main missions,<br>' +
      'the planets, aliens, and rockets will be new colors, but the rules<br>' +
      'will be the same.<br><br>' +
      'These missions are hard, so you will need to concentrate. Don\'t be<br>' +
      'afraid to trust your instincts!<br><br>' +
      'Here are three hints as you complete the main missions.<br><br>' +
      'Click "Continue >" to proceed.',

      '<b>Instructions</b><br>' +
      '<b><i>Main Missions: Hint 1</i></b><br><br>' +
      'Remember which aliens have space resources to share. An alien that<br>' +
      'has many space resources to share now will probably be able to share<br>' +
      'more in the near future, since the quality of their mine changes slowly.<br><br>' +
      'Click "Continue >" to proceed.',

      '<b>Instructions</b><br>' +
      '<b><i>Main Missions: Hint 2</i></b><br><br>' +
      'Remember that each alien has their own mine. Just because one alien currently<br>' +
      'has a bad mine and can\'t share space resources often, doesn\'t mean that<br>' +
      'another alien has a good mine.<br><br>' +
      'The aliens are not trying to trick you! Your choices do not change the<br>' +
      'quality of a mine, and the aliens do not hide space resources from you<br>' +
      'if they have any to share.<br><br>' +
      'Click "Continue >" to proceed.',

      '<b>Instructions</b><br>' +
      '<b><i>Main Missions: Hint 3</i></b><br><br>' +
      'The rocket you choose is important because often an alien on one planet<br>' +
      'may have a better mine right now than the aliens on another planet.<br><br>' +
      'You can find more resources by choosing the rocket that will take<br>' +
      'you to the planet where an alien currently has a good mine.<br><br>' +
      'Click "Continue >" to proceed.',

      '<b>Instructions</b><br>' +
      '<b><i>Main Missions</i></b><br><br>' +
      'You will answer three questions before the main missions commence<br>' +
      'to confirm that you understand how to play.<br><br>' +
      'If you need to review the instructions, you can click the "< Previous" button to go back.<br><br>' +
      'Click "Continue >" to answer the questions.',
    ],
    show_clickable_nav: true,
    button_label_next: 'Continue',
  });

  // Comprehension Questions
  timeline.push({
    type: ComprehensionPlugin,
    question: {
      prompt: 'Each spaceship always flies to the same planet.',
      correct: 'false'
    },
    preamble: 'Please answer the following question:',
    button_label: 'Continue',
    feedback: 'Incorrect. Spaceships may sometimes fly to the planet you don\'t expect.',
    extensions: [{
      type: NeurocogExtension,
    }],
  });

  timeline.push({
    type: ComprehensionPlugin,
    question: {
      prompt: 'If an alien has a lot of resources to share now, then they will probably have a lot of resources to share in the near future.',
      correct: 'true'
    },
    preamble: 'Please answer the following question:',
    button_label: 'Continue',
    feedback: 'Incorrect. Some aliens have more resources than others.',
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
      '<b>Instructions</b><br>' +
      '<b><i>Main Missions</i></b><br><br>' +
      'You are about to commence the main missions!<br><br>' +
      'The number of space resources you collect during these missions will be<br>' +
      'counted and shown to you at the end of all the missions.<br><br>' +
      'Click "Continue >" to commence the main missions.',
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
        trialType: 'full',
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
          const rewardCount = jsPsych.data.get().filter({trialType: 'full', wasRewarded: true}).values().length;
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
            <img src="${jsPsych.extensions.Neurocog.getStimulus('rocket1_norm.png')}" alt="Rocket 1" style="width: 150px; height: 150px;">
          </label>
          <br>
          <input type="radio" id="rocket1" name="rocket_choice" value="rocket1" required>
        </div>
        <div style="text-align: center;">
          <label for="rocket2">
            <img src="${jsPsych.extensions.Neurocog.getStimulus('rocket2_norm.png')}" alt="Rocket 2" style="width: 150px; height: 150px;">
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
}

// Start the experiment
const timeline = createTimeline();

jsPsych.run(timeline);

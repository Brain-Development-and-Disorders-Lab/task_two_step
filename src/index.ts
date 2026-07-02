/**
 * @fileoverview Main entry point for the Two-Step Task experiment
 *
 * This file serves as the main entry point for the Two-Step Task experiment,
 * importing necessary CSS styles and initializing the experiment timeline.
 * Additionally, it contains the main timeline creation logic for the Two-Step Task experiment,
 * including training phases, main experiment trials, instructions, and comprehension
 * questions. It creates trials iteratively without complex blocks.
 *
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// jsPsych imports
import { initJsPsych } from 'jspsych';
import instructions from '@jspsych/plugin-instructions';
import fullscreen from '@jspsych/plugin-fullscreen';
import preload from '@jspsych/plugin-preload';
import surveyHtmlForm from '@jspsych/plugin-survey-html-form';

// Custom plugins and extensions
import NeurocogExtension from 'neurocog';
import FixationPlugin from './plugins/two-step-fixation';
import ChoicePlugin from './plugins/two-step-choice';
import ComprehensionPlugin from './plugins/two-step-comprehension';

// Custom types
import { BackupStorage, PlanetType } from '../types';

// Configuration and data
import { config } from './config';
import { tutorialTrialProbabilities, fullTrialProbabilities } from './data';

// Utility libraries
import FileSaver from "file-saver";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";

// Configure logging
import { createConsola } from "consola";
export const logger = createConsola({
  level: config.debug.enableDebugLogging ? 4 : 3, // 3 is informational logs
  formatOptions: {
    colors: true,
    date: true,
  },
});

/**
 * Get rocket stimuli with optional side swapping
 * @param {boolean} isTraining Whether to use training rocket stimuli
 * @param {boolean} swapSides Whether to swap left and right rocket positions
 * @return Object containing left and right stimulus filenames
 */
export const getRocketStimuli = (isTraining: boolean, swapSides: boolean): { leftStimulus: string; rightStimulus: string } => {
  if (isTraining) {
    return swapSides
      ? { leftStimulus: 'tutorial_rocket_2.png', rightStimulus: 'tutorial_rocket_1.png' }
      : { leftStimulus: 'tutorial_rocket_1.png', rightStimulus: 'tutorial_rocket_2.png' };
  } else {
    return swapSides
      ? { leftStimulus: 'main_rocket_2.png', rightStimulus: 'main_rocket_1.png' }
      : { leftStimulus: 'main_rocket_1.png', rightStimulus: 'main_rocket_2.png' };
  }
};

/**
 * Get alien stimuli for a planet with optional side swapping
 * @param {PlanetType} planet The planet type ('red', 'purple', 'green', 'yellow')
 * @param {boolean} swapSides Whether to swap left and right alien positions
 * @return {{ leftStimulus: string, rightStimulus: string }} Object containing left and right stimulus filenames
 * @throws Error if planet type is unknown
 */
export const getAlienStimuli = (planet: PlanetType, swapSides: boolean): { leftStimulus: string; rightStimulus: string } => {
  if (planet === PlanetType.RED) {
    return swapSides
      ? { leftStimulus: 'main_alien_2.png', rightStimulus: 'main_alien_1.png' }
      : { leftStimulus: 'main_alien_1.png', rightStimulus: 'main_alien_2.png' };
  } else if (planet === PlanetType.PURPLE) {
    return swapSides
      ? { leftStimulus: 'main_alien_4.png', rightStimulus: 'main_alien_3.png' }
      : { leftStimulus: 'main_alien_3.png', rightStimulus: 'main_alien_4.png' };
  } else if (planet === PlanetType.GREEN) {
    return swapSides
      ? { leftStimulus: 'tutorial_alien_2.png', rightStimulus: 'tutorial_alien_1.png' }
      : { leftStimulus: 'tutorial_alien_1.png', rightStimulus: 'tutorial_alien_2.png' };
  } else if (planet === PlanetType.YELLOW) {
    return swapSides
      ? { leftStimulus: 'tutorial_alien_4.png', rightStimulus: 'tutorial_alien_3.png' }
      : { leftStimulus: 'tutorial_alien_3.png', rightStimulus: 'tutorial_alien_4.png' };
  }

  throw new Error(`Unknown 'PlanetType': ${planet}`);
};

/**
 * Determine which planet a rocket choice leads to
 * @param {number} rocketChoice The rocket choice (1 = left, 2 = right)
 * @param {boolean} swapPreference Whether rocket-to-planet mapping is swapped
 * @param {boolean} isTraining Whether this is a training trial (uses green/yellow planets)
 * @return The destination planet
 */
export const getPlanetFromRocketChoice = (
  rocketChoice: 1 | 2,
  swapPreference: boolean,
  isTraining: boolean = false
): PlanetType => {
  if (isTraining) {
    return rocketChoice === 1 ? PlanetType.GREEN : PlanetType.YELLOW;
  }

  if (swapPreference) {
    // Swapped: left rocket goes to purple, right rocket goes to red
    return rocketChoice === 1 ? PlanetType.PURPLE : PlanetType.RED;
  } else {
    // Default: left rocket goes to red, right rocket goes to purple
    return rocketChoice === 1 ? PlanetType.RED : PlanetType.PURPLE;
  }
};

/**
 * Get planet stimulus filename
 * @param {PlanetType} planet The planet type
 * @returns {string} The planet stimulus filename
 * @throws Error if planet type is unknown
 */
export const getPlanetStimulus = (planet: PlanetType): string => {
  switch (planet) {
    case PlanetType.RED: return 'main_planet_red.png';
    case PlanetType.PURPLE: return 'main_planet_purple.png';
    case PlanetType.GREEN: return 'tutorial_planet_green.png';
    case PlanetType.YELLOW: return 'tutorial_planet_yellow.png';
    default: throw new Error(`Unknown 'PlanetType': ${planet}`);
  }
};

/**
 * Retrieve the task data from local storage
 * @return {BackupStorage[]} the data associated with the experiment
 */
export const getLocalStorage = (): BackupStorage[] => {
  const data = localStorage.getItem(config.studyName);
  if (!data) {
    logger.warn("No data has been stored for this experiment");
    return [];
  }
  return JSON.parse(data);
};

/**
 * Initialize the local storage for a new experiment
 * @param {string} id the experiment ID
 */
export const initializeLocalStorage = (id: string): void => {
  // Get the list of existing experiments
  const stored: BackupStorage[] = getLocalStorage();
  if (stored.length > 0) {
    logger.info("Existing experiments:", stored);
    
    // Get the most recent stored experiment
    const lastStored = stored[stored.length - 1];
    if (lastStored !== undefined) {
      // Run a check to see if the most recent experiment has already been completed
      if (stored.length > 0 && !lastStored.completed) {
        logger.warn("Previous experiment was not completed");

        // If the user has not disabled the prompt, show it
        if (config.enablePreviousExperimentPrompt) {
          const confirm = window.confirm(
            "The previous experiment was not completed. Click OK to download the data from the previous experiment, or click Cancel to discard the data and continue."
          );
          if (confirm) {
            FileSaver.saveAs(
              new Blob([JSON.stringify(lastStored, null, "  ")], {
                type: "application/json",
              }),
              `${lastStored.experimentID}_data.json`
            );
          } else {
            logger.warn("Discarding previous experiment data");
          }
        }
      }
    } else {
      logger.error("Error while accessing the last stored experiment ID:", id);
    }
  }

  // Add the new experiment to the list and store
  const experiment: BackupStorage = {
    experimentID: id,
    timestamp: Date.now(),
    completed: false,
    data: [],
  };
  stored.push(experiment);
  localStorage.setItem(config.studyName, JSON.stringify(stored));
  logger.info(`Backup initialized for experiment ID: ${experiment.experimentID}`);
};

/**
 * Save data to the experiment's backup storage
 * @param {string} id the experiment ID
 * @param {any} data the jsPsych data object to store
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const saveToLocalStorage = (id: string, data: any): void => {
  const stored = getLocalStorage();
  if (stored.length === 0) {
    logger.error(`No backup storage found for experiment: ${id}`);
    return;
  }

  // Iterate through the list of experiments
  for (const experiment of stored) {
    if (experiment.experimentID === id) {
      // Update the data for the experiment
      experiment.data.push(data);
      localStorage.setItem(config.studyName, JSON.stringify(stored));
      logger.success(`Data saved to local storage for experiment ID: ${id}`);
      return;
    }
  }
  logger.error(`Unable to save data to backup storage for experiment ID: ${id}`);
};

/**
 * Toggle the completed flag in local storage
 * @param {string} id the experiment ID
 * @param {boolean} state the new state of the completed flag
 */
export const setCompleted = (id: string, state: boolean): void => {
  const stored = getLocalStorage();
  if (stored.length === 0) {
    logger.error(`No backup storage found for experiment: ${id}`);
    return;
  }

  // Iterate through the list of experiments
  for (const experiment of stored) {
    if (experiment.experimentID === id) {
      // Update the completed flag
      experiment.completed = state;
      localStorage.setItem(config.studyName, JSON.stringify(stored));
      logger.success(`Completed flag set for experiment ID: ${id}, ${state}`);
      return;
    }
  }
  logger.error(`Unable to set completed flag for experiment ID: ${id}`);
};


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
        stimuli: config.stimuli,
        seed: 0.2846,
      },
    },
  ],
  on_finish: () => {
    // Store counterbalancing configuration in jsPsych data
    jsPsych.data.addProperties({
      counterbalancing: config.counterbalancing
    });

    if (jsPsych.extensions.Neurocog._useAPI !== true) {
      // For testing purposes or running locally
      jsPsych.data.get().localSave('csv',`${config.studyName}_data.csv`);
    }
    
    // Toggle the completed flag in the local storage object
    setCompleted(jsPsych.extensions.Neurocog.getState("experimentID"), true);
  }
});

/**
 * Create the experiment timeline
 * @return {any[]} Array of timeline trials
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createTimeline = (): any[] => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timeline: any[] = [];
  
  // Preload images
  timeline.push({
    type: preload,
    images: Object.keys(config.stimuli).map((source) => jsPsych.extensions.Neurocog.getStimulus(source)),
  });

  // Request participant LUID
  if (config.requireID) {
    timeline.push({
      type: surveyHtmlForm,
      preamble: `<p>Please enter the 8 digit participant LUID.</p>`,
      html: `<input name="participantID" type="text" required/></br></br>`,
    });
  }
  
  // Run the experiment in fullscreen
  if (config.fullscreen) {
    timeline.push({
      type: fullscreen,
      message: `<p>Click 'Continue' to enter fullscreen mode.</p>`,
      fullscreen_mode: true,
    });
  }

  // Debug counterbalancing state
  logger.debug("Counterbalancing Configuration\n",
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
      'There are two rockets and two planets.<br>' +
      'Press <b>"F"</b> to select the left rocket, or <b>"J"</b> to select the right rocket.<br><br>' +
      'The training rockets look like this:<br><br>' +
      `<img src="${jsPsych.extensions.Neurocog.getStimulus(getRocketStimuli(true, config.counterbalancing.swapTrainingRockets).leftStimulus)}" alt="Rocket" style="width: 100px; height: 100px;">` +
      `<img src="${jsPsych.extensions.Neurocog.getStimulus(getRocketStimuli(true, config.counterbalancing.swapTrainingRockets).rightStimulus)}" alt="Rocket" style="width: 100px; height: 100px;"><br><br>` +
      'The rockets in the main missions will look different.<br><br>' +
      'Each rocket flies to its favorite planet, but sometimes it will fly to the other planet.<br><br>' +
      'Click "Continue >" to proceed.',

      '<b>Training Stage 1: Planets</b><br><br>' +
      'The training <i>green planet</i> looks like this:<br><br>' +
      `<img src="${jsPsych.extensions.Neurocog.getStimulus('tutorial_planet_green.png')}" alt="Planet" style="width: 300px;"><br><br>` +
      'Click "Continue >" to proceed.',

      '<b>Training Stage 1: Planets</b><br><br>' +
      'The training <i>yellow planet</i> looks like this:<br><br>' +
      `<img src="${jsPsych.extensions.Neurocog.getStimulus('tutorial_planet_yellow.png')}" alt="Planet" style="width: 300px;"><br><br>` +
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
      commonTransition: true, // Fixed common transitions
      rewardLikelihoods: [0.5, 0.5, 0.5, 0.5],
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
      'Each alien operates a mine that might contain <b>space resources</b>.<br><br>' +
      'The quality of each alien\'s mine changes slowly over time.<br>' +
      'This means that aliens will share space resources on some missions,<br>' +
      'but other missions they may not.<br>' +
      'Press <b>"F"</b> to select the left alien, or <b>"J"</b> to select the right alien.<br><br>' +
      'Click "Continue >" to proceed.',

      '<b>Training Stage 2: Outcomes</b><br><br>' +
      'If an alien shares resources, a space resource will appear above them:<br><br>' +
      `<img src="${jsPsych.extensions.Neurocog.getStimulus('reward.png')}" alt="Space Resource" style="width: 60px; height: 60px;"><br><br>` +
      'If an alien has no resources, an empty circle will appear:<br><br>' +
      `<img src="${jsPsych.extensions.Neurocog.getStimulus('no_reward.png')}" alt="Empty Circle" style="width: 60px; height: 60px;"><br><br>` +
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
      commonTransition: true, // Fixed common transitions
      rewardLikelihoods: [probData?.alien1 || 0.5, probData?.alien2 || 0.5, probData?.alien3 || 0.5, probData?.alien4 || 0.5],
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

  // Generate array of transition behaviors to ensure ordering of `rewardLikelihoods` is preserved
  const numCommonTransitionsTrainingTrials = Math.round(config.commonTransitionLikelihood * config.trainingTrials.full);
  const numRareTransitionsTrainingTrials = config.trainingTrials.full - numCommonTransitionsTrainingTrials;
  let trainingTrialsTransitions = new Array(numCommonTransitionsTrainingTrials).fill(true); // Create with common trials
  trainingTrialsTransitions.push(...new Array(numRareTransitionsTrainingTrials).fill(false)); // Append rare trials
  trainingTrialsTransitions = _.shuffle(trainingTrialsTransitions);
  
  for (let i = 0; i < config.trainingTrials.full; i++) {
    const probData = tutorialTrialProbabilities[i % tutorialTrialProbabilities.length];
    timeline.push({
      type: ChoicePlugin,
      trialLayout: 'training-full',
      leftKey: config.controls.left,
      rightKey: config.controls.right,
      commonTransition: trainingTrialsTransitions[i], // Use value from shuffled `trainingTrialsTransitions` array
      rewardLikelihoods: [probData?.alien1 || 0.5, probData?.alien2 || 0.5, probData?.alien3 || 0.5, probData?.alien4 || 0.5],
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
    feedback: 'Rockets may sometimes fly to the planet you don\'t expect.',
    extensions: [{
      type: NeurocogExtension,
    }],
  });

  timeline.push({
    type: ComprehensionPlugin,
    question: {
      prompt: 'If an alien shares a space resource in this mission, then they will probably have resources to share in the next few missions.',
      correct: 'true'
    },
    preamble: 'Please answer the following question:',
    button_label: 'Continue',
    feedback: 'The amount of resources an alien can share will change slowly over multiple missions.',
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
    feedback: 'You will have 3 seconds to make each choice.',
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
    // Generate array of transition behaviors to ensure ordering of `rewardLikelihoods` is preserved
    const numCommonTransitionsMainTrials = Math.round(config.mainTrials.blockSize * config.commonTransitionLikelihood);
    const numRareTransitionsMainTrials = config.mainTrials.blockSize - numCommonTransitionsMainTrials;
    let mainTrialsTransitions = new Array(numCommonTransitionsMainTrials).fill(true); // Create with common trials
    mainTrialsTransitions.push(...new Array(numRareTransitionsMainTrials).fill(false)); // Append rare trials
    mainTrialsTransitions = _.shuffle(mainTrialsTransitions);
    
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
        commonTransition: mainTrialsTransitions[j], // Use value from shuffled `trainingTrialsTransitions` array
        rewardLikelihoods: [probData?.alien1 || 0.5, probData?.alien2 || 0.5, probData?.alien3 || 0.5, probData?.alien4 || 0.5],
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

/**
 * Validate the generated experiment timeline, checking the length and the distribution of various probabilities
 * @param timeline Generated experiment timeline
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateTimeline = (timeline: any[]) => {
  const expectedTrainingTrialsLength =
    config.trainingTrials.rocket +
    config.trainingTrials.alien +
    config.trainingTrials.full +
    (config.mainTrials.blockCount * config.mainTrials.blockSize);
  
  // Filter the timeline to only the `ChoicePlugin` trials
  let filteredTimeline = timeline.filter((trial) => trial.type === ChoicePlugin);
  if (filteredTimeline.length !== expectedTrainingTrialsLength) {
    logger.warn(`Timeline is not the expected length of ${expectedTrainingTrialsLength}! Actual: ${filteredTimeline.length}`);
  } else {
    logger.success(`Timeline is expected length: ${expectedTrainingTrialsLength} trials`);
  }
  
  // Filter the timeline to only `full` `TrialLayout` to check transition probabilities
  filteredTimeline = filteredTimeline.filter((trial) => trial.trialLayout === "full" && trial.commonTransition === true);
  const expectedCommonTransitionMainTrials = Math.round(config.mainTrials.blockCount * config.mainTrials.blockSize * config.commonTransitionLikelihood);
  if (filteredTimeline.length !== expectedCommonTransitionMainTrials) {
    logger.warn(`Timeline does not include expected number of common transition trials (${expectedCommonTransitionMainTrials})! Actual: ${filteredTimeline.length}`);
  } else {
    logger.success(`Timeline includes expected number of common transition trials: ${expectedCommonTransitionMainTrials} trials`);
  }
};

// Generate a unique identifier for this experiment run
const experimentID = `${config.studyName}-${uuidv4()}`;
jsPsych.extensions.Neurocog.setState("experimentID", experimentID);
initializeLocalStorage(experimentID);

// Create and validate the experiment timeline
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const timeline: any[] = createTimeline();
validateTimeline(timeline);

// Start the experiment
jsPsych.run(timeline);

/**
 * Configure the experiment and create the timeline
 */
// Logging library
import consola from 'consola';

// Wrapper library
import {Experiment} from 'jspsych-wrapper';

// Experiment variables
import {
  blockLength,
  timeChoice,
  blockCount,
  rocketSides,
  practiceGameCount,
  practiceGameIdx,
  practiceRocketSides,
  keyLeft,
  keyRight,
  redPlanetFirstRocket,
  displayOrderRed,
  displayOrderGreen,
  displayOrderYellow,
  displayOrderPurple,
  probability,
  practicePressingNum,
  practicePressingIdx,
  practiceRewardNum,
  practiceRewardIdx,
  payoffReward,
  practiceStochasticNum,
  practiceStochasticIdx,
  payoffInstructions,
} from './lib/variables';

// Import the instructions
import {
  firstBreak,
  instructions,
  secondBreak,
  thirdBreak,
} from './lib/instructions';

// Configuration
import {configuration} from './configuration';

// General jsPsych imports
import 'jspsych';
import 'jspsych/plugins/jspsych-preload';
import 'jspsych-attention-check';

// Import all our plugins
import './lib/plugins/two-step-choice';
import './lib/plugins/two-step-instructions';
import './lib/plugins/two-step-fixation';

// Import the data
import practiceProbabilityData from './data/masterprobtut.csv';
import probabilityData from './data/masterprob4.csv';

// Styling
import './css/styles.css';

// Instantiate the Experiment wrapper class
export const experiment = new Experiment(configuration);

consola.info(`Experiment loaded, continuing...`);

// Instantiate the timeline variables for the main trials
const timelineVariables = [];
let trialRow = 0;

// Reward and no reward stimuli
const rewardString = experiment.getStimuli().getImage('t.png');
const nullString = experiment.getStimuli().getImage('nothing.png');

// Set the rocket configuration in the main trials
for (let j = 0; j < blockCount; j++) {
  timelineVariables.push([]);
  for (let i = 0; i < blockLength; i++) {
    // Randomize sides of rockets for each subject
    if (rocketSides) {
      timelineVariables[j].push({
        rightStimulus: 'rocket2',
        leftStimulus: 'rocket1',
        trialRow: trialRow,
        trialNumber: i + 1,
      });
    } else {
      timelineVariables[j].push({
        rightStimulus: 'rocket1',
        leftStimulus: 'rocket2',
        trialRow: trialRow,
        trialNumber: i + 1,
      });
    }
    trialRow++;
  };
};

// Instantiate the timeline variables for the practice trials
const practiceTimelineVariables = [];
trialRow = 0;

// Set the rocket configuration in the practice trials
for (let i = 0; i < practiceGameCount; i++) {
  // Randomize sides of rockets for each subject
  if (practiceRocketSides) {
    practiceTimelineVariables.push({
      rightStimulus: 'tutrocket2',
      leftStimulus: 'tutrocket1',
      trialRow: trialRow,
      trialNumber: i + 1,
    });
  } else {
    practiceTimelineVariables.push({
      rightStimulus: 'tutrocket1',
      leftStimulus: 'tutrocket2',
      trialRow: trialRow,
      trialNumber: i + 1,
    });
  }
  trialRow++;
};

let currStageTwo = [];

/**
 * createBlock function
 * @param {any} variables variables
 * @param {any} probabilityData probability data related to the
 * trials of the block
 * @param {Boolean} isPractice whether or not the block of trials
 * are practice trials
 * @return {any} three-stage grouping, including first decision,
 * second decision, and fixation cross
 */
const createBlock = (variables, probabilityData, isPractice) => {
  // Create the generic experimental procedure for a single trial.
  // Consists of the first and second choices.
  const procedure = {
    timeline: [
      {
        // Instantiate the first choice
        type: 'two-step-choice',
        trialStage: '1',
        choices: [keyLeft, keyRight],
        planetStimulus: experiment.getStimuli().getImage('earth.png'),
        rightStimulus: jsPsych.timelineVariable('rightStimulus'),
        leftStimulus: jsPsych.timelineVariable('leftStimulus'),
        trialNumber: jsPsych.timelineVariable('trialNumber'),

        // Specify if this is a practice trial or not
        isPractice: isPractice,

        // Define the 'on_start' callback
        on_start: function() {
          currStageTwo = [];
        },

        // Define the 'on_start' callback
        on_finish: function(data) {
          // Specify the choice made in the data
          if (data.key_press == keyLeft) {
            data.choice = 1;
          };
          if (data.key_press == keyRight) {
            data.choice = 2;
          };

          // Calcuate the transition and then the second location
          currStageTwo = calculateTransition(data.chosenStimulus, isPractice);
          if (currStageTwo == null) {
            currStageTwo = [
              data.rightStimulus,
              data.leftStimulus,
              experiment.getStimuli().getImage('earth.png'),
              null,
            ];
          }
        },

        // Specify a trial duration
        responseWindow: timeChoice,
      },
      {
        // Instantiate the second choice
        type: 'two-step-choice',
        trialStage: '2',
        choices: [keyLeft, keyRight],
        trialNumber: jsPsych.timelineVariable('trialNumber'),

        // Specify if this is a practice trial or not
        isPractice: isPractice,

        // Specify the trial data
        trialRow: () => {
          return probabilityData[jsPsych.timelineVariable('trialRow', true)];
        },

        // Specify the second planet
        planetStimulus: () => {
          return currStageTwo[2];
        },

        // Specify the left alien?
        rightStimulus: () => {
          return currStageTwo[0];
        },

        // Specify the right alien?
        leftStimulus: () => {
          return currStageTwo[1];
        },

        // Specify the reward outcome
        centerStimulus: () => {
          return currStageTwo[3];
        },

        // Specify the transition type
        transitionType: () => {
          return currStageTwo[4];
        },

        // Specify a trial duration
        responseWindow: () => {
          if (currStageTwo[3] == null) {
            return 0;
          } else {
            return timeChoice;
          }
        },

        // Define the 'on_finish' callback
        on_finish: (data) => {
          if (data.rewardStimulus === rewardString) {
            if (isPractice === false) {
              experiment.setGlobalStateValue(
                  'realReward',
                  experiment.getGlobalStateValue('realReward') + 1,
              );
            } else {
              experiment.setGlobalStateValue(
                  'practiceReward',
                  experiment.getGlobalStateValue('practiceReward') + 1,
              );
            }
          }

          // Specify the choice made in the data
          if (data.key_press == keyLeft) {
            data.choice = 1;
          }
          if (data.key_press == keyRight) {
            data.choice = 2;
          }

          // Specify the transition type in the data
          if (data.transitionType == true) {
            data.transition = 'common';
          }
          if (data.transitionType == false) {
            data.transition = 'rare';
          }

          // Specify the reward outcome in the data
          if (data.rewardStimulus ==
              experiment.getStimuli().getImage('t.png')) {
            data.wasRewarded = true;
          } else {
            data.wasRewarded = false;
          }

          // Store the timestamp
          const timestamp = (new Date).toISOString()
              .replace(/z|t/gi, ' ')
              .trim();
          jsPsych.data.addDataToLastTrial({timestamp});
        },
      },
      {
        // Instantiate the fixation stage
        type: 'two-step-fixation',
        stimulus: experiment.getStimuli().getImage('earth.png'),
        text: '+',
        responseWindow: 1000,
        trialNumber: jsPsych.timelineVariable('trialNumber'),
      },
    ],

    // Specify the timeline variables
    timeline_variables: variables,
  };

  return procedure;
};

/**
 * calculateTransition function
 * @param {string} chosenString chosenString
 * @param {Boolean} practice practice
 * @return {any}
 */
const calculateTransition = (chosenString, practice) => {
  let firstPlanet = '';
  let secondPlanet = '';

  if (chosenString == '' || typeof chosenString === 'undefined') {
    return null;
  } else {
    if (practice == true) {
      firstPlanet = 'green';
      secondPlanet = 'yellow';
    } else {
      firstPlanet = 'red';
      secondPlanet = 'purple';
    }
    const firstShipChosen = (chosenString.slice(-1) == 1);
    const goodTransition = (Math.random() < probability);

    // Determine the resulting planet
    let planet = '';
    if (firstShipChosen && redPlanetFirstRocket) {
      if (goodTransition) {
        planet = firstPlanet;
      } else {
        planet = secondPlanet;
      }
    } else if (~firstShipChosen && redPlanetFirstRocket) {
      if (goodTransition) {
        planet = secondPlanet;
      } else {
        planet = firstPlanet;
      }
    } else if (firstShipChosen && ~redPlanetFirstRocket) {
      if (goodTransition) {
        planet = secondPlanet;
      } else {
        planet = firstPlanet;
      }
    } else if (~firstShipChosen && ~redPlanetFirstRocket) {
      if (goodTransition) {
        planet = firstPlanet;
      } else {
        planet = secondPlanet;
      }
    }

    let displayOrder = (1);
    if (planet === 'red') {
      if (calculateTransition==false) {
        displayOrder = displayOrderRed;
      }

      if (displayOrder) {
        return [
          'alien2',
          'alien1',
          experiment.getStimuli().getImage('redplanet1.png'),
          chosenString,
          goodTransition,
        ];
      } else {
        return [
          'alien1',
          'alien2',
          experiment.getStimuli().getImage('redplanet1.png'),
          chosenString,
          goodTransition,
        ];
      }
    } else if (planet === 'purple') {
      if (calculateTransition==false) {
        displayOrder = displayOrderPurple;
      }

      if (displayOrder) {
        return [
          'alien4',
          'alien3',
          experiment.getStimuli().getImage('purpleplanet.png'),
          chosenString,
          goodTransition,
        ];
      } else {
        return [
          'alien3',
          'alien4',
          experiment.getStimuli().getImage('purpleplanet.png'),
          chosenString,
          goodTransition,
        ];
      }
    } else if (planet === 'green') {
      if (calculateTransition==false) {
        displayOrder = displayOrderGreen;
      }

      if (displayOrder) {
        return [
          'tutalien2',
          'tutalien1',
          experiment.getStimuli().getImage('tutgreenplanet.png'),
          chosenString,
          goodTransition,
        ];
      } else {
        return [
          'tutalien1',
          'tutalien2',
          experiment.getStimuli().getImage('tutgreenplanet.png'),
          chosenString,
          goodTransition,
        ];
      }
    } else if (planet === 'yellow') {
      if (calculateTransition==false) {
        displayOrder = displayOrderYellow;
      }

      if (displayOrder) {
        return [
          'tutalien4',
          'tutalien3',
          experiment.getStimuli().getImage('tutyellowplanet.png'),
          chosenString,
          goodTransition,
        ];
      } else {
        return [
          'tutalien3',
          'tutalien4',
          experiment.getStimuli().getImage('tutyellowplanet.png'),
          chosenString,
          goodTransition,
        ];
      }
    } else {
      consola.error('Error in transition calculation!');
      return null;
    }
  }
};

// Setup the experiment timeline
let expTimeline = [];

// Prepare the resource collections
const imagesLeft = [];
const imagesRight = [];
const imagesCenter = [];
const imagesReward = [];
const filesAudio = [];
const imagesButton = [];

// Instantiate the resource collections that accompany each
// page of instructions
let currentInstructions;
for (let i = 0; i < instructions.length; i += 1) {
  currentInstructions = instructions[i];
  imagesLeft[i] = [];
  imagesRight[i] = [];
  imagesReward[i] = [];
  imagesCenter[i] = [];
  filesAudio[i] = [];
  imagesButton[i] = [];
  for (let j = 0; j < currentInstructions.length; j += 1) {
    imagesLeft[i][j] = null;
    imagesRight[i][j] = null;
    imagesCenter[i][j] = null;
    imagesReward[i][j] = null;
    imagesButton[i][j] =
        experiment.getStimuli().getImage('button.jpeg');
  }
}

// Reward and no reward images
imagesReward[3][0] = rewardString;
imagesReward[3][1] = nullString;

// Center images
imagesCenter[4][0] =
    experiment.getStimuli().getImage('tutalien3_norm.png');
imagesCenter[4][1] =
    experiment.getStimuli().getImage('tutalien3_norm.png');
imagesCenter[9][0] =
    experiment.getStimuli().getImage('tutalien2_norm.png');

// Rockets
imagesRight[1][0] =
    experiment.getStimuli().getImage('tutrocket1_norm.png');
imagesLeft[1][0] =
    experiment.getStimuli().getImage('tutrocket2_norm.png');

// Aliens, both sides
imagesRight[2][0] =
    experiment.getStimuli().getImage('tutalien1_norm.png');
imagesLeft[2][0] =
    experiment.getStimuli().getImage('tutalien2_norm.png');
imagesRight[2][1] =
    experiment.getStimuli().getImage('tutalien1_norm.png');
imagesLeft[2][1] =
    experiment.getStimuli().getImage('tutalien2_norm.png');
imagesRight[2][2] =
    experiment.getStimuli().getImage('tutalien1_norm.png');
imagesLeft[2][2] =
    experiment.getStimuli().getImage('tutalien2_norm.png');

// Aliens, right side
imagesRight[6][0] =
    experiment.getStimuli().getImage('tutalien1_norm.png');
imagesRight[7][0] =
    experiment.getStimuli().getImage('tutalien2_norm.png');

// Aliens, left side
imagesLeft[6][0] =
    experiment.getStimuli().getImage('tutalien2_norm.png');
imagesLeft[7][0] =
    experiment.getStimuli().getImage('tutalien1_norm.png');

// Rockets, right side
imagesRight[13][0] =
    experiment.getStimuli().getImage('tutrocket1_norm.png');
imagesRight[13][1] =
    experiment.getStimuli().getImage('tutrocket1_norm.png');
imagesRight[14][0] =
    experiment.getStimuli().getImage('tutrocket1_norm.png');
imagesRight[14][1] =
    experiment.getStimuli().getImage('tutrocket1_norm.png');
imagesRight[14][2] =
    experiment.getStimuli().getImage('tutrocket1_norm.png');
imagesRight[14][3] =
    experiment.getStimuli().getImage('tutrocket1_sp.png');
imagesRight[14][4] =
    experiment.getStimuli().getImage('tutrocket1_norm.png');
imagesRight[14][5] =
    experiment.getStimuli().getImage('tutrocket1_norm.png');

// Rockets, left side
imagesLeft[13][0] =
    experiment.getStimuli().getImage('tutrocket2_norm.png');
imagesLeft[13][1] =
    experiment.getStimuli().getImage('tutrocket2_norm.png');
imagesLeft[14][0] =
    experiment.getStimuli().getImage('tutrocket2_norm.png');
imagesLeft[14][1] =
    experiment.getStimuli().getImage('tutrocket2_norm.png');
imagesLeft[14][2] =
    experiment.getStimuli().getImage('tutrocket2_norm.png');
imagesLeft[14][3] =
    experiment.getStimuli().getImage('tutrocket2_sp.png');
imagesLeft[14][4] =
    experiment.getStimuli().getImage('tutrocket2_norm.png');
imagesLeft[14][5] =
    experiment.getStimuli().getImage('tutrocket2_norm.png');

// Backgrounds used throughout the instructions
const instructionsBackgrounds = [
  experiment.getStimuli().getImage('blackbackground.jpg'),
  experiment.getStimuli().getImage('earth.png'),
  experiment.getStimuli().getImage('tutgreenplanet.png'),
  experiment.getStimuli().getImage('blackbackground.jpg'),
  experiment.getStimuli().getImage('tutyellowplanet.png'),
  experiment.getStimuli().getImage('blackbackground.jpg'),
  experiment.getStimuli().getImage('tutgreenplanet.png'),
  experiment.getStimuli().getImage('tutgreenplanet.png'),
  experiment.getStimuli().getImage('blackbackground.jpg'),
  experiment.getStimuli().getImage('blackbackground.jpg'),
  experiment.getStimuli().getImage('earth.png'),
  experiment.getStimuli().getImage('tutgreenplanet.png'),
  experiment.getStimuli().getImage('tutyellowplanet.png'),
  experiment.getStimuli().getImage('earth.png'),
  experiment.getStimuli().getImage('earth.png'),
  experiment.getStimuli().getImage('blackbackground.jpg'),
];

let t;
let currentPage;
let currentSide;

/**
 * Utility function to assemble instructions, combining text and images
 * @param {string} image stimulus
 * @param {string[]} prompts main prompt used
 * @param {string[]} rightText right stimulus
 * @param {string[]} leftText left stimulus
 * @param {string[]} centerText center stimulus
 * @param {string[]} rewardText reward stimlus
 * @return {any[]}
 */
const createInstructions = (
    image, prompts, rightText,
    leftText, centerText, rewardText,
)=> {
  // Instantitate and create the pages of the instructions
  const instructionPages = [];
  for (t = 0; t < prompts.length; t += 1) {
    // Collate the specifict texts and images
    // for the instruction page
    currentPage = {
      type: 'two-step-instructions',
      stimulus: image,
      rightStimulus: rightText[t],
      leftStimulus: leftText[t],
      centerStimulus: centerText[t],
      rewardString: rewardText[t],
      choices: [' '],
      prompt: prompts[t],
    };
    instructionPages.push(currentPage);
  }

  return instructionPages;
};

// Create all instruction pages
currentInstructions = [];

for (let i = 0; i < instructions.length; i++) {
  currentInstructions = currentInstructions.concat(
      createInstructions(
          instructionsBackgrounds[i],
          instructions[i],
          imagesRight[i],
          imagesLeft[i],
          imagesCenter[i],
          imagesReward[i],
          imagesButton[i],
      ),
  );
}

// Create practice trials for selecting between aliens
for (let i = 0; i < practicePressingNum - 1; i++) {
  currentInstructions.splice(practicePressingIdx, 0, {
    type: 'two-step-choice',
    timeout: false,
    choices: [keyLeft, keyRight],
    planetStimulus:
      experiment.getStimuli().getImage('tutgreenplanet.png'),
    rightStimulus: 'tutalien1',
    leftStimulus: 'tutalien2',
    prompt: ['Now try another one!'],
    responseWindow: timeChoice,
    isPractice: true,
    trialNumber: practicePressingNum - i,
  });
}

currentInstructions.splice(practicePressingIdx, 0, {
  type: 'two-step-choice',
  timeout: false,
  choices: [keyLeft, keyRight],
  planetStimulus: experiment.getStimuli().getImage('tutgreenplanet.png'),
  rightStimulus: 'tutalien1',
  leftStimulus: 'tutalien2',
  responseWindow: timeChoice,
  isPractice: true,
  trialNumber: 1,
});

// Create practice trials to select a single alien and view reward outcome
for (let i = 0; i < practiceRewardNum; i++) {
  currentInstructions.splice(practiceRewardIdx, 0, {
    type: 'two-step-choice',
    timeout: false,
    trialRow: payoffReward,
    choices: [keyLeft, keyRight],
    planetStimulus:
      experiment.getStimuli().getImage('tutyellowplanet.png'),
    trialNumber: practiceRewardNum - i,

    // Right alien image
    rightStimulus: () => {
      if (currentSide === true) {
        return 'tutalien3';
      }
      return null;
    },

    // Left alien image
    leftStimulus: () => {
      if (currentSide === true) {
        return null;
      }
      return 'tutalien3';
    },
    responseWindow: timeChoice,
    isPractice: true,
  });
}

// Create practice trials for selecting between aliens
for (let i = 0; i < practiceStochasticNum; i += 1) {
  currentInstructions.splice(practiceStochasticIdx, 0, {
    type: 'two-step-choice',
    timeout: false,
    trialRow: payoffInstructions,
    choices: [keyLeft, keyRight],
    planetStimulus:
      experiment.getStimuli().getImage('tutgreenplanet.png'),
    rightStimulus: 'tutalien1',
    leftStimulus: 'tutalien2',
    responseWindow: timeChoice,
    isPractice: true,
    trialNumber: practiceStochasticNum - i,
  });
}

// Insert practice trials into instructions
currentInstructions.splice(practiceGameIdx, 0,
    createBlock(practiceTimelineVariables, practiceProbabilityData, true));

// Insert the three quizzes before the last element in `currentInstructions`
// Question 1
currentInstructions.splice(currentInstructions.length - 1, 0, {
  type: 'attention-check',
  question: 'True or False: Each spaceship always flies to the same planet.',
  options: [
    'True',
    'False',
  ],
  options_radio: true,
  option_correct: 1,
  confirmation: true,
  feedback_correct: 'Correct!',
  feedback_incorrect:
      'Incorrect. Spaceships may sometimes fly ' +
      'to the planet you don\'t expect.',
});

// Question 2
currentInstructions.splice(currentInstructions.length - 1, 0, {
  type: 'attention-check',
  question:
    'True or False: If an alien has a lot of treasure to share now, ' +
    'then they will probably have a lot of treasure to share in the ' +
    'near future.',
  options: [
    'True',
    'False',
  ],
  options_radio: true,
  option_correct: 0,
  confirmation: true,
  feedback_correct: 'Correct!',
  feedback_incorrect:
      'Incorrect. Some aliens have more treasure than others.',
});

// Question 3
currentInstructions.splice(currentInstructions.length - 1, 0, {
  type: 'attention-check',
  question:
    'True or False: You will have as much time as ' +
    'you want to make each choice.',
  options: [
    'True',
    'False',
  ],
  options_radio: true,
  option_correct: 1,
  confirmation: true,
  feedback_correct: 'Correct!',
  feedback_incorrect:
      'Incorrect. You have a few seconds to make each choice.',
});

// Remove the instructions about the alien locations
currentInstructions.splice(27, 2);

// Instantiate the experiment timeline with the instructions and
// practice trials
expTimeline = currentInstructions;

// Create the remaining blocks of the timeline
// Main block 1
expTimeline.push(createBlock(timelineVariables[0], probabilityData, false));

// Insert break 1
expTimeline.push(createInstructions(
    experiment.getStimuli().getImage('blackbackground.jpg'),
    firstBreak,
    [], [], [], [],
)[0]);

// Main block 2
expTimeline.push(createBlock(timelineVariables[1], probabilityData, false));

// Insert break 2
expTimeline.push(createInstructions(
    experiment.getStimuli().getImage('blackbackground.jpg'),
    secondBreak,
    [], [], [], [],
)[0]);

// Main block 3
expTimeline.push(createBlock(timelineVariables[2], probabilityData, false));

// Insert break 3
expTimeline.push(createInstructions(
    experiment.getStimuli().getImage('blackbackground.jpg'),
    thirdBreak,
    [], [], [], [],
)[0]);

// Main block 4
expTimeline.push(createBlock(timelineVariables[3], probabilityData, false));

// Finish
expTimeline.push(createInstructions(
    experiment.getStimuli().getImage('blackbackground.jpg'),
    [
      [
        'You\'re finished with this part of the experiment!',
        'Click the red button to answer a final question.',
      ],
    ],
    [], [], [], [],
)[0]);

// Question about the rockets
expTimeline.push({
  type: 'two-step-choice',
  trialStage: '1',
  choices: [keyLeft, keyRight],
  planetStimulus:
    experiment.getStimuli().getImage('earth.png'),
  rightStimulus: rocketSides === true ? 'rocket1' : 'rocket2',
  leftStimulus: rocketSides === true ? 'rocket2' : 'rocket1',
  isPractice: false,
  prompt: [
    'Select the rocket you think went to the red planet most frequently.',
  ],
  on_finish: (data) => {
    // Store the keypresses
    if (data.key_press === keyLeft) {
      data.choice = 1;
    };
    if (data.key_press === keyRight) {
      data.choice = 2;
    };
    consola.info('data', data);
  },
  trialNumber: 0,
});

// Finish
expTimeline.push(createInstructions(
    experiment.getStimuli().getImage('blackbackground.jpg'),
    [
      [
        'Thank you for participating in this research!',
        'Click the red button to be redirected.',
      ],
    ],
    [], [], [], [],
)[0]);

// Start the experiment
experiment.start({
  timeline: expTimeline,
});

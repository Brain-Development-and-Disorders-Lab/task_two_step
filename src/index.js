// Logging library
import consola, {LogLevel} from 'consola';

// Wrapper library
import {Experiment} from 'jspsych-wrapper';

// Experiment variables
import {
  blockLength,
  timeChoice,
  blockCount,
  rocketSides,
  practiceGameNum,
  practiceGameIdx,
  pracRocketSides,
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
import {instructions} from './lib/text';

// Configuration
import {configuration} from './configuration';

// General jsPsych imports
import 'jspsych';
import 'jspsych/plugins/jspsych-preload';

// Import all our plugins
import './lib/plugins/two-step-choice';
import './lib/plugins/two-step-instructions';
import './lib/plugins/two-step-fixation';

// Import the data
import practiceProbData from './data/masterprobtut.csv';
import probData from './data/masterprob4.csv';

// Styling
import './css/styles.css';

export const experiment = new Experiment({
  name: 'Two-step game',
  studyName: 'task_twostep',
  manipulations: {},
  stimuli: configuration.stimuli,
  seed: '',
  allowParticipantContact: false,
  contact: 'henry.burgess@wustl.edu',
  logging: LogLevel.Warn,
  state: {
    practiceReward: 0,
    realReward: 0,
  },
});

experiment.load().then(() => {
  consola.info(`Experiment loaded, continuing...`);

  const timelineVar = [];
  let trial = 0;

  // Reward and no reward stimuli
  const rewardString = experiment.getStimuli().getImage('t.png');
  const nullString = experiment.getStimuli().getImage('nothing.png');

  // Add experiment blocks to timeline
  for (let j = 0; j < blockCount; j++) {
    timelineVar.push([]); // push block to timeline
    for (let i = 0; i < blockLength; i++) {
      // Randomize sides of rockets for each subject
      if (rocketSides) {
        timelineVar[j].push({
          right_text: 'rocket2',
          left_text: 'rocket1',
          trial: trial,
        });
      } else {
        timelineVar[j].push({
          right_text: 'rocket1',
          left_text: 'rocket2',
          trial: trial,
        });
      }
      trial = trial+1;
    };
  };

  const practiceTimelineVar = [];
  trial = 0;

  for (let i = 0; i < practiceGameNum; i++) {
    if (pracRocketSides) {
      // Randomize sides of rockets for each subject
      practiceTimelineVar.push({
        right_text: 'tutrocket2',
        left_text: 'tutrocket1',
        trial: trial,
      });
    } else {
      practiceTimelineVar.push({
        right_text: 'tutrocket1',
        left_text: 'tutrocket2',
        trial: trial,
      });
    }
    trial = trial + 1;
  };

  let currStageTwo = [];

  /**
   * createBlock function
   * @param {any} currVariables variables
   * @param {any} currProbData probability data related to the
   * trials of the block
   * @param {boolean} practice whether or not the block of trials
   * are practice trials
   * @return {any} ?
   */
  const createBlock = (currVariables, currProbData, practice) => {
    const expProcedure = {
      timeline: [
        { // define stage 1 choice
          type: 'two-step-choice',
          trial_stage: '1',
          choices: [keyLeft, keyRight],
          planet_text: experiment.getStimuli().getImage('earth.jpg'),
          right_text: jsPsych.timelineVariable('right_text'), // right rocket
          left_text: jsPsych.timelineVariable('left_text'), // left rocket
          practice_trial: function() {
            if (practice === false) {
              return 'real';
            }
          },
          on_start: function() {
            currStageTwo = [];
          },
          on_finish: function(data) {
            if (data.key_press == keyLeft) {
              data.choice = 1;
            };
            if (data.key_press == keyRight) {
              data.choice = 2;
            };
            currStageTwo = calculateTransition(data.chosenText, practice);
            if (currStageTwo == null) {
              currStageTwo = [
                data.right_text,
                data.left_text,
                experiment.getStimuli().getImage('earth.jpg'),
                null,
              ];
            }
          },
          trial_duration: timeChoice,
        },
        // define stage 2 choice
        {
          type: 'two-step-choice',
          trial_stage: '2',
          choices: [keyLeft, keyRight],
          practice_trial: () => {
            if (practice === false) {
              return 'real';
            }
          },
          trialRow: () => {
            return currProbData[jsPsych.timelineVariable('trial', true)];
          },
          planet_text: () => {
            return currStageTwo[2]; // stage 2 planet
          },
          right_text: () => {
            return currStageTwo[0]; // left alien
          },
          left_text: () => {
            return currStageTwo[1]; // right alien
          },
          center_text: () => {
            return currStageTwo[3]; // reward outcome
          },
          transition_type: () => {
            return currStageTwo[4]; // transition type
          },
          trial_duration: () => {
            if (currStageTwo[3] == null) {
              return 0;
            } else {
              return timeChoice;
            }
          },
          on_finish: (data) => {
            if (data.reward_text === rewardString) {
              if (practice === false) {
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
            if (data.key_press == keyLeft) {
              data.choice = 1;
            }
            if (data.key_press == keyRight) {
              data.choice = 2;
            }
            if (data.transition_type == true) {
              data.transition = 'common';
            }
            if (data.transition_type == false) {
              data.transition = 'rare';
            }
            if (data.reward_text ==
                experiment.getStimuli().getImage('t.png')) {
              data.reward = 1;
            } else {
              data.reward = 0;
            }
            const timestamp = (new Date).toISOString()
                .replace(/z|t/gi, ' ')
                .trim();
            jsPsych.data.addDataToLastTrial({timestamp});
          },
        },
        { // ITI
          type: 'two-step-fixation',
          stimulus: experiment.getStimuli().getImage('earth.jpg'),
          text: '+',
          trial_duration: 1000, // ITI duration
        },
      ],
      timeline_variables: currVariables,
    };
    return expProcedure;
  };

  // Break trials removed from here

  /**
   * calculateTransition function
   * @param {string} chosenString chosenString
   * @param {boolean} practice practice
   * @return {any}
   */
  const calculateTransition = (chosenString, practice) => {
    let firstPlanet = '';
    let secondPlanet = '';

    if (chosenString == '') {
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
            experiment.getStimuli().getImage('redplanet1.jpg'),
            chosenString,
            goodTransition,
          ];
        } else {
          return [
            'alien1',
            'alien2',
            experiment.getStimuli().getImage('redplanet1.jpg'),
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
            experiment.getStimuli().getImage('purpleplanet.jpg'),
            chosenString,
            goodTransition,
          ];
        } else {
          return [
            'alien3',
            'alien4',
            experiment.getStimuli().getImage('purpleplanet.jpg'),
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
            experiment.getStimuli().getImage('tutgreenplanet.jpg'),
            chosenString,
            goodTransition,
          ];
        } else {
          return [
            'tutalien1',
            'tutalien2',
            experiment.getStimuli().getImage('tutgreenplanet.jpg'),
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
            experiment.getStimuli().getImage('tutyellowplanet.jpg'),
            chosenString,
            goodTransition,
          ];
        } else {
          return [
            'tutalien3',
            'tutalien4',
            experiment.getStimuli().getImage('tutyellowplanet.jpg'),
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

  // initialize experiment timeline
  let expTimeline = [];

  const imagesLeft = [];
  const imagesRight = [];
  const imagesCenter = [];
  const imagesReward = [];
  const filesAudio = [];
  const imagesButton = [];

  let currInstructs;
  for (let i = 0; i < instructions.length; i += 1) {
    currInstructs = instructions[i];
    imagesLeft[i] = [];
    imagesRight[i] = [];
    imagesReward[i] = [];
    imagesCenter[i] = [];
    filesAudio[i] = [];
    imagesButton[i] = [];
    for (let j = 0; j < currInstructs.length; j += 1) {
      imagesLeft[i][j] = null;
      imagesRight[i][j] = null;
      imagesCenter[i][j] = null;
      imagesReward[i][j] = null;
      imagesButton[i][j] =
          experiment.getStimuli().getImage('button.jpeg');
    }
  }

  imagesReward[3][0] = rewardString;
  imagesReward[3][1] = nullString;

  imagesCenter[4][0] =
      experiment.getStimuli().getImage('tutalien3_norm.png');
  imagesCenter[4][1] =
      experiment.getStimuli().getImage('tutalien3_norm.png');
  imagesCenter[9][0] =
      experiment.getStimuli().getImage('tutalien2_norm.png');

  imagesRight[1][0] =
      experiment.getStimuli().getImage('tutrocket1_norm.png');
  imagesLeft[1][0] =
      experiment.getStimuli().getImage('tutrocket2_norm.png');

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

  imagesRight[6][0] =
      experiment.getStimuli().getImage('tutalien1_norm.png');
  imagesRight[7][0] =
      experiment.getStimuli().getImage('tutalien2_norm.png');

  imagesLeft[6][0] =
      experiment.getStimuli().getImage('tutalien2_norm.png');
  imagesLeft[7][0] =
      experiment.getStimuli().getImage('tutalien1_norm.png');

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

  const instructionsBackgrounds = [
    experiment.getStimuli().getImage('blackbackground.jpg'),
    experiment.getStimuli().getImage('earth.jpg'),
    experiment.getStimuli().getImage('tutgreenplanet.jpg'),
    experiment.getStimuli().getImage('blackbackground.jpg'),
    experiment.getStimuli().getImage('tutyellowplanet.jpg'),
    experiment.getStimuli().getImage('blackbackground.jpg'),
    experiment.getStimuli().getImage('tutgreenplanet.jpg'),
    experiment.getStimuli().getImage('tutgreenplanet.jpg'),
    experiment.getStimuli().getImage('blackbackground.jpg'),
    experiment.getStimuli().getImage('blackbackground.jpg'),
    experiment.getStimuli().getImage('earth.jpg'),
    experiment.getStimuli().getImage('tutgreenplanet.jpg'),
    experiment.getStimuli().getImage('tutyellowplanet.jpg'),
    experiment.getStimuli().getImage('earth.jpg'),
    experiment.getStimuli().getImage('earth.jpg'),
    experiment.getStimuli().getImage('blackbackground.jpg'),
  ];

  let t;
  let currPage;
  let currSide;

  const createInstructions = (
      image, texts, sectRightTexts,
      sectLeftTexts, sectCenterTexts, sectRewardTexts) => {
    'use strict';

    const instructionPages = [];
    for (t = 0; t < texts.length; t += 1) {
      currPage = {
        type: 'two-step-instructions',
        stimulus: image,
        right_text: sectRightTexts[t],
        left_text: sectLeftTexts[t],
        center_text: sectCenterTexts[t],
        rewardString: sectRewardTexts[t],
        choices: jsPsych.ALL_KEYS,
        prompt: texts[t],
      };
      instructionPages.push(currPage);
    }

    return instructionPages;
  };

  // Create instructions
  let currInstructions = [];
  for (let i = 0; i < instructions.length; i += 1) {
    currInstructions = currInstructions.concat(
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

  // INSERT PRACTICE
  // insert 4 selection practice trials on instructions page 5
  for (let i = 0; i < (practicePressingNum - 1); i += 1) {
    currInstructions.splice(practicePressingIdx, 0, {
      type: 'two-step-choice',
      timeout: false,
      choices: [keyLeft, keyRight],
      planet_text:
        experiment.getStimuli().getImage('tutgreenplanet.jpg'),
      right_text: 'tutalien1',
      left_text: 'tutalien2',
      prompt: ['Now try another one'],
      trial_duration: timeChoice,
    });
  }
  currInstructions.splice(practicePressingIdx, 0, {
    type: 'two-step-choice',
    timeout: false,
    choices: [keyLeft, keyRight],
    planet_text: experiment.getStimuli().getImage('tutgreenplanet.jpg'),
    right_text: 'tutalien1',
    left_text: 'tutalien2',
    trial_duration: timeChoice,
  });

  // insert 10 treasure asking practice trials
  for (let i = 0; i < practiceRewardNum; i += 1) {
    currInstructions.splice(practiceRewardIdx, 0, {
      type: 'two-step-choice',
      timeout: false,
      trialRow: payoffReward,
      choices: [keyLeft, keyRight],
      planet_text:
        experiment.getStimuli().getImage('tutyellowplanet.jpg'),
      right_text: () => {
        if (currSide === true) {
          return 'tutalien3';
        }
        return null;
      },
      left_text: () => {
        if (currSide === true) {
          return null;
        }
        return 'tutalien3';
      },
      trial_duration: timeChoice,
    });
  }

  // insert 10 asking green aliens for reward trials
  for (let i = 0; i < practiceStochasticNum; i += 1) {
    currInstructions.splice(practiceStochasticIdx, 0, {
      type: 'two-step-choice',
      timeout: false,
      trialRow: payoffInstructions,
      choices: [keyLeft, keyRight],
      planet_text:
        experiment.getStimuli().getImage('tutgreenplanet.jpg'),
      right_text: 'tutalien1',
      left_text: 'tutalien2',
      trial_duration: timeChoice,
    });
  }

  // remove the instructions about aliens on either side
  currInstructions.splice(27, 3);

  // insert practice into instrucitions
  currInstructions.splice(practiceGameIdx + 3, 0,
      createBlock(practiceTimelineVar, practiceProbData, true));

  // build experiment timeline
  expTimeline = currInstructions;

  // run trials with breaks
  expTimeline.push(createBlock(timelineVar[0], probData, false));
  expTimeline.push(createBlock(timelineVar[1], probData, false));
  expTimeline.push(createBlock(timelineVar[2], probData, false));
  expTimeline.push(createBlock(timelineVar[3], probData, false));

  experiment.start({
    timeline: expTimeline,
  });
});

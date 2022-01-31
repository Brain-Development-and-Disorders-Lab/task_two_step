/**
 * Plugin:
 * two-step-choice
 *
 * Overview:
 * Adapted from plugins by Josh de Leeuw
 *
 * The reward pictures and sizes, final prompt and most times are not inputs but
 * global variables in the experiment;
 * this could be adapted to include them as inputs if used in another experiment
 *
 * Changelog:
 * VF 08/2019
 * HB 01/2022
 */
// Logging library
import consola from 'consola';

// Wrapper instance
import {experiment} from '../..';

// d3.js imports
import {interval, select} from 'd3';

// Experiment variables
import {
  timeTransition,
  timeFlash,
  timeMoney,
} from '../variables';

// Display variables
import {
  width,
  height,
  sizeMonster,
  sizeReward,
  choiceY,
  choiceXRight,
  choiceXLeft,
  chosenX,
  chosenY,
  rewardX,
  rewardY,
  textInstructionsY,
  textX,
  textY,
  sizeFont,
} from '../display';

jsPsych.plugins['two-step-choice'] = (() => {
  const plugin = {};

  plugin.info = {
    name: 'two-step-choice',
    description: 'Two-step choice plugin.',
    parameters: {
      planet_text: {
        type: jsPsych.plugins.parameterType.STRING,
        default: undefined,
        array: false,
      },
      trial_stage: {
        type: jsPsych.plugins.parameterType.STRING,
        default: 'NA',
        array: false,
      },
      practice_trial: {
        type: jsPsych.plugins.parameterType.STRING,
        default: 'practice',
        array: false,
      },
      right_text: {
        type: jsPsych.plugins.parameterType.STRING,
        default: null,
        array: false,
      },
      left_text: {
        type: jsPsych.plugins.parameterType.STRING,
        default: null,
        array: false,
      },
      center_text: {
        type: jsPsych.plugins.parameterType.STRING,
        default: null,
        array: false,
      },
      rewardString: {
        type: jsPsych.plugins.parameterType.STRING,
        default: null,
        array: false,
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        default: null,
        array: false,
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        array: true,
        pretty_name: 'Choices',
        default: [49, 48],
        description: 'The keys the subject is allowed to ' +
            'press to respond to the stimulus.',
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show trial before it ends.',
      },
      trialRow: {
        type: jsPsych.plugins.parameterType.STRING,
        default: null,
        array: true,
      },
      timeout: {
        type: jsPsych.plugins.parameterType.BOOL,
        default: true,
        array: false,
      },
      query_trial: {
        type: jsPsych.plugins.parameterType.STRING,
        default: null,
        array: false,
      },
      transition_type: {
        type: jsPsych.plugins.parameterType.BOOL,
        default: null,
        array: false,
        description: 'Whether it was a common or rare transition.',
      },
    },
  };

  plugin.trial = (displayElement, trial) => {
    // Debugging information
    consola.debug(`Running trial:`, trial.type);

    // Reset the displayElement contents
    const html=`<div id='container' class='exp-container'></div>`;
    displayElement.innerHTML = html;

    // General plugin variables
    let movePossible = true;
    let chosenText = '';
    let unchosenText = '';
    let imageLeft = '';
    let imageCenter = '';
    let imageRight = '';
    let imageChosen = '';
    let imageUnchosen = '';

    // Render all specified elements to the view
    // SVG container
    const svg = select('div#container')
        .append('svg')
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr('viewBox', '0 0 ' + width + ' ' + height)
        .classed('svg-content', true);

    // Append the background image
    svg.append('svg:image')
        .attr('width', width)
        .attr('height', height)
        .attr('preserveAspectRatio', 'xMidYMid slice')
        .attr('xlink:href', trial.planet_text);

    // Append an image to the right side of the view
    if (trial.right_text !== null) {
      imageRight = svg.append('svg:image')
          .attr('class', 'right')
          .attr('x', choiceXRight)
          .attr('y', choiceY)
          .attr('width', sizeMonster)
          .attr('height', sizeMonster)
          .attr('xlink:href',
              experiment.getStimuli()
                  .getImage(
                      trial.right_text.replace('.png', '') + '_norm.png'));
    }

    // Append text to the left side of the view
    if (trial.left_text !== null) {
      imageLeft = svg.append('svg:image')
          .attr('x', choiceXLeft)
          .attr('y', choiceY)
          .attr('width', sizeMonster)
          .attr('height', sizeMonster)
          .attr('xlink:href',
              experiment.getStimuli()
                  .getImage(
                      trial.left_text.replace('.png', '') + '_norm.png'));
    }

    // Establish the collection of choices that are available
    let validChoices = trial.choices;
    if ((trial.left_text === null) || (trial.right_text === null)) {
      // If either left or right text fields are defined
      if ((trial.left_text === null) && (trial.right_text === null)) {
        // No valid choices
        validChoices = [];
      } else if (trial.left_text != null) {
        // Valid left choice
        validChoices = [trial.choices[0]];
      } else if (trial.right_text != null) {
        // Valid right choice
        validChoices = [trial.choices[1]];
      }
    }

    // Append text to the center of the view
    if (trial.center_text !== null) {
      imageCenter = svg.append('svg:image')
          .attr('x', chosenX)
          .attr('y', chosenY)
          .attr('width', sizeMonster)
          .attr('height', sizeMonster)
          .attr('xlink:href',
              experiment.getStimuli()
                  .getImage(
                      trial.center_text.replace('.png', '') + '_deact.png'));
    }

    if (trial.query_trial !== null) {
      svg.append('text')
          .attr('x', textX)
          .attr('y', textY)
          .style('text-anchor', 'middle')
          .style('font-size', sizeFont + 'px')
          .style('font-family', 'Open Sans')
          .style('font-weight', 'bold')
          .style('letter-spacing', '0.2')
          .style('fill', 'white')
          .text(trial.query_trial);
    }

    // Add the main prompt to the view
    if (trial.prompt !== null) {
      // Wrap text to fit inside the view
      let lineNumber = 0;
      const lineHeight = 1.1; // ems
      const dy = 0;

      for (let i = 0; i < trial.prompt.length; i++) {
        // Append a line of text
        svg.append('text')
            .attr('x', textX)
            .attr('y', textInstructionsY)
            .attr('dy', ++lineNumber * lineHeight + dy + 'em')
            .style('text-anchor', 'middle')
            .style('font-size', sizeFont + 'px')
            .style('font-family', 'Open Sans')
            .style('font-weight', 'bold')
            .style('letter-spacing', '0.2')
            .style('fill', 'white')
            .text(trial.prompt[i]);
        lineNumber++;
      }
    }

    // Configure the overall response data
    let response = {
      rt: null,
      key: null,
    };

    // Create a group of responses
    const responses = {
      rt: [],
      key: [],
    };

    // Configure parameters for the input validation
    let validPressed = 0;
    trial.reward_text = '';

    /**
     * End the 'two-step-choice' trial
     */
    const endTrial = () => {
      // Clear any existing 'setTimeout' instances
      jsPsych.pluginAPI.clearAllTimeouts();

      // Clear any existing keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      // Collate the data collected throughout the trial
      const trialData = {
        'rt': response.rt,
        'key_press': response.key,
        'duration': trial.trial_duration,
        'validPressed': validPressed,
        'rts': responses.rt,
        'keys': responses.key,
        'planet_text': trial.planet_text,
        'right_text': trial.right_text,
        'left_text': trial.left_text,
        'center_text': trial.center_text,
        'chosenText': trial.chosenText,
        'reward_text': trial.reward_text,
        'trial_stage': trial.trial_stage,
        'practice_trial': trial.practice_trial,
        'transition_type': trial.transition_type,
      };

      // Clear the contents of 'displayElement'
      displayElement.innerHTML = '';

      // Notify jsPsych and pass the trial data
      jsPsych.finishTrial(trialData);
    };

    /**
     * Handle responses by the subject
     * @param {any} info data object containing the reaction
     * time (rt) and the key code of the key pressed
     */
    const afterResponse = (info) => {
      // Record the key response
      if (response.key == null) {
        // Record the first response
        response = info;
      } else {
        // If multiple responses have been made already,
        // store them in a list
        responses.rt.push(info.rt);
        responses.key.push(info.key);
      }

      // Check the response and react accordingly
      if ((validPressed == 0) &&
        (validChoices.indexOf(info.key) > -1) && (movePossible)) {
        // If a valid key has been pressed and a transition is permitted
        consola.debug(`A valid key ('${info.key}') was pressed.`);

        // Set the 'validPressed' flag
        validPressed = 1;

        if (trial.query_trial == null) {
          // Determine what choice was made
          if (trial.choices.indexOf(info.key) == 1) {
            // Right selection
            chosenText = trial.right_text;
            unchosenText = trial.left_text;
            imageChosen = imageRight;
            imageUnchosen = imageLeft;
          } else {
            // Left selection
            chosenText = trial.left_text;
            unchosenText = trial.right_text;
            imageChosen = imageLeft;
            imageUnchosen = imageRight;
          }

          // Store the chosen option
          trial.chosenText = chosenText;

          if (trial.center_text !== null) {
            // Deactivate the choice that was not selected if there was
            // more than one option
            if (validChoices.length > 1) {
              imageUnchosen.attr('xlink:href',
                  experiment.getStimuli()
                      .getImage(
                          unchosenText.replace('.png', '') + '_deact.png'));
            }

            // Start the animation by moving the selected image to the center
            imageCenter.transition().remove().on('end', () => {
              imageChosen.attr('xlink:href', experiment.getStimuli().getImage(
                  chosenText.replace('.png', '') + '_a2.png'))
                  .transition().duration(timeTransition)
                  .attr('y', chosenY)
                  .attr('x', chosenX)
                  .on('end', () => {
                    let frames = 0;
                    let currentImage;

                    const transition = interval((elapsed) => {
                      // Update the image every two frames
                      if ((frames % 2) === 0) {
                        currentImage = chosenText + '_a1.png';
                      } else {
                        currentImage = chosenText + '_a2.png';
                      }

                      imageChosen.attr('xlink:href', experiment.getStimuli()
                          .getImage(currentImage));

                      frames++;

                      // Deactivate the image after 5 frames
                      if (frames == 5) {
                        imageChosen
                            .attr('xlink:href', experiment.getStimuli()
                                .getImage(chosenText + '_deact.png'));

                        if (trial.trialRow !== null) {
                          // Determine the reward and add the reward image
                          trial.reward_text =
                              calculateReward(chosenText, trial.trialRow);

                          // Append the reward image
                          svg.append('svg:image')
                              .attr('x', rewardX)
                              .attr('y', rewardY)
                              .attr('width', sizeReward)
                              .attr('height', sizeReward)
                              .attr('xlink:href', trial.reward_text);
                          interval((elapsed) => {}, timeMoney);
                        }

                        transition.stop();
                      }
                    }, timeFlash / 5);
                  });
            });
          } else {
            // Deactivate the choice that was not selected if there was
            // more than one option
            if (validChoices.length > 1) {
              imageUnchosen.attr('xlink:href',
                  experiment.getStimuli()
                      .getImage(
                          unchosenText.replace('.png', '') + '_deact.png'));
            }

            // Start the animation by moving the selected image to the center
            imageChosen.attr('xlink:href', experiment.getStimuli()
                .getImage(chosenText + '_a2.png'))
                .transition()
                .duration(timeTransition)
                .attr('y', chosenY)
                .attr('x', chosenX)
                .on('end', () => {
                  let frames = 0;
                  let currentImage;

                  const transition = interval((elapsed) => {
                    // Update the image every two frames
                    if ((frames % 2) === 0) {
                      currentImage = chosenText+'_a1.png';
                    } else {
                      currentImage = chosenText+'_a2.png';
                    }

                    imageChosen.attr('xlink:href', experiment.getStimuli()
                        .getImage(currentImage));

                    frames++;

                    // Deactivate the image after 5 frames
                    if (frames == 5) {
                      imageChosen.attr('xlink:href', experiment.getStimuli()
                          .getImage(chosenText+'_deact.png'));
                      if (trial.trialRow !== null) {
                        // Determine the reward and add the reward image
                        trial.reward_text =
                            calculateReward(chosenText, trial.trialRow);

                        // Append the reward image
                        svg.append('svg:image')
                            .attr('x', rewardX)
                            .attr('y', rewardY)
                            .attr('width', sizeReward)
                            .attr('height', sizeReward)
                            .attr('xlink:href', trial.reward_text);
                        interval((elapsed) => {}, timeMoney);
                      }

                      transition.stop();
                    }
                  }, timeFlash / 5);
                });
          }
        } else {
          // This only gets evaluated if 'query_trial' is 'true'
          consola.info(`'endTrial()' called.`);
          endTrial();
        }

        // Create a timeout for displaying the trial outcome
        jsPsych.pluginAPI.setTimeout(() => {
          // Cancel the keyboard listener
          jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);

          // End the trial
          endTrial();
        }, (timeFlash + timeMoney));
      }
    };

    // Create a keyboard listener, listen to all keys
    const keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
      callback_function: afterResponse,
      valid_responses: jsPsych.ALL_KEYS,
      persist: true,
      allow_held_key: false,
    });

    // If a timeout is configured and a duration is set, create a
    // timeout to end the trial if no response is recorded
    // in the specified timeframe
    if (trial.trial_duration !== null && trial.timeout == true) {
      jsPsych.pluginAPI.setTimeout(() => {
        if (response.rt == null) {
          movePossible = false;
          trial.chosenText = '';

          imageRight.transition()
              .duration(timeFlash)
              .attr('xlink:href', experiment.getStimuli()
                  .getImage(trial.right_text + '_sp.png'));
          imageLeft.attr('xlink:href', experiment.getStimuli()
              .getImage(trial.left_text.replace('.png', '') + '_sp.png'));
        }

        jsPsych.pluginAPI.setTimeout(() => {
          jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
          endTrial();
        }, (timeFlash));
      }, trial.trial_duration);
    }
  };


  /**
   * Calcuate if a reward has been obtained or not and return
   * the path to the image to display
   * @param {string} chosenString the selected option
   * @param {any} trialRow data for the trial
   * @return {string}
   */
  const calculateReward = (chosenString, trialRow) => {
    if (chosenString == '') {
      return null;
    } else {
      const alien = (chosenString.slice(-1) % 2);
      const state = +(chosenString.slice(-1) > 2);

      let reward = false;
      if (state == 0) {
        reward = (Math.random() < parseFloat(trialRow[alien]));
      } else {
        reward = (Math.random() < parseFloat(trialRow[2 + alien]));
      }

      if (reward) {
        return experiment.getStimuli().getImage('t.png');
      } else {
        return experiment.getStimuli().getImage('nothing.png');
      }
    }
  };

  return plugin;
})();

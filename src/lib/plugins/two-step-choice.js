/**
 * Adapted from plugins by Josh de Leeuw
 *
 * The reward pictures and sizes, final prompt and most times are not inputs but
 * global variables in the experiment;
 * this could be adapted to include them as inputs if used in another experiment
 *
 * VF 8/2019
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
  sizeFont,
} from '../display';

jsPsych.plugins['two-step-choice'] = (() => {
  const plugin = {};

  plugin.info = {
    name: 'two-step-choice',
    description: '',
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
    consola.debug(`Running trial:`, trial.type);

    const html=`<div id='container' class='exp-container'></div>`;
    displayElement.innerHTML = html;

    let mostPossible = true;

    let chosenText;
    let unchosenText;
    let imageLeft;
    let imageCenter;
    let imageRight;
    let imageChosen;
    let imageUnchosen;

    const svg = select('div#container')
        .append('svg')
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr('viewBox', '0 0 ' + width + ' ' + height)
        .classed('svg-content', true);

    svg.append('svg:image')
        .attr('width', width)
        .attr('height', height)
        .attr('preserveAspectRatio', 'xMidYMid slice')
        .attr('xlink:href', trial.planet_text);

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

    let validChoices = trial.choices;
    if ((trial.left_text === null) || (trial.right_text === null)) {
      if ((trial.left_text === null) && (trial.right_text === null)) {
        validChoices = [];
      } else if (trial.left_text != null) {
        validChoices = [trial.choices[0]];
      } else if (trial.right_text != null) {
        validChoices = [trial.choices[1]];
      }
    }

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
          .style('font-size', sizeFont+'px')
          .style('fill', 'white')
          .text(trial.query_trial);
    }

    // add prompt
    if (trial.prompt !== null) {
      let lineNumber = 0;
      const lineHeight = 1.1; // ems
      const dy = 0;
      for (let i = 0; i < trial.prompt.length; i++) {
        svg.append('text')
            .attr('x', textX)
            .attr('y', textInstructionsY)
            .attr('dy', ++lineNumber * lineHeight + dy + 'em')
            .style('font-size', sizeFont + 'px')
            .style('fill', 'white')
            .text(trial.prompt[i]);
        lineNumber++;
      }
    }

    // store response
    let response = {
      rt: null,
      key: null,
    };

    const responses = {
      rt: [],
      key: [],
    };

    let validPressed = 0;
    trial.reward_text = '';

    // function to end trial when it is time
    const endTrial = () => {
      // Kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // Kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      // gather the data to store for the trial
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

      // clear the display
      displayElement.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trialData);
    };

    /**
     * function to handle responses by the subject
     * @param {any} info event
     */
    const afterResponse = (info) => {
      // only record the first response
      if (response.key == null) {
        response = info;
      } else {
        responses.rt.push(info.rt);
        responses.key.push(info.key);
      }

      if ((validPressed == 0) &&
        (validChoices.indexOf(info.key) > -1) && (mostPossible)) {
        consola.debug(`A valid key ('${info.key}') was pressed.`);
        validPressed = 1;

        if (trial.query_trial == null) {
          if (trial.choices.indexOf(info.key) == 1) {
            // determine what choice was made
            chosenText = trial.right_text;
            unchosenText = trial.left_text;
            imageChosen = imageRight;
            imageUnchosen = imageLeft;
          } else {
            chosenText = trial.left_text;
            unchosenText = trial.right_text;
            imageChosen = imageLeft;
            imageUnchosen = imageRight;
          }
          trial.chosenText=chosenText; // set chosen text based on choice made
          if (trial.center_text !== null) {
            if (validChoices.length > 1) {
              // 'deactivate' the unselected choice if more than one choice
              imageUnchosen.attr('xlink:href',
                  experiment.getStimuli()
                      .getImage(
                          unchosenText.replace('.png', '') + '_deact.png'));
            }

            // start the animation by moving the selected image to the center
            imageCenter.transition().remove().on('end', () => {
              imageChosen.attr('xlink:href', experiment.getStimuli().getImage(
                  chosenText.replace('.png', '') + '_a2.png'))
                  .transition().duration(timeTransition)
                  .attr('y', chosenY)
                  .attr('x', chosenX)
                  .on('end', () => {
                    let frames = 0;
                    let currentImage;
                    const t = interval((elapsed) => {
                      if ((frames % 2) === 0) {
                        currentImage = chosenText + '_a1.png';
                      } else {
                        currentImage = chosenText + '_a2.png';
                      }
                      imageChosen.attr('xlink:href', experiment.getStimuli()
                          .getImage(currentImage));
                      frames++;
                      if (frames == 5) {
                        imageChosen
                            .attr('xlink:href', experiment.getStimuli()
                                .getImage(chosenText + '_deact.png'));
                        if (trial.trialRow !== null) {
                          // determine the reward and add the reward image
                          trial.reward_text =
                              calculateReward(chosenText, trial.trialRow);
                          svg.append('svg:image')
                              .attr('x', rewardX)
                              .attr('y', rewardY)
                              .attr('width', sizeReward)
                              .attr('height', sizeReward)
                              .attr('xlink:href', trial.reward_text);
                          interval((elapsed) => {}, timeMoney);
                        }
                        t.stop();
                      }
                    }, timeFlash / 5);
                  }); // increment 5 times
            });
          } else {
            // do the same thing, but without a center image
            if (validChoices.length > 1) {
              imageUnchosen.attr('xlink:href',
                  experiment.getStimuli()
                      .getImage(
                          unchosenText.replace('.png', '') + '_deact.png'));
            }

            imageChosen.attr('xlink:href', experiment.getStimuli()
                .getImage(chosenText + '_a2.png'))
                .transition()
                .duration(timeTransition)
                .attr('y', chosenY)
                .attr('x', chosenX)
                .on('end', () => {
                  let frames = 0;
                  let currentImage;
                  const t = interval((elapsed) => {
                    if ((frames % 2) === 0) {
                      currentImage = chosenText+'_a1.png';
                    } else {
                      currentImage = chosenText+'_a2.png';
                    }
                    imageChosen.attr('xlink:href', experiment.getStimuli()
                        .getImage(currentImage));
                    frames++;
                    if (frames == 5) {
                      imageChosen.attr('xlink:href', experiment.getStimuli()
                          .getImage(chosenText+'_deact.png'));
                      if (trial.trialRow !== null) {
                        trial.reward_text =
                            calculateReward(chosenText, trial.trialRow);
                        svg.append('svg:image')
                            .attr('x', rewardX)
                            .attr('y', rewardY)
                            .attr('width', sizeReward)
                            .attr('height', sizeReward)
                            .attr('xlink:href', trial.reward_text);
                        interval((elapsed) => {}, timeMoney);
                      }
                      t.stop();
                    }
                  }, timeFlash / 5);
                });
          }
        } else {
          // this only gets evaluated if query_trial = true
          consola.log(`'endTrial()' called.`);
          endTrial();
        }

        jsPsych.pluginAPI.setTimeout(() => {
          jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
          endTrial();
        }, (timeFlash + timeMoney));
      }
    }; // This is the end of the afterResponse function

    // start the response listener
    const keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
      callback_function: afterResponse,
      valid_responses: jsPsych.ALL_KEYS,
      persist: true,
      allow_held_key: false,
    });

    // end trial if trial_duration AND trial.timeout == true
    if (trial.trial_duration !== null && trial.timeout == true) {
      jsPsych.pluginAPI.setTimeout(() => {
        if (response.rt == null) {
          mostPossible = false;
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
   * calculateReward function
   * @param {string} chosenString
   * @param {any} trialRow
   * @return {any}
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

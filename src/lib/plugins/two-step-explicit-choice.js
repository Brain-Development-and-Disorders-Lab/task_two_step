/**
 * Adapted from plugins by Josh de Leeuw
 *
 * The reward pictures and sizes, final prompt and most times are not inputs but
 * global variables in the experiment; this could be adapted to include them
 * as inputs if used in another experiment
 *
 * KN 5/23/20
 */
import {select, interval} from 'd3';
import {experiment} from '../..';
import consola from 'consola';
import {
  width,
  height,
  chosen_x,
  chosen_y,
  choice_y,
  choice_x_left,
  choice_x_right,
  monster_size,
  box_moving_time,
  isitime,
  moneytime,
  text_start_x,
  instructions_text_start_y,
  font_size,
  reward_x,
  reward_y,
  reward_size,
} from '../variables';

jsPsych.plugins['two-step-explicit-choice'] = (() => {
  const plugin = {};

  plugin.info = {
    name: 'two-step-explicit-choice',
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
      reward_string: {
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
        default: ['1', '0'],
        description: 'The keys the subject is allowed to ' +
            'press to respond to the stimulus.',
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show trial before it ends.',
      },
      trial_row: {
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
      audio_stimulus: {
        type: jsPsych.plugins.parameterType.AUDIO,
        default: null,
        array: false,
      },
    },
  };

  plugin.trial = function(display_element, trial) {
    consola.debug(`Running trial:`, trial.type);

    const new_html = `<div id='container' class='exp-container'></div>`;
    display_element.innerHTML = new_html;

    let move_possible = true;

    const svg = select('div#container')
        .append('svg')
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr('viewBox', '0 0 ' + width + ' ' + height)
        .classed('svg-content', true);

    // Main image
    svg.append('svg:image')
        .attr('width', width)
        .attr('height', height)
        .attr('xlink:href', trial.planet_text);

    // Right image
    let right_image;
    if (trial.right_text !== null) {
      right_image = svg.append('svg:image')
          .attr('class', 'right')
          .attr('x', choice_x_right)
          .attr('y', choice_y)
          .attr('width', monster_size)
          .attr('height', monster_size)
          .attr('xlink:href', trial.right_text + '_norm.png');
    }

    // Left image
    let left_image;
    if (trial.left_text !== null) {
      left_image = svg.append('svg:image')
          .attr('x', choice_x_left)
          .attr('y', choice_y)
          .attr('width', monster_size)
          .attr('height', monster_size)
          .attr('xlink:href', trial.left_text + '_norm.png');
    }

    let valid_choices = trial.choices;
    if ((trial.left_text === null) || (trial.right_text === null)) {
      if ((trial.left_text === null) && (trial.right_text === null)) {
        valid_choices = [];
      } else if (trial.left_text != null) {
        valid_choices = [trial.choices[0]];
      } else if (trial.right_text != null) {
        valid_choices = [trial.choices[1]];
      }
    }

    // Center image
    let center_image;
    if (trial.center_text !== null) {
      center_image = svg.append('svg:image')
          .attr('x', chosen_x)
          .attr('y', chosen_y)
          .attr('width', monster_size)
          .attr('height', monster_size)
          .attr('xlink:href', trial.center_text + '_deact.png');
    }

    if (trial.query_trial !== null) {
      svg.append('text')
          .attr('x', text_start_x)
          .attr('y', text_start_y)
          .style('font-size', font_size + 'px')
          .style('fill', 'white')
          .text(trial.query_trial);
    }

    // add prompt
    if (trial.prompt !== null) {
      let lineNumber = 0;
      const lineHeight = 1.1; // ems
      const dy = 0;
      for (let i = 0; i<trial.prompt.length; i++) {
        svg.append('text')
            .attr('x', text_start_x)
            .attr('y', instructions_text_start_y)
            .attr('dy', ++lineNumber * lineHeight + dy + 'em')
            .style('font-size', font_size + 'px')
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

    let valid_pressed=0;
    trial.reward_text = '';

    // setup audio stimulus
    const context = jsPsych.pluginAPI.audioContext();
    if (context !== null) {
      const source = context.createBufferSource();
      source.buffer = jsPsych.pluginAPI.getAudioBuffer(trial.audio_stimulus);
      source.connect(context.destination);
    } else {
      const audio = jsPsych.pluginAPI.getAudioBuffer(trial.audio_stimulus);
      audio.currentTime = 0;
    }

    // start audio
    if (context !== null) {
      const startTime = context.currentTime;
      source.start(startTime);
    } else {
      audio.play();
    }

    // function to end trial when it is time
    const end_trial = () => {
      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      // stop the audio file if it is playing
      // remove end event listeners if they exist
      if (context !== null) {
        source.stop();
        source.onended = () => {};
      } else {
        audio.pause();
        audio.removeEventListener('ended', end_trial);
      }

      // gather the data to store for the trial
      const trial_data = {
        'rt': response.rt,
        'key_press': response.key,
        'duration': trial.trial_duration,
        'valid_pressed': valid_pressed,
        'rts': responses.rt,
        'keys': responses.key,
        'planet_text': trial.planet_text,
        'right_text': trial.right_text,
        'left_text': trial.left_text,
        'center_text': trial.center_text,
        'chosen_text': trial.chosen_text,
        'reward_text': trial.reward_text,
        'trial_stage': trial.trial_stage,
        'practice_trial': trial.practice_trial,
        'transition_type': trial.transition_type,
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // function to handle responses by the subject
    const after_response = (info) => {
      // only record the first response
      if (response.key == null) {
        response = info;
      } else {
        responses.rt.push(info.rt);
        responses.key.push(info.key);
      }

      if ((valid_pressed == 0) &&
          (valid_choices.indexOf(info.key) > -1) &&
          (move_possible)) {
        consola.info(`A valid key ('${info.key}') was pressed`);
        valid_pressed = 1;

        if (trial.query_trial == null) {
          // determine what choice was made
          if (trial.choices.indexOf(info.key) == 1) {
            chosen_text = trial.right_text;
            unchosen_text = trial.left_text;
            chosen_image = right_image;
            unchosen_image = left_image;
          } else {
            chosen_text = trial.left_text;
            unchosen_text = trial.right_text;
            chosen_image = left_image;
            unchosen_image = right_image;
          }
          trial.chosen_text=chosen_text; // set chosen text based on choice made
          if (trial.center_text !== null) {
            if (valid_choices.length > 1) {
              // if there was more than one possible choice,
              // 'deactivate' the unselected choice
              unchosen_image.attr('xlink:href', unchosen_text+'_deact.png');
            }

            // start the animation by moving the selected image to the center
            center_image.transition().remove().on('end', () => {
              chosen_image.attr('xlink:href', chosen_text+'_a2.png')
                  .transition()
                  .duration(box_moving_time)
                  .attr('y', chosen_y)
                  .attr('x', chosen_x)
                  .on('end', () => {
                    let frames = 0;
                    let curr_img;
                    const t = interval((elapsed) => {
                      if ((frames % 2) === 0) {
                        curr_img = chosen_text + '_a1.png';
                      } else {
                        curr_img = chosen_text + '_a2.png';
                      }
                      chosen_image.attr('xlink:href', curr_img);
                      frames++;
                      if (frames == 5) {
                        chosen_image.attr(
                            'xlink:href',
                            chosen_text + '_deact.png',
                        );
                        if (trial.trial_row !== null) {
                          // determine the reward and add the reward image
                          trial.reward_text = calculate_reward(
                              chosen_text,
                              trial.trial_row,
                          );
                          svg.append('svg:image')
                              .attr('x', reward_x)
                              .attr('y', reward_y)
                              .attr('width', reward_size)
                              .attr('height', reward_size)
                              .attr('xlink:href', trial.reward_text);
                          interval((elapsed) => {}, moneytime);
                        }
                        t.stop();
                      }
                    }, isitime / 5);
                  }); // increment 5 times
            });
          } else { // do the same thing, but without a center image
            if (valid_choices.length > 1) {
              unchosen_image.attr('xlink:href', unchosen_text + '_deact.png');
            }

            chosen_image.attr('xlink:href', chosen_text+'_a2.png')
                .transition()
                .duration(box_moving_time)
                .attr('y', chosen_y)
                .attr('x', chosen_x)
                .on('end', () => {
                  let frames = 0;
                  let curr_img;
                  const t = interval((elapsed) => {
                    if ((frames % 2) === 0) {
                      curr_img = chosen_text+'_a1.png';
                    } else {
                      curr_img = chosen_text+'_a2.png';
                    }
                    chosen_image.attr('xlink:href', curr_img);
                    frames++;
                    if (frames == 5) {
                      chosen_image.attr(
                          'xlink:href',
                          chosen_text + '_deact.png',
                      );
                      if (trial.trial_row !== null) {
                        trial.reward_text = calculate_reward(
                            chosen_text,
                            trial.trial_row,
                        );
                        svg.append('svg:image')
                            .attr('x', reward_x)
                            .attr('y', reward_y)
                            .attr('width', reward_size)
                            .attr('height', reward_size)
                            .attr('xlink:href', trial.reward_text);
                        interval((elapsed) => {}, moneytime);
                      }
                      t.stop();
                    }
                  }, isitime / 5);
                });
          }
        } else { // this only gets evaluated if query_trial = true
          consola.info(`'end_trial()' called.`);
          end_trial();
        }

        jsPsych.pluginAPI.setTimeout(() => {
          jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
          end_trial();
        }, (isitime + moneytime));
      }
    }; // This is the end of the after_response function

    // play the audio stimulus
    // start the response listener
    const keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
      callback_function: after_response,
      valid_responses: jsPsych.ALL_KEYS,
      persist: true,
      allow_held_key: false,
    });


    // end trial if trial_duration AND trial.timeout == true
    if (trial.trial_duration !== null && trial.timeout == true) {
      jsPsych.pluginAPI.setTimeout(function() {
        if (response.rt == null) {
          move_possible = false;
          trial.chosen_text='';
          right_image.transition()
              .duration(isitime)
              .attr('xlink:href', trial.right_text + '_sp.png');
          left_image.attr('xlink:href', trial.left_text + '_sp.png');
        }
        jsPsych.pluginAPI.setTimeout(() => {
          jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
          end_trial();
        }, (isitime));
      }, trial.trial_duration);
    }
  };

  const calculate_reward = (chosen_string, trial_row) => {
    if (chosen_string == '') {
      return null;
    } else {
      const alien = (chosen_string.slice(-1) % 2);
      const state = +(chosen_string.slice(-1) > 2);

      let reward;
      if (state == 0) {
        reward = (Math.random() < trial_row[alien]);
      } else {
        reward = (Math.random() < trial_row[2 + alien]);
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

import {Experiment} from 'crossplatform-jspsych-wrapper';
import consola from 'consola';

import {
  block_trials,
  choicetime,
  num_blocks,
  rocket_sides,
  practice_game_num,
  practice_game_idx,
  prac_rocket_sides,
  left_key,
  right_key,
  red_planet_first_rocket,
  red_display_order,
  green_display_order,
  yellow_display_order,
  purple_display_order,
  transprob,
  instructions,
  practice_pressing_num,
  practice_pressing_idx,
  practice_reward_num,
  practice_reward_idx,
  reward_instructions_payoff,
  practice_stochastic_num,
  practice_stochastic_idx,
  instructions_payoff,
} from './lib/instructions';

// General jsPsych imports
import 'jspsych';
import 'jspsych/plugins/jspsych-audio-button-response';
import 'jspsych/plugins/jspsych-audio-keyboard-response';
import 'jspsych/plugins/jspsych-call-function';
import 'jspsych/plugins/jspsych-fullscreen';
import 'jspsych/plugins/jspsych-html-button-response';
import 'jspsych/plugins/jspsych-html-keyboard-response';
import 'jspsych/plugins/jspsych-image-keyboard-response';
import 'jspsych/plugins/jspsych-instructions';
import 'jspsych/plugins/jspsych-survey-likert';
import 'jspsych/plugins/jspsych-survey-multi-choice';
import 'jspsych/plugins/jspsych-survey-text';
import 'jspsych/plugins/jspsych-preload';

import practice_prob_data from './data/masterprobtut.csv';
import prob_data from './data/masterprob4.csv';

// Import all our plugins
import './lib/plugins/jspsych-d3-animate-choice';
import './lib/plugins/jspsych-d3-instructions';
import './lib/plugins/jspsych-d3-two-stage';
import './lib/plugins/jspsych-instructions-quiz';
import './lib/plugins/jspsych-two-stage';
import './lib/plugins/two-step-end';
import './lib/plugins/two-step-explicit-choice';
import './lib/plugins/two-step-fixation';

// Styling
import './css/styles.css';

import {LogLevel} from 'consola';
import {configuration} from './configuration';

export const experiment = new Experiment({
  name: 'Two-step game',
  studyName: 'task_twostep',
  manipulations: {},
  stimuli: configuration.stimuli,
  seed: '',
  allowParticipantContact: false,
  contact: 'henry.burgess@wustl.edu',
  logging: LogLevel.Verbose,
});

experiment.load().then(() => {
  consola.info(`Experiment loaded, continuing...`);

  const timeline_var = [];
  let trial = 0;

  const reward_string = experiment.getStimuli().getCollection()['t.png'];
  const null_string = experiment.getStimuli().getCollection()['nothing.png'];

  // add experiment blocks to timeline
  for (let j = 0; j < num_blocks; j++) {
    timeline_var.push([]); // push block to timeline
    for (let i = 0; i < block_trials; i++) {
      if (rocket_sides) { // randomize sides of rockets for each subject
        timeline_var[j].push({
          right_text: 'images/rocket2',
          left_text: 'images/rocket1',
          trial: trial,
        });
      } else {
        timeline_var[j].push({
          right_text: 'images/rocket1',
          left_text: 'images/rocket2',
          trial: trial,
        });
      }
      trial = trial+1;
    };
  };

  const practice_timeline_var = [];
  trial = 0;

  for (let i = 0; i < practice_game_num; i++) {
    if (prac_rocket_sides) { // randomize sides of rockets for each subject
      practice_timeline_var.push({
        right_text: 'images/tutrocket2',
        left_text: 'images/tutrocket1',
        trial: trial,
      });
    } else {
      practice_timeline_var.push({
        right_text: 'images/tutrocket1',
        left_text: 'images/tutrocket2',
        trial: trial,
      });
    }
    trial = trial + 1;
  };

  let curr_stage_two = [];

  /**
   * create_block function
   * @param {any} curr_variables variables
   * @param {any} curr_prob_data data
   * @param {any} practice ?
   * @return {any} ?
   */
  const create_block = (curr_variables, curr_prob_data, practice) => {
    const exp_procedure = {
      timeline: [
        { // define stage 1 choice
          type: 'd3-animate-choice',
          trial_stage: '1',
          choices: [left_key, right_key],
          planet_text: experiment.getStimuli().getCollection()['earth.jpg'],
          right_text: jsPsych.timelineVariable('right_text'), // right rocket
          left_text: jsPsych.timelineVariable('left_text'), // left rocket
          practice_trial: function() {
            if (practice === false) {
              return 'real';
            }
          },
          on_start: function() {
            curr_stage_two = [];
          },
          on_finish: function(data) {
            if (data.key_press == left_key) {
              data.choice = 1;
            };
            if (data.key_press == right_key) {
              data.choice = 2;
            };
            curr_stage_two = calculate_transition(data.chosen_text, practice);
            if (curr_stage_two == null) {
              curr_stage_two = [
                data.right_text,
                data.left_text,
                experiment.getStimuli().getCollection()['earth.jpg'],
                null,
              ];
            }
          },
          trial_duration: choicetime,
        },
        // define stage 2 choice
        {
          type: 'd3-animate-choice',
          trial_stage: '2',
          choices: [left_key, right_key],
          practice_trial: () => {
            if (practice === false) {
              return 'real';
            }
          },
          trial_row: () => {
            return curr_prob_data[jsPsych.timelineVariable('trial', true)];
          },
          planet_text: () => {
            return curr_stage_two[2]; // stage 2 planet
          },
          right_text: () => {
            return curr_stage_two[0]; // left alien
          },
          left_text: () => {
            return curr_stage_two[1]; // right alien
          },
          center_text: () => {
            return curr_stage_two[3]; // reward outcome
          },
          transition_type: () => {
            return curr_stage_two[4]; // transition type
          },
          trial_duration: () => {
            if (curr_stage_two[3] == null) {
              return 0;
            } else {
              return choicetime;
            }
          },
          on_finish: (data) => {
            if (data.reward_text === reward_string) {
              if (practice === false) {
                real_reward += 1;
              } else {
                practice_reward += 1;
              }
            }
            if (data.key_press == left_key) {
              data.choice = 1;
            }
            if (data.key_press == right_key) {
              data.choice = 2;
            }
            if (data.transition_type == true) {
              data.transition = 'common';
            }
            if (data.transition_type == false) {
              data.transition = 'rare';
            }
            if (data.reward_text ==
                experiment.getStimuli().getCollection()['t.png']) {
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
          stimulus: experiment.getStimuli().getCollection()['earth.jpg'],
          text: '+',
          trial_duration: 1000, // ITI duration
        },
      ],
      timeline_variables: curr_variables,
    };
    return exp_procedure;
  };

  // Break trials removed from here

  /**
   * calculate_transition function
   * @param {string} chosen_string chosen_string
   * @param {boolean} practice practice
   * @return {any}
   */
  function calculate_transition(chosen_string, practice) {
    let first_planet = '';
    let second_planet = '';
    if (chosen_string == '') {
      return null;
    } else {
      if (practice == true) {
        first_planet = 'green';
        second_planet = 'yellow';
      } else {
        first_planet = 'red';
        second_planet = 'purple';
      }
      const first_ship_chosen = (chosen_string.slice(-1) == 1);
      const good_transition = (Math.random() < transprob);
      let planet = '';
      if (first_ship_chosen && red_planet_first_rocket) {
        if (good_transition) {
          planet = first_planet;
        } else {
          planet = second_planet;
        }
      } else if (~first_ship_chosen && red_planet_first_rocket) {
        if (good_transition) {
          planet = second_planet;
        } else {
          planet = first_planet;
        }
      } else if (first_ship_chosen && ~red_planet_first_rocket) {
        if (good_transition) {
          planet = second_planet;
        } else {
          planet = first_planet;
        }
      } else if (~first_ship_chosen && ~red_planet_first_rocket) {
        if (good_transition) {
          planet = first_planet;
        } else {
          planet = second_planet;
        }
      }

      let display_order = (1);
      if (planet === 'red') {
        if (calculate_transition==false) {
          display_order = red_display_order;
        }

        if (display_order) {
          return [
            'images/alien2',
            'images/alien1',
            experiment.getStimuli().getCollection()['redplanet1.jpg'],
            chosen_string,
            good_transition,
          ];
        } else {
          return [
            'images/alien1',
            'images/alien2',
            experiment.getStimuli().getCollection()['redplanet1.jpg'],
            chosen_string,
            good_transition,
          ];
        }
      } else if (planet === 'purple') {
        if (calculate_transition==false) {
          display_order = purple_display_order;
        }

        if (display_order) {
          return [
            'images/alien4',
            'images/alien3',
            experiment.getStimuli().getCollection()['purpleplanet.jpg'],
            chosen_string,
            good_transition,
          ];
        } else {
          return [
            'images/alien3',
            'images/alien4',
            experiment.getStimuli().getCollection()['purpleplanet.jpg'],
            chosen_string,
            good_transition,
          ];
        }
      } else if (planet === 'green') {
        if (calculate_transition==false) {
          display_order = green_display_order;
        }

        if (display_order) {
          return [
            'images/tutalien2',
            'images/tutalien1',
            experiment.getStimuli().getCollection()['tutgreenplanet.jpg'],
            chosen_string,
            good_transition,
          ];
        } else {
          return [
            'images/tutalien1',
            'images/tutalien2',
            experiment.getStimuli().getCollection()['tutgreenplanet.jpg'],
            chosen_string,
            good_transition,
          ];
        }
      } else if (planet === 'yellow') {
        if (calculate_transition==false) {
          display_order = yellow_display_order;
        }

        if (display_order) {
          return [
            'images/tutalien4',
            'images/tutalien3',
            experiment.getStimuli().getCollection()['tutyellowplanet.jpg'],
            chosen_string,
            good_transition,
          ];
        } else {
          return [
            'images/tutalien3',
            'images/tutalien4',
            experiment.getStimuli().getCollection()['tutyellowplanet.jpg'],
            chosen_string,
            good_transition,
          ];
        }
      } else {
        console.log('error in transition calculation');
        return null;
      }
    }
  }

  // initialize experiment timeline
  let exp_timeline = [];

  const left_images = [];
  const right_images = [];
  const center_images = [];
  const reward_images = [];
  const audio_files = [];
  const button_images = [];

  let curr_instructs;
  for (let i = 0; i < instructions.length; i += 1) {
    curr_instructs = instructions[i];
    left_images[i] = [];
    right_images[i] = [];
    reward_images[i] = [];
    center_images[i] = [];
    audio_files[i] = [];
    button_images[i] = [];
    for (let j = 0; j < curr_instructs.length; j += 1) {
      left_images[i][j] = null;
      right_images[i][j] = null;
      center_images[i][j] = null;
      reward_images[i][j] = null;
      button_images[i][j] =
          experiment.getStimuli().getCollection()['button.jpeg'];
    }
  }

  reward_images[3][0] = reward_string;
  reward_images[3][1] = null_string;

  center_images[4][0] =
      experiment.getStimuli().getCollection()['tutalien3_norm.png'];
  center_images[4][1] =
      experiment.getStimuli().getCollection()['tutalien3_norm.png'];
  center_images[9][0] =
      experiment.getStimuli().getCollection()['tutalien2_norm.png'];

  right_images[1][0] =
      experiment.getStimuli().getCollection()['tutrocket1_norm.png'];
  left_images[1][0] =
      experiment.getStimuli().getCollection()['tutrocket2_norm.png'];

  right_images[2][0] =
      experiment.getStimuli().getCollection()['tutalien1_norm.png'];
  left_images[2][0] =
      experiment.getStimuli().getCollection()['tutalien2_norm.png'];
  right_images[2][1] =
      experiment.getStimuli().getCollection()['tutalien1_norm.png'];
  left_images[2][1] =
      experiment.getStimuli().getCollection()['tutalien2_norm.png'];
  right_images[2][2] =
      experiment.getStimuli().getCollection()['tutalien1_norm.png'];
  left_images[2][2] =
      experiment.getStimuli().getCollection()['tutalien2_norm.png'];

  right_images[6][0] =
      experiment.getStimuli().getCollection()['tutalien1_norm.png'];
  right_images[7][0] =
      experiment.getStimuli().getCollection()['tutalien2_norm.png'];

  left_images[6][0] =
      experiment.getStimuli().getCollection()['tutalien2_norm.png'];
  left_images[7][0] =
      experiment.getStimuli().getCollection()['tutalien1_norm.png'];

  right_images[13][0] =
      experiment.getStimuli().getCollection()['tutrocket1_norm.png'];
  right_images[13][1] =
      experiment.getStimuli().getCollection()['tutrocket1_norm.png'];
  right_images[14][0] =
      experiment.getStimuli().getCollection()['tutrocket1_norm.png'];
  right_images[14][1] =
      experiment.getStimuli().getCollection()['tutrocket1_norm.png'];
  right_images[14][2] =
      experiment.getStimuli().getCollection()['tutrocket1_norm.png'];
  right_images[14][3] =
      experiment.getStimuli().getCollection()['tutrocket1_sp.png'];
  right_images[14][4] =
      experiment.getStimuli().getCollection()['tutrocket1_norm.png'];
  right_images[14][5] =
      experiment.getStimuli().getCollection()['tutrocket1_norm.png'];

  left_images[13][0] =
      experiment.getStimuli().getCollection()['tutrocket2_norm.png'];
  left_images[13][1] =
      experiment.getStimuli().getCollection()['tutrocket2_norm.png'];
  left_images[14][0] =
      experiment.getStimuli().getCollection()['tutrocket2_norm.png'];
  left_images[14][1] =
      experiment.getStimuli().getCollection()['tutrocket2_norm.png'];
  left_images[14][2] =
      experiment.getStimuli().getCollection()['tutrocket2_norm.png'];
  left_images[14][3] =
      experiment.getStimuli().getCollection()['tutrocket2_sp.png'];
  left_images[14][4] =
      experiment.getStimuli().getCollection()['tutrocket2_norm.png'];
  left_images[14][5] =
      experiment.getStimuli().getCollection()['tutrocket2_norm.png'];

  const instructions_backgrounds = [
    experiment.getStimuli().getCollection()['blackbackground.jpg'],
    experiment.getStimuli().getCollection()['earth.jpg'],
    experiment.getStimuli().getCollection()['tutgreenplanet.jpg'],
    experiment.getStimuli().getCollection()['blackbackground.jpg'],
    experiment.getStimuli().getCollection()['tutyellowplanet.jpg'],
    experiment.getStimuli().getCollection()['blackbackground.jpg'],
    experiment.getStimuli().getCollection()['tutgreenplanet.jpg'],
    experiment.getStimuli().getCollection()['tutgreenplanet.jpg'],
    experiment.getStimuli().getCollection()['blackbackground.jpg'],
    experiment.getStimuli().getCollection()['blackbackground.jpg'],
    experiment.getStimuli().getCollection()['earth.jpg'],
    experiment.getStimuli().getCollection()['tutgreenplanet.jpg'],
    experiment.getStimuli().getCollection()['tutyellowplanet.jpg'],
    experiment.getStimuli().getCollection()['earth.jpg'],
    experiment.getStimuli().getCollection()['earth.jpg'],
    experiment.getStimuli().getCollection()['blackbackground.jpg'],
  ];

  let t_i;
  let curr_page;
  let curr_side;

  const create_instructions = (
      image, texts, audio_files, sect_right_texts,
      sect_left_texts, sect_center_texts, sect_reward_texts) => {
    'use strict';
    const instruction_pages = [];
    for (t_i = 0; t_i < texts.length; t_i += 1) {
      curr_page = {
        type: 'd3-instructions',
        stimulus: image,
        right_text: sect_right_texts[t_i],
        left_text: sect_left_texts[t_i],
        center_text: sect_center_texts[t_i],
        reward_string: sect_reward_texts[t_i],
        choices: jsPsych.ALL_KEYS,
        prompt: texts[t_i],
        audio_stimulus: audio_files[t_i],
      };
      instruction_pages.push(curr_page);
    }
    return instruction_pages;
  };

  // Create instructions
  let curr_instructions = [];
  for (let i = 0; i < instructions.length; i += 1) {
    curr_instructions = curr_instructions.concat(
        create_instructions(
            instructions_backgrounds[i],
            instructions[i],
            right_images[i],
            left_images[i],
            center_images[i],
            reward_images[i],
            button_images[i],
        ),
    );
  }

  // INSERT PRACTICE
  // insert 4 selection practice trials on instructions page 5
  for (let i = 0; i < (practice_pressing_num - 1); i += 1) {
    curr_instructions.splice(practice_pressing_idx, 0, {
      type: 'd3-animate-choice',
      timeout: false,
      choices: [left_key, right_key],
      planet_text:
        experiment.getStimuli().getCollection()['tutgreenplanet.jpg'],
      right_text: 'images/tutalien1',
      left_text: 'images/tutalien2',
      prompt: ['Now try another one'],
      trial_duration: choicetime,
    });
  }
  curr_instructions.splice(practice_pressing_idx, 0, {
    type: 'd3-animate-choice',
    timeout: false,
    choices: [left_key, right_key],
    planet_text: experiment.getStimuli().getCollection()['tutgreenplanet.jpg'],
    right_text: 'images/tutalien1',
    left_text: 'images/tutalien2',
    trial_duration: choicetime,
  });

  // insert 10 treasure asking practice trials
  for (let i = 0; i < practice_reward_num; i += 1) {
    curr_instructions.splice(practice_reward_idx, 0, {
      type: 'd3-animate-choice',
      timeout: false,
      trial_row: reward_instructions_payoff,
      choices: [left_key, right_key],
      planet_text:
        experiment.getStimuli().getCollection()['tutyellowplanet.jpg'],
      right_text: () => {
        if (curr_side === true) {
          return 'images/tutalien3';
        }
        return null;
      },
      left_text: () => {
        if (curr_side === true) {
          return null;
        }
        return 'images/tutalien3';
      },
      trial_duration: choicetime,
    });
  }

  // insert 10 asking green aliens for reward trials
  for (let i = 0; i < practice_stochastic_num; i += 1) {
    curr_instructions.splice(practice_stochastic_idx, 0, {
      type: 'd3-animate-choice',
      timeout: false,
      trial_row: instructions_payoff,
      choices: [left_key, right_key],
      planet_text:
        experiment.getStimuli().getCollection()['tutgreenplanet.jpg'],
      right_text: 'images/tutalien1',
      left_text: 'images/tutalien2',
      trial_duration: choicetime,
    });
  }

  // remove the instructions about aliens on either side
  curr_instructions.splice(27, 3);

  // insert practice into instrucitions
  curr_instructions.splice(practice_game_idx + 3, 0,
      create_block(practice_timeline_var, practice_prob_data, true));

  // build experiment timeline
  exp_timeline = curr_instructions;

  // run trials with breaks
  exp_timeline.push(create_block(timeline_var[0], prob_data, false));
  exp_timeline.push(create_block(timeline_var[1], prob_data, false));
  exp_timeline.push(create_block(timeline_var[2], prob_data, false));
  exp_timeline.push(create_block(timeline_var[3], prob_data, false));

  experiment.start({
    timeline: exp_timeline,
  });
});

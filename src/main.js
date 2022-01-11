import {
  all_images,
  block_trials,
  choicetime,
  num_blocks,
  rocket_sides,
  practice_game_num,
  practice_game_idx,
  prac_rocket_sides,
  left_key,
  right_key,
  query_text,
  curr_instructions,
  red_planet_first_rocket,
  red_display_order,
  purple_display_order,
  reward_string,
  transprob,
} from './lib/instructions';

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

const timeline_var = [];
let trial = 0;

let practice_reward = 0;
let real_reward = 0;

// add experiment blocks to timeline
for (let j = 0; j < num_blocks; j++) {
  timeline_var.push([]); // push block to timeline
  for (let i = 0; i<block_trials; i++) {
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
        planet_text: 'images/earth.jpg', // start at earth
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
              'images/earth.jpg',
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
          if (data.reward_text == 'images/t.png') {
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
        stimulus: 'images/earth.jpg',
        text: '+',
        trial_duration: 1000, // ITI duration
      },
    ],
    timeline_variables: curr_variables,
  };
  return exp_procedure;
};

// Break trials removed from here

const end_experiment = {
  type: 'audio-keyboard-response',
  prompt: `<p> You're finished with this part of the experiment! <p><br>`,
  trial_ends_after_audio: 'True',
  stimulus: 'audio/instructions/end_of_task.wav',
};

/**
 * calculate_transition function
 * @param {string} chosen_string chosen_string
 * @param {boolean} practice practice
 * @return {any}
 */
function calculate_transition(chosen_string, practice) {
  // uses globals red_planet_first_rocket and transprob to figure out transition
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
          'images/redplanet1.jpg',
          chosen_string,
          good_transition,
        ];
      } else {
        return [
          'images/alien1',
          'images/alien2',
          'images/redplanet1.jpg',
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
          'images/purpleplanet.jpg',
          chosen_string,
          good_transition,
        ];
      } else {
        return [
          'images/alien3',
          'images/alien4',
          'images/purpleplanet.jpg',
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
          'images/tutgreenplanet.jpg',
          chosen_string,
          good_transition,
        ];
      } else {
        return [
          'images/tutalien1',
          'images/tutalien2',
          'images/tutgreenplanet.jpg', chosen_string, good_transition];
      }
    } else if (planet === 'yellow') {
      if (calculate_transition==false) {
        display_order = yellow_display_order;
      }

      if (display_order) {
        return [
          'images/tutalien4',
          'images/tutalien3',
          'images/tutyellowplanet.jpg',
          chosen_string,
          good_transition,
        ];
      } else {
        return [
          'images/tutalien3',
          'images/tutalien4',
          'images/tutyellowplanet.jpg',
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

const final_question = {
  type: 'two-step-explicit-choice',
  choices: [left_key, right_key],
  planet_text: 'images/earth.jpg',
  right_text: function() {
    if (rocket_sides) {
      return 'images/rocket2';
    } else {
      return 'images/rocket1';
    }
  },
  left_text: function() {
    if (rocket_sides) {
      return 'images/rocket1';
    } else {
      return 'images/rocket2';
    }
  },
  query_trial: query_text,
  timeout: false,
  practice_trial: 'explicit report',
  audio_stimulus: 'audio/instructions/query.wav',
};

const practice_reward_display = {
  type: 'audio-keyboard-response',
  stimulus: 'audio/instructions/treasure_feedback.wav',
  prompt: () => {
    'use strict';
    return [
      '<p style=\'color:#FFFFFF\'>You got ',
      () => {
        return practice_reward;
      },
      ` pieces of treasure.
      <br>
      Press the space bar to move to the next page.
      <br>`,
    ].join('');
  },
};

const real_reward_display = {
  type: 'audio-keyboard-response',
  stimulus: 'audio/instructions/treasure_feedback.wav',
  prompt: () => {
    'use strict';
    return [
      '<p style=\'color:#FFFFFF\'>You got ',
      () => {
        return real_reward;
      },
      ` pieces of treasure.
      <br>
      That means you earned a bonus of $5!
      <br>
      Press the space bar to move to the next page.`,
    ].join('');
  },
};

// initialize experiment timeline
let exp_timeline = [];

// insert practice into instrucitions
curr_instructions.splice(practice_game_idx + 3, 0,
    create_block(practice_timeline_var, practice_prob_data, true));
curr_instructions.splice(practice_game_idx + 5, 0, practice_reward_display);

// build experiment timeline
exp_timeline = curr_instructions;

// run trials with breaks
exp_timeline.push(create_block(timeline_var[0], prob_data, false));
exp_timeline.push(create_block(timeline_var[1], prob_data, false));
exp_timeline.push(create_block(timeline_var[2], prob_data, false));
exp_timeline.push(create_block(timeline_var[3], prob_data, false));
exp_timeline.push(real_reward_display);
exp_timeline.push(final_question);
exp_timeline.push(end_experiment);

jsPsych.pluginAPI.preloadImages(all_images, () => {
  jsPsych.init({
    timeline: exp_timeline,
    preload_images: all_images,
    on_trial_start: (data) => {
      jsPsych.data.get().addToAll({rocket_sides: rocket_sides});
      jsPsych.data.get().addToAll({
        red_planet_first_rocket: red_planet_first_rocket,
      });
      jsPsych.data.get().addToAll({red_display_order: red_display_order});
      jsPsych.data.get().addToAll({purple_display_order: purple_display_order});
      const interaction_data = jsPsych.data.getInteractionData();
      const blur_events = interaction_data.filter({event: 'blur'});
      const focus_events = interaction_data.filter({event: 'focus'});
      const fullscreenenter_events = interaction_data.filter({
        event: 'fullscreenenter',
      });
      const fullscreenexit_events = interaction_data.filter({
        event: 'fullscreenexit',
      });
      jsPsych.data.get().addToLast({interactions: interaction_data.csv()});
      jsPsych.data.get().addToLast({blur_events: blur_events.csv()});
      jsPsych.data.get().addToLast({focus_events: focus_events.csv()});
      jsPsych.data.get().addToLast({
        fullscreenenter_events: fullscreenenter_events.csv(),
      });
      jsPsych.data.get().addToLast({
        fullscreenexit_events: fullscreenexit_events.csv(),
      });
    },
    on_interaction_data_update: (data) => {
      const interaction_data = jsPsych.data.getInteractionData();
      const blur_events = interaction_data.filter({event: 'blur'});
      const focus_events = interaction_data.filter({event: 'focus'});
      const fullscreenenter_events = interaction_data.filter({
        event: 'fullscreenenter',
      });
      const fullscreenexit_events = interaction_data.filter({
        event: 'fullscreenexit',
      });
      jsPsych.data.get().addToLast({interactions: interaction_data.csv()});
      jsPsych.data.get().addToLast({blur_events: blur_events.csv()});
      jsPsych.data.get().addToLast({focus_events: focus_events.csv()});
      jsPsych.data.get().addToLast({
        fullscreenenter_events: fullscreenenter_events.csv(),
      });
      jsPsych.data.get().addToLast({
        fullscreenexit_events: fullscreenexit_events.csv(),
      });
    },
    on_close: (data) => {
      const interaction_data = jsPsych.data.getInteractionData();
      const blur_events = interaction_data.filter({event: 'blur'});
      const focus_events = interaction_data.filter({event: 'focus'});
      const fullscreenenter_events = interaction_data.filter({
        event: 'fullscreenenter',
      });
      const fullscreenexit_events = interaction_data.filter({
        event: 'fullscreenexit',
      });
      jsPsych.data.get().addToLast({interactions: interaction_data.csv()});
      jsPsych.data.get().addToLast({blur_events: blur_events.csv()});
      jsPsych.data.get().addToLast({focus_events: focus_events.csv()});
      jsPsych.data.get().addToLast({
        fullscreenenter_events: fullscreenenter_events.csv(),
      });
      jsPsych.data.get().addToLast({
        fullscreenexit_events: fullscreenexit_events.csv(),
      });
      jsPsych.data.get().addToAll({rocket_sides: rocket_sides});
      jsPsych.data.get().addToAll({
        red_planet_first_rocket: red_planet_first_rocket,
      });
      jsPsych.data.get().addToAll({red_display_order: red_display_order});
      jsPsych.data.get().addToAll({
        purple_display_order: purple_display_order,
      });
    },
    on_finish: (data) => {
      const interaction_data = jsPsych.data.getInteractionData();
      const blur_events = interaction_data.filter({event: 'blur'});
      const focus_events = interaction_data.filter({event: 'focus'});
      const fullscreenenter_events = interaction_data.filter({
        event: 'fullscreenenter',
      });
      const fullscreenexit_events = interaction_data.filter({
        event: 'fullscreenexit',
      });
      jsPsych.data.get().addToLast({interactions: interaction_data.csv()});
      jsPsych.data.get().addToLast({blur_events: blur_events.csv()});
      jsPsych.data.get().addToLast({focus_events: focus_events.csv()});
      jsPsych.data.get().addToLast({
        fullscreenenter_events: fullscreenenter_events.csv(),
      });
      jsPsych.data.get().addToLast({
        fullscreenexit_events: fullscreenexit_events.csv(),
      });
      jsPsych.data.get().addToAll({rocket_sides: rocket_sides});
      jsPsych.data.get().addToAll({
        red_planet_first_rocket: red_planet_first_rocket,
      });
      jsPsych.data.get().addToAll({red_display_order: red_display_order});
      jsPsych.data.get().addToAll({purple_display_order: purple_display_order});
    },
  });
});

import {getFormattedTime} from './lib/functions';
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
    function create_block(curr_variables, curr_prob_data, practice) {
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
                        trial_duration: choicetime
                    }, 
                    { // define stage 2 choice
                        type: 'd3-animate-choice',
                        trial_stage: "2",
                        choices: [left_key, right_key],
                        practice_trial: function(){if (practice === false) {return "real"}},
                        trial_row:  function(){return curr_prob_data[jsPsych.timelineVariable('trial', true)];},
                        planet_text: function(){return curr_stage_two[2]}, // stage 2 planet
                        right_text: function(){return curr_stage_two[0]}, // left alien
                        left_text: function(){return curr_stage_two[1]}, // right alien
                        center_text: function(){return curr_stage_two[3]}, // reward outcome
                        transition_type: function() {return curr_stage_two[4]}, // transition type
                        trial_duration: function(){if (curr_stage_two[3] == null){return 0;} else {return choicetime;}},
                        on_finish: function(data) {if (data.reward_text === reward_string) {if (practice === false) {real_reward += 1;} else {practice_reward += 1;};}
                        if(data.key_press == left_key){data.choice = 1} 
                        if(data.key_press == right_key){data.choice = 2}
                        if(data.transition_type == true){data.transition = 'common'}
                        if(data.transition_type == false){data.transition = 'rare'}
                        if(data.reward_text == "images/t.png"){data.reward = 1;} else {data.reward = 0}
                            var timestamp = (new Date).toISOString().replace(/z|t/gi,' ').trim();
                            jsPsych.data.addDataToLastTrial({timestamp})},
                    },
                    { // ITI
                        type: 'two-step-fixation',
                        stimulus: 'images/earth.jpg', 
                        text: '+',
                        trial_duration: 1000 // ITI duration
                    }
                ],
                timeline_variables: curr_variables,
            }
            return exp_procedure;
        }

        // var break_trial_1 = {
        //     type: 'audio-button-response-2',
        //     prompt: break_text_1,
        //     choices: ['Next round!'],
        //     stimulus: 'audio/instructions/break_1.wav'
        // }

        // var break_trial_2 = {
        //     type: 'audio-button-response-2',
        //     prompt: break_text_2,
        //     choices: ['Next round!'],
        //     stimulus: 'audio/instructions/break_2.wav'
        // }

        // var break_trial_3 = {
        //     type: 'audio-button-response-2',
        //     prompt: break_text_3,
        //     choices: ['Next round!'],
        //     stimulus: 'audio/instructions/break_3.wav'
        // }

        var end_experiment = {
            type: 'audio-keyboard-response',
            prompt: "<p> You're finished with this part of the experiment! <p><br>",
            trial_ends_after_audio: 'True',
            stimulus: 'audio/instructions/end_of_task.wav'
        };

        function calculate_transition(chosen_string, practice) {
            // uses globals red_planet_first_rocket and transprob to figure out transition
            if (chosen_string == "") {
                return null;
            } else {
                if (practice == true) {
                    first_planet = "green";
                    second_planet = "yellow"
                } else {
                    first_planet = "red";
                    second_planet = "purple"
                }
                var first_ship_chosen = (chosen_string.slice(-1)==1);
                console.log("left selected:")
                console.log(first_ship_chosen)
                console.log("green first planet:")
                console.log(red_planet_first_rocket)
                var good_transition = (Math.random() < transprob);
                console.log("common transition:")
                console.log(good_transition)
                console.log("transition probability:")
                console.log(transprob)
                var planet = "";

                if (first_ship_chosen && red_planet_first_rocket) {
                    if (good_transition) {planet = first_planet;} else {planet = second_planet;
                        }
                } else if (~first_ship_chosen && red_planet_first_rocket) {
                    if (good_transition) {planet = second_planet;} else {planet = first_planet;
                        }
                } else if (first_ship_chosen && ~red_planet_first_rocket) {
                    if (good_transition) {planet = second_planet;} else {planet = first_planet;
                        }
                } else if (~first_ship_chosen && ~red_planet_first_rocket) {
                    if (good_transition) {planet = first_planet;} else {planet = second_planet;}
                }

                var display_order = (1); 
                if (planet === "red") {
                    if (calculate_transition==false) {
                        display_order = red_display_order; 
                    }

                    if (display_order) {
                        return ["images/alien2", "images/alien1", "images/redplanet1.jpg", chosen_string, good_transition];
                    } else {
                        return ["images/alien1", "images/alien2", "images/redplanet1.jpg", chosen_string, good_transition];
                    }
                } else if (planet === "purple") {
                    if (calculate_transition==false) {
                        display_order = purple_display_order; 
                    }

                    if (display_order) {
                        return ["images/alien4", "images/alien3", "images/purpleplanet.jpg", chosen_string, good_transition];
                    } else {
                        return ["images/alien3", "images/alien4", "images/purpleplanet.jpg", chosen_string, good_transition];
                    }
                } else if (planet === "green") {
                    if (calculate_transition==false) {
                        display_order = green_display_order; 
                    }

                    if (display_order) {
                        return ["images/tutalien2", "images/tutalien1", "images/tutgreenplanet.jpg", chosen_string, good_transition];
                    } else {
                        return ["images/tutalien1", "images/tutalien2", "images/tutgreenplanet.jpg", chosen_string, good_transition];
                    }
                } else if (planet === "yellow") {
                    if (calculate_transition==false) {
                        display_order = yellow_display_order; 
                    }

                    if (display_order) {
                        return ["images/tutalien4", "images/tutalien3", "images/tutyellowplanet.jpg", chosen_string, good_transition];
                    } else {
                        return ["images/tutalien3", "images/tutalien4", "images/tutyellowplanet.jpg", chosen_string, good_transition];
                    }
                } else {
                    console.log("error in transition calculation");
                    return null;
                }
            }
        }

        var final_question = {
            type: 'two-step-explicit-choice',
            choices: [left_key, right_key],
            planet_text: "images/earth.jpg",
            right_text: function() {
                if(rocket_sides) {
                    return "images/rocket2"
                } else {
                    return "images/rocket1"
                }
            },
            left_text: function() {
                if(rocket_sides) {
                    return "images/rocket1"
                } else {
                    return "images/rocket2"
                }
            },
            query_trial: query_text,
            timeout: false, 
            practice_trial: "explicit report",
            audio_stimulus: 'audio/instructions/query.wav'
        }

                const practice_reward_display = { //break
                    type: 'audio-keyboard-response',
                    stimulus: 'audio/instructions/treasure_feedback.wav',
                    prompt: function () {
                        "use strict";
                        return ['<p style=\"color:#FFFFFF\">You got ', function() {return practice_reward;}() , ' pieces of treasure. <br> Press the space bar to move to the next page. <br> '].join('');
                    }
                }

                const real_reward_display = { //break
                    type: 'audio-keyboard-response',
                    stimulus: 'audio/instructions/treasure_feedback.wav',
                    prompt: function () {
                        "use strict";
                        return ['<p style=\"color:#FFFFFF\">You got ', function() {return real_reward;}() , ' pieces of treasure. <br> That means you earned a bonus of $5! <br> Press the space bar to move to the next page.'].join('');
                    },
                }

                //instructions quiz
                const quiz_1 = {
                    type: 'instructions-quiz',
                    prompt: 'True or False: Each spaceship always flies to the same planet. <br>',
                    choices: ['TRUE', 'FALSE'],
                    correct_answer: 1,
                    stimulus: 'audio/quiz/Q1_Prompt.wav',
                }

                const quiz_1_feedback = {
                    type: 'audio-keyboard-response',
                    stimulus: function() {
                        var last_answer = jsPsych.data.get().last(1).values()[0].button_pressed;
                        console.log(last_answer)
                        if(last_answer == 1){
                            return 'audio/quiz/Q1_Correct.wav';
                        } else {
                            return 'audio/quiz/Q1_Incorrect.wav';
                        }},
                    prompt: function() {
                        var last_answer = jsPsych.data.get().last(1).values()[0].button_pressed;
                        console.log(last_answer)
                        if(last_answer == 1){
                            return 'Correct! The spaceships can fly to either planet, but each spaceship will have one planet that it goes to the most often.';
                        } else {
                            return  'Incorrect. Remember, the spaceships can fly to either planet, but each spaceship will have one planet that it goes to the most often.';
                        }},
                    trial_ends_after_audio: 'True',
                    choices: jsPsych.ALL_KEYS
                }

                const quiz_2 = {
                    type: 'instructions-quiz',
                    prompt: 'True or False: If an alien has a lot of treasure to share now, then they will probably have a lot of treasure to share in the near future. <br>',
                    choices: ['TRUE', 'FALSE'],
                    correct_answer: 0,
                    stimulus: 'audio/quiz/Q2_Prompt.wav',
                }

                const quiz_2_feedback = {
                    type: 'audio-keyboard-response',
                    stimulus: function() {
                        var last_answer = jsPsych.data.get().last(1).values()[0].button_pressed;
                        console.log(last_answer)
                        if(last_answer == 0){
                            return 'audio/quiz/Q2_Correct.wav';
                        } else {
                            return 'audio/quiz/Q2_Incorrect.wav';
                        }},
                    prompt: function() {
                        var last_answer = jsPsych.data.get().last(1).values()[0].button_pressed;
                        if(last_answer == 0){
                            return 'Correct! How good a mine is changes slowly, so if an alien has a lot of treasure to share now, they will probably be able to share a lot in the near future.';
                        } else {
                            return  'Incorrect. Remember, how good a mine is changes slowly, so if an alien has a lot of treasure to share now, they will probably be able to share a lot in the near future.';
                        }},
                    trial_ends_after_audio: 'True',
                    choices: jsPsych.ALL_KEYS
                }

                const quiz_3 = {
                    type: 'instructions-quiz',
                    prompt: 'True or False: You will have as much time as you want to make each choice. <br>',
                    choices: ['TRUE', 'FALSE'],
                    correct_answer: 1,
                    stimulus: 'audio/quiz/Q3_Prompt.wav',
                }

                const quiz_3_feedback = {
                    type: 'audio-keyboard-response',
                    stimulus: function() {
                        var last_answer = jsPsych.data.get().last(1).values()[0].button_pressed;
                        console.log(last_answer)
                        if(last_answer == 1){
                            return 'audio/quiz/Q3_Correct.wav';
                        } else {
                            return 'audio/quiz/Q3_Incorrect.wav';
                        }},
                    prompt: function() {
                        var last_answer = jsPsych.data.get().last(1).values()[0].button_pressed;
                        if(last_answer == 1){
                            return 'Correct! You will only have 3 seconds to make each choice.';
                        } else {
                            return 'Incorrect. Remember, you will only have 3 seconds to make each choice.';
                        }},
                    trial_ends_after_audio: 'True',
                    choices: jsPsych.ALL_KEYS
                }

                // initialize experiment timeline
                var exp_timeline = [];

                // insert practice into instrucitions 
                curr_instructions.splice(practice_game_idx + 3, 0, create_block(practice_timeline_var, practice_prob_data, true))
                curr_instructions.splice(practice_game_idx + 5, 0, practice_reward_display)   
                curr_instructions.splice(practice_game_idx + 11, 0, quiz_1) 
                curr_instructions.splice(practice_game_idx + 12, 0, quiz_1_feedback) 
                curr_instructions.splice(practice_game_idx + 13, 0, quiz_2) 
                curr_instructions.splice(practice_game_idx + 14, 0, quiz_2_feedback) 
                curr_instructions.splice(practice_game_idx + 15, 0, quiz_3) 
                curr_instructions.splice(practice_game_idx + 16, 0, quiz_3_feedback) 

                // build experiment timeline
                exp_timeline = curr_instructions 

                exp_timeline.push(create_block(timeline_var[0], prob_data, false)) // run trials with breaks
                // exp_timeline.push(break_trial_1)
                exp_timeline.push(create_block(timeline_var[1], prob_data, false))
                // exp_timeline.push(break_trial_2)
                exp_timeline.push(create_block(timeline_var[2], prob_data, false))
                // exp_timeline.push(break_trial_3)
                exp_timeline.push(create_block(timeline_var[3], prob_data, false))
                exp_timeline.push(real_reward_display)
                exp_timeline.push(final_question)
                exp_timeline.push(end_experiment)

                /** GET SUB ID BASED ON URL **/
                var urlvar = jsPsych.data.urlVariables()
                var file_name = 'mbmf_' + urlvar.participant + '_' + getFormattedTime();

                jsPsych.pluginAPI.preloadImages(all_images, function () {
                    jsPsych.init({
                        timeline: exp_timeline,
                        preload_images: all_images,
                        on_trial_start: function(data){
                            jsPsych.data.get().addToAll({subject_id: urlvar.participant});
                            jsPsych.data.get().addToAll({rocket_sides: rocket_sides});
                            jsPsych.data.get().addToAll({red_planet_first_rocket: red_planet_first_rocket});
                            jsPsych.data.get().addToAll({red_display_order: red_display_order});
                            jsPsych.data.get().addToAll({purple_display_order: purple_display_order});
                            var interaction_data = jsPsych.data.getInteractionData();
                            var blur_events = interaction_data.filter({event: 'blur'});
                            var focus_events = interaction_data.filter({event: 'focus'});
                            var fullscreenenter_events = interaction_data.filter({event: 'fullscreenenter'});
                            var fullscreenexit_events = interaction_data.filter({event: 'fullscreenexit'});
                            jsPsych.data.get().addToLast({interactions: interaction_data.csv()});
                            jsPsych.data.get().addToLast({blur_events: blur_events.csv()});
                            jsPsych.data.get().addToLast({focus_events: focus_events.csv()});
                            jsPsych.data.get().addToLast({fullscreenenter_events: fullscreenenter_events.csv()});
                            jsPsych.data.get().addToLast({fullscreenexit_events: fullscreenexit_events.csv()});},
                        on_interaction_data_update: function (data) {
                            var interaction_data = jsPsych.data.getInteractionData();
                            var blur_events = interaction_data.filter({event: 'blur'});
                            var focus_events = interaction_data.filter({event: 'focus'});
                            var fullscreenenter_events = interaction_data.filter({event: 'fullscreenenter'});
                            var fullscreenexit_events = interaction_data.filter({event: 'fullscreenexit'});
                            jsPsych.data.get().addToLast({interactions: interaction_data.csv()});
                            jsPsych.data.get().addToLast({blur_events: blur_events.csv()});
                            jsPsych.data.get().addToLast({focus_events: focus_events.csv()});
                            jsPsych.data.get().addToLast({fullscreenenter_events: fullscreenenter_events.csv()});
                            jsPsych.data.get().addToLast({fullscreenexit_events: fullscreenexit_events.csv()});},
                        on_close: function (data) {
                            var interaction_data = jsPsych.data.getInteractionData();
                            var blur_events = interaction_data.filter({event: 'blur'});
                            var focus_events = interaction_data.filter({event: 'focus'});
                            var fullscreenenter_events = interaction_data.filter({event: 'fullscreenenter'});
                            var fullscreenexit_events = interaction_data.filter({event: 'fullscreenexit'});
                            jsPsych.data.get().addToLast({interactions: interaction_data.csv()});
                            jsPsych.data.get().addToLast({blur_events: blur_events.csv()});
                            jsPsych.data.get().addToLast({focus_events: focus_events.csv()});
                            jsPsych.data.get().addToLast({fullscreenenter_events: fullscreenenter_events.csv()});
                            jsPsych.data.get().addToLast({fullscreenexit_events: fullscreenexit_events.csv()});
                            jsPsych.data.get().addToAll({subject_id: urlvar.participant});
                            jsPsych.data.get().addToAll({rocket_sides: rocket_sides});
                            jsPsych.data.get().addToAll({red_planet_first_rocket: red_planet_first_rocket});
                            jsPsych.data.get().addToAll({red_display_order: red_display_order});
                            jsPsych.data.get().addToAll({purple_display_order: purple_display_order});},
                            //jsPsych.data.get().localSave('csv', file_name);},
                        on_finish: function (data) {
                            var interaction_data = jsPsych.data.getInteractionData();
                            var blur_events = interaction_data.filter({event: 'blur'});
                            var focus_events = interaction_data.filter({event: 'focus'});
                            var fullscreenenter_events = interaction_data.filter({event: 'fullscreenenter'});
                            var fullscreenexit_events = interaction_data.filter({event: 'fullscreenexit'});
                            jsPsych.data.get().addToLast({interactions: interaction_data.csv()});
                            jsPsych.data.get().addToLast({blur_events: blur_events.csv()});
                            jsPsych.data.get().addToLast({focus_events: focus_events.csv()});
                            jsPsych.data.get().addToLast({fullscreenenter_events: fullscreenenter_events.csv()});
                            jsPsych.data.get().addToLast({fullscreenexit_events: fullscreenexit_events.csv()});
                            jsPsych.data.get().addToAll({subject_id: urlvar.participant});
                            jsPsych.data.get().addToAll({rocket_sides: rocket_sides});
                            jsPsych.data.get().addToAll({red_planet_first_rocket: red_planet_first_rocket});
                            jsPsych.data.get().addToAll({red_display_order: red_display_order});
                            jsPsych.data.get().addToAll({purple_display_order: purple_display_order});
                            //jsPsych.data.get().localSave('csv', file_name);         
                            // document.body.innerHTML = '<p> <center> Please wait. You will be redirected to the next task in 10 seconds. Please click "leave" when asked if you would like to leave this page. </center> </p>'
                            // setTimeout(function () { location.href = mars_task}, 10000)
                        }
                    });
                });
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

// Styling
export const block_trials = 50; // total number of trials in each block
export const transprob = 0.7; // probability of 'correct' transition

export const right_key = '0'; // 0 at top of keyboard
export const left_key = '1'; // 1 at top of keyboard

export const randomize_side = false;

// subject level display orders for when we aren't randomizing every trial
export const rocket_sides = (Math.random() < .5);
export const prac_rocket_sides = (Math.random() < .5);
export const red_display_order = (Math.random() < .5);
export const purple_display_order = (Math.random() < .5);
export const green_display_order = (Math.random() < .5);
export const yellow_display_order = (Math.random() < .5);

export const moneytime = 1000; // 1000 according to Decker 2016;
export const isitime = 1000; // 1000 according to Decker 2016;
export const choicetime = 3000; // 3000 according to Decker 2016;
export const box_moving_time = 90; // from comment in matlab code
export const ititime = 1000; // 1000 according to Decker 2016;

export const num_blocks = 4;

export const reward_instructions_payoff = ['.8', '.8', '.8', '.8'];
export const instructions_payoff = ['.9', '.1', '.9', '.1'];

export const red_planet_first_rocket = (Math.random() < 0.5);

export const reward_string = 'images/t.png';
export const null_string = 'images/nothing.png';

export const practice_reward = 0;
export const real_reward = 0;

export const practice_pressing_idx = 5;
export const practice_pressing_num = 4; // 4 trials to practice selecting alien
export const practice_reward_idx = 10 + practice_pressing_num;
export const practice_reward_num = 10; // 10 trials to practice asking alien
export const practice_stochastic_idx =
    17 + practice_pressing_num + practice_reward_num;
export const practice_stochastic_num = 10; // 10 trials practice choosing aliens
export const practice_game_idx =
    34 + practice_pressing_num + practice_reward_num + practice_stochastic_num;
export const practice_game_num = 20; // 20 trials to practice full game

export const image_path = '../images/';
export const image_strings = [
  'alien1_a1.png',
  'alien4_sp.png',
  'tutalien1_a2.png',
  'tutalien4_deact.png',
  'alien1_a2.png',
  'blackbackground.jpg',
  'tutalien1_deact.png',
  'tutalien4_norm.png',
  'alien1_deact.png',
  'earth.jpg',
  'tutalien1_norm.png',
  'tutalien4_sp.png',
  'alien1_norm.png',
  'nothing.png',
  'tutalien1_sp.png',
  'tutgreenplanet.jpg',
  'alien1_sp.png',
  'purpleplanet.jpg',
  'alien2_a1.png',
  'redplanet1.jpg',
  'tutalien2_a1.png',
  'tutrocket1_a1.png',
  'alien2_a2.png',
  'rocket1_a1.png',
  'tutalien2_a2.png',
  'tutrocket1_a2.png',
  'alien2_deact.png',
  'rocket1_a2.png',
  'tutalien2_deact.png',
  'tutrocket1_deact.png',
  'alien2_norm.png',
  'rocket1_deact.png',
  'tutalien2_norm.png',
  'tutrocket1_norm.png',
  'alien2_sp.png',
  'rocket1_norm.png',
  'tutalien2_sp.png',
  'tutrocket1_sp.png',
  'alien3_a1.png',
  'rocket1_sp.png',
  'alien3_a2.png',
  'rocket2_a1.png',
  'tutalien3_a1.png',
  'tutrocket2_a1.png',
  'alien3_deact.png',
  'rocket2_a2.png',
  'tutalien3_a2.png',
  'tutrocket2_a2.png',
  'alien3_norm.png',
  'rocket2_deact.png',
  'tutalien3_deact.png',
  'tutrocket2_deact.png',
  'alien3_sp.png',
  'rocket2_norm.png',
  'tutalien3_norm.png',
  'tutrocket2_norm.png',
  'alien4_a1.png',
  'rocket2_sp.png',
  'tutalien3_sp.png',
  'tutrocket2_sp.png',
  'alien4_a2.png',
  't.png',
  'tutyellowplanet.jpg',
  'alien4_deact.png',
  'tutalien4_a1.png',
  'alien4_norm.png',
  'tutalien1_a1.png',
  'tutalien4_a2.png',
  'fish.png',
  'tiger.png',
  'shark.png',
  'turtle.png',
  'replay.png',
];

export const all_images = image_strings.map((data) => {
  return image_path + data;
});

// Audio to preload
export const quiz_audio = [
  'audio/quiz/Q1_Correct.wav',
  'audio/quiz/Q1_Incorrect.wav',
  'audio/quiz/Q2_Correct.wav',
  'audio/quiz/Q2_Incorrect.wav',
  'audio/quiz/Q3_Correct.wav',
  'audio/quiz/Q3_Incorrect.wav',
  'audio/beep_loop.wav',
  'audio/instructions/treasure_feedback.wav',
  'audio/instructions/break_1.wav',
  'audio/instructions/break_2.wav',
  'audio/instructions/break_3.wav',
  'audio/instructions/query.wav',
  'audio/instructions/end_of_task.wav',
];

// Global position variables
export const height = window.innerHeight;
export const width = window.innerWidth;

// scaling for window sizes
export let picture_height;
export let picture_width;

// if the participant or researcher resizes things will break!
if (window.innerWidth / window.innerHeight < 1.34) {
  picture_height = window.innerWidth / 1.34;
  picture_width = window.innerWidth;
} else {
  picture_height = window.innerHeight;
  picture_width = window.innerHeight * 1.34;
}

// scaling from original to picture
export const monster_size = picture_height * 300 / 758;

// similarly for the reward
export const reward_size = picture_height * 75 / 758;

export const x_center = width / 2;
export const y_center = height / 2;

export const choice_y = y_center + 0.22 * picture_height - monster_size / 2;
export const choice_x_right =
    x_center + 0.25 * picture_width - monster_size / 2;
export const choice_x_left = x_center - 0.25 * picture_width - monster_size / 2;

export const chosen_y = y_center - 0.06 * picture_height - monster_size / 2;
export const chosen_x = x_center - monster_size / 2;

export const reward_y =
    y_center - 0.06 * picture_height - reward_size / 2 - monster_size / 2;
export const reward_x = x_center - reward_size / 2;

export const text_start_y = y_center - 0.2 * picture_height;
export const instructions_text_start_y = y_center - 0.4 * picture_height;
export const text_start_x = x_center - 0.49 * picture_width;
export const font_size = picture_height * 25 / 758;

/** Texts **/
const id_prompt = 'Please enter your subject ID';
export const query_text = 'Which spaceship went mostly to the red planet?';
const break_text_1 = `
    Great job so far!
    You have completed 1 out of 4 rounds.
    <br>
    You may now take a break.
    <br>
    Press the button when you are ready for the next round.
`;
const break_text_2 = `
    Awesome! You are halfway through the game.
    <br>
    You may now take a break.
    <br>
    Press the button when you are ready for the next round.
`;
const break_text_3 = `
    Almost done! Just 1 more round to go.
    <br>
    You may now take a break.
    <br>
    Press the button when you are ready for the next round.
`;

export const instructions = [];
export const audio_instructions = [];

// black background
instructions[0] = [
  [
    'Please listen to the instructions and read each page carefully.',
    'When you are ready to go to the next page,',
    'click on the red circle on the bottom right so that it turns green.',
    'Then, press the space bar.',
  ],
];

// rocket background
instructions[1] = [
    ['In this game, you will be taking a spaceship from earth', 'to look for space treasure on two different planets.']
];


// alien background
instructions[2] = [
    ['Each planet has two aliens on it. ', ' And each alien has its own space treasure mine.'],
    ['On each planet, you will pick one alien to ask for space treasure. ', 'These aliens are nice, so if an alien just brought treasure ', ' up from the mine, it will share it with you.'],
    ['For each choice, choose the left alien by pressing the 1 key ', ' and the right alien by pressing the 0 key. ', 'The choice you make will be highlighted.', 'Click the red circle and press the space bar to move to the next page.', 'Then try practicing a few times by pressing 1 and 0.']
];

// black background
instructions[3] = [
    ['After you choose an alien, you will find out whether you got treasure.  ', ' Which looks like this.   '],
    ['If the alien couldn\'t bring treasure up this time you\'ll see an empty circle.  ', ' Which looks like this.   '],
    ['If an alien has a good mine that means it can easily dig up space treasure ', ' and it will be very likely to have some to share.  '],
    ['It might not have treasure EVERY time you ask, but it will most of the time. ', ' Another alien might have a bad mine that is hard to dig through at the moment, ', ' and won\'t have treasure to share most times you ask.']
];

//yellow alien
instructions[4] = [
    ['For example, the alien on the yellow planet has a good mine right now. ', 'Click the red circle and press the space bar to move to the next page. ', 'Then, try asking it for treasure 10 times by pressing 1.'],
    ['See, this alien shared treasure most of the times you asked, ', ' but not every time.  ']
];

//black background
instructions[5] = [
    ['Every alien has treasure in its mine, but they can\'t share every time. ', ' Some will be more likely to share because it is easier to dig right now. ']
];

// one right
instructions[6] = [
    ['Next, you can choose between two aliens ', ' and try to figure out which one has more treasure to share.', '']
];

//one left
instructions[7] = [
   ['...and sometimes come up on the left.']
];

//black
instructions[8] = [
    ['Which side an alien appears on does not matter. ', ' For instance, left is not luckier than right.'],
    ['You can practice choosing now. ', ' You have 20 choices to try to figure out which alien has a good mine.  '],
    ['Remember, key 1 is for the left alien, and key 0 is for the right alien.  ', ' Click the red circle and then press any key to start.']
];

//black
instructions[9] = [
    ['Good. You might have learned that this alien had treasure more often. ', ' Also, even if this alien had a better mine, ', ' you couldn\'t be sure if it had treasure all the time.   '],
    ['Each alien is like a game of chance, you can never be sure but you can guess. '],
    ['The treasure an alien can give will change during the game. '],
    ['Those with a good mine might get to a part of the mine that is hard to dig. ', ' Those with little to share might find easier treasure to dig. ', ' Any changes in an alien\'s mine will happen slowly, ', ' so try to focus to get as much treasure as possible.'],
    ['While the chance an alien has treasure to share changes over time, ', ' it changes slowly.  '],
    ['So an alien with a good treasure mine right now will stay good for a while. ', ' To find the alien with the best mine at each point in time, ', ' you must concentrate. ']
];

//rocket
instructions[10] = [
    ['Now that you know how to pick aliens, you can learn to play the whole game. ', ' You will travel from earth to one of two planets.']
];

//green
instructions[11] = [
    ['Here is the green planet']
];

//yellow
instructions[12] = [
    ['And here is the yellow planet']
];

//rocket
instructions[13] = [
    ['First you need to choose which spaceship to take.  ', ' The spaceships can fly to either planet, but one will fly mostly ', ' to the green planet, and the other mostly to the yellow planet.'],
    ['The planet a spaceship goes to most won\'t change during the game. ', ' Pick the one that you think will take you to the alien ', ' with the best mine, but remember, sometimes you\'ll go to the other planet!']
];

//rocket
instructions[14] = [
    ['Let\'s practice before doing the full game.  ', ' Remember, you want to find as much space treasure as you can ', ' by asking an alien to share with you.'],
    ['The aliens share somewhat randomly, ', ' but you can find the one with the best mine at any point in the game ', ' by asking it to share!  '],
    ['How much bonus money you make is based on how much space treasure you find. ', ' This is just a practice round of 20 flights, you\'re not playing for money now.'],
    ['You will have three seconds to make each choice.  If you are too slow, ', ' you will see a large X appear on each rocket or alien and that choice will be over.'],
    ['Don\'t feel rushed, but please try to make a choice every time.'],
    ['Good luck! Remember that 1 selects left and 0 selects right.']
];

// //black
instructions[15] = [
    ['That is the end of the practice game.  ', ' Click the red button. Then press any key to see how you did...'],
];

instructions[16] = [
    ['Okay, that is nearly the end of the tutorial!  ', ' In the real game, the planets, aliens, and spaceships will be new colors, ', ' but the rules will be the same.  ', ' The game is hard, so you will need to concentrate, ', ' but don\'t be afraid to trust your instincts. ', ' Here are three hints on how to play the game.'],
    ['Hint #1:  ', ' Remember which aliens have treasure. How good a mine is changes slowly, ', ' so an alien that has a lot of treasure to share now, ', ' will probably be able to share a lot in the near future. '],
    ['Hint #2:  ', ' Remember, each alien has its own mine.  Just because one alien has a bad ', ' mine and can\'t share very often, does not mean another has a good mine.  ', ' Also, there are no funny patterns in how an alien shares, ', ' like every other time you ask, or depending on which spaceship you took. ', ' The aliens are not trying to trick you.'],
    ['Hint #3:  ', ' The spaceship you choose is important because often an alien on one planet ', ' may be better than the ones on another planet. ', ' You can find more treasure by finding the spaceship ', ' that is most likely to take you to right planet.'],
];

instructions[17] = [
    ['Now it\'s time to make sure you know how to play.  ', 'Please respond TRUE or FALSE to the questions on the next few pages.']
];

instructions[18] = [
    ['OK! Now you know how to play.  ', ' In the real game we\'ll count how many pieces of space treasure ', ' you find and show you at the end. ', ' Ready?  Now its time to play the game!  Good luck space traveler!']
];


export let left_images = [];
export let right_images = [];
export let center_images = [];
export let reward_images = [];
export let audio_files = [];
export let button_images = [];

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
    button_images[i][j] = 'images/button.jpeg';
  }
}

reward_images[3][0] = reward_string;
reward_images[3][1] = null_string;

center_images[4][0] = 'images/tutalien3_norm.png';
center_images[4][1] = 'images/tutalien3_norm.png';
center_images[9][0] = 'images/tutalien2_norm.png';

right_images[1][0] = 'images/tutrocket1_norm.png';
left_images[1][0] = 'images/tutrocket2_norm.png';

right_images[2][0] = 'images/tutalien1_norm.png';
left_images[2][0] = 'images/tutalien2_norm.png';
right_images[2][1] = 'images/tutalien1_norm.png';
left_images[2][1] = 'images/tutalien2_norm.png';
right_images[2][2] = 'images/tutalien1_norm.png';
left_images[2][2] = 'images/tutalien2_norm.png';

right_images[6][0] = 'images/tutalien1_norm.png';
right_images[7][0] = 'images/tutalien2_norm.png';

left_images[6][0] = 'images/tutalien2_norm.png';
left_images[7][0] = 'images/tutalien1_norm.png';

right_images[13][0] = 'images/tutrocket1_norm.png';
right_images[13][1] = 'images/tutrocket1_norm.png';
right_images[14][0] = 'images/tutrocket1_norm.png';
right_images[14][1] = 'images/tutrocket1_norm.png';
right_images[14][2] = 'images/tutrocket1_norm.png';
right_images[14][3] = 'images/tutrocket1_sp.png';
right_images[14][4] = 'images/tutrocket1_norm.png';
right_images[14][5] = 'images/tutrocket1_norm.png';

left_images[13][0] = 'images/tutrocket2_norm.png';
left_images[13][1] = 'images/tutrocket2_norm.png';
left_images[14][0] = 'images/tutrocket2_norm.png';
left_images[14][1] = 'images/tutrocket2_norm.png';
left_images[14][2] = 'images/tutrocket2_norm.png';
left_images[14][3] = 'images/tutrocket2_sp.png';
left_images[14][4] = 'images/tutrocket2_norm.png';
left_images[14][5] = 'images/tutrocket2_norm.png';

export const instructions_backgrounds = [
  'images/blackbackground.jpg',
  'images/earth.jpg',
  'images/tutgreenplanet.jpg',
  'images/blackbackground.jpg',
  'images/tutyellowplanet.jpg',
  'images/blackbackground.jpg',
  'images/tutgreenplanet.jpg',
  'images/tutgreenplanet.jpg',
  'images/blackbackground.jpg',
  'images/blackbackground.jpg',
  'images/earth.jpg',
  'images/tutgreenplanet.jpg',
  'images/tutyellowplanet.jpg',
  'images/earth.jpg',
  'images/earth.jpg',
  'images/blackbackground.jpg',
];

//*** END Text for instruction pages**//
//**************************************//

// ADD AUDIO //

audio_instructions[0] = [["audio/instructions/I_0.1.wav"]];
audio_instructions[1] = [["audio/instructions/I_1.1.wav"]];


audio_instructions[2] = [
    ['audio/instructions/I_2.1.wav'],
    ['audio/instructions/I_2.2.wav'],
    ['audio/instructions/I_2.3.wav']
];


audio_instructions[3] = [
    ["audio/instructions/I_3.1.wav"],
    ["audio/instructions/I_3.2.wav"],
    ["audio/instructions/I_3.3.wav"],
    ["audio/instructions/I_3.4.wav"]
];

audio_instructions[4] = [
    ["audio/instructions/I_4.1.wav"],
    ["audio/instructions/I_4.2.wav"]
];

audio_instructions[5] = [
    ["audio/instructions/I_5.1.wav"]
];

audio_instructions[6] = [
    ["audio/instructions/I_6.1.wav"]
];

audio_instructions[7] = [
    ["audio/instructions/I_7.1.wav"]
];

audio_instructions[8] = [
    ["audio/instructions/I_8.1.wav"],
    ["audio/instructions/I_8.2.wav"],
    ["audio/instructions/I_8.3.wav"]
];

audio_instructions[9] = [
    ["audio/instructions/I_9.1.wav"],
    ["audio/instructions/I_9.2.wav"],
    ["audio/instructions/I_9.3.wav"],
    ["audio/instructions/I_9.4.wav"],
    ["audio/instructions/I_9.5.wav"],
    ["audio/instructions/I_9.6.wav"]
];

audio_instructions[10] = [
    ["audio/instructions/I_10.1.wav"]
];

audio_instructions[11] = [
    ["audio/instructions/I_11.1.wav"]
];

audio_instructions[12] = [
    ["audio/instructions/I_12.1.wav"]
];

audio_instructions[13] = [
    ["audio/instructions/I_13.1.wav"],
    ["audio/instructions/I_13.2.wav"]
];

audio_instructions[14] = [
    ["audio/instructions/I_14.1.wav"],
    ["audio/instructions/I_14.2.wav"],
    ["audio/instructions/I_14.3.wav"],
    ["audio/instructions/I_14.4.wav"],
    ["audio/instructions/I_14.5.wav"],
    ["audio/instructions/I_14.6.wav"]
];

audio_instructions[15] = [
    ["audio/instructions/I_15.1.wav"]
];

audio_instructions[16] = [
    ["audio/instructions/I_16.1.wav"],
    ["audio/instructions/I_16.2.wav"],
    ["audio/instructions/I_16.3.wav"],
    ["audio/instructions/I_16.4.wav"],
];

audio_instructions[17] = [
    ["audio/instructions/I_17.1.wav"]
];

audio_instructions[18] = [
    ["audio/instructions/I_18.1.wav"]
];

var t_i,
    curr_page,
    curr_side;

function create_instructions(image, texts, audio_files, sect_right_texts, sect_left_texts, sect_center_texts, sect_reward_texts) {
    'use strict';
    var instruction_pages = [];
    for (t_i = 0; t_i < texts.length; t_i += 1) {
        curr_page  = {
            type: 'd3-instructions',
            stimulus: image,
            right_text: sect_right_texts[t_i],
            left_text: sect_left_texts[t_i],
            center_text: sect_center_texts[t_i],
            reward_string: sect_reward_texts[t_i],
            choices: jsPsych.ALL_KEYS,
            prompt: texts[t_i],
            audio_stimulus: audio_files[t_i]
        }; 
        instruction_pages.push(curr_page);
    }
    return instruction_pages;
}

// Create instructions
export let curr_instructions = [];
for (let i = 0; i < instructions.length; i += 1) {
    curr_instructions = curr_instructions.concat(create_instructions(instructions_backgrounds[i], instructions[i], audio_instructions[i], right_images[i], left_images[i], center_images[i], reward_images[i], button_images[i]));
}


// INSERT PRACTICE
// insert 4 selection practice trials on instructions page 5 
for (let i = 0; i < (practice_pressing_num - 1); i += 1) {
  curr_instructions.splice(practice_pressing_idx, 0, {
    type: 'd3-animate-choice',
    timeout: false,
    choices: [left_key, right_key],
    planet_text: 'images/tutgreenplanet.jpg',
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
    planet_text: "images/tutgreenplanet.jpg",
    right_text: "images/tutalien1",
    left_text: "images/tutalien2",
    trial_duration: choicetime
});

// insert 10 treasure asking practice trials
for (let i = 0; i < practice_reward_num; i += 1) {
    curr_instructions.splice(practice_reward_idx, 0, {
        type: 'd3-animate-choice',
        timeout: false,
        trial_row: reward_instructions_payoff,
        choices: [left_key, right_key],
        planet_text: "images/tutyellowplanet.jpg",
        right_text: function() {if (curr_side === true) {return "images/tutalien3";} return null;},
        left_text: function() {if (curr_side === true) {return null;} return "images/tutalien3";},
        trial_duration: choicetime
    });
}

// insert 10 asking green aliens for reward trials
for (let i = 0; i < practice_stochastic_num; i += 1) {
    curr_instructions.splice(practice_stochastic_idx, 0, {
        type: 'd3-animate-choice',
        timeout: false,
        trial_row: instructions_payoff,
        choices: [left_key, right_key],
        planet_text: "images/tutgreenplanet.jpg",
        right_text: "images/tutalien1",
        left_text: "images/tutalien2",
        trial_duration: choicetime
    });
}

//remove the instructions about aliens on either side
curr_instructions.splice(27,3) 

// Insert audio test trials
// curr_instructions.splice(1, 0, {
//     type: 'html-keyboard-response',
//     choices: jsPsych.ALL_KEYS,
//     stimulus: 'Welcome! Press the space bar to begin.',
// });

// curr_instructions.splice(2, 0, {
//     type: 'audio-keyboard-response',
//     stimulus: 'audio/beep_loop.wav',
//     choices: jsPsych.ALL_KEYS,
//     prompt: 'You should now hear beeps playing. If so, press the space bar to proceed to the audio test.',
// });


// curr_instructions.splice(3, 0, {
//     type: 'audio-button-response',
//     stimulus: 'audio/fish.mp3',
//     choices: ['repeat', 'fish', 'tiger', 'turtle', 'shark'],
//     correct_answer: 1,
//     prompt: 'Click on the word that you just heard.',
//     incorrect_prompt: 'Incorrect, please adjust your volume and try again.',
//     margin_vertical: '40px',
//     margin_horizontal: '10px',
//     button_html:[
//         '<img src="images/replay.png" height="200px" width="200px"/>',
//         '<img src="images/fish.png" height="200px" width="200px"/>',
//         '<img src="images/tiger.png" height="200px" width="200px"/>',
//         '<img src="images/turtle.png" height="200px" width="200px"/>',
//         '<img src="images/shark.png" height="200px" width="200px"/>'
//     ],
//     post_trial_gap: 1000
// });


// curr_instructions.splice(4, 0, {
//     type: 'audio-button-response',
//     stimulus: 'audio/tiger.mp3',
//     choices: ['repeat', 'turtle', 'shark', 'fish', 'tiger'],
//     correct_answer: 4,
//     prompt: 'Again, click on the word that you just heard.',
//     incorrect_prompt: 'Incorrect, please adjust your volume and try again.',
//     margin_vertical: '40px',
//     margin_horizontal: '10px',
//     button_html:[
//         '<img src="images/replay.png" height="200px" width="200px"/>',
//         '<img src="images/turtle.png" height="200px" width="200px"/>',
//         '<img src="images/shark.png" height="200px" width="200px"/>',
//         '<img src="images/fish.png" height="200px" width="200px"/>',
//         '<img src="images/tiger.png" height="200px" width="200px"/>'
//     ],
//     post_trial_gap: 1000
// });

// add full screen after audio test
// curr_instructions.splice(5, 0, {
//     type: 'fullscreen', 
//     message: '<p> Press start to enter full-screen mode and start the game. </p>',
//     button_label: 'Start',
//     fullscreen_mode: true});

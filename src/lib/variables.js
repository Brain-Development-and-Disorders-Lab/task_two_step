// Experiment-wide variables
// Number of trials in a 'block' of trials
export const block_size = 50;
export const num_blocks = 4;

// Number of trial types
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

// Transition probability
export const probability = 0.7;

// Keys and control scheme
export const right_key = '0'; // 0 at top of keyboard
export const left_key = '1'; // 1 at top of keyboard

// Random variables
export const rocket_sides = (Math.random() < 0.5);
export const prac_rocket_sides = (Math.random() < 0.5);
export const red_display_order = (Math.random() < 0.5);
export const purple_display_order = (Math.random() < 0.5);
export const green_display_order = (Math.random() < 0.5);
export const yellow_display_order = (Math.random() < 0.5);
export const red_planet_first_rocket = (Math.random() < 0.5);

// Durations
export const money_time = 1000; // 1000 according to Decker 2016;
export const isi_time = 1000; // 1000 according to Decker 2016;
export const choice_time = 3000; // 3000 according to Decker 2016;
export const box_moving_time = 90; // from comment in matlab code

// Payoffs
export const reward_instructions_payoff = ['0.8', '0.8', '0.8', '0.8'];
export const instructions_payoff = ['0.9', '0.1', '0.9', '0.1'];

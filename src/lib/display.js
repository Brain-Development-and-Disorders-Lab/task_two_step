// Functions and constants that handle display sizing
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

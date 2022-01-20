// Functions and constants that handle display sizing
// Beware: multiple 'magic' numbers in this file
// Global position variables
export const height = window.innerHeight;
export const width = window.innerWidth;

// Overall scaling and picture sizing
export let pictureHeight;
export let pictureWidth;
if (window.innerWidth / window.innerHeight < 1.34) {
  pictureHeight = window.innerWidth / 1.34;
  pictureWidth = window.innerWidth;
} else {
  pictureHeight = window.innerHeight;
  pictureWidth = window.innerHeight * 1.34;
}

// Image scaling
export const sizeMonster = pictureHeight * 300 / 758;
export const sizeReward = pictureHeight * 75 / 758;

// Font size
export const sizeFont = pictureHeight * 25 / 758;

// Coordinate system for placing stimuli
// Center points
export const centerX = width / 2;
export const centerY = height / 2;

// Left and right choices
// y-coordinate
export const choiceY =
  centerY + 0.22 * pictureHeight - sizeMonster / 2;
// x-coordinates
export const choiceXRight =
  centerX + 0.25 * pictureWidth - sizeMonster / 2;
export const choiceXLeft = centerX - 0.25 * pictureWidth - sizeMonster / 2;

// Chosen stimulus location
export const chosenY = centerY - 0.06 * pictureHeight - sizeMonster / 2;
export const chosenX = centerX - sizeMonster / 2;

export const rewardY =
  centerY - 0.06 * pictureHeight - sizeReward / 2 - sizeMonster / 2;
export const rewardX = centerX - sizeReward / 2;

// Text positioning
export const textX = centerX - 0.49 * pictureWidth;
export const textY = centerY - 0.2 * pictureHeight;

export const textInstructionsY = centerY - 0.4 * pictureHeight;

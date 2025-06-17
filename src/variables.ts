/**
 * The jsPsych version of the task was originally coded by the Niv Lab (https://nivlab.princeton.edu/)
 * at Princeton, adapted by the Hartley Lab (https://www.hartleylab.org/) at NYU for use online
 * with children, adolescents, and adults, and adapted here by the Brain Development and Disorders Lab
 * (https://sites.wustl.edu/richardslab) at Washington University in St. Louis.
 *
 * Experiment-wide variables
 */

// Number of trials in a 'block' of trials
export const blockLength = 50;
export const blockCount = 4;

// Number of trial types
export const practicePressingIdx = 5;
export const practicePressingNum = 4; // 4 trials to practice selecting alien
export const practiceRewardIdx = 10 + practicePressingNum;
export const practiceRewardNum = 10; // 10 trials to practice asking alien
export const practiceStochasticIdx = 17 + practicePressingNum + practiceRewardNum;
export const practiceStochasticNum = 10; // 10 trials practice choosing aliens
export const practiceGameIdx = 34 + practicePressingNum + practiceRewardNum + practiceStochasticNum;
export const practiceGameCount = 20; // 20 trials to practice full game

// Transition probability
export const probability = 0.7;

// Display variables
// Global position variables
export const height = window.innerHeight;
export const width = window.innerWidth;

// Overall scaling and picture sizing
export let pictureHeight: number;
export let pictureWidth: number;

if (window.innerWidth / window.innerHeight < 1.34) {
  pictureHeight = window.innerWidth / 1.34;
  pictureWidth = window.innerWidth;
} else {
  pictureHeight = window.innerHeight;
  pictureWidth = window.innerHeight * 1.34;
}

// Image scaling
export const sizeMonster = (pictureHeight * 300) / 758;
export const sizeReward = (pictureHeight * 75) / 758;
export const sizeButton = (pictureHeight * 25) / 758;

// Font size
export const sizeFont = (pictureHeight * 25) / 758;

// Coordinate system for placing stimuli
export const centerX = width / 2;
export const centerY = height / 2;

// Left and right choices
export const choiceY = centerY + 0.22 * pictureHeight - sizeMonster / 2;
export const choiceXRight = centerX + 0.25 * pictureWidth - sizeMonster / 2;
export const choiceXLeft = centerX - 0.25 * pictureWidth - sizeMonster / 2;

// Chosen stimulus location
export const chosenY = centerY - 0.06 * pictureHeight - sizeMonster / 2;
export const chosenX = centerX - sizeMonster / 2;

export const rewardY = centerY - 0.06 * pictureHeight - sizeReward / 2 - sizeMonster / 2;
export const rewardX = centerX - sizeReward / 2;

// Text positioning
export const textX = window.innerWidth / 2;
export const textY = window.innerHeight / 5;
export const textInstructionsY = window.innerHeight / 5;

// Instructions
export const instructions: any[][] = [];

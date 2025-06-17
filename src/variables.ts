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

// Black background
instructions[15] = [
  [
    "That is the end of the practice games.",
    "",
    "Click the red button and press the spacebar when you are ready to continue.",
  ],
];

// Hints
instructions[16] = [
  [
    "This is nearly the end of the tutorial!",
    "",
    "In the real game, the planets, aliens, and spaceships will be new colors,",
    "but the rules will be the same.",
    "",
    "The game is hard, so you will need to concentrate,",
    "but don't be afraid to trust your instincts.",
    "",
    "Here are three hints on how to play the game.",
  ],
  [
    "Hint #1:",
    "Remember which aliens have treasure. How good a mine is changes slowly,",
    "so an alien that has a lot of treasure to share now,",
    "will probably be able to share a lot in the near future.",
  ],
  [
    "Hint #2:",
    "Remember, each alien has its own mine. Just because one alien has a bad ",
    "mine and can't share very often, does not mean another has a good mine.",
    "",
    "The aliens are not trying to trick you!",
    "",
    "Your actions do not change how good a mine is," +
    "and the aliens will not hide treasure from you if they have it available.",
  ],
  [
    "Hint #3:",
    "The spaceship you choose is important because often an alien on one planet ",
    "may be better than the ones on another planet.",
    "",
    "You can find more treasure by finding the spaceship",
    "that is most likely to take you to right planet.",
  ],
];

// Pre-attention-check
instructions[17] = [
  [
    "Now it's time to make sure you know how to play.",
    "",
    "Please respond 'True' or 'False' to the questions on the next few pages.",
  ],
];

// Pre-game
instructions[18] = [
  [
    "OK! Now you know how to play.",
    "",
    "In the real game we'll count how many pieces of space treasure",
    "you find and show you at the end.",
    "",
    "Ready? Now its time to play the game! Good luck space traveler!",
  ],
];

export const firstBreak = [
  [
    `Great job so far! You have completed 1 out of 4 rounds.`,
    "You may now take a break.",
    "",
    "Click the red button and press the spacebar when you are ready to continue.",
  ],
];

export const secondBreak = [
  [
    "Awesome! You are halfway through the game.",
    "",
    "You may now take a break.",
    "",
    "Click the red button and press the spacebar when you are ready to continue.",
  ],
];

export const thirdBreak = [
  [
    "Almost done! Just 1 more round to go.",
    "",
    "You may now take a break.",
    "",
    "Click the red button and press the spacebar when you are ready to continue.",
  ],
];

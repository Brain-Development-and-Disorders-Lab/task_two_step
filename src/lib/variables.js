/**
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
export const practiceStochasticIdx =
  17 + practicePressingNum + practiceRewardNum;
export const practiceStochasticNum = 10; // 10 trials practice choosing aliens
export const practiceGameIdx =
  34 + practicePressingNum + practiceRewardNum + practiceStochasticNum;
export const practiceGameNum = 20; // 20 trials to practice full game

// Transition probability
export const probability = 0.7;

// Keys and control scheme
export const keyRight = '0'; // 0 at top of keyboard
export const keyLeft = '1'; // 1 at top of keyboard

// Random variables
export const rocketSides = Math.random() < 0.5;
export const pracRocketSides = Math.random() < 0.5;
export const displayOrderRed = Math.random() < 0.5;
export const displayOrderPurple = Math.random() < 0.5;
export const displayOrderGreen = Math.random() < 0.5;
export const displayOrderYellow = Math.random() < 0.5;
export const redPlanetFirstRocket = Math.random() < 0.5;

// Durations
export const timeMoney = 1000; // 1000 according to Decker 2016;
export const timeFlash = 1000; // 1000 according to Decker 2016;
export const timeChoice = 3000; // 3000 according to Decker 2016;
export const timeTransition = 90; // from comment in matlab code

// Payoffs
export const payoffReward = ['0.8', '0.8', '0.8', '0.8'];
export const payoffInstructions = ['0.9', '0.1', '0.9', '0.1'];

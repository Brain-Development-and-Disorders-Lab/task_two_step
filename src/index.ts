/**
 * The jsPsych version of the task was originally coded by the Niv Lab (https://nivlab.princeton.edu/)
 * at Princeton, adapted by the Hartley Lab (https://www.hartleylab.org/) at NYU for use online
 * with children, adolescents, and adults, and adapted here by the Brain Development and Disorders Lab
 * (https://sites.wustl.edu/richardslab) at Washington University in St. Louis.
 *
 * Configure the experiment and create the timeline
 */
// Logging library
import consola from "consola";

// Neurocog library
import { Experiment } from "neurocog";

// General jsPsych imports
import "jspsych";
import "jspsych/plugins/jspsych-preload";
import "jspsych-attention-check";

// Import all our plugins
import "./plugins/two-step-choice";
import "./plugins/two-step-instructions";
import "./plugins/two-step-fixation";

// Styling
import "./css/styles.css";

// Import data informing probabilities
import practiceProbabilityData from "./data/masterprobtut.csv";
import probabilityData from "./data/masterprob4.csv";

// Experiment variables
import {
  blockLength,
  blockCount,
  practiceGameCount,
  probability,
} from "./variables";

// Configuration
import { configuration } from "./configuration";

// Instantiate the Experiment wrapper class
export const experiment = new Experiment(configuration);

// Boolean variables decided randomly at the start of the experiment
export const rocketSides = experiment.random() < 0.5;
export const practiceRocketSides = experiment.random() < 0.5;
export const displayOrderRed = experiment.random() < 0.5;
export const displayOrderPurple = experiment.random() < 0.5;
export const displayOrderGreen = experiment.random() < 0.5;
export const displayOrderYellow = experiment.random() < 0.5;
export const redPlanetFirstRocket = experiment.random() < 0.5;
consola.info(
  `-- Task Variables --\nrocketSides: ${rocketSides}\npracticeRocketSides: ${practiceRocketSides}\ndisplayOrderRed: ${displayOrderRed}\ndisplayOrderPurple: ${displayOrderPurple}\ndisplayOrderGreen: ${displayOrderGreen}\ndisplayOrderYellow: ${displayOrderYellow}\nredPlanetFirstRocket: ${redPlanetFirstRocket}\n`
);

/**
 * Function yielding a three-stage grouping of jsPsych trials. This grouping represents
 * the first decision (between two rockets), the second decision (between two aliens), and
 * a fixation cross.
 * @param {any[]} variables timeline variables
 * @param {{ [x: string]: any }} probabilityData probability data related to the
 * trials of the block
 * @param {boolean} isPractice whether or not the block of trials
 * are practice trials
 * @return {any} three-stage grouping, including first decision,
 * second decision, and fixation cross
 */
const createBlock = (
  variables: any[],
  probabilityData: { [x: string]: any },
  isPractice: boolean
): any => {
  // Local scope for state
  let stageState: any[] = [];

  // Create the generic experimental procedure for a single trial.
  // Consists of the first and second choices.
  const procedure = {
    timeline: [
      {
        // Instantiate the first choice
        type: "two-step-choice",
        trialStage: "1",
        trialNumber: jsPsych.timelineVariable("trialNumber"),
        choices: [configuration.controls.left, configuration.controls.right],

        // Trial stimuli
        planetStimulus: experiment.getStimuli().getImage("earth.png"),
        leftStimulus: jsPsych.timelineVariable("leftStimulus"),
        rightStimulus: jsPsych.timelineVariable("rightStimulus"),

        // Specify if this is a practice trial or not
        isPractice: isPractice,

        // Define the 'on_start' callback
        on_start: () => {
          stageState = [];
        },

        // Define the 'on_start' callback
        on_finish: (data: any) => {
          // Specify the choice made in the data
          if (data.key_press == configuration.controls.left) {
            data.choice = 1;
          }
          if (data.key_press == configuration.controls.right) {
            data.choice = 2;
          }

          // Calcuate the transition and then the second location
          stageState = calculateTransition(data.chosenStimulus, isPractice);
          if (stageState == null || stageState.length === 0) {
            stageState = [
              data.rightStimulus,
              data.leftStimulus,
              experiment.getStimuli().getImage("earth.png"),
              null,
            ];
          }
        },

        // Specify a trial duration
        responseWindow: configuration.timing.choice,
      },
      {
        // Instantiate the second choice
        type: "two-step-choice",
        trialStage: "2",
        choices: [configuration.controls.left, configuration.controls.right],
        trialNumber: jsPsych.timelineVariable("trialNumber"),

        // Specify if this is a practice trial or not
        isPractice: isPractice,

        // Specify the trial data
        trialRow: () => {
          return probabilityData[jsPsych.timelineVariable("trialRow", true)];
        },

        // Specify the second planet
        planetStimulus: () => {
          if (stageState) return stageState[2];
        },

        // Specify the left alien?
        rightStimulus: () => {
          if (stageState) return stageState[0];
        },

        // Specify the right alien?
        leftStimulus: () => {
          if (stageState) return stageState[1];
        },

        // Specify the reward outcome
        centerStimulus: () => {
          if (stageState) return stageState[3];
        },

        // Specify the transition type
        transitionType: () => {
          if (stageState) return stageState[4];
        },

        // Specify a trial duration
        responseWindow: () => {
          if (stageState && stageState[3] == null) {
            return 0;
          } else {
            return configuration.timing.choice;
          }
        },

        // Define the 'on_finish' callback
        on_finish: (data: any) => {
          if (
            data.rewardStimulus === experiment.getStimuli().getImage("t.png")
          ) {
            if (isPractice === false) {
              experiment
                .getState()
                .set("realReward", experiment.getState().get("realReward") + 1);
            } else {
              experiment
                .getState()
                .set(
                  "practiceReward",
                  experiment.getState().get("practiceReward") + 1
                );
            }
          }

          // Specify the choice made in the data
          if (data.key_press == configuration.controls.left) {
            data.choice = 1;
          }
          if (data.key_press == configuration.controls.right) {
            data.choice = 2;
          }

          // Specify the transition type in the data
          if (data.transitionType == true) {
            data.transition = "common";
          }
          if (data.transitionType == false) {
            data.transition = "rare";
          }

          // Specify the reward outcome in the data
          if (
            data.rewardStimulus == experiment.getStimuli().getImage("t.png")
          ) {
            data.wasRewarded = true;
          } else {
            data.wasRewarded = false;
          }

          // Store the trial end time
          const trialEndTime = Date.now();
          jsPsych.data.addDataToLastTrial({ trialEndTime });
        },
      },
      {
        // Instantiate the fixation stage
        type: "two-step-fixation",
        stimulus: experiment.getStimuli().getImage("earth.png"),
        text: "+",
        responseWindow: 1000,
        trialNumber: jsPsych.timelineVariable("trialNumber"),
      },
    ],

    // Specify the timeline variables
    timeline_variables: variables,
  };

  return procedure;
};

/**
 * calculateTransition function
 * @param {string} chosenString chosenString
 * @param {boolean} isPractice practice
 * @return {any}
 */
const calculateTransition = (chosenString: string, isPractice: boolean) => {
  let debugString = "-- Function --";
  debugString += `\nName: calculateTransition`;
  debugString += `\n\tchosenString: ${chosenString}`;
  debugString += `\n\tisPractice: ${isPractice}`;

  let firstPlanet = "";
  let secondPlanet = "";

  if (chosenString === "" || typeof chosenString === "undefined") {
    consola.warn("calculateTransition: chosenString is not defined");
    return [];
  }

  if (isPractice) {
    firstPlanet = "green";
    secondPlanet = "yellow";
  } else {
    firstPlanet = "red";
    secondPlanet = "purple";
  }

  const firstShipChosen = chosenString.slice(-1) === configuration.controls.left;
  const goodTransition = experiment.random() < probability;
  debugString += `\n\tprobability: ${probability}`;
  debugString += `\n\tgoodTransition: ${goodTransition}`;

  // Determine the resulting planet based on ship choice, rocket configuration, and transition type
  let planet = "";
  const isCommonTransition = goodTransition;

  if (redPlanetFirstRocket) {
    // If rocket 1 goes to red planet (redPlanetFirstRocket is true)
    planet =
      firstShipChosen === isCommonTransition ? firstPlanet : secondPlanet;
  } else {
    // If rocket 2 goes to red planet (redPlanetFirstRocket is false)
    planet =
      firstShipChosen === isCommonTransition ? secondPlanet : firstPlanet;
  }
  debugString += `\n\tplanet: ${planet}`;
  consola.info(debugString);

  let displayOrder = true;
  if (planet === "red") {
    // Counter-balancing only enabled in non-practice trials
    if (isPractice === false) {
      displayOrder = displayOrderRed;
    }

    if (displayOrder) {
      return [
        "alien2",
        "alien1",
        experiment.getStimuli().getImage("redplanet1.png"),
        chosenString,
        goodTransition,
      ];
    } else {
      return [
        "alien1",
        "alien2",
        experiment.getStimuli().getImage("redplanet1.png"),
        chosenString,
        goodTransition,
      ];
    }
  } else if (planet === "purple") {
    // Counter-balancing only enabled in non-practice trials
    if (isPractice === false) {
      displayOrder = displayOrderPurple;
    }

    if (displayOrder) {
      return [
        "alien4",
        "alien3",
        experiment.getStimuli().getImage("purpleplanet.png"),
        chosenString,
        goodTransition,
      ];
    } else {
      return [
        "alien3",
        "alien4",
        experiment.getStimuli().getImage("purpleplanet.png"),
        chosenString,
        goodTransition,
      ];
    }
  } else if (planet === "green") {
    // Counter-balancing only enabled in non-practice trials
    if (isPractice === false) {
      displayOrder = displayOrderGreen;
    }

    if (displayOrder) {
      return [
        "tutalien2",
        "tutalien1",
        experiment.getStimuli().getImage("tutgreenplanet.png"),
        chosenString,
        goodTransition,
      ];
    } else {
      return [
        "tutalien1",
        "tutalien2",
        experiment.getStimuli().getImage("tutgreenplanet.png"),
        chosenString,
        goodTransition,
      ];
    }
  } else if (planet === "yellow") {
    // Counter-balancing only enabled in non-practice trials
    if (isPractice === false) {
      displayOrder = displayOrderYellow;
    }

    if (displayOrder) {
      return [
        "tutalien4",
        "tutalien3",
        experiment.getStimuli().getImage("tutyellowplanet.png"),
        chosenString,
        goodTransition,
      ];
    } else {
      return [
        "tutalien3",
        "tutalien4",
        experiment.getStimuli().getImage("tutyellowplanet.png"),
        chosenString,
        goodTransition,
      ];
    }
  } else {
    consola.error("Error in transition calculation!");
    return [];
  }
};

// Timeline structure:
// (Instructions)
// 1. 4 trials to practice selecting an alien
// (Instructions)
// 2. 10 trials to practice selecting an alien and seeing resources
// (Instructions)
// 3. 10 trials to practice choosing between two aliens for resources
// (Instructions)
// 4. 20 trials to practice the full game
// (Instructions)
// Main: 4 blocks of 50 trials
const timeline = [];
let trialNumber = 0;

// Training, Part 1: Introduction
timeline.push(
  {
    type: "two-step-instructions",
    stimulus: experiment.getStimuli().getImage("blackbackground.jpg"),
    leftStimulus: [],
    centerStimulus: [],
    rightStimulus: [],
    rewardImage: [],
    choices: [" "],
    prompt: [
      "Before starting the task, please read the following carefully:",
      "This task requires a mouse and a keyboard.",
      "",
      "To go to the next screen of the instructions, you will interact with the red button",
      "at the bottom-right corner of your screen. When you are ready to continue, you will",
      "need to click it. After clicking it, it will turn green, and then you can press \"Spacebar\"",
      "to continue to the next screen.",
      "",
      "If you have any questions at any stage, let the research coordinator know.",
      "Continue to the next screen when you are ready!",
    ],
    include_score: false,
  },
  {
    type: "two-step-instructions",
    stimulus: experiment.getStimuli().getImage("earth.png"),
    leftStimulus: experiment.getStimuli().getImage("rocket1_norm.png"),
    centerStimulus: [],
    rightStimulus: experiment.getStimuli().getImage("rocket2_norm.png"),
    rewardImage: [],
    choices: [" "],
    prompt: [
      "Welcome! You are an astronaut in charge of important exploration missions to find space resources.",
      "",
      "Each mission involves flying a spaceship from Earth to explore two planets that may contain",
      "space resources. You will have two spaceships to choose from, and they look like these ones",
      "shown below:",
    ],
    include_score: false,
  },
  {
    type: "two-step-instructions",
    stimulus: experiment.getStimuli().getImage("earth.png"),
    leftStimulus: experiment.getStimuli().getImage("tutalien1_norm.png"),
    centerStimulus: [],
    rightStimulus: experiment.getStimuli().getImage("tutalien2_norm.png"),
    rewardImage: [],
    choices: [" "],
    prompt: [
      "Once you arrive at a planet, there will be two aliens that are guarding the space resources.",
      "",
      "The aliens may look like the ones shown below:",
    ],
    include_score: false,
  },
  {
    type: "two-step-instructions",
    stimulus: experiment.getStimuli().getImage("earth.png"),
    leftStimulus: experiment.getStimuli().getImage("tutalien1_norm.png"),
    centerStimulus: [],
    rightStimulus: experiment.getStimuli().getImage("tutalien2_norm.png"),
    rewardImage: [],
    choices: [" "],
    prompt: [
      "While you are at a planet, you can ask one of the aliens if they will share their space",
      "resources with you. A mission is successful when an alien shares their space resources.",
      "",
      "When you are ready, let's practice asking an alien to share their space resources!",
    ],
    include_score: false,
  },
);

// Training, Part 1: Practice selecting an alien
for (let i = 0; i < configuration.training.single; i++, trialNumber++) {
  timeline.push({
    type: "two-step-choice",
    timeout: false,
    choices: [configuration.controls.left, configuration.controls.right],
    trialNumber: trialNumber,
    leftStimulus: "tutalien2",
    rightStimulus: "tutalien1",
    planetStimulus: experiment.getStimuli().getImage("tutgreenplanet.png"),
    prompt: [
      i == 0 ? "Select an alien!" : "Select another alien!",
      "",
      "To ask the left alien, press the \"F\" key. To ask the right alien, press the \"J\" key.",
      "The alien you ask will be highlighted and move to the center of your screen.",
    ],
    responseWindow: configuration.timing.choice,
    isPractice: true,
  });
}

// Training, Part 2: Practice selecting an alien and seeing resources
timeline.push(
  {
    type: "two-step-instructions",
    stimulus: experiment.getStimuli().getImage("blackbackground.jpg"),
    leftStimulus: [],
    centerStimulus: [],
    rightStimulus: [],
    rewardImage: experiment.getStimuli().getImage("t.png"),
    choices: [" "],
    prompt: [
      "After you ask an alien, they will show you if they have space resources to share.",
      "",
      "Resources looks like this:",
    ],
    include_score: false,
  },
  {
    type: "two-step-instructions",
    stimulus: experiment.getStimuli().getImage("blackbackground.jpg"),
    leftStimulus: [],
    centerStimulus: [],
    rightStimulus: [],
    rewardImage: experiment.getStimuli().getImage("nothing.png"),
    choices: [" "],
    prompt: [
      "If the alien doesn't have space resources to share this time, you'll see an empty circle.",
      "",
      "The empty circle looks like this:",
    ],
    include_score: false,
  },
  {
    type: "two-step-instructions",
    stimulus: experiment.getStimuli().getImage("blackbackground.jpg"),
    leftStimulus: [],
    centerStimulus: [],
    rightStimulus: [],
    rewardImage: [],
    choices: [" "],
    prompt: [
      "If an alien has a good mine it will often have resources to share.",
      "It might not have resources every time you ask, but it will have",
      "resources most of the time.",
      "Another alien might have a bad mine at the moment,",
      "and it won't have resources to share most times you ask.",
    ],
    include_score: false,
  },
  {
    type: "two-step-instructions",
    stimulus: experiment.getStimuli().getImage("tutyellowplanet.png"),
    leftStimulus: experiment.getStimuli().getImage("tutalien3_norm.png"),
    centerStimulus: [],
    rightStimulus: [],
    rewardImage: [],
    choices: [" "],
    prompt: [
      "For example, this alien on the yellow planet has a good mine at the moment.",
      "You can now ask it for resources 10 times. To ask it for resources, press 'F'.",
      "",
      "Click the red button and press Spacebar to continue.",
    ],
    include_score: false,
  }
);

for (let i = 0; i < configuration.training.outcome; i++, trialNumber++) {
  timeline.push({
    type: "two-step-choice",
    timeout: false,
    trialRow: ["0.8", "0.8", "0.8", "0.8"],
    trialNumber: trialNumber,
    choices: [configuration.controls.left, configuration.controls.right],
    planetStimulus: experiment.getStimuli().getImage("tutyellowplanet.png"),
    leftStimulus: "tutalien3",
    rightStimulus: null,
    responseWindow: configuration.timing.choice,
    isPractice: true,
  });
}

timeline.push({
  type: "two-step-instructions",
  stimulus: experiment.getStimuli().getImage("tutyellowplanet.png"),
  leftStimulus: experiment.getStimuli().getImage("tutalien3_norm.png"),
  centerStimulus: [],
  rightStimulus: [],
  rewardImage: [],
  choices: [" "],
  prompt: [
    "The alien shared resources most times you asked.",
    "During missions, it may not share resources every time you ask.",
  ],
  include_score: false,
});

// Training, Part 3: Choosing between two aliens
timeline.push(
  {
    type: "two-step-instructions",
    stimulus: experiment.getStimuli().getImage("blackbackground.jpg"),
    leftStimulus: [],
    centerStimulus: [],
    rightStimulus: [],
    rewardImage: [],
    choices: [" "],
    prompt: [
      "You can will choose between two aliens to ask for resources.",
      "Pay attention to each alien and try to figure out which alien has more resources to share.",
      "It does not matter which side of your screen an alien appears on.",
      "For example: the left side is not luckier than the right side.",
    ],
    include_score: false,
  },
  {
    type: "two-step-instructions",
    stimulus: experiment.getStimuli().getImage("blackbackground.jpg"),
    leftStimulus: [],
    centerStimulus: [],
    rightStimulus: [],
    rewardImage: [],
    choices: [" "],
    prompt: [
      "You now have 10 practice missions to try to figure out which alien has a good mine.",
      "To ask the left alien for resources, press 'F'. To ask the right alien for resources, press 'J'.",
      "",
      "Click the red button and press Spacebar to continue.",
    ],
    include_score: false,
  }
);

for (let i = 0; i < configuration.training.both; i++, trialNumber++) {
  timeline.push({
    type: "two-step-choice",
    timeout: false,
    trialRow: ["0.9", "0.1", "0.9", "0.1"],
    trialNumber: trialNumber,
    choices: [configuration.controls.left, configuration.controls.right],
    leftStimulus: "tutalien2",
    rightStimulus: "tutalien1",
    planetStimulus: experiment.getStimuli().getImage("tutgreenplanet.png"),
    responseWindow: configuration.timing.choice,
    isPractice: true,
  });
}

// Training, Part 4: Entire trials
timeline.push(
  {
    type: "two-step-instructions",
    stimulus: experiment.getStimuli().getImage("earth.png"),
    leftStimulus: experiment.getStimuli().getImage("tutalien2_norm.png"),
    centerStimulus: [],
    rightStimulus: [],
    rewardImage: [],
    choices: [" "],
    prompt: [
      "You may have discovered that this alien had resources to share more often.",
      "",
      "Even if this alien had a better mine,",
      "you couldn't be sure if it had resources to share all the time.",
    ],
    include_score: false,
  },
  {
    type: "two-step-instructions",
    stimulus: experiment.getStimuli().getImage("blackbackground.jpg"),
    leftStimulus: [],
    centerStimulus: [],
    rightStimulus: [],
    rewardImage: [],
    choices: [" "],
    prompt: [
      "Each alien is like a game of chance, you can never be sure but",
      "you can guess.",
      "",
      "The amount of resources an alien can share will change during the missions.",
    ],
    include_score: false,
  },
  {
    type: "two-step-instructions",
    stimulus: experiment.getStimuli().getImage("blackbackground.jpg"),
    leftStimulus: [],
    centerStimulus: [],
    rightStimulus: [],
    rewardImage: [],
    choices: [" "],
    prompt: [
      "An alien with a good mine in previous missions may dig in a part of their",
      "mine that has few resources.",
      "",
      "Another alien with few resources in previous missions may discover a lot of resources.",
    ],
    include_score: false,
  },
  {
    type: "two-step-instructions",
    stimulus: experiment.getStimuli().getImage("blackbackground.jpg"),
    leftStimulus: [],
    centerStimulus: [],
    rightStimulus: [],
    rewardImage: [],
    choices: [" "],
    prompt: [
      "Any changes in an alien's mine will happen slowly across multiple missions.",
      "",
      "It is best to focus on retrieving as many resources as possible.",
    ],
    include_score: false,
  },
  {
    type: "two-step-instructions",
    stimulus: experiment.getStimuli().getImage("blackbackground.jpg"),
    leftStimulus: [],
    centerStimulus: [],
    rightStimulus: [],
    rewardImage: [],
    choices: [" "],
    prompt: [
      "An alien with a good resource mine right now will",
      "continue to have a good mine for a while.",
      "",
      "To find the alien with the best mine during each mission",
      "you must concentrate.",
    ],
    include_score: false,
  },
  {
    type: "two-step-instructions",
    stimulus: experiment.getStimuli().getImage("blackbackground.jpg"),
    leftStimulus: [],
    centerStimulus: [],
    rightStimulus: [],
    rewardImage: [],
    choices: [" "],
    prompt: [
      "Now that you know have practiced asking aliens for resources, you can",
      "learn how to launch and navigate your spaceship.",
      "",
      "In each mission, you will travel from Earth to one of two planets.",
    ],
    include_score: false,
  },
  {
    type: "two-step-instructions",
    stimulus: experiment.getStimuli().getImage("tutgreenplanet.png"),
    leftStimulus: [],
    centerStimulus: [],
    rightStimulus: [],
    rewardImage: [],
    choices: [" "],
    prompt: ["This is the green planet."],
    include_score: false,
  },
  {
    type: "two-step-instructions",
    stimulus: experiment.getStimuli().getImage("tutyellowplanet.png"),
    leftStimulus: [],
    centerStimulus: [],
    rightStimulus: [],
    rewardImage: [],
    choices: [" "],
    prompt: ["This is the yellow planet."],
    include_score: false,
  },
  {
    type: "two-step-instructions",
    stimulus: experiment.getStimuli().getImage("earth.png"),
    leftStimulus: experiment.getStimuli().getImage("rocket1_norm.png"),
    centerStimulus: [],
    rightStimulus: experiment.getStimuli().getImage("rocket2_norm.png"),
    rewardImage: [],
    choices: [" "],
    prompt: [
      "First, you must select the spaceship to launch.",
      "",
      "The spaceships can fly to either planet, but one",
      "spaceship will fly mostly to the green planet, and the other spaceship will",
      "fly mostly to the yellow planet.",
    ],
    include_score: false,
  },
  {
    type: "two-step-instructions",
    stimulus: experiment.getStimuli().getImage("earth.png"),
    leftStimulus: experiment.getStimuli().getImage("rocket1_norm.png"),
    centerStimulus: [],
    rightStimulus: experiment.getStimuli().getImage("rocket2_norm.png"),
    rewardImage: [],
    choices: [" "],
    prompt: [
      "The planet a spaceship flies to most often won't change during the game.",
      "",
      "You should choose the spaceship that you think will take you to the",
      "alien with the best mine, but remember, sometimes you'll",
      "go to the other planet!",
    ],
    include_score: false,
  },
  {
    type: "two-step-instructions",
    stimulus: experiment.getStimuli().getImage("earth.png"),
    leftStimulus: experiment.getStimuli().getImage("rocket1_norm.png"),
    centerStimulus: [],
    rightStimulus: experiment.getStimuli().getImage("rocket2_norm.png"),
    rewardImage: [],
    choices: [" "],
    prompt: [
      "Let's practice choosing spaceships before doing the full game.",
      "",
      "Remember, you still want to find as many space resources as you can",
      "by asking an alien to share their resources with you.",
    ],
    include_score: false,
  },
  {
    type: "two-step-instructions",
    stimulus: experiment.getStimuli().getImage("earth.png"),
    leftStimulus: experiment.getStimuli().getImage("rocket1_norm.png"),
    centerStimulus: [],
    rightStimulus: experiment.getStimuli().getImage("rocket2_norm.png"),
    rewardImage: [],
    choices: [" "],
    prompt: [
      "How much bonus money you make is based on how many space resources you find.",
      "",
      "This is just a practice round of 20 flights, you're not playing for resources yet.",
    ],
    include_score: false,
  },
  {
    type: "two-step-instructions",
    stimulus: experiment.getStimuli().getImage("earth.png"),
    leftStimulus: experiment.getStimuli().getImage("rocket1_norm.png"),
    centerStimulus: [],
    rightStimulus: experiment.getStimuli().getImage("rocket2_norm.png"),
    rewardImage: [],
    choices: [" "],
    prompt: [
      "You will have three seconds to make each choice. If you are too slow,",
      "you will see a large red 'X' appear on each rocket or alien and that choice will be over.",
      "",
      "Don't feel rushed, but please try to make a choice every time.",
      "Good luck! Remember that 'F' selects left and 'J' selects right.",
    ],
    include_score: false,
  }
);

// Instantiate the timeline variables for the main trials
const timelineVariables: any[][] = [];
let trialRow = 0;

// Set the rocket configuration in the main trials
for (let j = 0; j < blockCount; j++) {
  timelineVariables.push([]);
  for (let i = 0; i < blockLength; i++) {
    // Randomize sides of rockets for each subject
    if (rocketSides) {
      timelineVariables[j].push({
        rightStimulus: "rocket2",
        leftStimulus: "rocket1",
        trialRow: trialRow,
        trialNumber: i + 1,
      });
    } else {
      timelineVariables[j].push({
        rightStimulus: "rocket1",
        leftStimulus: "rocket2",
        trialRow: trialRow,
        trialNumber: i + 1,
      });
    }
    trialRow++;
  }
}

// Instantiate the timeline variables for the practice trials
const practiceTimelineVariables = [];
trialRow = 0;

// Set the rocket configuration in the practice trials
for (let i = 0; i < practiceGameCount; i++) {
  // Randomize sides of rockets for each subject
  if (practiceRocketSides) {
    practiceTimelineVariables.push({
      rightStimulus: "tutrocket2",
      leftStimulus: "tutrocket1",
      trialRow: trialRow,
      trialNumber: i + 1,
    });
  } else {
    practiceTimelineVariables.push({
      rightStimulus: "tutrocket1",
      leftStimulus: "tutrocket2",
      trialRow: trialRow,
      trialNumber: i + 1,
    });
  }
  trialRow++;
}

// Insert practice trials into instructions
timeline.push(
  createBlock(practiceTimelineVariables, practiceProbabilityData, true)
);

// Post-practice instructions
timeline.push(
  {
    type: "two-step-instructions",
    stimulus: experiment.getStimuli().getImage("blackbackground.jpg"),
    leftStimulus: [],
    centerStimulus: [],
    rightStimulus: [],
    rewardImage: [],
    choices: [" "],
    prompt: [
      "That is the end of the practice games.",
      "",
      "Click the red button and press the spacebar when you are ready to continue.",
    ],
    include_score: false,
  },
  {
    type: "two-step-instructions",
    stimulus: experiment.getStimuli().getImage("blackbackground.jpg"),
    leftStimulus: [],
    centerStimulus: [],
    rightStimulus: [],
    rewardImage: [],
    choices: [" "],
    prompt: [
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
    include_score: false,
  },
  {
    type: "two-step-instructions",
    stimulus: experiment.getStimuli().getImage("blackbackground.jpg"),
    leftStimulus: [],
    centerStimulus: [],
    rightStimulus: [],
    rewardImage: [],
    choices: [" "],
    prompt: [
      "Hint #1:",
      "Remember which aliens have resources. How good a mine is changes slowly,",
      "so an alien that has a lot of resources to share now,",
      "will probably be able to share a lot in the near future.",
    ],
    include_score: false,
  },
  {
    type: "two-step-instructions",
    stimulus: experiment.getStimuli().getImage("blackbackground.jpg"),
    leftStimulus: [],
    centerStimulus: [],
    rightStimulus: [],
    rewardImage: [],
    choices: [" "],
    prompt: [
      "Hint #2:",
      "Remember, each alien has its own mine. Just because one alien has a bad ",
      "mine and can't share very often, does not mean another has a good mine.",
      "",
      "The aliens are not trying to trick you!",
      "",
      "Your actions do not change how good a mine is,",
      "and the aliens will not hide resources from you if they have it available.",
    ],
    include_score: false,
  },
  {
    type: "two-step-instructions",
    stimulus: experiment.getStimuli().getImage("blackbackground.jpg"),
    leftStimulus: [],
    centerStimulus: [],
    rightStimulus: [],
    rewardImage: [],
    choices: [" "],
    prompt: [
      "Hint #3:",
      "The spaceship you choose is important because often an alien on one planet ",
      "may be better than the ones on another planet.",
      "",
      "You can find more resources by finding the spaceship",
      "that is most likely to take you to right planet.",
    ],
    include_score: false,
  },
  {
    type: "two-step-instructions",
    stimulus: experiment.getStimuli().getImage("blackbackground.jpg"),
    leftStimulus: [],
    centerStimulus: [],
    rightStimulus: [],
    rewardImage: [],
    choices: [" "],
    prompt: [
      "Now it's time to make sure you know how to play.",
      "",
      "Please respond 'True' or 'False' to the questions on the next few pages.",
    ],
    include_score: false,
  }
);

// Insert the three quizzes before the last element in `currentInstructions`
// Question 1
timeline.push({
  type: "attention-check",
  prompt: "True or False: Each spaceship always flies to the same planet.",
  options: ["True", "False"],
  options_radio: true,
  option_correct: 1,
  confirmation: true,
  feedback_correct: "Correct!",
  feedback_incorrect:
    "Incorrect. Spaceships may sometimes fly " +
    "to the planet you don't expect.",
});

// Question 2
timeline.push({
  type: "attention-check",
  prompt:
    "True or False: If an alien has a lot of resources to share now, " +
    "then they will probably have a lot of resources to share in the " +
    "near future.",
  options: ["True", "False"],
  options_radio: true,
  option_correct: 0,
  confirmation: true,
  feedback_correct: "Correct!",
  feedback_incorrect: "Incorrect. Some aliens have more resources than others.",
});

// Question 3
timeline.push({
  type: "attention-check",
  prompt:
    "True or False: You will have as much time as " +
    "you want to make each choice.",
  options: ["True", "False"],
  options_radio: true,
  option_correct: 1,
  confirmation: true,
  feedback_correct: "Correct!",
  feedback_incorrect: "Incorrect. You have a few seconds to make each choice.",
});

// Pre-main instructions
timeline.push({
  type: "two-step-instructions",
  stimulus: experiment.getStimuli().getImage("blackbackground.jpg"),
  leftStimulus: [],
  centerStimulus: [],
  rightStimulus: [],
  rewardImage: [],
  choices: [" "],
  prompt: [
    "OK! Now you know how to play.",
    "",
    "In the real game we'll count how many space resources",
    "you find and show you at the end.",
    "",
    "Ready? Now its time to play the game! Good luck space traveler!",
  ],
  include_score: false,
});

// Create the remaining blocks of the timeline
// Main block 1
timeline.push(createBlock(timelineVariables[0], probabilityData, false));

// Break 1
timeline.push({
  type: "two-step-instructions",
  stimulus: experiment.getStimuli().getImage("blackbackground.jpg"),
  leftStimulus: [],
  centerStimulus: [],
  rightStimulus: [],
  rewardImage: [],
  choices: [" "],
  prompt: [
    `Great job so far! You have completed 1 out of 4 rounds.`,
    "You may now take a break.",
    "",
    "Click the red button and press the spacebar when you are ready to continue.",
  ],
  include_score: false,
});

// Main block 2
timeline.push(createBlock(timelineVariables[1], probabilityData, false));

// Break 2
timeline.push({
  type: "two-step-instructions",
  stimulus: experiment.getStimuli().getImage("blackbackground.jpg"),
  leftStimulus: [],
  centerStimulus: [],
  rightStimulus: [],
  rewardImage: [],
  choices: [" "],
  prompt: [
    "Awesome! You are halfway through the game.",
    "",
    "You may now take a break.",
    "",
    "Click the red button and press the spacebar when you are ready to continue.",
  ],
  include_score: false,
});

// Main block 3
timeline.push(createBlock(timelineVariables[2], probabilityData, false));

// Break 3
timeline.push({
  type: "two-step-instructions",
  stimulus: experiment.getStimuli().getImage("blackbackground.jpg"),
  leftStimulus: [],
  centerStimulus: [],
  rightStimulus: [],
  rewardImage: [],
  choices: [" "],
  prompt: [
    "Almost done! Just 1 more round to go.",
    "",
    "You may now take a break.",
    "",
    "Click the red button and press the spacebar when you are ready to continue.",
  ],
  include_score: false,
});

// Main block 4
timeline.push(createBlock(timelineVariables[3], probabilityData, false));

// Finish
timeline.push({
  type: "two-step-instructions",
  stimulus: experiment.getStimuli().getImage("blackbackground.jpg"),
  leftStimulus: [],
  centerStimulus: [],
  rightStimulus: [],
  rewardImage: [],
  choices: [" "],
  prompt: [
    "You're finished with this part of the experiment!",
    "",
    "Click the red button to answer a final question.",
    "",
    "You found:",
  ],
  include_score: true,
});

// Question about the rockets
timeline.push({
  type: "two-step-choice",
  trialStage: "1",
  choices: [configuration.controls.left, configuration.controls.right],
  planetStimulus: experiment.getStimuli().getImage("earth.png"),
  rightStimulus: rocketSides === true ? "rocket1" : "rocket2",
  leftStimulus: rocketSides === true ? "rocket2" : "rocket1",
  isPractice: false,
  prompt: [
    "Select the rocket you think went to the red planet most frequently.",
  ],
  on_finish: (data: any) => {
    // Store the keypresses
    if (data.key_press === configuration.controls.left) {
      data.choice = 1;
    }
    if (data.key_press === configuration.controls.right) {
      data.choice = 2;
    }
    consola.info("data", data);
  },
  trialNumber: 0,
});

// Finish
timeline.push({
  type: "two-step-instructions",
  stimulus: experiment.getStimuli().getImage("blackbackground.jpg"),
  leftStimulus: [],
  centerStimulus: [],
  rightStimulus: [],
  rewardImage: [],
  choices: [" "],
  prompt: [
    "Thank you for participating in this research!",
    "",
    "Click the red button and press the spacebar to be redirected.",
  ],
  include_score: false,
});

// Start the experiment
experiment.start({
  timeline: timeline,
});

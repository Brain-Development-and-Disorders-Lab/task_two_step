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
consola.info(`-- Task Variables --
rocketSides: ${rocketSides}
practiceRocketSides: ${practiceRocketSides}
displayOrderRed: ${displayOrderRed}
displayOrderPurple: ${displayOrderPurple}
displayOrderGreen: ${displayOrderGreen}
displayOrderYellow: ${displayOrderYellow}
redPlanetFirstRocket: ${redPlanetFirstRocket}
`);

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
      "Before commencing the task, review the following instructions carefully.",
      "",
      "When you are ready to continue, click the red button in",
      "the lower-right corner of your screen.",
      "Once the button is green, press the Spacebar to continue.",
      "",
      "If you have any questions at any stage of the task, reach out to the research",
      "coordinator.",
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
      "Welcome, astronaut! You are now in charge of important exploration missions.",
      "",
      "These missions involve taking one of these two spaceships from Earth",
      "to explore two planets potentially containing resources.",
    ],
    include_score: false,
  },
  {
    type: "two-step-instructions",
    stimulus: experiment.getStimuli().getImage("tutgreenplanet.png"),
    leftStimulus: experiment.getStimuli().getImage("tutalien1_norm.png"),
    centerStimulus: [],
    rightStimulus: experiment.getStimuli().getImage("tutalien2_norm.png"),
    rewardImage: [],
    choices: [" "],
    prompt: [
      "Each planet will have two aliens who are in charge of their own",
      "resource mines.",
    ],
    include_score: false,
  },
  {
    type: "two-step-instructions",
    stimulus: experiment.getStimuli().getImage("tutgreenplanet.png"),
    leftStimulus: experiment.getStimuli().getImage("tutalien1_norm.png"),
    centerStimulus: [],
    rightStimulus: experiment.getStimuli().getImage("tutalien2_norm.png"),
    rewardImage: [],
    choices: [" "],
    prompt: [
      "On each planet, you must ask one alien to share their resources.",
      "If an alien has resources, it will share them with you.",
      "A mission is successful when an alien shares their treasure.",
    ],
    include_score: false,
  },
  {
    type: "two-step-instructions",
    stimulus: experiment.getStimuli().getImage("tutgreenplanet.png"),
    leftStimulus: experiment.getStimuli().getImage("tutalien1_norm.png"),
    centerStimulus: [],
    rightStimulus: experiment.getStimuli().getImage("tutalien2_norm.png"),
    rewardImage: [],
    choices: [" "],
    prompt: [
      "To ask the left alien, press '1'. To ask the right alien, press '0'.",
      "The alien you asked will be highlighted.",
      "",
      "You can practice asking aliens for resources now.",
      "Click the red button and press Spacebar to continue.",
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
    prompt: [i == 0 ? "Select an alien!" : "Select another alien!"],
    responseWindow: configuration.timing.choice,
    isPractice: true,
  });
};

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
      "After you ask an alien, they will show you if they have resources to share.",
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
      "If the alien doesn't have resources to share this time, you'll see an empty circle.",
      "The circle looks like this:",
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
      "You can now ask it for treasure 10 times. To ask it for treasure, press '1'.",
      "",
      "Click the red button and press Spacebar to continue.",
    ],
    include_score: false,
  },
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
};

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
      "To ask the left alien for resources, press '1'. To ask the right alien for resources, press '0'.",
      "",
      "Click the red button and press Spacebar to continue.",
    ],
    include_score: false,
  },
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
};

// Training, Part 4: Entire trials
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
      "You may have discovered that this alien had resources to share more often.",
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
      "The amount resources an alien can share will change during the missions.",
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
      "It is best to focus on retrieving as much resources as possible.",
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
);

for (let i = 0; i < configuration.training.complete; i++, trialNumber++) {
  let currStageTwo: any[] = [];

  timeline.push({
    // Instantiate the first choice
    type: "two-step-choice",
    trialStage: "1",
    trialNumber: trialNumber,
    choices: [configuration.controls.left, configuration.controls.right],

    // Trial stimuli
    planetStimulus: experiment.getStimuli().getImage("earth.png"),
    leftStimulus: practiceRocketSides ? "rocket2" : "rocket1",
    rightStimulus: practiceRocketSides ? "rocket1" : "rocket2",

    // Specify if this is a practice trial or not
    isPractice: true,

    // Define the 'on_start' callback
    on_start: () => {
      currStageTwo = [];
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
      currStageTwo = calculateTransition(data.chosenStimulus, true);
      if (currStageTwo.length === 0) {
        currStageTwo = [
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
    trialNumber: trialNumber,

    // Specify if this is a practice trial or not
    isPractice: true,

    // Specify the trial data
    trialRow: () => {
      return practiceProbabilityData[i + 1];
    },

    // Specify the second planet
    planetStimulus: () => {
      if (currStageTwo) return currStageTwo[2];
    },

    // Specify the left alien?
    rightStimulus: () => {
      if (currStageTwo) return currStageTwo[0];
    },

    // Specify the right alien?
    leftStimulus: () => {
      if (currStageTwo) return currStageTwo[1];
    },

    // Specify the reward outcome
    centerStimulus: () => {
      if (currStageTwo) return currStageTwo[3];
    },

    // Specify the transition type
    transitionType: () => {
      if (currStageTwo) return currStageTwo[4];
    },

    // Specify a trial duration
    responseWindow: () => {
      if (currStageTwo && currStageTwo[3] == null) {
        return 0;
      } else {
        return configuration.timing.choice;
      }
    },

    // Define the 'on_finish' callback
    on_finish: (data: any) => {
      if (data.rewardStimulus === experiment.getStimuli().getImage("t.png")) {
        experiment.getState().set("practiceReward", experiment.getState().get("practiceReward") + 1);
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

      // Store the timestamp
      const timestamp = new Date().toISOString().replace(/z|t/gi, " ").trim();
      jsPsych.data.addDataToLastTrial({ timestamp });
    },
  },
  {
    // Instantiate the fixation stage
    type: "two-step-fixation",
    stimulus: experiment.getStimuli().getImage("earth.png"),
    text: "+",
    responseWindow: 1000,
    trialNumber: trialNumber,
  },)
};

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

let currStageTwo: any[] | null = [];

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
const createBlock = (variables: any[], probabilityData: { [x: string]: any }, isPractice: boolean): any => {
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
          currStageTwo = [];
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
          currStageTwo = calculateTransition(data.chosenStimulus, isPractice);
          if (currStageTwo == null) {
            currStageTwo = [
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
          if (currStageTwo) return currStageTwo[2];
        },

        // Specify the left alien?
        rightStimulus: () => {
          if (currStageTwo) return currStageTwo[0];
        },

        // Specify the right alien?
        leftStimulus: () => {
          if (currStageTwo) return currStageTwo[1];
        },

        // Specify the reward outcome
        centerStimulus: () => {
          if (currStageTwo) return currStageTwo[3];
        },

        // Specify the transition type
        transitionType: () => {
          if (currStageTwo) return currStageTwo[4];
        },

        // Specify a trial duration
        responseWindow: () => {
          if (currStageTwo && currStageTwo[3] == null) {
            return 0;
          } else {
            return configuration.timing.choice;
          }
        },

        // Define the 'on_finish' callback
        on_finish: (data: any) => {
          if (data.rewardStimulus === experiment.getStimuli().getImage("t.png")) {
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

          // Store the timestamp
          const timestamp = new Date()
            .toISOString()
            .replace(/z|t/gi, " ")
            .trim();
          jsPsych.data.addDataToLastTrial({ timestamp });
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
 * @param {boolean} practice practice
 * @return {any}
 */
const calculateTransition = (chosenString: string, isPractice: boolean) => {
  let firstPlanet = "";
  let secondPlanet = "";

  if (chosenString === "" || typeof chosenString === "undefined") {
    return [];
  }

  if (isPractice) {
    firstPlanet = "green";
    secondPlanet = "yellow";
  } else {
    firstPlanet = "red";
    secondPlanet = "purple";
  }

  const firstShipChosen = chosenString.slice(-1) === "1";
  const goodTransition = experiment.random() < probability;

  // Determine the resulting planet
  let planet = "";
  if (firstShipChosen && redPlanetFirstRocket) {
    planet = goodTransition ? firstPlanet : secondPlanet;
  } else if (!firstShipChosen && redPlanetFirstRocket) {
    planet = goodTransition ? secondPlanet : firstPlanet;
  } else if (firstShipChosen && !redPlanetFirstRocket) {
    planet = goodTransition ? secondPlanet : firstPlanet;
    if (goodTransition) {
      planet = secondPlanet;
    } else {
      planet = firstPlanet;
    }
  } else if (~firstShipChosen && ~redPlanetFirstRocket) {
    if (goodTransition) {
      planet = firstPlanet;
    } else {
      planet = secondPlanet;
    }
  }

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

// Prepare the resource collections
const imagesLeft: any[][] = [];
const imagesRight: any[][] = [];
const imagesCenter: any[][] = [];
const imagesReward: any[][] = [];
const filesAudio: any[][] = [];
const imagesButton: any[][] = [];

// Instantiate the resource collections that accompany each
// page of instructions
let currentInstructions: any[];
for (let i = 0; i < instructions.length; i += 1) {
  currentInstructions = instructions[i];
  imagesLeft[i] = [];
  imagesRight[i] = [];
  imagesReward[i] = [];
  imagesCenter[i] = [];
  filesAudio[i] = [];
  imagesButton[i] = [];
  for (let j = 0; j < currentInstructions.length; j += 1) {
    imagesLeft[i][j] = null;
    imagesRight[i][j] = null;
    imagesCenter[i][j] = null;
    imagesReward[i][j] = null;
    imagesButton[i][j] = experiment.getStimuli().getImage("button.jpeg");
  }
}

// Reward and no reward images
imagesReward[3][0] = experiment.getStimuli().getImage("t.png");
imagesReward[3][1] = experiment.getStimuli().getImage("nothing.png");

// Center images
imagesCenter[4][0] = experiment.getStimuli().getImage("tutalien3_norm.png");
imagesCenter[4][1] = experiment.getStimuli().getImage("tutalien3_norm.png");
imagesCenter[9][0] = experiment.getStimuli().getImage("tutalien2_norm.png");

// Rockets
imagesRight[1][0] = experiment.getStimuli().getImage("tutrocket1_norm.png");
imagesLeft[1][0] = experiment.getStimuli().getImage("tutrocket2_norm.png");

// Aliens, both sides
imagesRight[2][0] = experiment.getStimuli().getImage("tutalien1_norm.png");
imagesLeft[2][0] = experiment.getStimuli().getImage("tutalien2_norm.png");
imagesRight[2][1] = experiment.getStimuli().getImage("tutalien1_norm.png");
imagesLeft[2][1] = experiment.getStimuli().getImage("tutalien2_norm.png");
imagesRight[2][2] = experiment.getStimuli().getImage("tutalien1_norm.png");
imagesLeft[2][2] = experiment.getStimuli().getImage("tutalien2_norm.png");

// Aliens, right side
imagesRight[6][0] = experiment.getStimuli().getImage("tutalien1_norm.png");
imagesRight[7][0] = experiment.getStimuli().getImage("tutalien2_norm.png");

// Aliens, left side
imagesLeft[6][0] = experiment.getStimuli().getImage("tutalien2_norm.png");
imagesLeft[7][0] = experiment.getStimuli().getImage("tutalien1_norm.png");

// Rockets, right side
imagesRight[13][0] = experiment.getStimuli().getImage("tutrocket1_norm.png");
imagesRight[13][1] = experiment.getStimuli().getImage("tutrocket1_norm.png");
imagesRight[14][0] = experiment.getStimuli().getImage("tutrocket1_norm.png");
imagesRight[14][1] = experiment.getStimuli().getImage("tutrocket1_norm.png");
imagesRight[14][2] = experiment.getStimuli().getImage("tutrocket1_norm.png");
imagesRight[14][3] = experiment.getStimuli().getImage("tutrocket1_sp.png");
imagesRight[14][4] = experiment.getStimuli().getImage("tutrocket1_norm.png");
imagesRight[14][5] = experiment.getStimuli().getImage("tutrocket1_norm.png");

// Rockets, left side
imagesLeft[13][0] = experiment.getStimuli().getImage("tutrocket2_norm.png");
imagesLeft[13][1] = experiment.getStimuli().getImage("tutrocket2_norm.png");
imagesLeft[14][0] = experiment.getStimuli().getImage("tutrocket2_norm.png");
imagesLeft[14][1] = experiment.getStimuli().getImage("tutrocket2_norm.png");
imagesLeft[14][2] = experiment.getStimuli().getImage("tutrocket2_norm.png");
imagesLeft[14][3] = experiment.getStimuli().getImage("tutrocket2_sp.png");
imagesLeft[14][4] = experiment.getStimuli().getImage("tutrocket2_norm.png");
imagesLeft[14][5] = experiment.getStimuli().getImage("tutrocket2_norm.png");

// Backgrounds used throughout the instructions
const instructionsBackgrounds = [
  experiment.getStimuli().getImage("blackbackground.jpg"),
  experiment.getStimuli().getImage("earth.png"),
  experiment.getStimuli().getImage("tutgreenplanet.png"),
  experiment.getStimuli().getImage("blackbackground.jpg"),
  experiment.getStimuli().getImage("tutyellowplanet.png"),
  experiment.getStimuli().getImage("blackbackground.jpg"),
  experiment.getStimuli().getImage("tutgreenplanet.png"),
  experiment.getStimuli().getImage("tutgreenplanet.png"),
  experiment.getStimuli().getImage("blackbackground.jpg"),
  experiment.getStimuli().getImage("blackbackground.jpg"),
  experiment.getStimuli().getImage("earth.png"),
  experiment.getStimuli().getImage("tutgreenplanet.png"),
  experiment.getStimuli().getImage("tutyellowplanet.png"),
  experiment.getStimuli().getImage("earth.png"),
  experiment.getStimuli().getImage("earth.png"),
  experiment.getStimuli().getImage("blackbackground.jpg"),
];

let t: number;
let currentPage: any;

/**
 * Utility function to assemble instructions, combining text and images
 * @param {string} image stimulus
 * @param {string[][]} prompts main prompt used
 * @param {string[]} rightText right stimulus
 * @param {string[]} leftText left stimulus
 * @param {string[]} centerText center stimulus
 * @param {string[]} rewardText reward stimlus
 * @return {any[]}
 */
const createInstructions = (
  image: string,
  prompts: string[][],
  rightText: string[],
  leftText: string[],
  centerText: string[],
  rewardText: string[],
  includeScore = false
) => {
  // Instantitate and create the pages of the instructions
  const instructionPages = [];
  for (t = 0; t < prompts.length; t += 1) {
    // Collate the specifict texts and images
    // for the instruction page
    currentPage = {
      type: "two-step-instructions",
      stimulus: image,
      rightStimulus: rightText[t],
      leftStimulus: leftText[t],
      centerStimulus: centerText[t],
      rewardImage: rewardText[t],
      choices: [" "],
      prompt: prompts[t],
      include_score: includeScore,
    };
    instructionPages.push(currentPage);
  }

  return instructionPages;
};

// Create all instruction pages
currentInstructions = [];

for (let i = 0; i < instructions.length; i++) {
  currentInstructions = currentInstructions.concat(
    createInstructions(
      instructionsBackgrounds[i],
      instructions[i],
      imagesRight[i],
      imagesLeft[i],
      imagesCenter[i],
      imagesReward[i]
    )
  );
}

// Insert practice trials into instructions
currentInstructions.push(createBlock(practiceTimelineVariables, practiceProbabilityData, true));

// Insert the three quizzes before the last element in `currentInstructions`
// Question 1
currentInstructions.push({
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
currentInstructions.push({
  type: "attention-check",
  prompt:
    "True or False: If an alien has a lot of treasure to share now, " +
    "then they will probably have a lot of treasure to share in the " +
    "near future.",
  options: ["True", "False"],
  options_radio: true,
  option_correct: 0,
  confirmation: true,
  feedback_correct: "Correct!",
  feedback_incorrect: "Incorrect. Some aliens have more treasure than others.",
});

// Question 3
currentInstructions.push({
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

// Instantiate the experiment timeline with the instructions and
// practice trials
// timeline.push(currentInstructions);

// Create the remaining blocks of the timeline
// Main block 1
// timeline.push(createBlock(timelineVariables[0], probabilityData, false));

// Insert break 1
// timeline.push(
//   createInstructions(
//     experiment.getStimuli().getImage("blackbackground.jpg"),
//     firstBreak,
//     [],
//     [],
//     [],
//     []
//   )[0]
// );

// Main block 2
// timeline.push(createBlock(timelineVariables[1], probabilityData, false));

// Insert break 2
// timeline.push(
//   createInstructions(
//     experiment.getStimuli().getImage("blackbackground.jpg"),
//     secondBreak,
//     [],
//     [],
//     [],
//     []
//   )[0]
// );

// Main block 3
// timeline.push(createBlock(timelineVariables[2], probabilityData, false));

// Insert break 3
// timeline.push(
//   createInstructions(
//     experiment.getStimuli().getImage("blackbackground.jpg"),
//     thirdBreak,
//     [],
//     [],
//     [],
//     []
//   )[0]
// );

// Main block 4
// timeline.push(createBlock(timelineVariables[3], probabilityData, false));

// Finish
// timeline.push(
//   createInstructions(
//     experiment.getStimuli().getImage("blackbackground.jpg"),
//     [
//       [
//         "You're finished with this part of the experiment!",
//         "",
//         "Click the red button to answer a final question.",
//         "",
//         "You found:",
//       ],
//     ],
//     [],
//     [],
//     [],
//     [],
//     true
//   )[0]
// );

// Question about the rockets
// timeline.push({
//   type: "two-step-choice",
//   trialStage: "1",
//   choices: [configuration.controls.left, configuration.controls.right],
//   planetStimulus: experiment.getStimuli().getImage("earth.png"),
//   rightStimulus: rocketSides === true ? "rocket1" : "rocket2",
//   leftStimulus: rocketSides === true ? "rocket2" : "rocket1",
//   isPractice: false,
//   prompt: [
//     "Select the rocket you think went to the red planet most frequently.",
//   ],
//   on_finish: (data: any) => {
//     // Store the keypresses
//     if (data.key_press === configuration.controls.left) {
//       data.choice = 1;
//     }
//     if (data.key_press === configuration.controls.right) {
//       data.choice = 2;
//     }
//     consola.info("data", data);
//   },
//   trialNumber: 0,
// });

// Finish
// timeline.push(
//   createInstructions(
//     experiment.getStimuli().getImage("blackbackground.jpg"),
//     [
//       [
//         "Thank you for participating in this research!",
//         "",
//         "Click the red button and press the spacebar to be redirected.",
//       ],
//     ],
//     [],
//     [],
//     [],
//     []
//   )[0]
// );

// Start the experiment
experiment.start({
  timeline: timeline,
});

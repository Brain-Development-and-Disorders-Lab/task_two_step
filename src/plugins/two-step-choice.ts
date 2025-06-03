/**
 * The jsPsych version of the task was originally coded by the Niv Lab (https://nivlab.princeton.edu/)
 * at Princeton, adapted by the Hartley Lab (https://www.hartleylab.org/) at NYU for use online
 * with children, adolescents, and adults, and adapted here by the Brain Development and Disorders Lab
 * (https://sites.wustl.edu/richardslab) at Washington University in St. Louis.
 *
 * Plugin:
 * two-step-choice
 *
 * Overview:
 * Adapted from plugins by Josh de Leeuw
 *
 * The reward pictures and sizes, final prompt and most times are not inputs but
 * global variables in the experiment;
 * this could be adapted to include them as inputs if used in another experiment
 *
 * Changelog:
 * VF 08/2019
 * HB 01/2022
 */
// Logging library
import consola from "consola";

// d3.js imports
import { interval, select } from "d3";

// Experiment variables
import {
  width,
  height,
  sizeMonster,
  sizeReward,
  choiceY,
  choiceXRight,
  choiceXLeft,
  chosenX,
  chosenY,
  rewardX,
  rewardY,
  textInstructionsY,
  textX,
  textY,
  sizeFont,
} from "../variables";

// Configuration
import { configuration } from "../configuration";

jsPsych.plugins["two-step-choice"] = (() => {
  const plugin = {
    info: {},
    trial: (displayElement: HTMLElement, trial: any) => {
      consola.debug(`displayElement:`, displayElement);
      consola.debug(`trial:`, trial);
      consola.error(`Plugin trial not defined!`);
    },
  };

  plugin.info = {
    name: "two-step-choice",
    description: "Two-step choice plugin.",
    parameters: {
      planetStimulus: {
        type: jsPsych.plugins.parameterType.STRING,
        default: undefined,
      },
      trialStage: {
        type: jsPsych.plugins.parameterType.STRING,
        default: "practice",
      },
      isPractice: {
        type: jsPsych.plugins.parameterType.BOOL,
        default: false,
      },
      rightStimulus: {
        type: jsPsych.plugins.parameterType.STRING,
        default: null,
      },
      leftStimulus: {
        type: jsPsych.plugins.parameterType.STRING,
        default: null,
      },
      centerStimulus: {
        type: jsPsych.plugins.parameterType.STRING,
        default: null,
      },
      rewardString: {
        type: jsPsych.plugins.parameterType.STRING,
        default: null,
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        default: null,
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        array: true,
        pretty_name: "Choices",
        default: [configuration.controls.left, configuration.controls.right],
        description:
          "The keys the subject is allowed to " +
          "press to respond to the stimulus.",
      },
      responseWindow: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Trial duration",
        default: null,
        description: "How long to show trial before it ends.",
      },
      trialRow: {
        type: jsPsych.plugins.parameterType.STRING,
        default: null,
        array: true,
      },
      timeout: {
        type: jsPsych.plugins.parameterType.BOOL,
        default: true,
      },
      trialPrompt: {
        type: jsPsych.plugins.parameterType.STRING,
        default: null,
      },
      transitionType: {
        type: jsPsych.plugins.parameterType.STRING,
        default: null,
        description: "Whether it was a common or rare transition.",
      },
      trialNumber: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Trial number",
        default: undefined,
        description: "The trial ID associated with this fixation.",
      },
    },
  };

  plugin.trial = (displayElement, trial) => {
    // Debugging information
    consola.debug(`Running trial:`, trial.type);

    // 'Experiment' instance
    const experiment = window.Experiment;

    // Reset the displayElement contents
    const html = `<div id='container' class='exp-container'></div>`;
    displayElement.innerHTML = html;

    // General plugin variables
    let movePossible = true;
    let chosenStimulus = "";
    let unchosenStimulus = "";
    let imageLeft: any;
    let imageCenter: any;
    let imageRight: any;
    let imageChosen: any;
    let imageUnchosen: any;

    // Render all specified elements to the view
    // SVG container
    const svg = select("div#container")
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 " + width + " " + height)
      .classed("svg-content", true);

    // Append the background image
    svg
      .append("svg:image")
      .attr("width", width)
      .attr("height", height)
      .attr("preserveAspectRatio", "xMidYMid slice")
      .attr("xlink:href", trial.planetStimulus);

    // Append an image to the right side of the view
    if (trial.rightStimulus !== null) {
      imageRight = svg
        .append("svg:image")
        .attr("class", "right")
        .attr("x", choiceXRight)
        .attr("y", choiceY)
        .attr("width", sizeMonster)
        .attr("height", sizeMonster)
        .attr(
          "xlink:href",
          experiment
            .getStimuli()
            .getImage(trial.rightStimulus.replace(".png", "") + "_norm.png")
        );
    }

    // Append text to the left side of the view
    if (trial.leftStimulus !== null) {
      imageLeft = svg
        .append("svg:image")
        .attr("x", choiceXLeft)
        .attr("y", choiceY)
        .attr("width", sizeMonster)
        .attr("height", sizeMonster)
        .attr(
          "xlink:href",
          experiment
            .getStimuli()
            .getImage(trial.leftStimulus.replace(".png", "") + "_norm.png")
        );
    }

    // Establish the collection of choices that are available
    let validChoices = trial.choices;
    if (trial.leftStimulus === null || trial.rightStimulus === null) {
      // If either left or right text fields are defined
      if (trial.leftStimulus === null && trial.rightStimulus === null) {
        // No valid choices
        validChoices = [];
      } else if (trial.leftStimulus != null) {
        // Valid left choice
        validChoices = [trial.choices[0]];
      } else if (trial.rightStimulus != null) {
        // Valid right choice
        validChoices = [trial.choices[1]];
      }
    }

    // Append text to the center of the view
    if (trial.centerStimulus !== null) {
      imageCenter = svg
        .append("svg:image")
        .attr("x", chosenX)
        .attr("y", chosenY)
        .attr("width", sizeMonster)
        .attr("height", sizeMonster)
        .attr(
          "xlink:href",
          experiment
            .getStimuli()
            .getImage(trial.centerStimulus.replace(".png", "") + "_deact.png")
        );
    }

    if (trial.trialPrompt !== null) {
      svg
        .append("text")
        .attr("x", textX)
        .attr("y", textY)
        .style("text-anchor", "middle")
        .style("font-size", sizeFont + "px")
        .style("font-family", "Arial")
        .style("font-weight", "bold")
        .style("letter-spacing", "0.2")
        .style("fill", "white")
        .text(trial.trialPrompt);
    }

    // Add the main prompt to the view
    if (trial.prompt !== null) {
      // Wrap text to fit inside the view
      let lineNumber = 0;
      const lineHeight = 1.1; // ems
      const dy = 0;

      for (let i = 0; i < trial.prompt.length; i++) {
        // Append a line of text
        svg
          .append("text")
          .attr("x", textX)
          .attr("y", textInstructionsY)
          .attr("dy", ++lineNumber * lineHeight + dy + "em")
          .style("text-anchor", "middle")
          .style("font-size", sizeFont + "px")
          .style("font-family", "Arial")
          .style("font-weight", "bold")
          .style("letter-spacing", "0.2")
          .style("fill", "white")
          .text(trial.prompt[i]);
        lineNumber++;
      }
    }

    // Configure the overall response data
    let response = {
      rt: null,
      key: null,
    };

    // Create a group of responses
    const responses: {
      rt: any[];
      key: any[];
    } = {
      rt: [],
      key: [],
    };

    // Configure parameters for the input validation
    let validResponse = false;
    trial.rewardStimulus = "";

    /**
     * End the 'two-step-choice' trial
     */
    const endTrial = () => {
      // Clear any existing 'setTimeout' instances
      jsPsych.pluginAPI.clearAllTimeouts();

      // Clear any existing keyboard listeners
      if (typeof keyboardListener !== "undefined") {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      // Collate the data collected throughout the trial
      const trialData = {
        trialNumber: trial.trialNumber,
        initialReactionTime: response.rt,
        initialResponse: response.key,
        responseWindow: trial.responseWindow,
        validResponse: validResponse,
        allReactionTimes: responses.rt,
        allResponses: responses.key,
        planetStimulus: trial.planetStimulus,
        rightStimulus: trial.rightStimulus,
        leftStimulus: trial.leftStimulus,
        centerStimulus: trial.centerStimulus,
        chosenStimulus: trial.chosenStimulus,
        rewardStimulus: trial.rewardStimulus,
        trialStage: trial.trialStage,
        isPractice: trial.isPractice,
        transitionType: trial.transitionType,
        choiceStageOne: "",
        choiceStageTwo: "",
      };

      consola.debug("Trial data (pre-adjustment):", trialData);

      // Store stage-specific choices for each trial
      if (trialData.trialStage === "1") {
        consola.debug("Recording data from first stage");
        trialData.choiceStageOne = chosenStimulus.slice(-1);
      } else if (trialData.trialStage === "2") {
        consola.debug("Recording data from second stage");
        trialData.choiceStageTwo = chosenStimulus.slice(-1);
      }

      // Adjust the transition type
      if (trial.transitionType === true) {
        trialData.transitionType = "C";
      } else if (trial.transitionType === false) {
        trialData.transitionType = "R";
      }

      consola.debug("Trial data (post-adjustment):", trialData);

      // Clear the contents of 'displayElement'
      displayElement.innerHTML = "";

      // Notify jsPsych and pass the trial data
      jsPsych.finishTrial(trialData);
    };

    /**
     * Handle responses by the subject
     * @param {any} info data object containing the reaction
     * time (rt) and the key code of the key pressed
     */
    const afterResponse = (info: any) => {
      // Record the key response, if a valid key has been pressed
      if (trial.choices.includes(info.key)) {
        // Add the first response
        if (response.key == null) {
          response = info;
        }

        // Store all responses
        responses.rt.push(info.rt);
        responses.key.push(info.key);
      }

      // Check the response and react accordingly
      if (
        validResponse === false &&
        validChoices.indexOf(info.key) > -1 &&
        movePossible === true
      ) {
        // If a valid key has been pressed and a transition is permitted
        consola.debug(`A valid key ('${info.key}') was pressed.`);

        // Set the 'validResponse' flag
        validResponse = true;

        if (trial.trialPrompt == null) {
          // Determine what choice was made
          if (trial.choices.indexOf(info.key) == 1) {
            // Right selection
            chosenStimulus = trial.rightStimulus;
            unchosenStimulus = trial.leftStimulus;
            imageChosen = imageRight;
            imageUnchosen = imageLeft;
          } else {
            // Left selection
            chosenStimulus = trial.leftStimulus;
            unchosenStimulus = trial.rightStimulus;
            imageChosen = imageLeft;
            imageUnchosen = imageRight;
          }

          // Store the chosen option
          trial.chosenStimulus = chosenStimulus;

          if (trial.centerStimulus !== null) {
            // Deactivate the choice that was not selected if there was
            // more than one option
            if (validChoices.length > 1) {
              imageUnchosen.attr(
                "xlink:href",
                experiment
                  .getStimuli()
                  .getImage(unchosenStimulus.replace(".png", "") + "_deact.png")
              );
            }

            // Start the animation by moving the selected image to the center
            imageCenter
              .transition()
              .remove()
              .on("end", () => {
                imageChosen
                  .attr(
                    "xlink:href",
                    experiment
                      .getStimuli()
                      .getImage(chosenStimulus.replace(".png", "") + "_a2.png")
                  )
                  .transition()
                  .duration(configuration.timing.transition)
                  .attr("y", chosenY)
                  .attr("x", chosenX)
                  .on("end", () => {
                    let frames = 0;
                    let currentImage;

                    const transition = interval(() => {
                      // Update the image every two frames
                      if (frames % 2 === 0) {
                        currentImage = chosenStimulus + "_a1.png";
                      } else {
                        currentImage = chosenStimulus + "_a2.png";
                      }

                      imageChosen.attr(
                        "xlink:href",
                        experiment.getStimuli().getImage(currentImage)
                      );

                      frames++;

                      // Deactivate the image after 5 frames
                      if (frames == 5) {
                        imageChosen.attr(
                          "xlink:href",
                          experiment
                            .getStimuli()
                            .getImage(chosenStimulus + "_deact.png")
                        );

                        if (trial.trialRow !== null) {
                          // Determine the reward and add the reward image
                          trial.rewardStimulus = calculateReward(
                            chosenStimulus,
                            trial.trialRow
                          );

                          // Append the reward image
                          svg
                            .append("svg:image")
                            .attr("x", rewardX)
                            .attr("y", rewardY)
                            .attr("width", sizeReward)
                            .attr("height", sizeReward)
                            .attr("xlink:href", trial.rewardStimulus);
                          interval(() => {}, configuration.timing.reward);
                        }

                        transition.stop();
                      }
                    }, configuration.timing.flash / 5);
                  });
              });
          } else {
            // Deactivate the choice that was not selected if there was
            // more than one option
            if (validChoices.length > 1) {
              imageUnchosen.attr(
                "xlink:href",
                experiment
                  .getStimuli()
                  .getImage(unchosenStimulus.replace(".png", "") + "_deact.png")
              );
            }

            // Start the animation by moving the selected image to the center
            imageChosen
              .attr(
                "xlink:href",
                experiment.getStimuli().getImage(chosenStimulus + "_a2.png")
              )
              .transition()
              .duration(configuration.timing.transition)
              .attr("y", chosenY)
              .attr("x", chosenX)
              .on("end", () => {
                let frames = 0;
                let currentImage;

                const transition = interval(() => {
                  // Update the image every two frames
                  if (frames % 2 === 0) {
                    currentImage = chosenStimulus + "_a1.png";
                  } else {
                    currentImage = chosenStimulus + "_a2.png";
                  }

                  imageChosen.attr(
                    "xlink:href",
                    experiment.getStimuli().getImage(currentImage)
                  );

                  frames++;

                  // Deactivate the image after 5 frames
                  if (frames == 5) {
                    imageChosen.attr(
                      "xlink:href",
                      experiment
                        .getStimuli()
                        .getImage(chosenStimulus + "_deact.png")
                    );
                    if (trial.trialRow !== null) {
                      // Determine the reward and add the reward image
                      trial.rewardStimulus = calculateReward(
                        chosenStimulus,
                        trial.trialRow
                      );

                      // Append the reward image
                      svg
                        .append("svg:image")
                        .attr("x", rewardX)
                        .attr("y", rewardY)
                        .attr("width", sizeReward)
                        .attr("height", sizeReward)
                        .attr("xlink:href", trial.rewardStimulus);
                      interval(() => {}, configuration.timing.reward);
                    }

                    transition.stop();
                  }
                }, configuration.timing.flash / 5);
              });
          }
        } else {
          // This only gets evaluated if 'trialPrompt' is 'true'
          consola.info(`'endTrial()' called.`);
          endTrial();
        }

        // Create a timeout for displaying the trial outcome
        jsPsych.pluginAPI.setTimeout(() => {
          // Cancel the keyboard listener
          jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);

          // End the trial
          endTrial();
        }, configuration.timing.flash + configuration.timing.reward);
      }
    };

    // Create a keyboard listener, listen to all keys
    const keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
      callback_function: afterResponse,
      valid_responses: jsPsych.ALL_KEYS,
      persist: true,
      allow_held_key: false,
    });

    // If a timeout is configured and a duration is set, create a
    // timeout to end the trial if no response is recorded
    // in the specified timeframe
    if (trial.responseWindow !== null && trial.timeout == true) {
      jsPsych.pluginAPI.setTimeout(() => {
        if (response.rt == null) {
          movePossible = false;
          trial.chosenStimulus = "";

          imageRight
            .transition()
            .duration(configuration.timing.flash)
            .attr(
              "xlink:href",
              experiment.getStimuli().getImage(trial.rightStimulus + "_sp.png")
            );
          imageLeft.attr(
            "xlink:href",
            experiment
              .getStimuli()
              .getImage(trial.leftStimulus.replace(".png", "") + "_sp.png")
          );
        }

        jsPsych.pluginAPI.setTimeout(() => {
          jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
          endTrial();
        }, configuration.timing.flash);
      }, trial.responseWindow);
    }
  };

  /**
   * Calcuate if a reward has been obtained or not and return
   * the path to the image to display
   * @param {string} chosenString the selected option
   * @param {any} trialRow data for the trial
   * @return {string}
   */
  const calculateReward = (chosenString: string, trialRow: any) => {
    // 'Experiment' instance
    const experiment = window.Experiment;

    let debugString = "-- Function --";
    debugString += `\nName: calculateReward`;
    debugString += `\n\tchosenString: ${chosenString}`;

    if (chosenString == "") {
      consola.info(debugString);
      return null;
    } else {
      const alien = parseInt(chosenString.slice(-1)) % 2;
      const state = +(parseInt(chosenString.slice(-1)) > 2);
      debugString += `\n\talien: ${alien}`;
      debugString += `\n\tstate: ${state}`;

      let reward = false;
      if (state == 0) {
        reward = experiment.random() < parseFloat(trialRow[alien]);
      } else {
        reward = experiment.random() < parseFloat(trialRow[2 + alien]);
      }

      debugString += `\n\treward: ${reward}`;
      consola.info(debugString);

      if (reward) {
        return experiment.getStimuli().getImage("t.png");
      } else {
        return experiment.getStimuli().getImage("nothing.png");
      }
    }
  };

  return plugin;
})();

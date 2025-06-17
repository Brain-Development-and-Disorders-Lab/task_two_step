/**
 * The jsPsych version of the task was originally coded by the Niv Lab (https://nivlab.princeton.edu/)
 * at Princeton, adapted by the Hartley Lab (https://www.hartleylab.org/) at NYU for use online
 * with children, adolescents, and adults, and adapted here by the Brain Development and Disorders Lab
 * (https://sites.wustl.edu/richardslab) at Washington University in St. Louis.
 *
 * Plugin:
 * two-step-fixation
 *
 * Changelog:
 * ...
 * HB 01/2022
 */
// Logging library
import consola from "consola";

// d3.js imports
import { select } from "d3";

// Display variables
import { width, height, centerX, centerY, sizeFont } from "../variables";

jsPsych.plugins["two-step-fixation"] = (() => {
  const plugin = {
    info: {},
    trial: (displayElement: HTMLElement, trial: any) => {
      consola.debug(`displayElement:`, displayElement);
      consola.debug(`trial:`, trial);
      consola.error(`Plugin trial not defined!`);
    },
  };

  plugin.info = {
    name: "two-step-fixation",
    description: "Fixation cross for the task.",
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Stimulus",
        default: undefined,
        description: "The HTML string to be displayed",
      },
      text: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Text",
        default: null,
        description: "Any content here will be displayed on the background.",
      },
      responseWindow: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Trial duration",
        default: null,
        description: "How long to show trial before it ends.",
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

    // Reset the displayElement contents
    const html = `<div id='container' class='exp-container'></div>`;
    displayElement.innerHTML = html;

    // Render all specified elements to the view
    // SVG container
    const svg = select("div#container")
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 " + width + " " + height)
      .classed("svg-content", true);

    // Append the stimulus image
    if (trial.stimulus !== null) {
      svg
        .append("svg:image")
        .attr("width", width)
        .attr("height", height)
        .attr("preserveAspectRatio", "xMidYMid slice")
        .attr("xlink:href", trial.stimulus);
    }

    // Append text to the center of the view
    if (trial.text !== null) {
      svg
        .append("text")
        .attr("x", centerX)
        .attr("y", centerY)
        .style("text-anchor", "middle")
        .style("font-size", sizeFont + "px")
        .style("font-family", "Arial")
        .style("font-weight", "bold")
        .style("letter-spacing", "0.2")
        .style("fill", "white")
        .text(trial.text);
    }

    /**
     * End the 'two-step-instructions' trial
     */
    const endTrial = () => {
      // Clear any existing 'setTimeout' instances
      jsPsych.pluginAPI.clearAllTimeouts();

      // Specify the data from the trial
      const trialData = {
        planetStimulus: trial.stimulus,
        trialNumber: trial.trialNumber,
        trialStage: "fixation",
      };

      // Clear the contents of 'displayElement'
      displayElement.innerHTML = "";

      // Notify jsPsych and pass the trial data
      jsPsych.finishTrial(trialData);
    };

    // Configure a trial timeout and limit the duration
    if (trial.responseWindow !== null && trial.responseWindow > 0) {
      jsPsych.pluginAPI.setTimeout(function () {
        endTrial();
      }, trial.responseWindow);
    }
  };

  return plugin;
})();

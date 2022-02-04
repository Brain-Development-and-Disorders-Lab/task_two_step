/**
 * Plugin:
 * two-step-instructions
 *
 * Overview:
 * Similar to other two-step task d3 plugins, sizes of pictures are
 * global variables.
 *
 * Changelog:
 * VF 08/2019
 * KN 04/2020
 * HB 01/2022
 */
// Logging library
import consola from 'consola';

// d3.js imports
import {select} from 'd3';

// Display variables
import {
  width,
  height,
  sizeMonster,
  sizeReward,
  centerX,
  choiceY,
  choiceXRight,
  choiceXLeft,
  textInstructionsY,
  textX,
  sizeFont,
} from '../display';

jsPsych.plugins['two-step-instructions'] = (() => {
  const plugin = {};

  plugin.info = {
    name: 'two-step-instructions',
    description: 'Instructions for the task.',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Stimulus',
        default: null,
        description: 'The image to be displayed',
      },
      rightStimulus: {
        type: jsPsych.plugins.parameterType.STRING,
        default: null,
        array: false,
      },
      leftStimulus: {
        type: jsPsych.plugins.parameterType.STRING,
        default: null,
        array: false,
      },
      centerStimulus: {
        type: jsPsych.plugins.parameterType.STRING,
        default: null,
        array: false,
      },
      rewardString: {
        type: jsPsych.plugins.parameterType.STRING,
        default: null,
        array: false,
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        array: true,
        pretty_name: 'Choices',
        default: jsPsych.ALL_KEYS,
        description: 'The keys the subject is allowed to ' +
            'press to respond to the stimulus.',
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.',
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: false,
        description: 'If true, trial will end when subject makes a response.',
      },
      button_clicked: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Button state',
        default: false,
        description: 'State of the button.',
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
    const svg = select('div#container')
        .append('svg')
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .classed('svg-content', true);

    // Append the stimulus image
    if (trial.stimulus !== null) {
      svg.append('svg:image')
          .attr('width', width)
          .attr('height', height)
          .attr('preserveAspectRatio', 'xMidYMid slice')
          .attr('xlink:href', trial.stimulus);
    }

    // Append an image to the right side of the view
    if (trial.rightStimulus !== null) {
      svg.append('svg:image')
          .attr('class', 'right')
          .attr('x', choiceXRight)
          .attr('y', choiceY)
          .attr('width', sizeMonster)
          .attr('height', sizeMonster)
          .attr('xlink:href', trial.rightStimulus);
    }

    // Append the reward string to the view
    if (trial.rewardString !== null) {
      svg.append('svg:image')
          .attr('x', centerX - sizeReward / 2)
          .attr('y', choiceY)
          .attr('width', sizeReward)
          .attr('height', sizeReward)
          .attr('xlink:href', trial.rewardString);
    }

    // Append text to the left side of the view
    if (trial.leftStimulus !== null) {
      svg.append('svg:image')
          .attr('x', choiceXLeft)
          .attr('y', choiceY)
          .attr('width', sizeMonster)
          .attr('height', sizeMonster)
          .attr('xlink:href', trial.leftStimulus);
    }

    // Append text to the center of the view
    if (trial.centerStimulus !== null) {
      svg.append('svg:image')
          .attr('x', centerX - sizeMonster / 2)
          .attr('y', choiceY)
          .attr('width', sizeMonster)
          .attr('height', sizeMonster)
          .attr('xlink:href', trial.centerStimulus);
    }

    // Append the continue button to the view
    const imageButton = svg.append('svg:circle')
        .attr('r', 30)
        .attr('cx', choiceXRight + sizeMonster)
        .attr('cy', choiceY + sizeMonster - 100)
        .style('fill', 'red')
        .style('stroke', 'black')
        .style('stroke-width', 6)
        .on('click', () => {
          trial.button_clicked = true;
          imageButton.style('fill', 'green');
          imageButton.style('stroke', 'black');
        });

    // Add the main prompt to the view
    if (trial.prompt !== null) {
      // Wrap text to fit inside the view
      let lineNumber = 0;
      const lineHeight = 1.1;
      const dy = 0;

      for (let i = 0; i < trial.prompt.length; i++) {
        // Append a line of text
        svg.append('text')
            .attr('x', textX)
            .attr('y', textInstructionsY)
            .attr('dy', ++lineNumber * lineHeight + dy + 'em')
            .style('text-anchor', 'middle')
            .style('font-size', sizeFont + 'px')
            .style('font-family', 'Open Sans')
            .style('font-weight', 'bold')
            .style('letter-spacing', '0.2')
            .style('fill', 'white')
            .text(trial.prompt[i]);
        lineNumber++;
      }
    }

    /**
     * End the 'two-step-instructions' trial
     */
    const endTrial = () => {
      // Reset the button state
      trial.button_clicked = false;

      // Clear any existing 'setTimeout' instances
      jsPsych.pluginAPI.clearAllTimeouts();

      // Clear any existing keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      // Clear the contents of 'displayElement'
      displayElement.innerHTML = '';

      // Notify jsPsych
      jsPsych.finishTrial();
    };


    /**
     * Handle responses by the subject
     */
    const afterResponse = () => {
      // If the participant has clicked the button, end the trial
      if (trial.button_clicked == true) {
        endTrial();
      };
    };

    // Create a keyboard listener, listen to all keys
    if (trial.choices != jsPsych.NO_KEYS) {
      // Use the jsPsych pluginAPI
      jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: afterResponse,
        valid_responses: trial.choices,
        rt_method: 'performance',
        persist: true,
        allow_held_key: false,
      });
    }
  };

  return plugin;
})();

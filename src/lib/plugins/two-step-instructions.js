/**
 * two-step-instructions
 * Similar to other two-step task d3 plugins, sizes of pictures are
 * global variables
 * VF 8/2019
 * KN added audio 4/22/20
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

jsPsych.plugins['two-step-instructions'] = (function() {
  const plugin = {};

  plugin.info = {
    name: 'two-step-instructions',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Stimulus',
        default: null,
        description: 'The image to be displayed',
      },
      right_text: {
        type: jsPsych.plugins.parameterType.STRING,
        default: null,
        array: false,
      },
      left_text: {
        type: jsPsych.plugins.parameterType.STRING,
        default: null,
        array: false,
      },
      center_text: {
        type: jsPsych.plugins.parameterType.STRING,
        default: null,
        array: false,
      },
      rewardString: {
        type: jsPsych.plugins.parameterType.STRING,
        default: null,
        array: false.valueOf,
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
        description: 'state of button.',
      },
    },
  };

  plugin.trial = function(displayElement, trial) {
    consola.debug(`Running trial:`, trial.type);

    // display stimulus
    const html = `<div id='container' class='exp-container'></div>`;
    displayElement.innerHTML = html;

    const svg = select('div#container')
        .append('svg')
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .classed('svg-content', true);

    if (trial.stimulus !== null) {
      svg.append('svg:image')
          .attr('width', width)
          .attr('height', height)
          .attr('preserveAspectRatio', 'xMidYMid slice')
          .attr('xlink:href', trial.stimulus);
    }

    if (trial.right_text !== null) {
      svg.append('svg:image')
          .attr('class', 'right')
          .attr('x', choiceXRight)
          .attr('y', choiceY)
          .attr('width', sizeMonster)
          .attr('height', sizeMonster)
          .attr('xlink:href', trial.right_text);
    }

    if (trial.rewardString !== null) {
      svg.append('svg:image')
          .attr('x', centerX-sizeReward / 2)
          .attr('y', choiceY)
          .attr('width', sizeReward)
          .attr('height', sizeReward)
          .attr('xlink:href', trial.rewardString);
    }

    if (trial.left_text !== null) {
      svg.append('svg:image')
          .attr('x', choiceXLeft)
          .attr('y', choiceY)
          .attr('width', sizeMonster)
          .attr('height', sizeMonster)
          .attr('xlink:href', trial.left_text);
    }

    if (trial.center_text !== null) {
      svg.append('svg:image')
          .attr('x', centerX-sizeMonster / 2)
          .attr('y', choiceY)
          .attr('width', sizeMonster)
          .attr('height', sizeMonster)
          .attr('xlink:href', trial.center_text);
    }

    const imageButton = svg.append('svg:circle')
        .attr('r', 25)
        .attr('cx', choiceXRight + sizeMonster)
        .attr('cy', choiceY + sizeMonster - 100)
        .style('stroke', 'black')
        .style('fill', 'red')
        .on('click', () => {
          trial.button_clicked = true;
          imageButton.style('fill', 'green');
          imageButton.style('stroke', 'black');
        });

    // add prompt
    if (trial.prompt !== null) {
      // inspired by Mike Bostock
      // https://bl.ocks.org/mbostock/7555321
      let lineNumber = 0;
      const lineHeight = 1.1; // ems
      const dy = 0;
      for (let i = 0; i < trial.prompt.length; i++) {
        svg.append('text')
            .attr('x', textX)
            .attr('y', textInstructionsY)
            .attr('dy', ++lineNumber * lineHeight + dy + 'em')
            .style('font-size', sizeFont+'px')
            .style('fill', 'white')
            .text(trial.prompt[i]);
        lineNumber++;
      }
    }

    // function to end trial when it is time
    const endTrial = () => {
      // set button_clicked back to false
      trial.button_clicked = false;

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      // clear the display
      displayElement.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial();
    };


    // function to handle responses by the subject
    const afterResponse = () => {
      if (trial.button_clicked == true) {
        endTrial();
      };
    };

    // start the response listener
    if (trial.choices != jsPsych.NO_KEYS) {
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

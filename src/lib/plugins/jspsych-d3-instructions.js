/**
 * d3-instructions
 * Similar to other two-step task d3 plugins, sizes of pictures are
 * global variables
 * VF 8/2019
 * KN added audio 4/22/20
 **/
import {select} from 'd3';
import consola from 'consola';

import {
  width,
  height,
  monster_size,
  reward_size,
  x_center,
  choice_y,
  choice_x_right,
  choice_x_left,
  instructions_text_start_y,
  text_start_x,
  font_size,
} from '../display';

jsPsych.plugins['d3-instructions'] = (function() {
  const plugin = {};

  plugin.info = {
    name: 'd3-instructions',
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
      reward_string: {
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

  plugin.trial = function(display_element, trial) {
    consola.debug(`Running trial:`, trial.type);

    // display stimulus
    const new_html = `<div id='container' class='exp-container'></div>`;
    display_element.innerHTML = new_html;

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
          .attr('x', choice_x_right)
          .attr('y', choice_y)
          .attr('width', monster_size)
          .attr('height', monster_size)
          .attr('xlink:href', trial.right_text);
    }

    if (trial.reward_string !== null) {
      svg.append('svg:image')
          .attr('x', x_center-reward_size / 2)
          .attr('y', choice_y)
          .attr('width', reward_size)
          .attr('height', reward_size)
          .attr('xlink:href', trial.reward_string);
    }

    if (trial.left_text !== null) {
      svg.append('svg:image')
          .attr('x', choice_x_left)
          .attr('y', choice_y)
          .attr('width', monster_size)
          .attr('height', monster_size)
          .attr('xlink:href', trial.left_text);
    }

    if (trial.center_text !== null) {
      svg.append('svg:image')
          .attr('x', x_center-monster_size / 2)
          .attr('y', choice_y)
          .attr('width', monster_size)
          .attr('height', monster_size)
          .attr('xlink:href', trial.center_text);
    }

    const button_image = svg.append('svg:circle')
        .attr('r', 25)
        .attr('cx', choice_x_right + monster_size)
        .attr('cy', choice_y + monster_size - 100)
        .style('stroke', 'black')
        .style('fill', 'red')
        .on('click', () => {
          trial.button_clicked = true;
          button_image.style('fill', 'green');
          button_image.style('stroke', 'black');
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
            .attr('x', text_start_x)
            .attr('y', instructions_text_start_y)
            .attr('dy', ++lineNumber * lineHeight + dy + 'em')
            .style('font-size', font_size+'px')
            .style('fill', 'white')
            .text(trial.prompt[i]);
        lineNumber++;
      }
    }

    // function to end trial when it is time
    const end_trial = () => {
      // set button_clicked back to false
      trial.button_clicked = false;

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial();
    };


    // function to handle responses by the subject
    const after_response = () => {
      if (trial.button_clicked == true) {
        end_trial();
      };
    };

    // start the response listener
    if (trial.choices != jsPsych.NO_KEYS) {
      jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: 'performance',
        persist: true,
        allow_held_key: false,
      });
    }
  };

  return plugin;
})();

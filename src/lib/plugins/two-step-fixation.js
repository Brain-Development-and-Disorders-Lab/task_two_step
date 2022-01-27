/**
 * jspsych-two-step-fixation
 */
// Logging library
import consola from 'consola';

// d3.js imports
import {select} from 'd3';

// Display variables
import {width, height, centerX, centerY, sizeFont} from '../display';

jsPsych.plugins['two-step-fixation'] = (() => {
  const plugin = {};

  plugin.info = {
    name: 'two-step-fixation',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The HTML string to be displayed',
      },
      text: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Text',
        default: null,
        description: 'Any content here will be displayed on the background.',
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show trial before it ends.',
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
        .attr('viewBox', '0 0 ' + width + ' ' + height)
        .classed('svg-content', true);


    if (trial.stimulus !== null) {
      svg.append('svg:image')
          .attr('width', width)
          .attr('height', height)
          .attr('preserveAspectRatio', 'xMidYMid slice')
          .attr('xlink:href', trial.stimulus);
    }

    // add text
    if (trial.text !== null) {
      svg.append('text')
          .attr('x', centerX-3)
          .attr('y', centerY)
          .attr('dy', + 'em')
          .style('font-size', sizeFont+'px')
          .style('fill', 'white')
          .text(trial.text);
    }

    // function to end trial when it is time
    const endTrial = () => {
      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // gather the data to store for the trial
      const trialData = {
        'stimulus': trial.stimulus,
        'trial_stage': 'fixation',
      };

      // clear the display
      displayElement.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trialData);
    };

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        endTrial();
      }, trial.trial_duration);
    }
  };

  return plugin;
})();

/**
 * jspsych-two-step-end
 * Kristin Diep
 *
 * plugin for playing an audio file and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 */
// Logging library
import consola from 'consola';

jsPsych.plugins['two-step-end'] = (function() {
  const plugin = {};

  jsPsych.pluginAPI.registerPreload('two-step-end', 'stimulus', 'audio');

  plugin.info = {
    name: 'two-step-end',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.AUDIO,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The audio to be played.',
      },
      choices: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Choices',
        default: undefined,
        array: true,
        description: 'The button labels.',
      },
      button_html: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Button HTML',
        default: `<button class='jspsych-btn'>%choice%</button>`,
        array: true,
        description: 'Custom button. Can make your own style.',
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.',
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'The maximum duration to wait for a response.',
      },
      margin_vertical: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Margin vertical',
        default: '0px',
        description: 'Vertical margin of button.',
      },
      margin_horizontal: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Margin horizontal',
        default: '8px',
        description: 'Horizontal margin of button.',
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, the trial will end when user makes a response.',
      },
      trial_ends_after_audio: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Trial ends after audio',
        default: false,
        description: 'If true, then the trial will end as soon as the ' +
            'audio file finishes playing.',
      },
    },
  };

  plugin.trial = function(display_element, trial) {
    consola.debug(`Running trial:`, trial.type);

    // setup stimulus
    const context = jsPsych.pluginAPI.audioContext();
    if (context !== null) {
      const source = context.createBufferSource();
      source.buffer = jsPsych.pluginAPI.getAudioBuffer(trial.stimulus);
      source.connect(context.destination);
    } else {
      const audio = jsPsych.pluginAPI.getAudioBuffer(trial.stimulus);
      audio.currentTime = 0;
    }

    // set up end event if trial needs it
    if (trial.trial_ends_after_audio) {
      if (context !== null) {
        source.onended = () => {
          end_trial();
        };
      } else {
        audio.addEventListener('ended', end_trial);
      }
    }

    // show prompt if there is one
    let html = ``;
    if (trial.prompt !== null) {
      html = trial.prompt;
    }

    // display buttons
    const buttons = [];
    if (Array.isArray(trial.button_html)) {
      if (trial.button_html.length == trial.choices.length) {
        buttons = trial.button_html;
      } else {
        consola.error(
            'Error in image-button-response plugin. '+
            'The length of the button_html array does not ' +
            'equal the length of the choices array',
        );
      }
    } else {
      for (let i = 0; i < trial.choices.length; i++) {
        buttons.push(trial.button_html);
      }
    }

    html += `<div id='jspsych-two-step-end-btngroup'>`;
    for (let i = 0; i < trial.choices.length; i++) {
      const str = buttons[i].replace(/%choice%/g, trial.choices[i]);
      html +=
          `<div
            class='jspsych-two-step-end-button'
            style='
              cursor: pointer;
              display: inline-block;
              margin:${trial.margin_vertical} ${trial.margin_horizontal}
              id='jspsych-two-step-end-button-${i}
              data-choice=${i}
          >
            ${str}
          </div>`;
    }
    html += `</div>`;

    display_element.innerHTML = html;

    for (let i = 0; i < trial.choices.length; i++) {
      display_element.querySelector('#jspsych-two-step-end-button-' + i)
          .addEventListener('click', (e) => {
            const choice = e.currentTarget.getAttribute('data-choice');
            after_response(choice);
          });
    }

    // store response
    const response = {
      rt: null,
      button: null,
    };

    // function to handle responses by the subject
    const after_response = (choice) => {
      // measure rt
      const end_time = performance.now();
      const rt = end_time - start_time;
      response.button = choice;
      response.rt = rt;

      // disable all the buttons after a response
      const btns = document.querySelectorAll(
          '.jspsych-two-step-end-button button',
      );
      for (let i = 0; i<btns.length; i++) {
        btns[i].setAttribute('disabled', 'disabled');
      }

      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    // function to end trial when it is time
    const end_trial = () => {
      // stop the audio file if it is playing
      // remove end event listeners if they exist
      if (context !== null) {
        source.stop();
        source.onended = () => {};
      } else {
        audio.pause();
        audio.removeEventListener('ended', end_trial);
      }

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // gather the data to store for the trial
      const trial_data = {
        'rt': response.rt,
        'stimulus': trial.stimulus,
        'button_pressed': response.button,
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // start time
    const start_time = performance.now();

    // start audio
    if (context !== null) {
      const startTime = context.currentTime;
      source.start(startTime);
    } else {
      audio.play();
    }

    // end trial if time limit is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }
  };

  return plugin;
})();

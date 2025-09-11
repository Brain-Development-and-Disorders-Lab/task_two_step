# Two-Step Task

An adaptation of the task described by [Nussenbaum, K., Scheuplein, M., Phaneuf, C., Evans, M.D., & Hartley, C.A. (2020) - Moving developmental research online: comparing in-lab and web-based studies of model-based reinforcement learning.](https://online.ucpress.edu/collabra/article/6/1/17213/114338/Moving-Developmental-Research-Online-Comparing-In).

They collected data from 151 participants on two tasks: the two-step task, as described in Decker et al. (2016) and the Matrix Reasoning Item Bank (MaRs-IB) as described in Chierchia, Fuhrmann et al. (2019).

The adaptation of the two-step task, developed using [jsPsych](https://www.jspsych.org/), can be found in the _src_ directory.

## Task Overview

This sequential decision-making task was originally described in [Decker et al. (2016)](https://journals.sagepub.com/doi/full/10.1177/0956797616639301?url_ver=Z39.88-2003&rfr_id=ori:rid:crossref.org&rfr_dat=cr_pub%20%200pubmed), and is based off of an adult task originally described in [Daw et al. (2011)](<https://www.cell.com/neuron/fulltext/S0896-6273(11)00125-5?_returnURL=https%3A%2F%2Flinkinghub.elsevier.com%2Fretrieve%2Fpii%2FS0896627311001255%3Fshowall%3Dtrue>).
Participants make a series of sequential decisions to try to gain as much reward as possible. In this version, on each trial, participants first must select a spaceship, which then transports them to one of two planets where they can ask an alien for space treasure.

The jsPsych version of the task was originally coded by the [Niv Lab](https://nivlab.princeton.edu/) at Princeton, adapted by the [Hartley Lab](https://www.hartleylab.org/) at NYU for use online with children, adolescents, and adults, and adapted here by the [Brain Development and Disorders Lab](https://sites.wustl.edu/richardslab) at Washington University in St. Louis.

## Major Changes

- Complete refactor and rewrite of core experiment architecture using jsPsych v7.0
- [Pavlovia](https://pavlovia.org/) integration was removed from all source code
- Gorilla platform integration
  - Packaging of images, audio and CSV files
  - Integration of `Neurocog` library for integration with Gorilla
- Rocket images and backgrounds updated
- Comprehensive data collection

## Data Collection

All raw data and analysis code has been moved into the _analysis_ directory. All analyses and results reported in the Nussenbaum et. al. (2020) manuscript can be reproduced by running the R scripts (for all data summary statistics and regression analyses) and MATLAB code (for the computational modeling of the two-step task data).

The experiment collects comprehensive data for each trial. The following table details all data points collected:

| **Category** | **Variable** | **Type** | **Description** |
|--------------|--------------|----------|-----------------|
| **Trial Information** | `trialType` | `string` | Type of trial: 'training-rocket', 'training-alien', 'training-full', or 'full' |
| | `leftKey` | `string` | Key mapping for left choice (default: 'f') |
| | `rightKey` | `string` | Key mapping for right choice (default: 'j') |
| | `rewardLikelihoods` | `number[]` | Array of 4 reward probabilities for each alien |
| | `transitionLikelihood` | `number` | Probability of common vs rare transitions (0-1) |
| | `responseWindow` | `number` | Maximum response time allowed in milliseconds |
| **Participant Response** | `levelOneChoice` | `0\|1\|2` | Rocket choice: 0=timeout, 1=left, 2=right |
| | `levelTwoChoice` | `0\|1\|2` | Alien choice: 0=timeout, 1=left, 2=right |
| | `levelOneRT` | `number` | Reaction time for rocket choice in milliseconds |
| | `levelTwoRT` | `number` | Reaction time for alien choice in milliseconds |
| | `timeout` | `boolean` | Whether the trial timed out |
| **Transition & Reward** | `transitionType` | `'none'\|'common'\|'rare'` | Type of transition that occurred |
| | `wasRewarded` | `boolean` | Whether participant received a reward |
| **Timing** | `trialStartTime` | `number` | Timestamp when trial began (Date.now()) |
| | `trialEndTime` | `number` | Timestamp when trial ended (Date.now()) |
| **Comprehension Questions** | `question.prompt` | `string` | The comprehension question text |
| | `question.correct` | `string` | Correct answer ('true' or 'false') |
| | `response` | `string` | Participant's answer ('true' or 'false') |
| | `correctAnswer` | `string` | The correct answer for the question |
| | `responseTime` | `number` | Time to answer comprehension question |
| | `isCorrect` | `boolean` | Whether participant answered correctly |
| **Fixation Trials** | `duration` | `number` | Duration of fixation display in milliseconds |
| **Counterbalancing** | `counterbalancing.swapMainRockets` | `boolean` | Whether main rocket positions are swapped |
| | `counterbalancing.swapTrainingRockets` | `boolean` | Whether training rocket positions are swapped |
| | `counterbalancing.swapRedAliens` | `boolean` | Whether red planet alien positions are swapped |
| | `counterbalancing.swapPurpleAliens` | `boolean` | Whether purple planet alien positions are swapped |
| | `counterbalancing.swapGreenAliens` | `boolean` | Whether green planet alien positions are swapped |
| | `counterbalancing.swapYellowAliens` | `boolean` | Whether yellow planet alien positions are swapped |
| | `counterbalancing.swapRocketPreference` | `boolean` | Whether rocket-to-planet mapping is swapped |

## Configuration

Trial counts and parameters can be easily modified in `src/config.ts`:

```typescript
export const config: ExperimentConfig = {
  trainingTrials: {
    rocket: 8,           // Number of rocket-only training trials
    alien: 8,            // Number of alien-only training trials
    full: 8,             // Number of complete training trials
  },
  mainTrials: {
    blockSize: 50,       // Trials per block
    blockCount: 4,       // Number of blocks
  },
  timing: {
    fixation: 1000,      // Fixation cross duration (ms)
    choice: 3000,        // Response window duration (ms)
    reward: 1000,       // Reward display duration (ms)
    transition: 1500,   // Transition animation duration (ms)
  },
  controls: {
    left: 'f',           // Left choice key
    right: 'j',          // Right choice key
  },
  transitionLikelihood: 0.7,  // Probability of common transitions
  name: 'Two-Step Task',
  studyName: 'task_two_step',
  contact: 'henry.burgess@wustl.edu',
  counterbalancing: {
    swapMainRockets: true,
    swapTrainingRockets: false,
    swapRedAliens: true,
    swapPurpleAliens: false,
    swapGreenAliens: false,
    swapYellowAliens: false,
    swapRocketPreference: false,
  },
};
```

## License

<!-- CC BY-NC-SA 4.0 License -->
<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
  <img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" />
</a>
<br />
This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.

## Issues and Feedback

For questions about the task used by Nussenbaum et. al., please contact <[katenuss@nyu.edu](mailto:katenuss@nyu.edu)>. Please contact **Henry Burgess** <[henry.burgess@wustl.edu](mailto:henry.burgess@wustl.edu)> regarding this adaptation or other code-related issues and feedback.

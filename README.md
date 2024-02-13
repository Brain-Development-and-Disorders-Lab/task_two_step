# Two-Step Task

An adaptation of the task described by [Nussenbaum, K., Scheuplein, M., Phaneuf, C., Evans, M.D., & Hartley, C.A. (2020) - Moving developmental research online: comparing in-lab and web-based studies of model-based reinforcement learning.](https://online.ucpress.edu/collabra/article/6/1/17213/114338/Moving-Developmental-Research-Online-Comparing-In).

They collected data from 151 participants on two tasks: the two-step task, as described in Decker et al. (2016) and the Matrix Reasoning Item Bank (MaRs-IB) as described in Chierchia, Fuhrmann et al. (2019).

The adaptation of the two-step task, developed using [jsPsych](https://www.jspsych.org/), can be found in the *src* directory.

## Task Overview

This sequential decision-making task was originally described in [Decker et al. (2016)](https://journals.sagepub.com/doi/full/10.1177/0956797616639301?url_ver=Z39.88-2003&rfr_id=ori:rid:crossref.org&rfr_dat=cr_pub%20%200pubmed), and is based off of an adult task originally described in [Daw et al. (2011)](<https://www.cell.com/neuron/fulltext/S0896-6273(11)00125-5?_returnURL=https%3A%2F%2Flinkinghub.elsevier.com%2Fretrieve%2Fpii%2FS0896627311001255%3Fshowall%3Dtrue>).
Participants make a series of sequential decisions to try to gain as much reward as possible. In this version, on each trial, participants first must select a spaceship, which then transports them to one of two planets where they can ask an alien for space treasure.

The jsPsych version of the task was originally coded by the [Niv Lab](https://nivlab.princeton.edu/) at Princeton, adapted by the [Hartley Lab](https://www.hartleylab.org/) at NYU for use online with children, adolescents, and adults, and adapted here by the [Brain Development and Disorders Lab](https://sites.wustl.edu/richardslab) at Washington University in St. Louis.

## Data and analysis code

All raw data and analysis code has been moved into the *analysis* directory. All analyses and results reported in the Nussenbaum et. al. (2020) manuscript can be reproduced by running the R scripts (for all data summary statistics and regression analyses) and MATLAB code (for the computational modeling of the two-step task data).

For questions about the task used by Nussenbaum et. al., please contact katenuss@nyu.edu. For questions about this specific adaptation, please contact henry.burgess@wustl.edu.

## Major Changes

[Pavlovia](https://pavlovia.org/) integration was removed from all source code. A general cleanup of JavaScript source code.

Other changes include:

- Gorilla platform integration
  - Packaging of images, audio and CSV files
  - Integration of `jspsych-wrapper` library
- ESLint integration for code quality
- Rocket images and backgrounds updated

## License

<!-- CC BY-NC-SA 4.0 License -->
<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
  <img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" />
</a>
<br />
This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.

## Issues and Feedback

For questions about the task used by Nussenbaum et. al., please contact <[katenuss@nyu.edu](mailto:katenuss@nyu.edu)>. Please contact **Henry Burgess** <[henry.burgess@wustl.edu](mailto:henry.burgess@wustl.edu)> regarding this adaptation or other code-related issues and feedback.

// 'Experiment' jsPsych wrapper library
import { Experiment } from "jspsych-wrapper";

// Add 'Experiment' to the global Window interface
declare global {
  interface Window {
    Experiment: Experiment;
  }
}

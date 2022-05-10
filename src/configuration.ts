/**
 * The jsPsych version of the task was originally coded by the Niv Lab (https://nivlab.princeton.edu/)
 * at Princeton, adapted by the Hartley Lab (https://www.hartleylab.org/) at NYU for use online
 * with children, adolescents, and adults, and adapted here by the Brain Development and Disorders Lab
 * (https://sites.wustl.edu/richardslab) at Washington University in St. Louis.
 *
 * Configuration for the experiment
 */

// 'LogLevel' attribute to configure logging
import { LogLevel } from "consola";

export const configuration = {
  name: "Two-step game",
  studyName: "task_twostep",
  manipulations: {
    testing: true,
  },
  resources: {},
  stimuli: {
    // Alien 1, main
    "alien1_a1.png": "images/aliens/1/alien1_a1.png",
    "alien1_a2.png": "images/aliens/1/alien1_a2.png",
    "alien1_deact.png": "images/aliens/1/alien1_deact.png",
    "alien1_norm.png": "images/aliens/1/alien1_norm.png",
    "alien1_sp.png": "images/aliens/1/alien1_sp.png",

    // Alien 2, main
    "alien2_a1.png": "images/aliens/2/alien2_a1.png",
    "alien2_a2.png": "images/aliens/2/alien2_a2.png",
    "alien2_deact.png": "images/aliens/2/alien2_deact.png",
    "alien2_norm.png": "images/aliens/2/alien2_norm.png",
    "alien2_sp.png": "images/aliens/2/alien2_sp.png",

    // Alien 3, main
    "alien3_a1.png": "images/aliens/3/alien3_a1.png",
    "alien3_a2.png": "images/aliens/3/alien3_a2.png",
    "alien3_deact.png": "images/aliens/3/alien3_deact.png",
    "alien3_norm.png": "images/aliens/3/alien3_norm.png",
    "alien3_sp.png": "images/aliens/3/alien3_sp.png",

    // Alien 4, main
    "alien4_a1.png": "images/aliens/4/alien4_a1.png",
    "alien4_a2.png": "images/aliens/4/alien4_a2.png",
    "alien4_deact.png": "images/aliens/4/alien4_deact.png",
    "alien4_norm.png": "images/aliens/4/alien4_norm.png",
    "alien4_sp.png": "images/aliens/4/alien4_sp.png",

    // Alien 1, tutorial
    "tutalien1_a1.png": "images/aliens/1/tutalien1_a1.png",
    "tutalien1_a2.png": "images/aliens/1/tutalien1_a2.png",
    "tutalien1_deact.png": "images/aliens/1/tutalien1_deact.png",
    "tutalien1_norm.png": "images/aliens/1/tutalien1_norm.png",
    "tutalien1_sp.png": "images/aliens/1/tutalien1_sp.png",

    // Alien 2, tutorial
    "tutalien2_a1.png": "images/aliens/2/tutalien2_a1.png",
    "tutalien2_a2.png": "images/aliens/2/tutalien2_a2.png",
    "tutalien2_deact.png": "images/aliens/2/tutalien2_deact.png",
    "tutalien2_norm.png": "images/aliens/2/tutalien2_norm.png",
    "tutalien2_sp.png": "images/aliens/2/tutalien2_sp.png",

    // Alien 3, tutorial
    "tutalien3_a1.png": "images/aliens/3/tutalien3_a1.png",
    "tutalien3_a2.png": "images/aliens/3/tutalien3_a2.png",
    "tutalien3_deact.png": "images/aliens/3/tutalien3_deact.png",
    "tutalien3_norm.png": "images/aliens/3/tutalien3_norm.png",
    "tutalien3_sp.png": "images/aliens/3/tutalien3_sp.png",

    // Alien 4, tutorial
    "tutalien4_a1.png": "images/aliens/4/tutalien4_a1.png",
    "tutalien4_a2.png": "images/aliens/4/tutalien4_a2.png",
    "tutalien4_deact.png": "images/aliens/4/tutalien4_deact.png",
    "tutalien4_norm.png": "images/aliens/4/tutalien4_norm.png",
    "tutalien4_sp.png": "images/aliens/4/tutalien4_sp.png",

    // Rocket 1, main
    "rocket1_a1.png": "images/rockets/1/rocket1_a1.png",
    "rocket1_a2.png": "images/rockets/1/rocket1_a2.png",
    "rocket1_deact.png": "images/rockets/1/rocket1_deact.png",
    "rocket1_norm.png": "images/rockets/1/rocket1_norm.png",
    "rocket1_sp.png": "images/rockets/1/rocket1_sp.png",

    // Rocket 2, main
    "rocket2_a1.png": "images/rockets/2/rocket2_a1.png",
    "rocket2_a2.png": "images/rockets/2/rocket2_a2.png",
    "rocket2_deact.png": "images/rockets/2/rocket2_deact.png",
    "rocket2_norm.png": "images/rockets/2/rocket2_norm.png",
    "rocket2_sp.png": "images/rockets/2/rocket2_sp.png",

    // Rocket 1, tutorial
    "tutrocket1_a1.png": "images/rockets/3/tutrocket1_a1.png",
    "tutrocket1_a2.png": "images/rockets/3/tutrocket1_a2.png",
    "tutrocket1_deact.png": "images/rockets/3/tutrocket1_deact.png",
    "tutrocket1_norm.png": "images/rockets/3/tutrocket1_norm.png",
    "tutrocket1_sp.png": "images/rockets/3/tutrocket1_sp.png",

    // Rocket 2, tutorial
    "tutrocket2_a1.png": "images/rockets/4/tutrocket2_a1.png",
    "tutrocket2_a2.png": "images/rockets/4/tutrocket2_a2.png",
    "tutrocket2_deact.png": "images/rockets/4/tutrocket2_deact.png",
    "tutrocket2_norm.png": "images/rockets/4/tutrocket2_norm.png",
    "tutrocket2_sp.png": "images/rockets/4/tutrocket2_sp.png",

    // Backgrounds
    "blackbackground.jpg": "images/blackbackground.jpg",
    "earth.png": "images/earth.png",
    "tutgreenplanet.png": "images/tutgreenplanet.png",
    "purpleplanet.png": "images/purpleplanet.png",
    "redplanet1.png": "images/redplanet1.png",
    "tutyellowplanet.png": "images/tutyellowplanet.png",

    // Other
    "button.jpeg": "images/button.jpeg",
    "nothing.png": "images/nothing.png",
    "t.png": "images/t.png",
  },
  seed: 0.4735,
  allowParticipantContact: false,
  contact: "henry.burgess@wustl.edu",
  logging: LogLevel.Info,
  state: {
    practiceReward: 0,
    realReward: 0,
  },
};

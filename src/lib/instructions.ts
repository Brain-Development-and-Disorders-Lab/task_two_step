/**
 * The jsPsych version of the task was originally coded by the Niv Lab (https://nivlab.princeton.edu/)
 * at Princeton, adapted by the Hartley Lab (https://www.hartleylab.org/) at NYU for use online
 * with children, adolescents, and adults, and adapted here by the Brain Development and Disorders Lab
 * (https://sites.wustl.edu/richardslab) at Washington University in St. Louis.
 * 
 * Generate and export the instructions for the task
 */
export const instructions: any[][] = [];

// Black (starting) background
instructions[0] = [
  [
    'Please read each page of the instructions carefully.',
    'When you are ready to go to the next page,',
    'click on the red circle on the bottom right so that it turns green.',
    'Once the circle is green, press the spacebar to continue.',
  ],
];

// Rocket background
instructions[1] = [
  [
    'In this game, you will be taking a spaceship from earth',
    'to look for space treasure on two different planets.',
  ],
];


// Alien background
instructions[2] = [
  [
    'Each planet has two aliens on it. ',
    'Each alien runs a space treasure mine.',
  ],
  [
    'On each planet, you must ask one alien to share their space treasure with you. ',
    'These aliens are nice, so if an alien just found treasure ',
    'in their mine, it will share it with you.',
  ],
  [
    'Choose the left alien by pressing the \'1\' key ',
    ' and the right alien by pressing the \'0\' key. ',
    'The choice you make will be highlighted.',
    'You have an opportunity to practice selecting aliens now.',
    'Click the red circle and press the spacebar to continue.',
  ],
];

// Black background
instructions[3] = [
  [
    'After you choose an alien, you will find out if they have treasure to share.',
    'The treasure looks like this:',
  ],
  [
    'If the alien doesn\'t have treasure this time ' +
        'you\'ll see an empty circle.',
    'The circle looks like this:',
  ],
  [
    'If an alien has a good mine it will often have treasure to share. ',
    'It might not have treasure EVERY time you ask, but it will have ' +
        'treasure most of the time.',
  ],
  [
    'Another alien might have a bad mine at the moment',
    'and won\'t have treasure to share most times you ask.',
  ],
];

// Yellow alien
instructions[4] = [
  [
    'For example, this alien on the yellow planet has a good mine right now. ',
    'You can now ask it for treasure 10 times by pressing \'1\'.',
    'Click the red circle and press the spacebar to continue.',
  ],
  [
    'See, this alien shared treasure most of the times you asked,',
    'but maybe not every time.',
  ],
];

// Black background
instructions[5] = [
  [
    'Every alien has treasure in its mine, but they can\'t share every time.',
    'Some aliens will share because treasure is easier to dig up right now.',
  ],
];

// One alien to the right
instructions[6] = [
  [
    'Now, you can choose between two aliens',
    'and figure out which alien has more treasure to share.',
  ],
];

// One alien to the left
instructions[7] = [
  ['...and sometimes come up on the left.'],
];

// Black background
instructions[8] = [
  [
    'It does not matter which side an alien appears on.',
    'For example: left is not luckier than right.',
  ],
  [
    'You can practice choosing between the aliens now.',
    'You have 10 choices to try to figure out which alien has a good mine.',
  ],
  [
    'Remember, press \'1\' to choose the left alien, or press key \'0\' to',
    'choose the right alien.',
    'Click the red circle and then press the spacebar to continue.',
  ],
];

// Black background
instructions[9] = [
  [
    'You may have learned that this alien had treasure more often.',
    'Even if this alien had a better mine,',
    'you couldn\'t be sure if it had treasure all the time.',
  ],
  [
    'Each alien is like a game of chance, you can never be sure but',
    'you can guess.',
    'The treasure an alien can give will change during the game. ',
  ],
  [
    'An alien with a good mine may dig in a part of their mine that has ' +
        'little treasure. ',
    'Another alien with little treasure may find a lot of treasure.',
  ],
  [
    'Any changes in an alien\'s mine will happen slowly, ',
    'so try to focus on getting as much treasure as possible.',
  ],
  [
    'So an alien with a good treasure mine right now will',
    'continue to stay good for a while.',
    'To find the alien with the best mine at each point in time,',
    'you must concentrate.',
  ],
];

// Rockets
instructions[10] = [
  [
    'Now that you know have practiced choosing aliens, you can',
    'learn to play the entire game.',
    'In the game, you will travel from earth to one of two planets.',
  ],
];

// Green planet
instructions[11] = [
  ['This is the green planet.'],
];

// Yellow planet
instructions[12] = [
  ['This is the yellow planet.'],
];

// Rockets
instructions[13] = [
  [
    'First, you need to choose which spaceship to take.',
    'The spaceships can fly to either planet, but one will fly mostly',
    'to the green planet, and the other mostly to the yellow planet.',
  ],
  [
    'The planet a spaceship goes to most won\'t change during the game.',
    'Choose the spaceship that you think will take you to the alien',
    'with the best mine, but remember, sometimes you\'ll',
    'go to the other planet!',
  ],
];

// Rockets
instructions[14] = [
  [
    'Let\'s practice choosing spaceships before doing the full game.',
    'Remember, you still want to find as much space treasure as you can',
    'by asking an alien to share their treasure with you.',
  ],
  [
    'The aliens share somewhat randomly,',
    'but you can find the alien with the best mine at any point',
    'in the game by asking it to share!',
  ],
  [
    'How much bonus money you make is based on how much space treasure ' +
    'you find.',
    'This is just a practice round of 20 flights, you\'re not playing ' +
    'for money now.',
  ],
  [
    'You will have three seconds to make each choice. If you are too slow,',
    'you will see a large X appear on each rocket or alien and that ' +
    'choice will be over.',
  ],
  [
    'Don\'t feel rushed, but please try to make a choice every time.',
  ],
  [
    'Good luck! Remember that 1 selects left and 0 selects right.',
  ],
];

// Black background
instructions[15] = [
  [
    'That is the end of the practice games.',
    'Click the red button to continue.',
  ],
];

// Hints
instructions[16] = [
  [
    'Okay, that is nearly the end of the tutorial!',
    'In the real game, the planets, aliens, and spaceships will ' +
    'be new colors,',
    'but the rules will be the same.',
    'The game is hard, so you will need to concentrate,',
    'but don\'t be afraid to trust your instincts.',
    'Here are three hints on how to play the game.',
  ],
  [
    'Hint #1:',
    'Remember which aliens have treasure. How good a mine is changes slowly,',
    'so an alien that has a lot of treasure to share now,',
    'will probably be able to share a lot in the near future.',
  ],
  [
    'Hint #2:',
    'Remember, each alien has its own mine. Just because one ' +
    'alien has a bad ',
    'mine and can\'t share very often, does not mean another ' +
    'has a good mine.',
    'Also, there are no funny patterns in how an alien shares, ',
    'like every other time you ask, or depending on which spaceship ' +
    'you took.',
    'The aliens are not trying to trick you.',
  ],
  [
    'Hint #3:',
    'The spaceship you choose is important because often an alien ' +
    'on one planet ',
    'may be better than the ones on another planet.',
    'You can find more treasure by finding the spaceship',
    'that is most likely to take you to right planet.',
  ],
];

// Pre-attention-check
instructions[17] = [
  [
    'Now it\'s time to make sure you know how to play.',
    'Please respond TRUE or FALSE to the questions on the next few pages.',
  ],
];

// Pre-game
instructions[18] = [
  [
    'OK! Now you know how to play.',
    'In the real game we\'ll count how many pieces of space treasure',
    'you find and show you at the end.',
    'Ready?  Now its time to play the game! Good luck space traveler!',
  ],
];

export const firstBreak = [
  [
    'Great job so far! You have completed 1 out of 4 rounds.',
    'You may now take a break.',
    'Press the button when you are ready for the next round.',
  ],
];

export const secondBreak = [
  [
    'Awesome! You are halfway through the game.',
    'You may now take a break.',
    'Press the button when you are ready for the next round.',
  ],
];

export const thirdBreak = [
  [
    'Almost done! Just 1 more round to go.',
    'You may now take a break.',
    'Press the button when you are ready for the next round.',
  ],
];

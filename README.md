# Two-Step Task

A clean TypeScript implementation of the two-step behavioral task paradigm using the latest jsPsych framework.

## Overview

This is a simplified, maintainable implementation of a two-step decision-making task where participants make sequential choices that lead to probabilistic outcomes. The task involves:

1. **Stage 1**: Choosing between two rockets on Earth
2. **Stage 2**: Flying to a planet and choosing between two aliens
3. **Outcome**: Receiving or not receiving space resources based on alien choice

## Experiment Flow

### Timeline Structure
- **Instructions**: Welcome screen explaining the task
- **Training Phase 1**: 4 rocket selection trials (configurable)
- **Training Phase 2**: 4 alien selection trials (configurable)
- **Training Phase 3**: 4 complete mission trials (configurable)
- **Main Trials**: 4 complete missions with counter-balancing (configurable)

### Controls
- **F key**: Select left option
- **J key**: Select right option
- **Spacebar**: Continue through instructions

### Timing
- **Fixation**: 500ms cross display between trials
- **Choice**: 3000ms response window for decisions
- **Transition**: 90ms between rocket choice and planet display

## Data Collection

The experiment collects comprehensive data for each trial:

### Trial Information
- `trialNumber`: Sequential trial number
- `trialStage`: '1' (rocket choice), '2' (alien choice), or 'fixation'
- `isPractice`: Boolean indicating practice vs. main trial

### Stimuli
- `leftStimulus`: Path to left choice stimulus
- `rightStimulus`: Path to right choice stimulus
- `planetStimulus`: Background planet image
- `rewardStimulus`: Reward/no-reward indicator

### Participant Response
- `keyPress`: Key pressed ('f' or 'j')
- `choice`: Numeric choice (1 = left, 2 = right)
- `rt`: Reaction time in milliseconds

### Transition & Reward Data
- `transitionType`: Boolean (true = common, false = rare)
- `transition`: String ('common' or 'rare')
- `wasRewarded`: Boolean indicating if reward was received

### Timing
- `trialStartTime`: Timestamp when trial began
- `trialEndTime`: Timestamp when trial ended

### Counter-balancing Variables
- `rocketSides`: Random rocket position assignment
- `displayOrderRed/Purple/Green/Yellow`: Random alien order per planet
- `redPlanetFirstRocket`: Random rocket-to-planet mapping

## Technical Architecture

### Core Components
- **ExperimentLogic**: Handles transition calculations and counter-balancing
- **Custom Plugins**: Fixation, choice, and instructions plugins
- **Timeline**: Configurable trial sequence with training and main phases
- **Data Integration**: Probability data embedded in TypeScript

### Key Features
- **Responsive Design**: Adapts to different screen sizes
- **Hot Reload**: Development server with live updates
- **TypeScript**: Full type safety and modern development experience
- **Modular Structure**: Clean separation of concerns
- **Configurable**: Easy adjustment of trial counts and parameters
- **Neurocog Integration**: Proper stimuli loading and preloading via neurocog

## Configuration

Trial counts and parameters can be easily modified in `src/config.ts`:

```typescript
export const config: ExperimentConfig = {
  trainingTrials: {
    rocketToAlien: 4,    // Configurable
    alienToReward: 4,    // Configurable
    complete: 4,         // Configurable
  },
  mainTrials: 4,         // Configurable

  timing: {
    fixation: 500,
    choice: 3000,
    reward: 1000,
    transition: 90,
  },

  transitionProbability: 0.7,  // Common transition probability
};
```

## Development

### Setup
```bash
npm install
npm run dev
```

### Build
```bash
npm run build
```

### Available Scripts
- `npm run dev`: Start development server with hot reload
- `npm run build`: Build production bundle
- `npm run clean`: Clean build directory
- `npm run lint`: Run ESLint
- `npm run type-check`: TypeScript type checking

## Dependencies

- **jsPsych**: ^8.0.0 (Latest version)
- **neurocog**: ^0.3.8 (Gorilla platform integration)
- **TypeScript**: ^5.3.3
- **Webpack**: ^5.89.0 (Build system)

## File Structure

```
src/
├── config.ts          # Experiment configuration
├── types.ts           # TypeScript type definitions
├── stimuli.ts         # Stimuli mapping
├── data.ts            # Probability data (embedded from CSV)
├── experiment.ts      # Core experiment logic
├── timeline.ts        # Timeline implementation
├── plugins/           # Custom jsPsych plugins
│   ├── fixation.ts
│   ├── choice.ts
│   └── instructions.ts
├── images/            # Stimuli images
└── index.ts           # Main entry point
```

## Counter-balancing

The experiment implements sophisticated counter-balancing to ensure balanced conditions:

- **Rocket Positions**: Random assignment of rocket 1/2 to left/right
- **Alien Orders**: Random left/right order for each planet type
- **Rocket-Planet Mapping**: Random assignment of which rocket goes to which planet
- **Transition Probabilities**: 70% common, 30% rare transitions

## Integration

This implementation integrates with:
- **Gorilla Platform**: Via neurocog package
- **jsPsych**: Latest version with modern plugin architecture
- **Responsive Design**: Works across different screen sizes and devices

## License

CC-BY-4.0

## Contact

Henry Burgess <henry.burgess@wustl.edu>

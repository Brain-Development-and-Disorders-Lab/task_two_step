// Functions to test
import {
  getRocketStimuli,
  getAlienStimuli,
  getPlanetFromRocketChoice,
  getPlanetStimulus
} from '../src/';

// Custom types
import { PlanetType } from '../types';

describe('rocket stimuli, training trials', () => {
  test('training trials should return tutorial rockets', () => {
    // Validate the start of the file paths returned
    const responseDefault: { leftStimulus: string, rightStimulus: string } = getRocketStimuli(true, false);
    expect(responseDefault.leftStimulus.startsWith('tutorial')).toBeTruthy();
    expect(responseDefault.rightStimulus.startsWith('tutorial')).toBeTruthy();

    const responseSwapped: { leftStimulus: string, rightStimulus: string } = getRocketStimuli(true, true);
    expect(responseSwapped.leftStimulus.startsWith('tutorial')).toBeTruthy();
    expect(responseSwapped.rightStimulus.startsWith('tutorial')).toBeTruthy();
  });
  
  test('training trials without swapping should return correct tutorial rockets', () => {
    expect(getRocketStimuli(true, false)).toMatchObject<{ leftStimulus: string, rightStimulus: string }>({
      leftStimulus: 'tutorial_rocket_1.png',
      rightStimulus: 'tutorial_rocket_2.png',
    });
  });
  
  test('training trials with swapping should return correct tutorial rockets', () => {
    expect(getRocketStimuli(true, true)).toMatchObject<{ leftStimulus: string, rightStimulus: string }>({
      leftStimulus: 'tutorial_rocket_2.png',
      rightStimulus: 'tutorial_rocket_1.png',
    });
  });
});

describe('alien stimuli, all planets', () => {
  test('red planet should return normal aliens 1 and 2', () => {
    expect(getAlienStimuli(PlanetType.RED, false)).toMatchObject<{ leftStimulus: string, rightStimulus: string }>({
      leftStimulus: 'main_alien_1.png',
      rightStimulus: 'main_alien_2.png',
    });

    // Swap sides
    expect(getAlienStimuli(PlanetType.RED, true)).toMatchObject<{ leftStimulus: string, rightStimulus: string }>({
      leftStimulus: 'main_alien_2.png',
      rightStimulus: 'main_alien_1.png',
    });
  });
  
  test('purple planet should return normal aliens 3 and 4', () => {
    expect(getAlienStimuli(PlanetType.PURPLE, false)).toMatchObject<{ leftStimulus: string, rightStimulus: string }>({
      leftStimulus: 'main_alien_3.png',
      rightStimulus: 'main_alien_4.png',
    });

    // Swap sides
    expect(getAlienStimuli(PlanetType.PURPLE, true)).toMatchObject<{ leftStimulus: string, rightStimulus: string }>({
      leftStimulus: 'main_alien_4.png',
      rightStimulus: 'main_alien_3.png',
    });
  });
  
  test('green planet should return tutorial aliens 1 and 2', () => {
    expect(getAlienStimuli(PlanetType.GREEN, false)).toMatchObject<{ leftStimulus: string, rightStimulus: string }>({
      leftStimulus: 'tutorial_alien_1.png',
      rightStimulus: 'tutorial_alien_2.png',
    });

    // Swap sides
    expect(getAlienStimuli(PlanetType.GREEN, true)).toMatchObject<{ leftStimulus: string, rightStimulus: string }>({
      leftStimulus: 'tutorial_alien_2.png',
      rightStimulus: 'tutorial_alien_1.png',
    });
  });
  
  test('yellow planet should return tutorial aliens 3 and 4', () => {
    expect(getAlienStimuli(PlanetType.YELLOW, false)).toMatchObject<{ leftStimulus: string, rightStimulus: string }>({
      leftStimulus: 'tutorial_alien_3.png',
      rightStimulus: 'tutorial_alien_4.png',
    });

    // Swap sides
    expect(getAlienStimuli(PlanetType.YELLOW, true)).toMatchObject<{ leftStimulus: string, rightStimulus: string }>({
      leftStimulus: 'tutorial_alien_4.png',
      rightStimulus: 'tutorial_alien_3.png',
    });
  });
});

describe('planet stimuli, all planets', () => {
  test('red planet', () => {
    expect(getPlanetStimulus(PlanetType.RED)).toBe('main_planet_red.png');
  });
  
  test('purple planet', () => {
    expect(getPlanetStimulus(PlanetType.PURPLE)).toBe('main_planet_purple.png');
  });
  
  test('green planet', () => {
    expect(getPlanetStimulus(PlanetType.GREEN)).toBe('tutorial_planet_green.png');
  });
  
  test('yellow planet', () => {
    expect(getPlanetStimulus(PlanetType.YELLOW)).toBe('tutorial_planet_yellow.png');
  });
  
  test('invalid planet', () => {
    expect(() => getPlanetStimulus('invalid' as PlanetType)).toThrow('Unknown \'PlanetType\': invalid');
  });
});

describe('planet type, all choices', () => {
  test('default selection behavior', () => {
    expect(getPlanetFromRocketChoice(1, false)).toBe(PlanetType.RED);
    expect(getPlanetFromRocketChoice(2, false)).toBe(PlanetType.PURPLE);
  });
  
  test('default selection behavior, swapped', () => {
    expect(getPlanetFromRocketChoice(1, true)).toBe(PlanetType.PURPLE);
    expect(getPlanetFromRocketChoice(2, true)).toBe(PlanetType.RED);
  });
  
  test('training selection behavior', () => {
    expect(getPlanetFromRocketChoice(1, false, true)).toBe(PlanetType.GREEN);
    expect(getPlanetFromRocketChoice(2, false, true)).toBe(PlanetType.YELLOW);
  });
  
  test('training selection behavior, swapped', () => {
    // Counterbalancing does not take place in training, so behavior should be the same
    expect(getPlanetFromRocketChoice(1, true, true)).toBe(PlanetType.GREEN);
    expect(getPlanetFromRocketChoice(2, true, true)).toBe(PlanetType.YELLOW);
  });
});

// Functions to test
import {
  getRocketStimuli,
  getAlienStimuli,
  getPlanetFromRocketChoice,
  getPlanetStimulus
} from '../../src/counterbalancing';

// Custom types
import { PlanetType } from '../../types';

describe('rocket stimuli, training trials', () => {
  test('training trials should return tutorial rockets', () => {
    // Validate the start of the file paths returned
    const responseDefault: { leftStimulus: string, rightStimulus: string } = getRocketStimuli(true, false);
    expect(responseDefault.leftStimulus.startsWith('tut')).toBeTruthy();
    expect(responseDefault.rightStimulus.startsWith('tut')).toBeTruthy();

    const responseSwapped: { leftStimulus: string, rightStimulus: string } = getRocketStimuli(true, true);
    expect(responseSwapped.leftStimulus.startsWith('tut')).toBeTruthy();
    expect(responseSwapped.rightStimulus.startsWith('tut')).toBeTruthy();
  });
  
  test('training trials without swapping should return correct tutorial rockets', () => {
    expect(getRocketStimuli(true, false)).toMatchObject<{ leftStimulus: string, rightStimulus: string }>({
      leftStimulus: 'tutrocket1_norm.png',
      rightStimulus: 'tutrocket2_norm.png',
    });
  });
  
  test('training trials with swapping should return correct tutorial rockets', () => {
    expect(getRocketStimuli(true, true)).toMatchObject<{ leftStimulus: string, rightStimulus: string }>({
      leftStimulus: 'tutrocket2_norm.png',
      rightStimulus: 'tutrocket1_norm.png',
    });
  });
});

describe('alien stimuli, all planets', () => {
  test('red planet should return normal aliens 1 and 2', () => {
    expect(getAlienStimuli(PlanetType.RED, false)).toMatchObject<{ leftStimulus: string, rightStimulus: string }>({
      leftStimulus: 'alien1_norm.png',
      rightStimulus: 'alien2_norm.png',
    });

    // Swap sides
    expect(getAlienStimuli(PlanetType.RED, true)).toMatchObject<{ leftStimulus: string, rightStimulus: string }>({
      leftStimulus: 'alien2_norm.png',
      rightStimulus: 'alien1_norm.png',
    });
  });
  
  test('purple planet should return normal aliens 3 and 4', () => {
    expect(getAlienStimuli(PlanetType.PURPLE, false)).toMatchObject<{ leftStimulus: string, rightStimulus: string }>({
      leftStimulus: 'alien3_norm.png',
      rightStimulus: 'alien4_norm.png',
    });

    // Swap sides
    expect(getAlienStimuli(PlanetType.PURPLE, true)).toMatchObject<{ leftStimulus: string, rightStimulus: string }>({
      leftStimulus: 'alien4_norm.png',
      rightStimulus: 'alien3_norm.png',
    });
  });
  
  test('green planet should return tutorial aliens 1 and 2', () => {
    expect(getAlienStimuli(PlanetType.GREEN, false)).toMatchObject<{ leftStimulus: string, rightStimulus: string }>({
      leftStimulus: 'tutalien1_norm.png',
      rightStimulus: 'tutalien2_norm.png',
    });

    // Swap sides
    expect(getAlienStimuli(PlanetType.GREEN, true)).toMatchObject<{ leftStimulus: string, rightStimulus: string }>({
      leftStimulus: 'tutalien2_norm.png',
      rightStimulus: 'tutalien1_norm.png',
    });
  });
  
  test('yellow planet should return tutorial aliens 3 and 4', () => {
    expect(getAlienStimuli(PlanetType.YELLOW, false)).toMatchObject<{ leftStimulus: string, rightStimulus: string }>({
      leftStimulus: 'tutalien3_norm.png',
      rightStimulus: 'tutalien4_norm.png',
    });

    // Swap sides
    expect(getAlienStimuli(PlanetType.YELLOW, true)).toMatchObject<{ leftStimulus: string, rightStimulus: string }>({
      leftStimulus: 'tutalien4_norm.png',
      rightStimulus: 'tutalien3_norm.png',
    });
  });
});

describe('planet stimuli, all planets', () => {
  test('red planet', () => {
    expect(getPlanetStimulus(PlanetType.RED)).toBe('redplanet1.png');
  });
  
  test('purple planet', () => {
    expect(getPlanetStimulus(PlanetType.PURPLE)).toBe('purpleplanet.png');
  });
  
  test('green planet', () => {
    expect(getPlanetStimulus(PlanetType.GREEN)).toBe('tutgreenplanet.png');
  });
  
  test('yellow planet', () => {
    expect(getPlanetStimulus(PlanetType.YELLOW)).toBe('tutyellowplanet.png');
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

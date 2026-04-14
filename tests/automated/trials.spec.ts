/**
 * @fileoverview Automated tests for main trial behavior
 *
 * Five test scenarios that exercise the ChoicePlugin with controlled
 * transition probabilities and reward likelihoods
 * 
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

import { test, expect } from '@playwright/test';
import {
  setupTestPage,
  waitForRocketStage,
  waitForAlienStage,
  pressLeftKey,
  advancePageTimer,
  waitForTrialCount,
  getLastTrialData,
  getAllTrialData,
  getTrialConfiguration,
} from './helpers/interactions';
import { TestConfig } from '.';
import { fullTrialProbabilities } from '../../src/data';

// Setup variables
const UNIFORM_REWARDS: TestConfig['rewardLikelihoods'] = [0.5, 0.5, 0.5, 0.5];
const ACTUAL_REWARDS: TestConfig['rewardLikelihoods'] = [
  fullTrialProbabilities[0]!.alien1,
  fullTrialProbabilities[0]!.alien2,
  fullTrialProbabilities[0]!.alien3,
  fullTrialProbabilities[0]!.alien4,
];

async function runSingleTrial(page: import('@playwright/test').Page, completedBefore: number): Promise<void> {
  // Note: jsPsych uses setTimeout(0) between trials to advance to the next trial, a small fastForward
  // lets jsPsych initialise the DOM for the current trial before interacting
  await page.clock.fastForward(100);
  await waitForRocketStage(page);
  await pressLeftKey(page);
  await advancePageTimer(page);
  await waitForAlienStage(page, completedBefore);
  await pressLeftKey(page);
  await advancePageTimer(page);
  await waitForTrialCount(page, completedBefore + 1);
}

// Test 1: Default main trial, common transitions, 0.5 reward probabilities
test('default main trial: common transition, uniform 0.5 reward probabilities', async ({ page }) => {
  await page.clock.install({ time: 0 });
  await setupTestPage(page, getTrialConfiguration(1.0, UNIFORM_REWARDS));

  await runSingleTrial(page, 0);

  const data = await getLastTrialData(page);

  expect(data.trialLayout).toBe('full');
  expect(data.transitionType).toBe('common');
  expect(data.timeout).toBe(false);
  expect(data.levelOneChoice).toBe(1); // left rocket ('f')
  expect(data.levelTwoChoice).toBe(1); // left alien ('f')
  expect(typeof data.wasRewarded).toBe('boolean');
  expect(data.rewardLikelihoods).toEqual([0.5, 0.5, 0.5, 0.5]);
  expect(data.transitionLikelihood).toBe(1.0);
});

// Test 2: Default main trial, common transitions, actual reward probabilities
test('default main trial: common transition, actual reward probabilities', async ({ page }) => {
  await page.clock.install({ time: 0 });
  await setupTestPage(page, getTrialConfiguration(1.0, ACTUAL_REWARDS));

  await runSingleTrial(page, 0);

  const data = await getLastTrialData(page);
  const expected = fullTrialProbabilities[0]!;

  expect(data.transitionType).toBe('common');
  expect(data.timeout).toBe(false);
  // Verify reward likelihoods were passed through correctly
  expect(data.rewardLikelihoods[0]).toBeCloseTo(expected.alien1, 5);
  expect(data.rewardLikelihoods[1]).toBeCloseTo(expected.alien2, 5);
  expect(data.rewardLikelihoods[2]).toBeCloseTo(expected.alien3, 5);
  expect(data.rewardLikelihoods[3]).toBeCloseTo(expected.alien4, 5);
  expect(typeof data.wasRewarded).toBe('boolean');
});

// Test 3: Rare main trial, rare transitions, 0.5 reward probabilities
test('rare main trial: rare transition, uniform 0.5 reward probabilities', async ({ page }) => {
  await page.clock.install({ time: 0 });
  await setupTestPage(page, getTrialConfiguration(0.0, UNIFORM_REWARDS));

  await runSingleTrial(page, 0);

  const data = await getLastTrialData(page);

  expect(data.trialLayout).toBe('full');
  expect(data.transitionType).toBe('rare');
  expect(data.timeout).toBe(false);
  expect(data.levelOneChoice).toBe(1);
  expect(data.levelTwoChoice).toBe(1);
  expect(typeof data.wasRewarded).toBe('boolean');
  expect(data.rewardLikelihoods).toEqual([0.5, 0.5, 0.5, 0.5]);
  expect(data.transitionLikelihood).toBe(0.0);
});

// Test 4: Rare main trial, rare transitions, actual reward probabilities
test('rare main trial: rare transition, actual reward probabilities', async ({ page }) => {
  await page.clock.install({ time: 0 });
  await setupTestPage(page, getTrialConfiguration(0.0, ACTUAL_REWARDS));

  await runSingleTrial(page, 0);

  const data = await getLastTrialData(page);
  const expected = fullTrialProbabilities[0]!;

  expect(data.transitionType).toBe('rare');
  expect(data.timeout).toBe(false);
  // Actual probabilities are passed through accurately to the trial data
  expect(data.rewardLikelihoods[0]).toBeCloseTo(expected.alien1, 5);
  expect(data.rewardLikelihoods[1]).toBeCloseTo(expected.alien2, 5);
  expect(data.rewardLikelihoods[2]).toBeCloseTo(expected.alien3, 5);
  expect(data.rewardLikelihoods[3]).toBeCloseTo(expected.alien4, 5);
  expect(typeof data.wasRewarded).toBe('boolean');
});

// Test 5: Extended trial block, real-world behavior, probability verification
test('extended block: observed common/rare transition counts match expected probability', async ({ page }) => {
  // Note: 50 trials with 200ms Playwright overhead = 10s, allow generous margin
  test.setTimeout(120000);

  const NUM_TRIALS = 50;
  const EXPECTED_COMMON_RATE = 0.7;
  const MIN_COMMON = 22;
  const MAX_COMMON = 48;

  await page.clock.install({ time: 0 });
  await setupTestPage(page, getTrialConfiguration(0.7, UNIFORM_REWARDS, NUM_TRIALS));

  for (let i = 0; i < NUM_TRIALS; i++) {
    await runSingleTrial(page, i);
  }

  const allData = await getAllTrialData(page);
  expect(allData).toHaveLength(NUM_TRIALS);

  // Every trial must be a complete full trial (no timeouts)
  for (const data of allData) {
    expect(data.trialLayout).toBe('full');
    expect(data.timeout).toBe(false);
    expect(data.transitionType).toMatch(/^(common|rare)$/);
  }

  // Count common transitions and verify they are within the expected range
  const commonCount = allData.filter((d) => d.transitionType === 'common').length;
  const observedRate = commonCount / NUM_TRIALS;

  expect(commonCount).toBeGreaterThanOrEqual(MIN_COMMON);
  expect(commonCount).toBeLessThanOrEqual(MAX_COMMON);

  // Log for visibility in test output
  console.log(
    `Transition counts over ${NUM_TRIALS} trials: ` +
    `${commonCount} common (${(observedRate * 100).toFixed(1)}%), ` +
    `${NUM_TRIALS - commonCount} rare — expected ~${EXPECTED_COMMON_RATE * 100}%`
  );
});

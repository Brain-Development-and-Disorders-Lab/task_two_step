/**
 * @fileoverview Trial interaction abstractions for automated testing
 * 
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

import { Page } from '@playwright/test';
import { TestConfig } from '..';
import { ChoiceTrialData } from '../../../types';

/**
 * Inject `window.__TEST_CONFIG__` and navigate to the test app.
 * Must be called before `page.goto()` so the init script fires first.
 * @param {Page} page Playwright Page instance
 * @param {TestConfig} config Test configuration
 */
export const setupTestPage = async (page: Page, config: TestConfig): Promise<void> => {
  await page.addInitScript((cfg) => { window.__TEST_CONFIG__ = cfg; }, config);
  await page.goto('/');
};

/**
 * Wait until a fixation trial is visible (the '+' cross is rendered).
 * @param {Page} page Playwright Page instance
 */
export const waitForFixation = async (page: Page): Promise<void> => {
  await page.waitForSelector('div:has-text("+")', { timeout: 5000 });
};

/**
 * Wait until the rocket-selection stage is ready, jsPsych renders
 * `#left-stimulus` and `#right-stimulus` synchronously when
 * the trial begins, so this resolves almost immediately
 * @param {Page} page Playwright Page instance
 */
export const waitForRocketStage = async (page: Page): Promise<void> => {
  await page.waitForSelector('#left-stimulus', { timeout: 5000 });
};

/**
 * Wait until the alien-selection stage is ready
 * @param {Page} page Playwright Page instance
 * @param {number} completedTrials Number of completed trials
 */
export const waitForAlienStage = async (page: Page, completedTrials: number): Promise<void> => {
  // Verify the stage by checking the trial count has not advanced yet
  await page.waitForFunction(
    (count) => (window.__ALL_TRIAL_DATA__?.length ?? 0) === count,
    completedTrials,
    { timeout: 5000 }
  );
  await page.waitForSelector('#left-stimulus', { timeout: 5000 });
};

/**
 * Press the left input key 'f'
 * @param {Page} page Playwright Page instance
 */
export const pressLeftKey = async (page: Page): Promise<void> => {
  await page.keyboard.press('f');
};

/**
 * Press the right input key 'j'
 * @param {Page} page Playwright Page instance
 */
export const pressRightKey = async (page: Page): Promise<void> => {
  await page.keyboard.press('j');
};

/**
 * Advance the fake clock far enough to complete the rocket-to-alien
 * transition animation (config.timing.transition = 1500ms)
 * @param {Page} page Playwright Page instance
 */
export const advancePageTimer = async (page: Page, duration = 2000): Promise<void> => {
  await page.clock.fastForward(duration);
};

/**
 * Wait until a given number of trials have been completed
 * @param {Page} page Playwright Page instance
 * @param {number} count Specific trial count to wait for
 */
export const waitForTrialCount = async (page: Page, count: number): Promise<void> => {
  await page.waitForFunction(
    (n) => (window.__ALL_TRIAL_DATA__?.length ?? 0) >= n,
    count,
    { timeout: 10000 }
  );
}

/**
 * Retrieve the data written by the most recently completed trial
 * @param {Page} page Playwright Page instance
 * @return {ChoiceTrialData}
 */
export const getLastTrialData = async (page: Page): Promise<ChoiceTrialData> => {
  return page.evaluate(() => window.__LAST_TRIAL_DATA__ as ChoiceTrialData);
};

/**
 * Retrieve all accumulated trial data
 * @param {Page} page Playwright Page instance
 * @return {ChoiceTrialData[]}
 */
export const getAllTrialData = async (page: Page): Promise<ChoiceTrialData[]> => {
  return page.evaluate(() => window.__ALL_TRIAL_DATA__);
};

/**
 * Wait until a comprehension question is displayed
 * @param {Page} page Playwright Page instance
 */
export const waitForComprehensionQuestion = async (page: Page): Promise<void> => {
  await page.waitForSelector('.option-button', { timeout: 5000 });
};

/**
 * Click the "True" answer button
 * @param {Page} page Playwright Page instance
 */
export const answerTrue = async (page: Page): Promise<void> => {
  await page.click('[data-answer="true"]');
};

/**
 * Click the "False" answer button
 * @param {Page} page Playwright Page instance
 */
export const answerFalse = async (page: Page): Promise<void> => {
  await page.click('[data-answer="false"]');
};

/**
 * Click the continue button that appears after answering
 * @param {Page} page Playwright Page instance
 */
export const clickContinue = async (page: Page): Promise<void> => {
  await page.click('#continue-btn');
};

/**
 * Generate a trial configuration containing required likelihoods
 * @param {number} transitionLikelihood Likelihood of rare transition
 * @param {[number, number, number, number]} rewardLikelihoods Breakdown of specific likelihoods of reward
 * @param {number} numTrials Number of trials
 * @return {TestConfig}
 */
export const getTrialConfiguration = (
  transitionLikelihood: number,
  rewardLikelihoods: TestConfig['rewardLikelihoods'],
  numTrials = 1
): TestConfig => {
  return { trialLayout: 'full', transitionLikelihood, rewardLikelihoods, numTrials };
};

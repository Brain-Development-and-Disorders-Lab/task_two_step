/**
 * @fileoverview Mock the Neurocog extension for automated testing
 *
 * Provides a minimal replacement for the Neurocog extension, allows tests to control
 * the random number generator and returns stimulus filenames as-is
 */

export default class Neurocog {
  static info = {
    name: 'Neurocog',
    version: '0.0.1',
    data: {},
  };

  private _randomFn: () => number = Math.random;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  initialize(params: Record<string, unknown>): void {}
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  on_start(params: Record<string, unknown>): void {}
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  on_load(params: Record<string, unknown>): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  on_finish(params: Record<string, unknown>): Record<string, unknown> {
    return {};
  }

  /**
   * Returns a value in [0, 1)
   * @return {number}
   */
  random(): number {
    return this._randomFn();
  }

  /**
   * Override the random function
   * @param {{(): number}} fn Updated random function
   */
  setRandom(fn: () => number): void {
    this._randomFn = fn;
  }

  /**
   * Returns the filename unchanged
   * @param {string} filename Stimulus filename
   * @return {string}
   */
  getStimulus(filename: string): string {
    return filename;
  }
}

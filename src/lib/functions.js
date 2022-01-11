/**
 * Get time as a formatted string, taken from this answer:
 * https://stackoverflow.com/questions/44484882/download-with-current-user-time-as-filename
 * @return {string}
 */
export function getFormattedTime() {
  'use strict';
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth() + 1; // JavaScript months are 0-based.
  const d = today.getDate();
  const h = today.getHours();
  const mi = today.getMinutes();
  const s = today.getSeconds();
  return y + '-' + m + '-' + d + '-' + h + '-' + mi + '-' + s;
}

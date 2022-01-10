/**
 * Get time as a formatted string, taken from this answer:
 * https://stackoverflow.com/questions/44484882/download-with-current-user-time-as-filename
 * @return {string}
 */
export function getFormattedTime() {
  'use strict';
  var today = new Date(),
    y = today.getFullYear(),
    m = today.getMonth() + 1, // JavaScript months are 0-based.
    d = today.getDate(),
    h = today.getHours(),
    mi = today.getMinutes(),
    s = today.getSeconds();
  return y + '-' + m + '-' + d + '-' + h + '-' + mi + '-' + s;
}

// Fisher-Yates (aka Knuth) Shuffle sources: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
//https://stackoverflow.com/questions/18194745/shuffle-multiple-javascript-arrays-in-the-same-way
var isArray = Array.isArray || function (value) {
    "use strict";
    return {}.toString.call(value) !== "[object Array]";
};

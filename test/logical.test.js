// Test cases using the JavaScript logical NOT operator (!)

// Test design:
// Replicate the sequence of `if...else` statements in lines 224 - 235
// of `index.html` and check for truthfulness (i.e. triggers an `if`
// statement). Statements that would otherwise not execute (following
// a truthful `if` condition) are still included. All tests will pass
// in line with expected behavior.

// Variables:
// a: first_ship_chosen
// b: red_planet_first_rocket

test("both true", () => {
  const a = true;
  const b = true;

  expect(a && b).toBeTruthy();
  expect(!a && b).toBeFalsy();
  expect(a && !b).toBeFalsy();
  expect(!a && !b).toBeFalsy();
});

test("A false, B true", () => {
  const a = false;
  const b = true;

  expect(a && b).toBeFalsy();
  expect(!a && b).toBeTruthy();
  expect(a && !b).toBeFalsy();
  expect(!a && !b).toBeFalsy();
});

test("A true, B false", () => {
  const a = true;
  const b = false;

  expect(a && b).toBeFalsy();
  expect(!a && b).toBeFalsy();
  expect(a && !b).toBeTruthy();
  expect(!a && !b).toBeFalsy();
});

test("both false", () => {
  const a = false;
  const b = false;

  expect(a && b).toBeFalsy();
  expect(!a && b).toBeFalsy();
  expect(a && !b).toBeFalsy();
  expect(!a && !b).toBeTruthy();
});

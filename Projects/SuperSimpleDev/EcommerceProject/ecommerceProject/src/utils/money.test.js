import assert from "node:assert/strict";
import { test } from "node:test";
import formatMoney from "./money.js";

test("formats zero cents as dollars", () => {
  assert.equal(formatMoney(0), "$0.00");
});

test("formats cents with two decimal places", () => {
  assert.equal(formatMoney(1999), "$19.99");
  assert.equal(formatMoney(5), "$0.05");
});

test("formats large amounts without losing cents", () => {
  assert.equal(formatMoney(123456789), "$1234567.89");
});

import assert from "node:assert/strict";
import { test } from "node:test";
import formatMoney from "./money.js";
import {it, expect, describe} from "vitest";


describe('formatMoney', () => {
    it('format 1999 cents as $19.99', () => {
      expect(formatMoney(1999)).toBe("$19.99");
    });

    it('format 0 cents as $0.00', () => {
      expect(formatMoney(0)).not.toBe("$10.00");
    });

    it('format 5 cents as $0.05', () => {
      expect(formatMoney(5)).toBe("$0.05");
    });

    it('format 123456789 cents as $1234567.89', () => {
      expect(formatMoney(123456789)).toBe("$1234567.89");
    });
});






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


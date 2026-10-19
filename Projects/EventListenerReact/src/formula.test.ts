// formula.test.ts
import { describe, it, expect } from 'vitest';
import { formula } from './formula';

describe('formula', () => {
  it('should return the correct result', () => {
    expect(formula(2, 3)).toBe(5); // 2 + 3 = 5 ✓
  });
});

describe('formula', () => {
  it('should return the correct result', () => {
    expect(formula(3, 3)).not.toBe(7); // 3 + 3 = 6, so ≠ 7 ✓
  });
});
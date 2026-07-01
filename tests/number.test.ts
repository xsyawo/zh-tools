import { describe, it, expect } from 'vitest'
import { add, sub, mul, div, round, clamp, random, inRange } from '../src/number'

describe('precise arithmetic', () => {
  describe('add', () => {
    it('should add precisely', () => {
      expect(add(0.1, 0.2)).toBe(0.3)
    })

    it('should handle integers', () => {
      expect(add(1, 2)).toBe(3)
    })
  })

  describe('sub', () => {
    it('should subtract precisely', () => {
      expect(sub(1, 0.9)).toBe(0.1)
    })

    it('should handle integers', () => {
      expect(sub(5, 3)).toBe(2)
    })
  })

  describe('mul', () => {
    it('should multiply precisely', () => {
      expect(mul(0.1, 0.2)).toBe(0.02)
    })

    it('should handle integers', () => {
      expect(mul(3, 4)).toBe(12)
    })
  })

  describe('div', () => {
    it('should divide precisely', () => {
      expect(div(0.3, 0.1)).toBe(3)
    })

    it('should handle integers', () => {
      expect(div(10, 2)).toBe(5)
    })
  })
})

describe('round', () => {
  it('should round to specified decimals', () => {
    expect(round(1.005, 2)).toBe(1.01)
  })

  it('should round to integer by default', () => {
    expect(round(3.6)).toBe(4)
    expect(round(3.4)).toBe(3)
  })

  it('should handle negative numbers', () => {
    expect(round(-1.005, 2)).toBe(-1.01)
  })
})

describe('clamp', () => {
  it('should clamp value within range', () => {
    expect(clamp(120, 0, 100)).toBe(100)
    expect(clamp(-5, 0, 100)).toBe(0)
    expect(clamp(50, 0, 100)).toBe(50)
  })
})

describe('random', () => {
  it('should generate number within range', () => {
    for (let i = 0; i < 50; i++) {
      const n = random(1, 10)
      expect(n).toBeGreaterThanOrEqual(1)
      expect(n).toBeLessThanOrEqual(10)
    }
  })

  it('should generate integer', () => {
    const n = random(1, 10)
    expect(Number.isInteger(n)).toBe(true)
  })

  it('should handle min === max', () => {
    expect(random(5, 5)).toBe(5)
  })
})

describe('inRange', () => {
  it('should return true when in range', () => {
    expect(inRange(5, 1, 10)).toBe(true)
  })

  it('should return true at boundaries', () => {
    expect(inRange(1, 1, 10)).toBe(true)
    expect(inRange(10, 1, 10)).toBe(true)
  })

  it('should return false when out of range', () => {
    expect(inRange(0, 1, 10)).toBe(false)
    expect(inRange(11, 1, 10)).toBe(false)
  })
})

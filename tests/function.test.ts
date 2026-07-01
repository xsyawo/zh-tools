import { describe, it, expect } from 'vitest'
import { sleep, once, retry } from '../src/function'

describe('sleep', () => {
  it('should resolve after the specified delay', async () => {
    const start = Date.now()
    await sleep(50)
    const elapsed = Date.now() - start
    expect(elapsed).toBeGreaterThanOrEqual(40) // allow small timer inaccuracy
  })
})

describe('once', () => {
  it('should only execute the function once', () => {
    let count = 0
    const fn = once(() => ++count)
    expect(fn()).toBe(1)
    expect(fn()).toBe(1)
    expect(fn()).toBe(1)
    expect(count).toBe(1)
  })

  it('should preserve this context', () => {
    const obj = {
      value: 42,
      getValue: once(function (this: any) {
        return this.value
      }),
    }
    expect(obj.getValue()).toBe(42)
  })
})

describe('retry', () => {
  it('should succeed on first try if no failure', async () => {
    const fn = () => Promise.resolve('ok')
    const result = await retry(fn, 3)
    expect(result).toBe('ok')
  })

  it('should retry on failure and eventually succeed', async () => {
    let attempts = 0
    const fn = () => {
      attempts++
      if (attempts < 3) return Promise.reject(new Error('fail'))
      return Promise.resolve('ok')
    }
    const result = await retry(fn, 5)
    expect(result).toBe('ok')
  })

  it('should throw after exhausting retries', async () => {
    const fn = () => Promise.reject(new Error('always fail'))
    await expect(retry(fn, 2)).rejects.toThrow('always fail')
  })
})

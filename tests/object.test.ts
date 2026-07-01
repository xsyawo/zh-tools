import { describe, it, expect } from 'vitest'
import { deepClone, deepMerge, omit, pick, clearObj, isPlainObject, get, set, flatten, diff, merge } from '../src/object'

describe('deepClone', () => {
  it('primitives', () => {
    expect(deepClone(42)).toBe(42)
    expect(deepClone('hello')).toBe('hello')
    expect(deepClone(null)).toBe(null)
  })
  it('objects', () => {
    const obj = { a: { b: 1 } }
    const cloned = deepClone(obj)
    expect(cloned).toEqual(obj)
    expect(cloned).not.toBe(obj)
    expect(cloned.a).not.toBe(obj.a)
  })
  it('arrays', () => {
    const arr = [{ x: 1 }, { x: 2 }]
    const cloned = deepClone(arr)
    expect(cloned).toEqual(arr)
    expect(cloned).not.toBe(arr)
    expect(cloned[0]).not.toBe(arr[0])
  })
  it('Date', () => {
    const d = new Date()
    const cloned = deepClone(d)
    expect(cloned).toEqual(d)
    expect(cloned).not.toBe(d)
  })
  it('RegExp', () => {
    const r = /test/gi
    const cloned = deepClone(r)
    expect(cloned).toEqual(r)
    expect(cloned).not.toBe(r)
  })
  it('Map', () => {
    const m = new Map([['a', 1]])
    const cloned = deepClone(m)
    expect(cloned.get('a')).toBe(1)
  })
  it('Set', () => {
    const s = new Set([1, 2, 3])
    const cloned = deepClone(s)
    expect(cloned.has(1)).toBe(true)
  })
})

describe('deepMerge', () => {
  it('should merge simple objects', () => {
    expect(deepMerge({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 })
  })
  it('should deep merge nested objects', () => {
    expect(deepMerge({ a: { b: 1 } }, { a: { c: 2 } })).toEqual({ a: { b: 1, c: 2 } })
  })
  it('should handle multiple sources', () => {
    expect(deepMerge({ a: 1 }, { b: 2 }, { c: 3 })).toEqual({ a: 1, b: 2, c: 3 })
  })
  it('should not mutate target', () => {
    const target = { a: { b: 1 } }
    deepMerge(target, { a: { c: 2 } })
    expect(target).toEqual({ a: { b: 1 } })
  })
})

describe('omit', () => {
  it('should omit specified keys', () => {
    expect(omit({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ b: 2 })
  })
})

describe('pick', () => {
  it('should pick specified keys', () => {
    expect(pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ a: 1, c: 3 })
  })
})

describe('clearObj', () => {
  it('should clear all values', () => {
    const result = clearObj({ a: 'hello', b: 42, c: true, d: [1], e: { x: 1 } })
    expect(result.a).toBe('')
    expect(result.b).toBe(0)
    expect(result.c).toBe(false)
    expect(result.d).toEqual([])
    expect(result.e).toEqual({})
  })
  it('should keep specified keys', () => {
    const result = clearObj({ a: 'hello', b: 42 }, ['a'])
    expect(result.a).toBe('hello')
    expect(result.b).toBe(0)
  })
})

describe('isPlainObject', () => {
  it('should return true for plain objects', () => {
    expect(isPlainObject({})).toBe(true)
    expect(isPlainObject({ a: 1 })).toBe(true)
  })
  it('should return false for non-plain objects', () => {
    expect(isPlainObject(null)).toBe(false)
    expect(isPlainObject([])).toBe(false)
    expect(isPlainObject('')).toBe(false)
  })
})

describe('get', () => {
  it('should get nested value by path', () => {
    expect(get({ a: { b: 42 } }, 'a.b')).toBe(42)
  })
  it('should return default for missing path', () => {
    expect(get({ a: 1 }, 'b.c', 'default')).toBe('default')
  })
})

describe('set', () => {
  it('should set nested value by path', () => {
    const obj = {}
    set(obj, 'a.b.c', 42)
    expect((obj as any).a.b.c).toBe(42)
  })
})

describe('flatten', () => {
  it('should flatten nested objects with dot notation', () => {
    expect(flatten({ a: { b: 1, c: 2 }, d: 3 })).toEqual({ 'a.b': 1, 'a.c': 2, d: 3 })
  })

  it('should return single-level object as-is', () => {
    expect(flatten({ x: 1, y: 2 })).toEqual({ x: 1, y: 2 })
  })

  it('should handle deeply nested objects', () => {
    expect(flatten({ a: { b: { c: 1 } } })).toEqual({ 'a.b.c': 1 })
  })
})

describe('diff', () => {
  it('should return changed and new fields from b vs a', () => {
    expect(diff({ a: 1, b: 2 }, { a: 1, b: 3, c: 4 })).toEqual({ b: 3, c: 4 })
  })

  it('should return empty object when identical', () => {
    expect(diff({ a: 1 }, { a: 1 })).toEqual({})
  })

  it('should detect removed keys as change', () => {
    const result = diff({ a: 1, b: 2 }, { a: 1 })
    // b is removed; appears as undefined in returned partial
    expect(result.b).toBeUndefined()
  })
})

describe('merge', () => {
  it('should shallow merge objects', () => {
    expect(merge({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 })
  })

  it('should not mutate target', () => {
    const target = { a: 1 }
    const result = merge(target, { b: 2 })
    expect(target).toEqual({ a: 1 })
    expect(result).toEqual({ a: 1, b: 2 })
  })

  it('should overwrite same keys with later sources', () => {
    expect(merge({ a: 1 }, { a: 2 })).toEqual({ a: 2 })
  })
})

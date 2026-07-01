import { describe, it, expect } from 'vitest'
import { groupBy, unique, uniqueBy, chunk, range, sortBy, sumBy, move } from '../src/array'

describe('groupBy', () => {
  const data = [
    { type: 'A', val: 1 },
    { type: 'B', val: 2 },
    { type: 'A', val: 3 },
  ]

  it('should group by field name', () => {
    const result = groupBy(data, 'type')
    expect(result.A).toHaveLength(2)
    expect(result.B).toHaveLength(1)
    expect(result.A[0].val).toBe(1)
    expect(result.A[1].val).toBe(3)
  })

  it('should group by function', () => {
    const result = groupBy(data, item => item.type)
    expect(result.A).toHaveLength(2)
  })

  it('should return empty object for empty array', () => {
    expect(groupBy([], 'type')).toEqual({})
  })
})

describe('unique', () => {
  it('should remove duplicate primitives', () => {
    expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3])
  })

  it('should handle empty array', () => {
    expect(unique([])).toEqual([])
  })
})

describe('uniqueBy', () => {
  it('should deduplicate by field name', () => {
    const data = [{ id: 1 }, { id: 2 }, { id: 1 }]
    expect(uniqueBy(data, 'id')).toEqual([{ id: 1 }, { id: 2 }])
  })

  it('should deduplicate by function', () => {
    const data = [{ a: 1 }, { a: 2 }, { a: 1 }]
    expect(uniqueBy(data, item => item.a)).toEqual([{ a: 1 }, { a: 2 }])
  })
})

describe('chunk', () => {
  it('should split array into chunks', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
  })

  it('should return single chunk if size >= length', () => {
    expect(chunk([1, 2], 5)).toEqual([[1, 2]])
  })

  it('should return empty array for empty input', () => {
    expect(chunk([], 2)).toEqual([])
  })
})

describe('range', () => {
  it('should generate ascending range', () => {
    expect(range(1, 5)).toEqual([1, 2, 3, 4, 5])
  })

  it('should generate descending range', () => {
    expect(range(5, 1, -1)).toEqual([5, 4, 3, 2, 1])
  })

  it('should handle step', () => {
    expect(range(0, 10, 2)).toEqual([0, 2, 4, 6, 8, 10])
  })

  it('should handle start === end', () => {
    expect(range(3, 3)).toEqual([3])
  })
})

describe('sortBy', () => {
  const data = [{ a: 3 }, { a: 1 }, { a: 2 }]

  it('should sort ascending by field', () => {
    const result = sortBy(data, 'a')
    expect(result.map(d => d.a)).toEqual([1, 2, 3])
  })

  it('should sort descending', () => {
    const result = sortBy(data, 'a', 'desc')
    expect(result.map(d => d.a)).toEqual([3, 2, 1])
  })

  it('should not mutate original array', () => {
    const copy = [...data]
    sortBy(data, 'a')
    expect(data).toEqual(copy)
  })

  it('should sort by function', () => {
    const result = sortBy(data, item => item.a, 'asc')
    expect(result.map(d => d.a)).toEqual([1, 2, 3])
  })
})

describe('sumBy', () => {
  it('should sum by field name', () => {
    expect(sumBy([{ price: 10 }, { price: 20 }, { price: 30 }], 'price')).toBe(60)
  })

  it('should sum by function', () => {
    expect(sumBy([{ a: 1 }, { a: 2 }], item => item.a)).toBe(3)
  })

  it('should return 0 for empty array', () => {
    expect(sumBy([], 'a' as any)).toBe(0)
  })
})

describe('move', () => {
  it('should move element from one position to another', () => {
    const arr = [1, 2, 3, 4]
    move(arr, 0, 2)
    expect(arr).toEqual([2, 3, 1, 4])
  })

  it('should handle invalid index gracefully', () => {
    const arr = [1, 2, 3]
    move(arr, -1, 0)
    expect(arr).toEqual([1, 2, 3])
  })
})

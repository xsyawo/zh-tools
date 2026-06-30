import { describe, it, expect } from 'vitest'
import { formatDate, formatDateTime, formatRelative, getStartOfDay, getEndOfDay, getDateRange, diffDays } from '../src/date'

describe('formatDate', () => {
  it('should format with YYYY-MM-DD', () => {
    const d = new Date(2026, 4, 31, 14, 30, 0) // May 31, 2026
    expect(formatDate(d, 'YYYY-MM-DD')).toBe('2026-05-31')
  })
  it('should format with time', () => {
    const d = new Date(2026, 4, 31, 8, 5, 3)
    expect(formatDate(d, 'YYYY-MM-DD HH:mm:ss')).toBe('2026-05-31 08:05:03')
  })
  it('should accept string input', () => {
    expect(formatDate('2026-05-31', 'YYYY-MM-DD')).toBe('2026-05-31')
  })
})

describe('formatDateTime', () => {
  it('should format as YYYY-MM-DD HH:mm:ss', () => {
    const d = new Date(2026, 4, 31, 14, 30, 0)
    expect(formatDateTime(d)).toBe('2026-05-31 14:30:00')
  })
})

describe('formatRelative', () => {
  it('should return 刚刚 for recent time', () => {
    expect(formatRelative(new Date())).toBe('刚刚')
  })
  it('should return X分钟前', () => {
    const d = new Date(Date.now() - 5 * 60000)
    expect(formatRelative(d)).toBe('5分钟前')
  })
  it('should return X小时前', () => {
    const d = new Date(Date.now() - 3 * 3600000)
    expect(formatRelative(d)).toBe('3小时前')
  })
  it('should return 昨天', () => {
    const d = new Date(Date.now() - 86400000)
    expect(formatRelative(d)).toBe('昨天')
  })
  it('should return X天前', () => {
    const d = new Date(Date.now() - 5 * 86400000)
    expect(formatRelative(d)).toBe('5天前')
  })
})

describe('getStartOfDay', () => {
  it('should return 00:00:00.000', () => {
    const d = getStartOfDay(new Date(2026, 4, 31, 14, 30, 0))
    expect(d.getHours()).toBe(0)
    expect(d.getMinutes()).toBe(0)
    expect(d.getSeconds()).toBe(0)
  })
})

describe('getEndOfDay', () => {
  it('should return 23:59:59.999', () => {
    const d = getEndOfDay(new Date(2026, 4, 31, 14, 30, 0))
    expect(d.getHours()).toBe(23)
    expect(d.getMinutes()).toBe(59)
    expect(d.getSeconds()).toBe(59)
  })
})

describe('getDateRange', () => {
  it('today should return same day start to end', () => {
    const [start, end] = getDateRange('today')
    expect(start.getTime()).toBeLessThanOrEqual(end.getTime())
  })
  it('week should return Monday to Sunday', () => {
    const [start, end] = getDateRange('week')
    expect(start.getDay()).toBe(1) // Monday
    expect(end.getDay()).toBe(0)   // Sunday
  })
})

describe('diffDays', () => {
  it('should calculate day difference', () => {
    expect(diffDays(new Date('2026-05-31'), new Date('2026-06-01'))).toBe(1)
  })
  it('should return negative for past dates', () => {
    expect(diffDays(new Date('2026-06-01'), new Date('2026-05-31'))).toBe(-1)
  })
})

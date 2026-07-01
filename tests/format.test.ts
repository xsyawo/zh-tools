import { describe, it, expect } from 'vitest'
import { formatMoney, formatPercent, formatMobile, formatIdCard, formatBankCard, formatFileSize } from '../src/format'

describe('formatMoney', () => {
  it('should format with thousands separator', () => {
    expect(formatMoney(12345.6)).toBe('12,345.60')
  })
  it('should handle zero', () => {
    expect(formatMoney(0)).toBe('0.00')
  })
  it('should accept custom decimals', () => {
    expect(formatMoney(123.456, 3)).toBe('123.456')
  })
})

describe('formatPercent', () => {
  it('should append % to whole numbers', () => {
    expect(formatPercent(85)).toBe('85%')
  })
  it('should auto-multiply decimal values', () => {
    expect(formatPercent(0.85)).toBe('85%')
  })
  it('should handle 0 gracefully', () => {
    expect(formatPercent(0)).toBe('0%')
  })
  it('should respect decimals parameter', () => {
    expect(formatPercent(0.856, 1)).toBe('85.6%')
    expect(formatPercent(85.567, 2)).toBe('85.57%')
  })
})

describe('formatMobile', () => {
  it('should mask middle digits', () => {
    expect(formatMobile('13800138000')).toBe('138****8000')
  })
  it('should return original if not 11 digits', () => {
    expect(formatMobile('12345')).toBe('12345')
  })
})

describe('formatIdCard', () => {
  it('should mask ID card', () => {
    expect(formatIdCard('110101199001011234')).toBe('1101**********1234')
  })
  it('should return original if too short', () => {
    expect(formatIdCard('12345')).toBe('12345')
  })
})

describe('formatBankCard', () => {
  it('should add spaces every 4 digits', () => {
    expect(formatBankCard('6222021234567890')).toBe('6222 0212 3456 7890')
  })
})

describe('formatFileSize', () => {
  it('should format bytes', () => {
    expect(formatFileSize(0)).toBe('0 B')
    expect(formatFileSize(1024)).toBe('1.00 KB')
    expect(formatFileSize(1048576)).toBe('1.00 MB')
    expect(formatFileSize(1073741824)).toBe('1.00 GB')
  })
})

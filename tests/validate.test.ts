import { describe, it, expect } from 'vitest'
import { isPhone, isEmail, isIdCard, isUrl, isLicensePlate, isEmpty, isChinese, isDecimal } from '../src/validate'

describe('isPhone', () => {
  it('valid phone numbers', () => {
    expect(isPhone('13800138000')).toBe(true)
    expect(isPhone('15912345678')).toBe(true)
    expect(isPhone('17712345678')).toBe(true)
  })
  it('invalid phone numbers', () => {
    expect(isPhone('12345678901')).toBe(false)
    expect(isPhone('1380013800')).toBe(false)
    expect(isPhone('23800138000')).toBe(false)
    expect(isPhone('')).toBe(false)
  })
})

describe('isEmail', () => {
  it('valid emails', () => {
    expect(isEmail('test@example.com')).toBe(true)
    expect(isEmail('a.b@c.cn')).toBe(true)
    expect(isEmail('test+tag@example.com')).toBe(true)
    expect(isEmail('user@sub.example.com')).toBe(true)
    expect(isEmail('user@ex-ample.com')).toBe(true)
  })
  it('invalid emails', () => {
    expect(isEmail('')).toBe(false)
    expect(isEmail('not-email')).toBe(false)
    expect(isEmail('test@example')).toBe(false)       // 无 TLD
    expect(isEmail('test..user@example.com')).toBe(false) // 连续点
    expect(isEmail('.test@example.com')).toBe(false)     // 点开头
    expect(isEmail('test.@example.com')).toBe(false)     // @前有点
    expect(isEmail('test@.example.com')).toBe(false)     // @后有点
    expect(isEmail('test@example.com.')).toBe(false)     // 点结尾
    expect(isEmail('test@ex.1')).toBe(false)             // 数字 TLD
  })
})

describe('isIdCard', () => {
  it('valid ID cards', () => {
    expect(isIdCard('110101199001010074')).toBe(true)
    expect(isIdCard('11010119900101100X')).toBe(true)
    expect(isIdCard('11010119900101100x')).toBe(true)
  })
  it('invalid ID cards', () => {
    expect(isIdCard('123456789012345')).toBe(false)
    expect(isIdCard('110101199001011233')).toBe(false)
    expect(isIdCard('')).toBe(false)
  })
})

describe('isUrl', () => {
  it('valid URLs', () => {
    expect(isUrl('https://example.com')).toBe(true)
    expect(isUrl('http://example.com/path?q=1')).toBe(true)
  })
  it('invalid URLs', () => {
    expect(isUrl('not-a-url')).toBe(false)
    expect(isUrl('')).toBe(false)
  })
})

describe('isLicensePlate', () => {
  it('valid plates', () => {
    expect(isLicensePlate('京A12345')).toBe(true)
    expect(isLicensePlate('粤AD12345')).toBe(true)
  })
  it('invalid plates', () => {
    expect(isLicensePlate('')).toBe(false)
    expect(isLicensePlate('AB12345')).toBe(false)
  })
})

describe('isEmpty', () => {
  it('empty values', () => {
    expect(isEmpty(null)).toBe(true)
    expect(isEmpty(undefined)).toBe(true)
    expect(isEmpty('')).toBe(true)
    expect(isEmpty('   ')).toBe(true)
    expect(isEmpty([])).toBe(true)
    expect(isEmpty({})).toBe(true)
  })
  it('non-empty values', () => {
    expect(isEmpty('hello')).toBe(false)
    expect(isEmpty([1])).toBe(false)
    expect(isEmpty({ a: 1 })).toBe(false)
    expect(isEmpty(0)).toBe(false)
  })
})

describe('isChinese', () => {
  it('pure Chinese', () => {
    expect(isChinese('中文')).toBe(true)
    expect(isChinese('你好世界')).toBe(true)
  })
  it('non-Chinese', () => {
    expect(isChinese('hello')).toBe(false)
    expect(isChinese('中文123')).toBe(false)
    expect(isChinese('')).toBe(false)
  })
})

describe('isDecimal', () => {
  it('valid decimals', () => {
    expect(isDecimal(123.45)).toBe(true)
    expect(isDecimal('123.45')).toBe(true)
    expect(isDecimal(100)).toBe(true)
  })
  it('decimal place validation', () => {
    expect(isDecimal(123.45, 2)).toBe(true)
    expect(isDecimal(123.456, 2)).toBe(false)
  })
  it('non-numeric', () => {
    expect(isDecimal('abc')).toBe(false)
  })
})

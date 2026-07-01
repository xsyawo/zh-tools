import { describe, it, expect } from 'vitest'
import { uuid, randomStr, camelToSnake, snakeToCamel, truncate, escapeHtml, stripHtml } from '../src/string'

describe('uuid', () => {
  it('should generate a valid UUID v4 format', () => {
    const id = uuid()
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
  })

  it('should generate unique values', () => {
    const ids = new Set(Array.from({ length: 100 }, () => uuid()))
    expect(ids.size).toBe(100)
  })
})

describe('randomStr', () => {
  it('should generate string of specified length', () => {
    expect(randomStr(8)).toHaveLength(8)
    expect(randomStr(32)).toHaveLength(32)
  })

  it('should use default charset', () => {
    const result = randomStr(100)
    expect(result).toMatch(/^[a-zA-Z2-9]+$/)
  })

  it('should respect custom charset', () => {
    const result = randomStr(20, 'abc')
    expect(result).toMatch(/^[abc]{20}$/)
  })
})

describe('camelToSnake', () => {
  it('should convert camelCase to snake_case', () => {
    expect(camelToSnake('userName')).toBe('user_name')
  })

  it('should handle consecutive capitals', () => {
    expect(camelToSnake('APIKey')).toBe('api_key')
  })

  it('should handle already snake case', () => {
    expect(camelToSnake('user_name')).toBe('user_name')
  })
})

describe('snakeToCamel', () => {
  it('should convert snake_case to camelCase', () => {
    expect(snakeToCamel('user_name')).toBe('userName')
  })

  it('should handle multiple underscores', () => {
    expect(snakeToCamel('api_response_data')).toBe('apiResponseData')
  })
})

describe('truncate', () => {
  it('should truncate long strings', () => {
    expect(truncate('hello world', 9)).toBe('hello wo…')
    expect(truncate('hello world', 8)).toBe('hello w…')
  })

  it('should not truncate short strings', () => {
    expect(truncate('hi', 8)).toBe('hi')
  })

  it('should use custom ellipsis', () => {
    expect(truncate('hello world', 8, '...')).toBe('hello...')
  })
})

describe('escapeHtml', () => {
  it('should escape HTML special characters', () => {
    expect(escapeHtml('<div>"hello"</div>')).toBe('&lt;div&gt;&quot;hello&quot;&lt;/div&gt;')
  })

  it('should handle ampersand', () => {
    expect(escapeHtml('a & b')).toBe('a &amp; b')
  })
})

describe('stripHtml', () => {
  it('should remove HTML tags', () => {
    expect(stripHtml('<p>hello <b>world</b></p>')).toBe('hello world')
  })

  it('should return plain text unchanged', () => {
    expect(stripHtml('plain text')).toBe('plain text')
  })
})

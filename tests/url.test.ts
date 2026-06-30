import { describe, it, expect } from 'vitest'
import { getUrlParam, setUrlParam, removeUrlParam, objToUrlParams, urlParamsToObj } from '../src/url'

describe('getUrlParam', () => {
  it('should get param by key', () => {
    expect(getUrlParam('a', '?a=1&b=2')).toBe('1')
  })
  it('should return null for missing key', () => {
    expect(getUrlParam('c', '?a=1')).toBeNull()
  })
})

describe('setUrlParam', () => {
  it('should add param', () => {
    expect(setUrlParam('http://example.com', 'a', '1')).toBe('http://example.com?a=1')
  })
  it('should update existing param', () => {
    expect(setUrlParam('http://example.com?a=1', 'a', '2')).toBe('http://example.com?a=2')
  })
})

describe('removeUrlParam', () => {
  it('should remove param', () => {
    expect(removeUrlParam('http://example.com?a=1&b=2', 'a')).toBe('http://example.com?b=2')
  })
  it('should return base URL if no params left', () => {
    expect(removeUrlParam('http://example.com?a=1', 'a')).toBe('http://example.com')
  })
})

describe('objToUrlParams', () => {
  it('should convert object to query string', () => {
    expect(objToUrlParams({ a: 1, b: 'hello' })).toBe('a=1&b=hello')
  })
  it('should skip null/undefined values', () => {
    expect(objToUrlParams({ a: null, b: 2 })).toBe('b=2')
  })
})

describe('urlParamsToObj', () => {
  it('should parse query string', () => {
    expect(urlParamsToObj('?a=1&b=2')).toEqual({ a: '1', b: '2' })
  })
})

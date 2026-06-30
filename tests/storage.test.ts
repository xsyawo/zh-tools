import { describe, it, expect, beforeEach } from 'vitest'
import {
  getLocal, setLocal, removeLocal, clearLocal,
  getSession, setSession, removeSession, clearSession,
  getCookie, setCookie, removeCookie,
} from '../src/storage'

describe('localStorage', () => {
  beforeEach(() => clearLocal())

  it('setLocal and getLocal', () => {
    setLocal('key', { a: 1 })
    expect(getLocal('key')).toEqual({ a: 1 })
  })
  it('getLocal returns null for missing key', () => {
    expect(getLocal('nonexistent')).toBeNull()
  })
  it('removeLocal removes key', () => {
    setLocal('key', 'val')
    removeLocal('key')
    expect(getLocal('key')).toBeNull()
  })
  it('clearLocal removes all', () => {
    setLocal('a', 1)
    setLocal('b', 2)
    clearLocal()
    expect(getLocal('a')).toBeNull()
    expect(getLocal('b')).toBeNull()
  })
})

describe('sessionStorage', () => {
  beforeEach(() => clearSession())

  it('setSession and getSession', () => {
    setSession('key', 'val')
    expect(getSession('key')).toBe('val')
  })
  it('getSession returns null for missing key', () => {
    expect(getSession('missing')).toBeNull()
  })
  it('removeSession removes key', () => {
    setSession('key', 'val')
    removeSession('key')
    expect(getSession('key')).toBeNull()
  })
})

describe('cookie', () => {
  beforeEach(() => {
    // Clear all cookies
    document.cookie.split(';').forEach(c => {
      const key = c.split('=')[0].trim()
      if (key) removeCookie(key)
    })
  })

  it('setCookie and getCookie', () => {
    setCookie('theme', 'dark')
    expect(getCookie('theme')).toBe('dark')
  })
  it('getCookie returns null for missing key', () => {
    expect(getCookie('missing')).toBeNull()
  })
  it('removeCookie removes cookie', () => {
    setCookie('key', 'val')
    removeCookie('key')
    expect(getCookie('key')).toBeNull()
  })
  it('setCookie with options', () => {
    setCookie('key', 'val', { path: '/', expires: 7 })
    expect(getCookie('key')).toBe('val')
  })
})

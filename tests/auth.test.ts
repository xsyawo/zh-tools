import { describe, it, expect } from 'vitest'
import { hasPermission, hasRole, hasAllPermissions, hasAnyPermission } from '../src/auth'

describe('hasPermission', () => {
  it('single permission', () => {
    expect(hasPermission('user:read', ['user:read', 'user:write'])).toBe(true)
    expect(hasPermission('user:delete', ['user:read'])).toBe(false)
  })
  it('multiple permissions (OR)', () => {
    expect(hasPermission(['user:read', 'user:delete'], ['user:read'])).toBe(true)
    expect(hasPermission(['admin:add', 'admin:del'], ['user:read'])).toBe(false)
  })
})

describe('hasRole', () => {
  it('should check role', () => {
    expect(hasRole('admin', ['admin', 'editor'])).toBe(true)
    expect(hasRole('viewer', ['admin'])).toBe(false)
  })
})

describe('hasAllPermissions', () => {
  it('AND logic', () => {
    expect(hasAllPermissions(['user:read', 'user:write'], ['user:read', 'user:write', 'admin'])).toBe(true)
    expect(hasAllPermissions(['user:read', 'user:delete'], ['user:read'])).toBe(false)
  })
})

describe('hasAnyPermission', () => {
  it('OR logic', () => {
    expect(hasAnyPermission(['user:read', 'user:delete'], ['user:read'])).toBe(true)
    expect(hasAnyPermission(['admin:add', 'admin:del'], ['user:read'])).toBe(false)
  })
})

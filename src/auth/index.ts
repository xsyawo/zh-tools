/**
 * 判断是否有某个或某些权限
 * @param value - 权限标识（单个字符串或字符串数组，数组时 OR 逻辑）
 * @param permissions - 用户拥有的权限列表
 * @returns 是否有权限
 * @example hasPermission('user:read', ['user:read', 'user:write']) // true
 */
export function hasPermission(value: string | string[], permissions: string[]): boolean {
  const values = Array.isArray(value) ? value : [value]
  return values.some(v => permissions.includes(v))
}

/**
 * 判断是否为某角色（数组时 OR 逻辑）
 * @param value - 角色标识（单个字符串或字符串数组）
 * @param roles - 用户拥有的角色列表
 * @returns 是否匹配角色
 * @example hasRole('admin', ['admin', 'editor']) // true
 */
export function hasRole(value: string | string[], roles: string[]): boolean {
  return hasPermission(value, roles)
}

/**
 * 判断是否拥有所有指定权限（AND 逻辑）
 * @param values - 权限标识列表
 * @param permissions - 用户拥有的权限列表
 * @returns 是否拥有所有权限
 * @example hasAllPermissions(['user:read', 'user:write'], ['user:read', 'user:write', 'admin']) // true
 */
export function hasAllPermissions(values: string[], permissions: string[]): boolean {
  return values.every(v => permissions.includes(v))
}

/**
 * 判断是否拥有任一权限（OR 逻辑）
 * @param values - 权限标识列表
 * @param permissions - 用户拥有的权限列表
 * @returns 是否拥有任一权限
 * @example hasAnyPermission(['user:read', 'user:delete'], ['user:read']) // true
 */
export function hasAnyPermission(values: string[], permissions: string[]): boolean {
  return values.some(v => permissions.includes(v))
}

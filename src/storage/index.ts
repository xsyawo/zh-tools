export interface CookieOptions {
  /** 过期天数或具体日期 */
  expires?: number | Date
  /** 路径，默认 '/' */
  path?: string
  /** 域名 */
  domain?: string
  /** 仅 HTTPS */
  secure?: boolean
}

// ---- localStorage ----

/**
 * 获取 localStorage 值（自动 JSON 解析）
 * @param key - 键名
 * @returns 存储的值或 null
 */
export function getLocal<T = any>(key: string): T | null {
  try {
    const val = localStorage.getItem(key)
    if (val === null) return null
    return JSON.parse(val) as T
  } catch {
    return null
  }
}

/**
 * 设置 localStorage 值（自动 JSON 序列化）
 * @param key - 键名
 * @param value - 要存储的值
 */
export function setLocal(key: string, value: any): void {
  localStorage.setItem(key, JSON.stringify(value))
}

/**
 * 移除 localStorage 值
 * @param key - 键名
 */
export function removeLocal(key: string): void {
  localStorage.removeItem(key)
}

/**
 * 清空所有 localStorage
 */
export function clearLocal(): void {
  localStorage.clear()
}

// ---- sessionStorage ----

/**
 * 获取 sessionStorage 值（自动 JSON 解析）
 * @param key - 键名
 * @returns 存储的值或 null
 */
export function getSession<T = any>(key: string): T | null {
  try {
    const val = sessionStorage.getItem(key)
    if (val === null) return null
    return JSON.parse(val) as T
  } catch {
    return null
  }
}

/**
 * 设置 sessionStorage 值（自动 JSON 序列化）
 * @param key - 键名
 * @param value - 要存储的值
 */
export function setSession(key: string, value: any): void {
  sessionStorage.setItem(key, JSON.stringify(value))
}

/**
 * 移除 sessionStorage 值
 * @param key - 键名
 */
export function removeSession(key: string): void {
  sessionStorage.removeItem(key)
}

/**
 * 清空所有 sessionStorage
 */
export function clearSession(): void {
  sessionStorage.clear()
}

// ---- Cookie ----

/**
 * 获取 cookie
 * @param key - cookie 名
 * @returns cookie 值或 null
 */
export function getCookie(key: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${encodeURIComponent(key)}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

/**
 * 设置 cookie
 * @param key - cookie 名
 * @param value - cookie 值
 * @param options - 可选配置（过期时间、路径、域名、安全标志）
 */
export function setCookie(key: string, value: string, options?: CookieOptions): void {
  let cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
  if (options) {
    if (options.expires) {
      const expires = options.expires instanceof Date ? options.expires : new Date(Date.now() + options.expires * 86400000)
      cookie += `; expires=${expires.toUTCString()}`
    }
    if (options.path) cookie += `; path=${options.path}`
    if (options.domain) cookie += `; domain=${options.domain}`
    if (options.secure) cookie += '; secure'
  }
  document.cookie = cookie
}

/**
 * 移除 cookie
 * @param key - cookie 名
 * @param options - 可选配置（路径、域名）
 */
export function removeCookie(key: string, options?: Omit<CookieOptions, 'expires'>): void {
  setCookie(key, '', { ...options, expires: new Date(0) })
}

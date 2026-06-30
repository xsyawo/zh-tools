/**
 * 获取指定 URL 参数值
 * @param key - 参数名
 * @param search - URL 查询字符串（含 ?），默认当前 location.search
 * @returns 参数值或 null
 * @example getUrlParam('a', '?a=1&b=2') // '1'
 */
export function getUrlParam(key: string, search?: string): string | null {
  const params = getAllUrlParams(search)
  return params[key] ?? null
}

/**
 * 获取所有 URL 参数
 * @param search - URL 查询字符串（含 ?），默认当前 location.search
 * @returns 参数键值对对象
 * @example getAllUrlParams('?a=1&b=2') // { a: '1', b: '2' }
 */
export function getAllUrlParams(search?: string): Record<string, string> {
  const s = search ?? (typeof window !== 'undefined' ? window.location.search : '')
  const cleanSearch = s.startsWith('?') ? s.slice(1) : s
  if (!cleanSearch) return {}
  const result: Record<string, string> = {}
  for (const part of cleanSearch.split('&')) {
    const [key, value] = part.split('=')
    if (key) {
      result[decodeURIComponent(key)] = value ? decodeURIComponent(value) : ''
    }
  }
  return result
}

/**
 * 设置 URL 参数（追加或覆盖）
 * @param url - 原始 URL
 * @param key - 参数名
 * @param value - 参数值
 * @returns 新的 URL 字符串
 * @example setUrlParam('http://example.com', 'a', '1') // 'http://example.com?a=1'
 */
export function setUrlParam(url: string, key: string, value: string): string {
  const [base, search] = url.split('?')
  const params = search ? urlParamsToObj('?' + search) : {}
  params[key] = value
  const newSearch = objToUrlParams(params)
  return newSearch ? `${base}?${newSearch}` : base
}

/**
 * 移除 URL 参数
 * @param url - 原始 URL
 * @param key - 要移除的参数名
 * @returns 新的 URL 字符串
 * @example removeUrlParam('http://example.com?a=1&b=2', 'a') // 'http://example.com?b=2'
 */
export function removeUrlParam(url: string, key: string): string {
  const [base, search] = url.split('?')
  if (!search) return url
  const params = urlParamsToObj('?' + search)
  delete params[key]
  const newSearch = objToUrlParams(params)
  return newSearch ? `${base}?${newSearch}` : base
}

/**
 * 对象转 URL 参数字符串
 * @param obj - 参数对象
 * @returns URL 参数字符串（不带 ?）
 * @example objToUrlParams({ a: 1, b: 'hello' }) // 'a=1&b=hello'
 */
export function objToUrlParams(obj: Record<string, any>): string {
  const parts: string[] = []
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== null && obj[key] !== undefined) {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(obj[key]))}`)
    }
  }
  return parts.join('&')
}

/**
 * URL 参数字符串转对象
 * @param search - URL 查询字符串（含 ?）
 * @returns 参数对象
 * @example urlParamsToObj('?a=1&b=2') // { a: '1', b: '2' }
 */
export function urlParamsToObj(search: string): Record<string, string> {
  return getAllUrlParams(search)
}

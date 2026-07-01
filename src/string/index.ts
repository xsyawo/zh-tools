/**
 * 生成 UUID v4（随机）
 *
 * 基于 crypto.randomUUID()，不支持时降级为 Math.random 生成
 *
 * @returns UUID v4 字符串
 * @example uuid() // '550e8400-e29b-41d4-a716-446655440000'
 */
export function uuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  // 降级：手动生成 RFC4122 v4 UUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * 生成指定长度的随机字符串
 *
 * @param length - 字符串长度，默认 16
 * @param charset - 字符集，默认包含大小写字母和数字，不含易混淆字符（0/O/i/I/l/1）
 * @returns 随机字符串
 * @example randomStr(6) // 'aB3kF8'
 * @example randomStr(4, '0123456789') // '3829'
 */
export function randomStr(
  length: number = 16,
  charset: string = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789',
): string {
  let result = ''
  const len = charset.length
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * len))
  }
  return result
}

// ==================== 命名风格转换 ====================

/**
 * 驼峰命名 → 下划线命名
 * @param str - 驼峰命名字符串
 * @returns 下划线命名字符串
 * @example camelToSnake('userName') // 'user_name'
 * @example camelToSnake('APIKey') // 'api_key'
 */
export function camelToSnake(str: string): string {
  return str
    // 小写/数字后跟大写 → 插入下划线
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    // 连续大写 + 大写后跟小写（处理缩写词）→ 在最后一个大写前插入下划线
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
    .toLowerCase()
}

/**
 * 下划线命名 → 驼峰命名
 * @param str - 下划线命名字符串
 * @returns 驼峰命名字符串
 * @example snakeToCamel('user_name') // 'userName'
 * @example snakeToCamel('api_key') // 'apiKey'
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

// ==================== 文本处理 ====================

/**
 * 截断文本并添加省略号
 * @param str - 要截断的字符串
 * @param maxLength - 最大长度（含省略号）
 * @param ellipsis - 省略号字符，默认 '…'
 * @returns 截断后的字符串
 * @example truncate('很长的文本内容', 4) // '很长…'
 * @example truncate('hello world', 8, '...') // 'hello...'
 */
export function truncate(str: string, maxLength: number, ellipsis: string = '…'): string {
  if (str.length <= maxLength) return str
  if (maxLength <= ellipsis.length) return ellipsis.slice(0, maxLength)
  return str.slice(0, maxLength - ellipsis.length) + ellipsis
}

/**
 * HTML 转义（防 XSS）
 * @param str - 原始字符串
 * @returns 转义后的 HTML 安全字符串
 * @example escapeHtml('<div>"hello"</div>') // '&lt;div&gt;&quot;hello&quot;&lt;/div&gt;'
 */
export function escapeHtml(str: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
  }
  return str.replace(/[&<>"']/g, char => map[char])
}

/**
 * 去除 HTML 标签
 * @param str - 含 HTML 标签的字符串
 * @returns 纯文本
 * @example stripHtml('<p>hello <b>world</b></p>') // 'hello world'
 */
export function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '')
}

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

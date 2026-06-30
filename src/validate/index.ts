/**
 * 校验手机号（支持所有运营商号段）
 * @param val - 手机号字符串
 * @returns 是否有效手机号
 * @example isPhone('13800138000') // true
 */
export function isPhone(val: string): boolean {
  return /^1[3-9]\d{9}$/.test(val)
}

/**
 * 校验邮箱地址
 * @param val - 邮箱字符串
 * @returns 是否有效邮箱
 * @example isEmail('test@example.com') // true
 * @example isEmail('test..user@example.com') // false — 连续点
 */
export function isEmail(val: string): boolean {
  // 基本格式：非空 + @ + 非空 + . + 非空
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return false
  // 拒绝连续点
  if (val.includes('..')) return false
  // 拒绝点开头/结尾（local 以点开头、@ 旁有单独点、domain 以点结尾）
  if (/^\.|\.@|@\.|\.$/.test(val)) return false
  // TLD 至少两位纯字母
  if (!/\.[a-zA-Z]{2,}$/.test(val)) return false
  return true
}

/**
 * 校验身份证号（18位，含校验位算法验证）
 * @param val - 身份证号字符串
 * @returns 是否有效身份证号
 * @example isIdCard('110101199001011234') // true
 */
export function isIdCard(val: string): boolean {
  if (!/^\d{17}[\dXx]$/.test(val)) return false
  const factors = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  const parity = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
  let sum = 0
  for (let i = 0; i < 17; i++) {
    sum += parseInt(val[i], 10) * factors[i]
  }
  return parity[sum % 11] === val[17].toUpperCase()
}

/**
 * 校验 URL
 * @param val - URL 字符串
 * @returns 是否有效 URL
 * @example isUrl('https://example.com') // true
 */
export function isUrl(val: string): boolean {
  try {
    new URL(val)
    return true
  } catch {
    return false
  }
}

/**
 * 校验车牌号（支持新能源绿牌和普通蓝牌）
 * @param val - 车牌号字符串
 * @returns 是否有效车牌号
 * @example isLicensePlate('京A12345') // true
 */
export function isLicensePlate(val: string): boolean {
  return /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤川青藏琼宁][A-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/.test(val)
}

/**
 * 判断值是否为空（null / undefined / 空字符串 / 空数组 / 空对象）
 * @param val - 要判断的值
 * @returns 是否为空
 * @example isEmpty(null) // true
 */
export function isEmpty(val: any): boolean {
  if (val === null || val === undefined) return true
  if (typeof val === 'string') return val.trim() === ''
  if (Array.isArray(val)) return val.length === 0
  if (Object.prototype.toString.call(val) === '[object Object]') return Object.keys(val).length === 0
  return false
}

/**
 * 判断是否纯中文字符
 * @param val - 要判断的字符串
 * @returns 是否纯中文
 * @example isChinese('中文') // true
 */
export function isChinese(val: string): boolean {
  return /^[一-龥]+$/.test(val)
}

/**
 * 判断是否为合法数字（支持精度校验）
 * @param val - 要校验的值
 * @param decimals - 可选，限制小数位数
 * @returns 是否合法数字
 * @example isDecimal(123.45) // true
 */
export function isDecimal(val: string | number, decimals?: number): boolean {
  if (typeof val === 'number') val = String(val)
  if (!/^-?\d+(\.\d+)?$/.test(val)) return false
  if (decimals !== undefined) {
    const parts = val.split('.')
    if (parts[1] && parts[1].length > decimals) return false
  }
  return true
}

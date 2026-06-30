/**
 * 金额格式化，千分位加逗号
 * @param value - 金额（数字或字符串）
 * @param decimals - 小数位数，默认 2
 * @returns 格式化后的金额字符串
 * @example formatMoney(12345.6) // '12,345.60'
 */
export function formatMoney(value: number | string, decimals: number = 2): string {
  const num = typeof value === 'string' ? parseFloat(value) : value
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/**
 * 百分比格式化
 * @param value - 百分比值
 * @returns 格式化后的百分比字符串
 * @example formatPercent(85) // '85%'
 */
export function formatPercent(value: number | string): string {
  return `${value}%`
}

/**
 * 手机号脱敏
 * @param mobile - 手机号字符串
 * @returns 脱敏后的手机号，如 138****8000
 * @example formatMobile('13800138000') // '138****8000'
 */
export function formatMobile(mobile: string): string {
  if (mobile.length !== 11) return mobile
  return mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/**
 * 身份证号脱敏
 * @param id - 身份证号字符串
 * @returns 脱敏后的身份证号
 * @example formatIdCard('110101199001011234') // '1101**********1234'
 */
export function formatIdCard(id: string): string {
  if (id.length < 10) return id
  return id.replace(/^(\d{4})\d{10}(\w{4})$/, '$1**********$2')
}

/**
 * 银行卡号格式化（每4位加空格）
 * @param card - 银行卡号字符串
 * @returns 格式化后的卡号
 * @example formatBankCard('6222021234567890') // '6222 0212 3456 7890'
 */
export function formatBankCard(card: string): string {
  return card.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
}

/**
 * 文件大小格式化
 * @param bytes - 文件字节数
 * @returns 格式化后的文件大小字符串
 * @example formatFileSize(1024) // '1.00 KB'
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${units[i]}`
}

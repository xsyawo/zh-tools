type DateRangeType = 'today' | 'yesterday' | 'week' | 'month' | 'year'

/** 将输入统一转为 Date 对象 */
function toDate(date: Date | string | number): Date {
  if (date instanceof Date) return date
  return new Date(date)
}

/**
 * 日期格式化
 * @param date - 日期对象/时间戳/日期字符串
 * @param fmt - 格式模板，如 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期字符串
 * @example formatDate(new Date(), 'YYYY-MM-DD') // '2026-05-31'
 */
export function formatDate(date: Date | string | number, fmt: string): string {
  const d = toDate(date)
  const pad = (n: number) => String(n).padStart(2, '0')
  const map: Record<string, string> = {
    'YYYY': String(d.getFullYear()),
    'MM': pad(d.getMonth() + 1),
    'DD': pad(d.getDate()),
    'HH': pad(d.getHours()),
    'mm': pad(d.getMinutes()),
    'ss': pad(d.getSeconds()),
  }
  let result = fmt
  for (const [key, val] of Object.entries(map)) {
    result = result.replace(key, val)
  }
  return result
}

/**
 * 格式化为完整日期时间字符串
 * @param date - 日期对象/时间戳/日期字符串
 * @returns 格式化后的字符串 'YYYY-MM-DD HH:mm:ss'
 * @example formatDateTime(new Date()) // '2026-05-31 14:30:00'
 */
export function formatDateTime(date: Date | string | number): string {
  return formatDate(date, 'YYYY-MM-DD HH:mm:ss')
}

/**
 * 格式化为相对时间描述
 * @param date - 日期对象/时间戳/日期字符串
 * @returns 相对时间描述（刚刚、X分钟前、X小时前、昨天、X天前）
 * @example formatRelative(new Date()) // '刚刚'
 */
export function formatRelative(date: Date | string | number): string {
  const d = toDate(date)
  const now = Date.now()
  const diff = now - d.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (diff < 0) return formatDate(d, 'YYYY-MM-DD')
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 2) return '昨天'
  if (days < 30) return `${days}天前`
  return formatDate(d, 'YYYY-MM-DD')
}

/**
 * 获取当天开始时间 00:00:00.000
 * @param date - 日期对象/时间戳/日期字符串
 * @returns 开始时间 Date 对象
 */
export function getStartOfDay(date: Date | string | number): Date {
  const d = toDate(date)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * 获取当天结束时间 23:59:59.999
 * @param date - 日期对象/时间戳/日期字符串
 * @returns 结束时间 Date 对象
 */
export function getEndOfDay(date: Date | string | number): Date {
  const d = toDate(date)
  d.setHours(23, 59, 59, 999)
  return d
}

/**
 * 获取常用日期范围
 * @param type - 范围类型 'today' | 'yesterday' | 'week' | 'month' | 'year'
 * @returns [开始日期, 结束日期]
 * @example getDateRange('week')
 */
export function getDateRange(type: DateRangeType): [Date, Date] {
  const now = new Date()
  const start = new Date()
  const end = new Date()

  switch (type) {
    case 'today':
      return [getStartOfDay(now), getEndOfDay(now)]
    case 'yesterday': {
      const yesterday = new Date(now.getTime() - 86400000)
      return [getStartOfDay(yesterday), getEndOfDay(yesterday)]
    }
    case 'week': {
      const day = now.getDay()
      const diffToMonday = (day === 0 ? 6 : day - 1)
      start.setDate(now.getDate() - diffToMonday)
      end.setDate(start.getDate() + 6)
      return [getStartOfDay(start), getEndOfDay(end)]
    }
    case 'month':
      start.setDate(1)
      end.setMonth(now.getMonth() + 1, 0)
      return [getStartOfDay(start), getEndOfDay(end)]
    case 'year':
      start.setMonth(0, 1)
      end.setMonth(11, 31)
      return [getStartOfDay(start), getEndOfDay(end)]
    default:
      return [getStartOfDay(now), getEndOfDay(now)]
  }
}

/**
 * 计算两个日期之间的天数差
 * @param date1 - 第一个日期
 * @param date2 - 第二个日期
 * @returns 天数差（可能为负数）
 * @example diffDays(new Date('2026-05-31'), new Date('2026-06-01')) // 1
 */
export function diffDays(date1: Date | string | number, date2: Date | string | number): number {
  const d1 = toDate(date1)
  const d2 = toDate(date2)
  const msPerDay = 86400000
  return Math.round((d2.getTime() - d1.getTime()) / msPerDay)
}

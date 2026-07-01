/**
 * 按字段分组
 * @param arr - 要分组的数组
 * @param key - 分组字段名或取值函数
 * @returns 分组后的对象，key 为分组值，value 为对应数组
 * @example
 * groupBy([{ type: 'A', val: 1 }, { type: 'B', val: 2 }, { type: 'A', val: 3 }], 'type')
 * // { A: [{ type: 'A', val: 1 }, { type: 'A', val: 3 }], B: [{ type: 'B', val: 2 }] }
 */
export function groupBy<T extends Record<string, any>>(
  arr: T[],
  key: keyof T | ((item: T) => string | number),
): Record<string, T[]> {
  const result: Record<string, T[]> = {}
  const getKey = typeof key === 'function' ? key : (item: T) => String(item[key])
  for (const item of arr) {
    const k = getKey(item)
    ;(result[k] ??= []).push(item)
  }
  return result
}

/**
 * 数组去重（基本类型）
 * @param arr - 要去重的数组
 * @returns 去重后的新数组
 * @example unique([1, 2, 2, 3]) // [1, 2, 3]
 */
export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)]
}

/**
 * 按字段去重（对象数组）
 * @param arr - 要去重的对象数组
 * @param key - 去重依据的字段名或取值函数
 * @returns 去重后的新数组（保留第一个匹配项）
 * @example uniqueBy([{ id: 1 }, { id: 2 }, { id: 1 }], 'id') // [{ id: 1 }, { id: 2 }]
 */
export function uniqueBy<T extends Record<string, any>>(
  arr: T[],
  key: keyof T | ((item: T) => string | number),
): T[] {
  const seen = new Set()
  const getKey = typeof key === 'function' ? key : (item: T) => String(item[key])
  return arr.filter(item => {
    const k = getKey(item)
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}

/**
 * 将数组按指定大小分块
 * @param arr - 要分块的数组
 * @param size - 每块大小
 * @returns 二维数组
 * @example chunk([1, 2, 3, 4, 5], 2) // [[1, 2], [3, 4], [5]]
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}

/**
 * 生成数字序列
 * @param start - 起始值
 * @param end - 结束值（含）
 * @param step - 步长，默认 1
 * @returns 数字数组
 * @example range(1, 5) // [1, 2, 3, 4, 5]
 * @example range(5, 1, -1) // [5, 4, 3, 2, 1]
 */
export function range(start: number, end: number, step: number = 1): number[] {
  const result: number[] = []
  if (step > 0) {
    for (let i = start; i <= end; i += step) result.push(i)
  } else {
    for (let i = start; i >= end; i += step) result.push(i)
  }
  return result
}

/**
 * 按字段排序（返回新数组，不修改原数组）
 * @param arr - 要排序的数组
 * @param key - 排序字段名或取值函数
 * @param order - 'asc' 升序 | 'desc' 降序，默认 'asc'
 * @returns 排序后的新数组
 * @example sortBy([{ a: 3 }, { a: 1 }, { a: 2 }], 'a') // [{ a: 1 }, { a: 2 }, { a: 3 }]
 */
export function sortBy<T extends Record<string, any>>(
  arr: T[],
  key: keyof T | ((item: T) => number | string),
  order: 'asc' | 'desc' = 'asc',
): T[] {
  const getVal = typeof key === 'function' ? key : (item: T) => item[key]
  const dir = order === 'asc' ? 1 : -1
  return [...arr].sort((a, b) => {
    const va = getVal(a)
    const vb = getVal(b)
    if (typeof va === 'string') return va.localeCompare(vb as string) * dir
    return (va - (vb as number)) * dir
  })
}

/**
 * 按字段求和
 * @param arr - 对象数组
 * @param key - 要求和的字段名或取值函数
 * @returns 总和
 * @example sumBy([{ price: 10 }, { price: 20 }], 'price') // 30
 */
export function sumBy<T extends Record<string, any>>(
  arr: T[],
  key: keyof T | ((item: T) => number),
): number {
  const getVal = typeof key === 'function' ? key : (item: T) => item[key]
  return arr.reduce((sum, item) => sum + getVal(item), 0)
}

/**
 * 移动数组元素位置（原地修改）
 * @param arr - 要操作的数组
 * @param fromIndex - 源索引
 * @param toIndex - 目标索引
 * @returns 原数组
 * @example move([1, 2, 3, 4], 0, 2) // [2, 3, 1, 4]
 */
export function move<T>(arr: T[], fromIndex: number, toIndex: number): T[] {
  if (fromIndex < 0 || fromIndex >= arr.length || toIndex < 0 || toIndex >= arr.length) return arr
  const [item] = arr.splice(fromIndex, 1)
  arr.splice(toIndex, 0, item)
  return arr
}

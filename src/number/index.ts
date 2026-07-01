/**
 * zh-kit — 数值工具
 *
 * 精确浮点运算，避免 0.1 + 0.2 !== 0.3 的问题。
 * 基于 "先放大为整数运算，再缩小还原" 的策略。
 */

/** 获取数字的小数位数 */
function getDecimalPlaces(num: number): number {
  const parts = num.toString().split('.')
  return parts[1] ? parts[1].length : 0
}

/** 将两个数同步放大为整数 */
function toIntegerPair(a: number, b: number): [number, number, number] {
  const da = getDecimalPlaces(a)
  const db = getDecimalPlaces(b)
  const factor = Math.pow(10, Math.max(da, db))
  return [Math.round(a * factor), Math.round(b * factor), factor]
}

/**
 * 精确加法
 * @example add(0.1, 0.2) // 0.3
 */
export function add(a: number, b: number): number {
  const [ia, ib, factor] = toIntegerPair(a, b)
  return (ia + ib) / factor
}

/**
 * 精确减法
 * @example sub(1, 0.9) // 0.1
 */
export function sub(a: number, b: number): number {
  const [ia, ib, factor] = toIntegerPair(a, b)
  return (ia - ib) / factor
}

/**
 * 精确乘法
 * @example mul(0.1, 0.2) // 0.02
 */
export function mul(a: number, b: number): number {
  const da = getDecimalPlaces(a)
  const db = getDecimalPlaces(b)
  const factor = Math.pow(10, da + db)
  return (Math.round(a * Math.pow(10, da)) * Math.round(b * Math.pow(10, db))) / factor
}

/**
 * 精确除法
 * @example div(0.3, 0.1) // 3
 */
export function div(a: number, b: number): number {
  const da = getDecimalPlaces(a)
  const db = getDecimalPlaces(b)
  const factor = Math.pow(10, Math.max(da, db))
  return Math.round(a * factor) / Math.round(b * factor)
}

/**
 * 安全四舍五入（修复原生 toFixed 的银行家舍入问题）
 * @param num - 要舍入的数字
 * @param decimals - 小数位数，默认 0
 * @returns 舍入后的数字
 * @example round(1.005, 2) // 1.01（原生 1.005.toFixed(2) → '1.00'）
 * @example round(-1.005, 2) // -1.01
 * @example round(1.234, 2) // 1.23
 */
export function round(num: number, decimals: number = 0): number {
  const factor = Math.pow(10, decimals)
  const sign = num >= 0 ? 1 : -1
  const abs = Math.abs(num)
  return sign * Math.round(mul(abs, factor)) / factor
}

/**
 * 值钳制在 [min, max] 范围内
 * @param num - 要钳制的值
 * @param min - 最小值
 * @param max - 最大值
 * @returns 钳制后的值
 * @example clamp(120, 0, 100) // 100
 * @example clamp(-5, 0, 100) // 0
 */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max)
}

/**
 * 生成 [min, max] 范围内的随机整数（含两端）
 * @param min - 最小值（整数）
 * @param max - 最大值（整数）
 * @returns 随机整数
 * @example random(1, 10) // 7
 */
export function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 判断数字是否在指定范围内
 * @param num - 要判断的数字
 * @param min - 最小值（含）
 * @param max - 最大值（含）
 * @returns 是否在范围内
 * @example inRange(5, 1, 10) // true
 */
export function inRange(num: number, min: number, max: number): boolean {
  return num >= min && num <= max
}

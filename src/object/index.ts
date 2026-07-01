/**
 * 深拷贝对象，支持 Date、RegExp、Map、Set、数组、普通对象、循环引用
 * @param obj - 要拷贝的对象
 * @returns 深拷贝后的对象
 * @example deepClone({ a: { b: 1 } }) // { a: { b: 1 } }
 */
export function deepClone<T>(obj: T): T {
  return deepCloneInternal(obj, new WeakMap())
}

function deepCloneInternal<T>(obj: T, cache: WeakMap<object, any>): T {
  if (obj === null || typeof obj !== 'object') return obj

  // 循环引用检测
  if (cache.has(obj as object)) return cache.get(obj as object)

  if (obj instanceof Date) {
    const cloned = new Date(obj.getTime())
    cache.set(obj, cloned)
    return cloned as any
  }
  if (obj instanceof RegExp) {
    const cloned = new RegExp(obj)
    cache.set(obj, cloned)
    return cloned as any
  }
  if (obj instanceof Map) {
    const result = new Map()
    cache.set(obj, result)
    obj.forEach((value, key) => result.set(deepCloneInternal(key, cache), deepCloneInternal(value, cache)))
    return result as any
  }
  if (obj instanceof Set) {
    const result = new Set()
    cache.set(obj, result)
    obj.forEach(value => result.add(deepCloneInternal(value, cache)))
    return result as any
  }
  if (Array.isArray(obj)) {
    const result: any[] = []
    cache.set(obj, result)
    for (let i = 0; i < obj.length; i++) {
      result[i] = deepCloneInternal(obj[i], cache)
    }
    return result as any
  }
  const cloned: Record<string, any> = {}
  cache.set(obj, cloned)
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepCloneInternal((obj as any)[key], cache)
    }
  }
  return cloned as T
}

/**
 * 深度合并对象（类似 Object.assign 的深度版本）
 * @param target - 目标对象
 * @param sources - 源对象列表
 * @returns 合并后的对象
 * @example deepMerge({ a: 1, b: { c: 2 } }, { b: { d: 3 } }) // { a: 1, b: { c: 2, d: 3 } }
 */
export function deepMerge<T extends Record<string, any>>(target: T, ...sources: Partial<T>[]): T {
  const result = deepClone(target)
  for (const source of sources) {
    if (!source) continue
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const srcVal = source[key]
        const resVal = result[key]
        if (isPlainObject(srcVal) && isPlainObject(resVal)) {
          (result as Record<string, any>)[key] = deepMerge(resVal as Record<string, any>, srcVal as Record<string, any>)
        } else {
          result[key] = deepClone(srcVal as any)
        }
      }
    }
  }
  return result
}

/**
 * 排除指定字段
 * @param obj - 源对象
 * @param keys - 要排除的字段列表
 * @returns 排除后的新对象
 * @example omit({ a: 1, b: 2, c: 3 }, ['a', 'c']) // { b: 2 }
 */
export function omit<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj }
  for (const key of keys) {
    delete result[key]
  }
  return result
}

/**
 * 选取指定字段
 * @param obj - 源对象
 * @param keys - 要选取的字段列表
 * @returns 选取后的新对象
 * @example pick({ a: 1, b: 2, c: 3 }, ['a', 'c']) // { a: 1, c: 3 }
 */
export function pick<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key]
    }
  }
  return result
}

/**
 * 清空对象属性值
 * @param obj - 要清空的对象
 * @param keepKeys - 保留这些字段不清空
 * @returns 原对象（已修改）
 * @example clearObj({ a: 'hello', b: 42 }) // { a: '', b: 0 }
 */
export function clearObj<T extends Record<string, any>>(obj: T, keepKeys?: (keyof T)[]): T {
  const keep = new Set(keepKeys)
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && !keep.has(key)) {
      const val = obj[key]
      if (typeof val === 'string') obj[key] = '' as any
      else if (typeof val === 'number') obj[key] = 0 as any
      else if (typeof val === 'boolean') obj[key] = false as any
      else if (Array.isArray(val)) obj[key] = [] as any
      else if (isPlainObject(val)) obj[key] = {} as any
    }
  }
  return obj
}

/**
 * 判断是否纯对象（{} 或 new Object()）
 * @param val - 要判断的值
 * @returns 是否纯对象
 * @example isPlainObject({}) // true
 */
export function isPlainObject(val: any): val is Record<string, any> {
  if (val === null || val === undefined) return false
  const proto = Object.getPrototypeOf(val)
  return proto === Object.prototype || proto === null
}

/**
 * 按路径安全取值
 * @param obj - 源对象
 * @param path - 路径字符串，如 'a.b.c'
 * @param defaultValue - 默认值
 * @returns 取到的值或默认值
 * @example get({ a: { b: 42 } }, 'a.b') // 42
 */
export function get<T = any>(obj: any, path: string, defaultValue?: T): T | undefined {
  const keys = path.split('.')
  let result = obj
  for (const key of keys) {
    if (result === null || result === undefined || typeof result !== 'object') {
      return defaultValue
    }
    result = result[key]
  }
  return result === undefined ? defaultValue : result
}

/**
 * 按路径设置值（自动创建中间对象）
 * @param obj - 目标对象
 * @param path - 路径字符串
 * @param value - 要设置的值
 * @example set({}, 'a.b.c', 42) // { a: { b: { c: 42 } } }
 */
export function set(obj: Record<string, any>, path: string, value: any): void {
  const keys = path.split('.')
  let current = obj
  for (let i = 0; i < keys.length - 1; i++) {
    if (!isPlainObject(current[keys[i]])) {
      current[keys[i]] = {}
    }
    current = current[keys[i]]
  }
  current[keys[keys.length - 1]] = value
}

// ==================== 对象扁平化 & 对比 ====================

/**
 * 对象扁平化（嵌套 → 平铺，路径用点号连接）
 * @param obj - 要扁平化的对象
 * @param prefix - 内部递归用，调用时无需传
 * @returns 扁平化后的对象
 * @example flatten({ a: { b: 1, c: 2 }, d: 3 }) // { 'a.b': 1, 'a.c': 2, d: 3 }
 */
export function flatten(obj: Record<string, any>, prefix: string = ''): Record<string, any> {
  const result: Record<string, any> = {}
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue
    const path = prefix ? `${prefix}.${key}` : key
    const val = obj[key]
    if (isPlainObject(val)) {
      Object.assign(result, flatten(val, path))
    } else {
      result[path] = val
    }
  }
  return result
}

/**
 * 浅层差异比较 —— 返回 b 相对于 a 发生变化的字段（浅比较）
 * @param a - 原始对象
 * @param b - 新对象
 * @returns 有变化的字段组成的新对象（仅包含 b 中与 a 不同的 key）
 * @example diff({ a: 1, b: 2 }, { a: 1, b: 3, c: 4 }) // { b: 3, c: 4 }
 */
export function diff<T extends Record<string, any>>(a: T, b: T): Partial<T> {
  const result: Partial<T> = {}
  const allKeys = new Set([...Object.keys(a), ...Object.keys(b)])
  for (const key of allKeys) {
    if (a[key] !== b[key]) {
      result[key as keyof T] = b[key]
    }
  }
  return result
}

/**
 * 浅合并（Object.assign 的快捷方式，返回新对象）
 * @param target - 目标对象
 * @param sources - 源对象列表
 * @returns 合并后的新对象
 * @example merge({ a: 1 }, { b: 2 }) // { a: 1, b: 2 }
 */
export function merge<T extends Record<string, any>>(target: T, ...sources: Partial<T>[]): T {
  return Object.assign({}, target, ...sources)
}

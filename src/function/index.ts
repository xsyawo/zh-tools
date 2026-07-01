/**
 * 异步延迟（Promise 版 setTimeout）
 *
 * 适用场景：测试 loading 状态、延迟重试、调试等待
 *
 * @param ms - 延迟毫秒数
 * @returns 在指定毫秒后 resolve 的 Promise
 * @example
 * await sleep(1000)
 * console.log('1 秒后执行')
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 将函数包装为只执行一次
 *
 * 适用场景：单次初始化、支付按钮防重复
 *
 * @param fn - 要包装的函数
 * @returns 包装后的函数（第一次调用执行并返回结果，后续调用返回第一次的结果）
 * @example
 * const init = once(() => console.log('只执行一次'))
 * init() // 输出
 * init() // 不输出，返回上次结果
 */
export function once<T extends (...args: any[]) => any>(fn: T): T {
  let called = false
  let result: ReturnType<T>
  return function (this: any, ...args: Parameters<T>): ReturnType<T> {
    if (!called) {
      called = true
      result = fn.apply(this, args)
    }
    return result
  } as T
}

/**
 * 失败重试
 *
 * 适用场景：网络请求重试、不稳定操作的容错
 *
 * @param fn - 可能失败的异步函数
 * @param times - 最大重试次数，默认 3
 * @param delayMs - 重试间隔（毫秒），默认 0
 * @returns Promise，返回首次成功的值，全部失败则 reject
 * @example
 * const data = await retry(() => fetch('/api/data'), 3, 1000)
 */
export async function retry<T>(fn: () => Promise<T>, times: number = 3, delayMs: number = 0): Promise<T> {
  let lastError: any
  for (let i = 0; i < times; i++) {
    try {
      return await fn()
    } catch (e) {
      lastError = e
      if (i < times - 1 && delayMs > 0) {
        await sleep(delayMs)
      }
    }
  }
  throw lastError
}

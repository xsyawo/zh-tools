/**
 * 防抖 — 在事件触发 n 秒后再执行回调，期间再次触发则重新计时
 *
 * 适用场景：搜索框输入、窗口 resize、按钮防重复提交
 *
 * @param fn - 要防抖的函数
 * @param delay - 延迟时间（毫秒），默认 300
 * @returns 防抖后的函数
 * @example
 * const search = debounce((keyword: string) => {
 *   fetch('/api/search?q=' + keyword)
 * }, 500)
 * input.oninput = (e) => search(e.target.value)
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timer !== null) clearTimeout(timer)
    timer = setTimeout(() => {
      fn(...args)
      timer = null
    }, delay)
  }
}

/**
 * 节流 — 在指定时间间隔内只执行一次回调
 *
 * 适用场景：滚动事件、鼠标移动、动画帧同步
 *
 * @param fn - 要节流的函数
 * @param interval - 时间间隔（毫秒），默认 300
 * @returns 节流后的函数
 * @example
 * const onScroll = throttle(() => {
 *   console.log('scrolling...')
 * }, 200)
 * window.addEventListener('scroll', onScroll)
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  interval: number = 300,
): (...args: Parameters<T>) => void {
  let lastTime = 0
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastTime >= interval) {
      lastTime = now
      fn(...args)
    }
  }
}

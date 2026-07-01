/**
 * 将文本复制到剪贴板
 *
 * 优先使用现代 navigator.clipboard API，不支持时降级为 textarea + execCommand。
 * SSR / 非浏览器环境调用会 reject。
 *
 * @param text - 要复制的文本
 * @returns Promise，复制成功时 resolve
 * @example
 * await copyToClipboard('复制的文本')
 * // 或 .then .catch
 * copyToClipboard('hello').then(() => console.log('已复制'))
 */
export function copyToClipboard(text: string): Promise<void> {
  if (typeof document === 'undefined') {
    return Promise.reject(new Error('copyToClipboard 仅支持浏览器环境'))
  }

  // 优先使用 Clipboard API（HTTPS / localhost 环境可用）
  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    return navigator.clipboard.writeText(text)
  }

  // 降级方案：textarea + execCommand
  return new Promise((resolve, reject) => {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    textarea.style.top = '-9999px'
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    try {
      const success = document.execCommand('copy')
      if (success) {
        resolve()
      } else {
        reject(new Error('execCommand copy 失败'))
      }
    } catch (e) {
      reject(e)
    } finally {
      document.body.removeChild(textarea)
    }
  })
}

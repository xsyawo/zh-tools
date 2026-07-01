export interface CompressOptions {
  /** 最大宽度，默认 1920 */
  maxWidth?: number
  /** 最大高度 */
  maxHeight?: number
  /** 图片质量 0-1，默认 0.8 */
  quality?: number
  /** 输出格式，默认 'image/jpeg' */
  format?: string
}

/**
 * 图片压缩
 * @param file - 图片文件
 * @param options - 压缩选项
 * @returns 压缩后的 Blob 对象
 * @example const compressed = await compressImage(file, { quality: 0.5 })
 */
export function compressImage(file: File | Blob, options?: CompressOptions): Promise<Blob> {
  const { maxWidth = 1920, maxHeight, quality = 0.8, format = 'image/jpeg' } = options || {}
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img

      // 计算是否需要缩放
      const needsResize =
        width > maxWidth || (maxHeight !== undefined && height > maxHeight)

      if (!needsResize) {
        // 无需缩放，跳过 Canvas 重绘，直接返回原始文件数据
        if (file instanceof Blob) {
          resolve(file)
        } else {
          // File 实例，直接返回（也是 Blob 的子类）
          resolve(file)
        }
        return
      }

      if (width > maxWidth) {
        height = (height / width) * maxWidth
        width = maxWidth
      }
      if (maxHeight && height > maxHeight) {
        width = (width / height) * maxHeight
        height = maxHeight
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Failed to get canvas context'))
        return
      }
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(blob => {
        if (blob) resolve(blob)
        else reject(new Error('Failed to compress image'))
      }, format, quality)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }
    img.src = url
  })
}

/**
 * 图片转 Base64（通过 Canvas 绘制）
 * @param img - HTMLImageElement
 * @returns Base64 字符串
 * @example imageToBase64(document.getElementById('myImg') as HTMLImageElement)
 */
export function imageToBase64(img: HTMLImageElement): string {
  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  ctx.drawImage(img, 0, 0)
  return canvas.toDataURL('image/png')
}

/**
 * 获取图片原始宽高
 * @param file - 图片文件
 * @returns 包含 width 和 height 的对象
 * @example const { width, height } = await getImageDimensions(file)
 */
export function getImageDimensions(file: File | Blob): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }
    img.src = url
  })
}

/**
 * 生成图片缩略图
 * @param file - 图片文件
 * @param maxSize - 缩略图最大边长
 * @returns DataURL 字符串
 * @example const thumb = await createImageThumbnail(file, 200)
 */
export function createImageThumbnail(file: File | Blob, maxSize: number): Promise<string> {
  return compressImage(file, {
    maxWidth: maxSize,
    maxHeight: maxSize,
    quality: 0.7,
    format: 'image/jpeg',
  }).then(blob => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(new Error('Failed to read thumbnail'))
      reader.readAsDataURL(blob)
    })
  })
}

import { formatFileSize } from '../format/index'

/** 图片下载选项 */
export interface DownloadImageOptions {
  /** 图片 URL */
  url: string
  /** 指定画布宽度 */
  canvasWidth?: number
  /** 指定画布高度 */
  canvasHeight?: number
  /** 将图片绘制在画布上时是否带上图片的宽高值，默认 true */
  drawWithImageSize?: boolean
}

export interface UploadOptions {
  /** 上传地址 */
  url: string
  /** 文件数据 */
  file: File | Blob
  /** 表单字段名，默认 'file' */
  name?: string
  /** 额外表单数据 */
  data?: Record<string, any>
  /** 自定义请求头 */
  headers?: Record<string, string>
  /** 是否携带凭证 */
  withCredentials?: boolean
  /** 上传进度回调（0-100） */
  onProgress?: (percent: number) => void
  /** 取消信号 */
  signal?: AbortSignal
}

/**
 * 通过 URL 下载文件（创建 a 标签模拟点击）
 * @param url - 文件 URL
 * @param filename - 下载文件名（可选）
 */
export function downloadByUrl(url: string, filename?: string): void {
  const a = document.createElement('a')
  a.href = url
  if (filename) a.download = filename
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

/**
 * 通过 Blob 下载文件
 * @param blob - 文件 Blob 数据
 * @param filename - 下载文件名
 * @example downloadByBlob(new Blob(['text']), 'file.txt')
 */
export function downloadByBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  downloadByUrl(url, filename)
  URL.revokeObjectURL(url)
}

/**
 * 通过 Blob 数据下载文件（指定 MIME 类型）
 * @param data - 文件数据
 * @param fileName - 下载文件名
 * @param mimeType - MIME 类型
 * @example downloadBlob(new Blob(['data']), 'file.xlsx', 'application/vnd.ms-excel')
 */
function downloadBlob(data: Blob, fileName: string, mimeType: string): void {
  const blob = new Blob([data], { type: mimeType })
  downloadByBlob(blob, fileName)
}

/** MIME 类型映射表 */
const MIME_MAP: Record<string, string> = {
  excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  word: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  zip: 'application/zip',
  html: 'text/html',
  markdown: 'text/markdown',
  pdf: 'application/pdf',
  json: 'application/json',
  xml: 'text/xml',
  csv: 'text/csv',
}

/**
 * 便捷下载方法集合
 *
 * @example
 * // 下载 Excel
 * download.excel(blobData, '报表.xlsx')
 *
 * // 下载图片（跨域支持）
 * download.image({ url: 'https://example.com/photo.png' })
 */
export const download = {
  /**
   * 下载 Excel 文件
   * @param data - 文件 Blob 数据
   * @param fileName - 文件名（建议含 .xlsx 后缀）
   */
  excel: (data: Blob, fileName: string) => {
    downloadBlob(data, fileName, MIME_MAP.excel)
  },
  /**
   * 下载 Word 文件
   * @param data - 文件 Blob 数据
   * @param fileName - 文件名（建议含 .docx 后缀）
   */
  word: (data: Blob, fileName: string) => {
    downloadBlob(data, fileName, MIME_MAP.word)
  },
  /**
   * 下载 Zip 压缩包
   * @param data - 文件 Blob 数据
   * @param fileName - 文件名（建议含 .zip 后缀）
   */
  zip: (data: Blob, fileName: string) => {
    downloadBlob(data, fileName, MIME_MAP.zip)
  },
  /**
   * 下载 HTML 文件
   * @param data - 文件 Blob 数据
   * @param fileName - 文件名（建议含 .html 后缀）
   */
  html: (data: Blob, fileName: string) => {
    downloadBlob(data, fileName, MIME_MAP.html)
  },
  /**
   * 下载 Markdown 文件
   * @param data - 文件 Blob 数据
   * @param fileName - 文件名（建议含 .md 后缀）
   */
  markdown: (data: Blob, fileName: string) => {
    downloadBlob(data, fileName, MIME_MAP.markdown)
  },
  /**
   * 下载图片（通过 Canvas 绘制，支持跨域）
   * @param options - 下载选项
   */
  image: (options: DownloadImageOptions) => {
    const { url, canvasWidth, canvasHeight, drawWithImageSize = true } = options
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.src = url
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = canvasWidth || image.width
      canvas.height = canvasHeight || image.height
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (drawWithImageSize) {
        ctx.drawImage(image, 0, 0, image.width, image.height)
      } else {
        ctx.drawImage(image, 0, 0)
      }
      const dataUrl = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = 'image.png'
      a.click()
    }
    image.onerror = () => {
      console.error('图片下载失败:', url)
    }
  },
  /**
   * 下载 PDF 文件
   * @param data - 文件 Blob 数据
   * @param fileName - 文件名
   */
  pdf: (data: Blob, fileName: string) => {
    downloadBlob(data, fileName, MIME_MAP.pdf)
  },
  /**
   * 下载 JSON 文件
   * @param data - 文件 Blob 数据
   * @param fileName - 文件名
   */
  json: (data: Blob, fileName: string) => {
    downloadBlob(data, fileName, MIME_MAP.json)
  },
  /**
   * 下载 CSV 文件
   * @param data - 文件 Blob 数据
   * @param fileName - 文件名
   */
  csv: (data: Blob, fileName: string) => {
    downloadBlob(data, fileName, MIME_MAP.csv)
  },
}

/**
 * 文件上传（基于 XMLHttpRequest，支持进度监听）
 * @param options - 上传配置
 * @returns Promise 返回服务器响应数据
 * @example uploadFile({ url: '/api/upload', file: fileInput.files[0], onProgress: p => console.log(p) })
 */
export function uploadFile(options: UploadOptions): Promise<any> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const formData = new FormData()
    formData.append(options.name || 'file', options.file)

    if (options.data) {
      for (const [key, val] of Object.entries(options.data)) {
        formData.append(key, val)
      }
    }

    xhr.open('POST', options.url)

    if (options.headers) {
      for (const [key, val] of Object.entries(options.headers)) {
        xhr.setRequestHeader(key, val)
      }
    }

    if (options.withCredentials) {
      xhr.withCredentials = true
    }

    if (options.signal) {
      options.signal.addEventListener('abort', () => xhr.abort())
    }

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && options.onProgress) {
        options.onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText))
        } catch {
          resolve(xhr.responseText)
        }
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`))
      }
    }

    xhr.upload.onerror = () => reject(new Error('Upload failed'))
    xhr.upload.onabort = () => reject(new Error('Upload aborted'))
    xhr.onerror = () => reject(new Error('Network error'))
    xhr.send(formData)
  })
}

/**
 * 将文件大小转为可读字符串
 * @param bytes - 文件字节数
 * @returns 可读文件大小字符串
 * @example getFileSizeStr(1024) // '1.00 KB'
 */
export function getFileSizeStr(bytes: number): string {
  return formatFileSize(bytes)
}

/**
 * 获取文件扩展名（小写）
 * @param filename - 文件名
 * @returns 扩展名，含 . 前缀
 * @example getFileExtension('image.jpg') // '.jpg'
 */
export function getFileExtension(filename: string): string {
  const idx = filename.lastIndexOf('.')
  return idx >= 0 ? filename.slice(idx).toLowerCase() : ''
}

/**
 * 判断文件类型是否符合
 * @param filename - 文件名
 * @param types - 允许的类型列表，如 ['.jpg', '.png']
 * @returns 是否匹配
 * @example isFileType('photo.jpg', ['.jpg', '.png']) // true
 */
export function isFileType(filename: string, types: string[]): boolean {
  const ext = getFileExtension(filename)
  return types.includes(ext)
}

/**
 * 将 File 对象读取为 DataURL
 * @param file - 文件对象
 * @returns DataURL 字符串
 */
export function readFileAsDataURL(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Failed to read file as DataURL'))
    reader.readAsDataURL(file)
  })
}

/**
 * 将 File 对象读取为文本
 * @param file - 文件对象
 * @returns 文件文本内容
 */
export function readFileAsText(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Failed to read file as text'))
    reader.readAsText(file)
  })
}

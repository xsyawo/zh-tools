import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

// ==================== 业务类型定义 ====================

/** 后端响应通用结构 */
export interface BackendResponse<T = any> {
  code: number | string
  data: T
  message: string
  [key: string]: any
}

/** createRequest 配置 */
export interface RequestConfig {
  /** HTTP 实例（必传），如 axios.create(...) 的返回值 */
  axios: AxiosInstance
  /** 基础路径 */
  baseURL?: string
  /** 超时时间（毫秒），默认 10000 */
  timeout?: number
  /** 获取 token 的方法 */
  getToken?: () => string | null
  /** token 放在请求头的哪个字段，默认 'Authorization' */
  tokenHeaderName?: string
  /** token 前缀，默认 'Bearer ' */
  tokenPrefix?: string
  /** 业务成功的 code 值，默认 0 */
  successCode?: number | string
  /** 从后端响应中提取数据的路径，默认 'data' */
  dataPath?: string
  /** 从后端响应中提取 code 的路径，默认 'code' */
  codePath?: string
  /** 从后端响应中提取 message 的路径，默认 'message' */
  messagePath?: string
  /** 401 无权限回调（跳转登录页等） */
  onUnauthorized?: () => void
  /**
   * 全局错误回调（用于日志、统计等）
   * 如果想显示 UI 消息提示，用下方的 `message` 配置
   */
  onError?: (message: string, code: number | string) => void
  /**
   * UI 消息提示方法 — 传入任意 (msg, type) => void 函数
   * 传入后，发生错误时自动调用，type 根据 code 自动判断
   *
   * @example
   *
   * // Element Plus
   * message: (msg, type) => ElMessage({ message: msg, type })
   *
   * // Ant Design Vue
   * message: (msg, type) => message[type](msg)
   *
   * // Naive UI
   * message: (msg, type) => window.$message[type](msg)
   *
   * // 自定义函数
   * message: (msg, type) => myNotification.show({ content: msg, type })
   */
  message?: (message: string, type: 'success' | 'warning' | 'info' | 'error') => void
  /** 自定义请求拦截器（在默认逻辑之后执行） */
  requestInterceptor?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>
  /** 自定义响应拦截器（在默认逻辑之后执行） */
  responseInterceptor?: (response: AxiosResponse) => any
  /** 自定义请求头 */
  headers?: Record<string, string>
}

/** 下载选项 */
export interface DownloadOptions {
  /** 文件名 */
  fileName?: string
  /** 从响应头中提取文件名的 key，默认 'content-disposition' */
  fileNameKey?: string
  /** 下载进度回调（0-100） */
  onProgress?: UploadProgressCallback
}

/** 上传进度回调 */
export type UploadProgressCallback = (percent: number) => void

/** createRequest 返回的实例 */
export interface RequestInstance {
  get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T>
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
  upload<T = any>(url: string, file: File | Blob, name?: string, data?: Record<string, any>, onProgress?: UploadProgressCallback, config?: AxiosRequestConfig): Promise<T>
  download(url: string, options?: DownloadOptions, data?: any, config?: AxiosRequestConfig): Promise<void>
  /** 获取底层 HTTP 实例 */
  getAxios: () => AxiosInstance
  /** 自定义请求 */
  request<T = any>(config: AxiosRequestConfig): Promise<T>
}

// ==================== 工具函数 ====================

/** 安全地按路径取值 */
function getValue(obj: any, path: string, defaultValue?: any): any {
  const keys = path.split('.')
  let result = obj
  for (const key of keys) {
    if (result === null || result === undefined) return defaultValue
    result = result[key]
  }
  return result === undefined ? defaultValue : result
}

/**
 * 从 Content-Disposition 中提取文件名
 * @example getFileNameFromDisposition('attachment; filename="report.xlsx"') // 'report.xlsx'
 */
function getFileNameFromDisposition(disposition: string): string | null {
  const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
  if (match) {
    try {
      return decodeURIComponent(match[1].replace(/['"]/g, ''))
    } catch {
      return match[1].replace(/['"]/g, '')
    }
  }
  return null
}

/**
 * 触发文件下载
 * @param blob - 文件 Blob
 * @param fileName - 下载文件名
 */
function triggerDownload(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * 从错误对象中提取可读的错误消息
 * @param error - 捕获的错误对象（可能是 AxiosError、Error 或 string）
 * @returns 可读的错误消息
 */
function getErrorMessage(error: any): string {
  if (typeof error === 'string') return error

  // 服务端返回了错误响应
  if (error.response?.data) {
    const data = error.response.data
    if (typeof data === 'string') return data
    if (data.message) return data.message
    if (data.msg) return data.msg
    if (data.error) return typeof data.error === 'string' ? data.error : String(data.error)
  }

  // 请求发出去了但没收到响应（网络超时、断网等）
  if (error.code === 'ECONNABORTED') return '请求超时，请稍后重试'
  if (error.code === 'ERR_NETWORK') return '网络异常，请检查网络连接'

  // 普通 Error 对象
  if (error.message) return error.message

  // 兜底
  return '未知错误'
}

/**
 * 根据错误码获取建议的消息提示类型
 * 401/403 → warning，其余 → error
 */
function getMessageType(code: number | string): 'success' | 'warning' | 'info' | 'error' {
  const num = Number(code)
  if (num === 401 || num === 403) return 'warning'
  if (num === 200) return 'success'
  return 'error'
}

// ==================== 工厂函数 ====================

/**
 * 创建请求实例
 *
 * @description 封装 HTTP 客户端，自动处理 token 注入、响应解包、错误处理、401 跳转等
 * @param config - 请求配置
 * @returns 请求实例
 *
 * @example
 * ```ts
 * import axios from 'axios'
 * import { createRequest } from 'zh-tools'
 *
 * const request = createRequest({
 *   axios: axios.create({ baseURL: '/api' }),
 *   getToken: () => localStorage.getItem('token'),
 *   onUnauthorized: () => { window.location.href = '/login' },
 * })
 *
 * // GET 请求
 * const users = await request.get('/users', { page: 1 })
 *
 * // POST 请求
 * const result = await request.post('/users', { name: '张三' })
 *
 * // 上传
 * await request.upload('/upload', fileInput.files[0])
 *
 * // 下载
 * await request.download('/export/excel', { fileName: '报表.xlsx' })
 * ```
 */
export function createRequest(config: RequestConfig): RequestInstance {
  const {
    axios: instance,
    getToken,
    tokenHeaderName = 'Authorization',
    tokenPrefix = 'Bearer ',
    successCode = 0,
    dataPath = 'data',
    codePath = 'code',
    messagePath = 'message',
    onUnauthorized,
    onError,
    message: showMessage,
    requestInterceptor,
    responseInterceptor,
    headers,
  } = config

  // ==================== 请求拦截器 ====================

  instance.interceptors.request.use(
    (reqConfig: InternalAxiosRequestConfig) => {
      // 注入 token
      if (getToken) {
        const token = getToken()
        if (token) {
          reqConfig.headers[tokenHeaderName] = `${tokenPrefix}${token}`
        }
      }

      // 合并自定义请求头
      if (headers) {
        Object.assign(reqConfig.headers, headers)
      }

      // 自定义请求拦截器（在默认逻辑之后执行）
      if (requestInterceptor) {
        return requestInterceptor(reqConfig)
      }

      return reqConfig
    },
    (error: any) => Promise.reject(error),
  )

  // ==================== 响应拦截器 ====================

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // 自定义响应拦截器（优先级最高）
      if (responseInterceptor) {
        return responseInterceptor(response)
      }

      const res = response.data
      const code = getValue(res, codePath)
      const msg = getValue(res, messagePath) || '未知错误'

      if (code === undefined || code === null) {
        // 后端没有返回 code，直接返回 response.data
        return res
      }

      if (code === successCode) {
        // 业务成功，解包返回实际数据
        const data = getValue(res, dataPath)
        return data !== undefined ? data : res
      }

      // 业务失败
      if (code === 401) {
        onUnauthorized?.()
      }

      onError?.(msg, code)
      showMessage?.(msg, getMessageType(code))
      return Promise.reject(new Error(msg))
    },
    (error: { response: { status: any } }) => {
      // HTTP 层面错误（网络超时、500 等）
      const status = error.response?.status
      const msg = getErrorMessage(error)

      if (status === 401) {
        onUnauthorized?.()
      }

      onError?.(msg, status || 0)
      showMessage?.(msg, getMessageType(status || 0))
      return Promise.reject(error)
    },
  )

  // ==================== 请求方法 ====================

  /**
   * GET 请求
   * @param url - 接口地址
   * @param params - URL 参数
   * @param config - 额外 axios 配置
   */
  function get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
    return instance.get(url, { params, ...config }) as any
  }

  /**
   * POST 请求
   * @param url - 接口地址
   * @param data - 请求体
   * @param config - 额外 axios 配置
   */
  function post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return instance.post(url, data, config) as any
  }

  /**
   * PUT 请求
   * @param url - 接口地址
   * @param data - 请求体
   * @param config - 额外 axios 配置
   */
  function put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return instance.put(url, data, config) as any
  }

  /**
   * DELETE 请求
   * @param url - 接口地址
   * @param config - 额外 axios 配置
   */
  function del<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return instance.delete(url, config) as any
  }

  /**
   * 文件上传
   * @param url - 上传地址
   * @param file - 文件对象
   * @param name - 表单字段名，默认 'file'
   * @param data - 额外表单数据
   * @param onProgress - 上传进度回调（0-100）
   * @param config - 额外 axios 配置
   */
  function upload<T = any>(
    url: string,
    file: File | Blob,
    name: string = 'file',
    data?: Record<string, any>,
    onProgress?: UploadProgressCallback,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const formData = new FormData()
    formData.append(name, file)

    if (data) {
      for (const [key, val] of Object.entries(data)) {
        formData.append(key, val)
      }
    }

    return instance.post(url, formData, {
      onUploadProgress: onProgress
        ? (e: { total?: number; loaded: number }) => {
            if (e.total) {
              onProgress(Math.round((e.loaded / e.total) * 100))
            }
          }
        : undefined,
      ...config,
    }) as any
  }

  /**
   * 文件下载
   * @param url - 下载地址
   * @param options - 下载选项（fileName、onProgress 等）
   * @param data - POST 请求体（如果传了就用 POST 下载，否则用 GET）
   * @param config - 额外 axios 配置
   *
   * @example
   * // 基础下载
   * await request.download('/export/excel', { fileName: '报表.xlsx' })
   *
   * // 带进度
   * await request.download('/download/large', {
   *   fileName: '大文件.zip',
   *   onProgress: (pct) => console.log(`下载进度: ${pct}%`),
   * })
   */
  async function download(
    url: string,
    options?: DownloadOptions,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<void> {
    const onProgress = options?.onProgress
    const response = data
      ? await instance.post(url, data, {
          responseType: 'blob',
          onDownloadProgress: onProgress
            ? (e: { total?: number; loaded: number }) => {
                if (e.total) {
                  onProgress(Math.round((e.loaded / e.total) * 100))
                }
              }
            : undefined,
          ...config,
        })
      : await instance.get(url, {
          responseType: 'blob',
          params: config?.params,
          onDownloadProgress: onProgress
            ? (e: { total?: number; loaded: number }) => {
                if (e.total) {
                  onProgress(Math.round((e.loaded / e.total) * 100))
                }
              }
            : undefined,
          ...config,
        })

    const blob = response.data as Blob

    // 确定文件名
    let fileName = options?.fileName || 'download'

    // 从 Content-Disposition 中提取
    if (!options?.fileName) {
      const disposition = response.headers?.[options?.fileNameKey || 'content-disposition']
      if (disposition) {
        const extracted = getFileNameFromDisposition(disposition)
        if (extracted) {
          fileName = extracted
        }
      }
    }

    triggerDownload(blob, fileName)
  }

  /**
   * 自定义请求
   * @param config - 请求配置（透传给底层 HTTP 实例）
   */
  function request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return instance.request(config) as any
  }

  /** 获取底层 HTTP 实例 */
  function getAxios(): AxiosInstance {
    return instance
  }

  return {
    get,
    post,
    put,
    delete: del,
    upload,
    download,
    getAxios,
    request,
  }
}

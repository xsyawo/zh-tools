# zh-tools 后台管理工具库 — 设计文档

## 概述

`zh-tools` 是一个面向后台管理系统（Admin）的前端常用工具方法库，使用 TypeScript 编写，支持 ESM / CJS 双格式导出。所有方法均包含完整的 TypeScript 类型标注和 JSDoc 注释，确保 IDE 中鼠标悬停时显示参数类型和说明。

## 技术规格

- **语言**: TypeScript (strict mode)
- **构建**: Vite (vite build) + tsc (类型声明)
- **格式**: ESM (`dist/zh-tools.js`) + CJS (`dist/zh-tools.cjs`) + 类型声明 (`dist/index.d.ts`)
- **目标**: ES2020
- **运行时**: 浏览器环境（依赖 DOM API）
- **测试**: Vitest
- **代码风格**: 统一 JSDoc + TypeScript 类型

## 模块结构

```
src/
├── index.ts              # 入口文件，导出所有公共方法
├── date/                 # 日期时间处理
│   └── index.ts
├── tree/                 # 树形数据处理
│   └── index.ts
├── auth/                 # 权限校验
│   └── index.ts
├── validate/             # 表单校验
│   └── index.ts
├── file/                 # 文件上传下载
│   └── index.ts
├── image/                # 图片处理
│   └── index.ts
├── storage/              # 存储封装
│   └── index.ts
├── object/               # 对象工具
│   └── index.ts
├── format/               # 格式化
│   └── index.ts
└── url/                  # URL 参数处理
    └── index.ts
```

## 模块详细设计

### 1. date — 日期时间处理

所有方法均接受 `Date | string | number` 类型输入，内部统一转为 Date 对象处理。

```typescript
/**
 * 日期格式化
 * @param date - 日期对象/时间戳/日期字符串
 * @param fmt - 格式模板，如 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期字符串
 * @example formatDate(new Date(), 'YYYY-MM-DD') // '2026-05-31'
 */
function formatDate(date: Date | string | number, fmt: string): string

/**
 * 格式化为完整日期时间字符串
 */
function formatDateTime(date: Date | string | number): string

/**
 * 格式化为相对时间描述（刚刚、X分钟前、X小时前、昨天、X天前）
 */
function formatRelative(date: Date | string | number): string

/**
 * 获取当天开始时间 00:00:00.000
 */
function getStartOfDay(date: Date | string | number): Date

/**
 * 获取当天结束时间 23:59:59.999
 */
function getEndOfDay(date: Date | string | number): Date

/**
 * 获取常用日期范围
 * @param type - 'today' | 'yesterday' | 'week' | 'month' | 'year'
 * @returns [开始日期, 结束日期]
 */
function getDateRange(type: DateRangeType): [Date, Date]

/**
 * 计算两个日期之间的天数差
 */
function diffDays(date1: Date | string | number, date2: Date | string | number): number
```

### 2. tree — 树形数据处理

```typescript
interface TreeOptions {
  idKey?: string          // 节点ID字段名，默认 'id'
  parentIdKey?: string    // 父节点ID字段名，默认 'parentId'
  childrenKey?: string    // 子节点字段名，默认 'children'
  rootValue?: any         // 根节点的parentId值，默认 null | 0 | ''
}

/**
 * 将扁平列表转为树形结构
 */
function listToTree<T extends Record<string, any>>(list: T[], options?: TreeOptions): TreeNode<T>[]

/**
 * 将树形结构展平为列表（深度优先）
 */
function treeToList<T>(tree: TreeNode<T>[], options?: TreeOptions): T[]

/**
 * 递归查找树节点，返回第一个匹配的节点
 */
function findTreeNode<T>(tree: TreeNode<T>[], predicate: (node: TreeNode<T>) => boolean): TreeNode<T> | null

/**
 * 查找节点路径（从根到目标节点），用于面包屑导航
 */
function findTreePath<T>(tree: TreeNode<T>[], predicate: (node: TreeNode<T>) => boolean): TreeNode<T>[]

/**
 * 过滤树节点（保留层级关系，子节点匹配则保留父节点）
 */
function filterTree<T>(tree: TreeNode<T>[], predicate: (node: TreeNode<T>) => boolean): TreeNode<T>[]

/**
 * 遍历树节点，广度优先
 */
function walkTree<T>(tree: TreeNode<T>[], fn: (node: TreeNode<T>) => void): void

/**
 * 映射树节点生成新树
 */
function mapTree<T, R>(tree: TreeNode<T>[], fn: (node: TreeNode<T>) => R): R[]
```

### 3. auth — 权限校验

```typescript
/**
 * 判断是否有某个或某些权限
 * @param value - 权限标识（单个字符串或字符串数组）
 * @param permissions - 用户拥有的权限列表
 * @returns boolean
 */
function hasPermission(value: string | string[], permissions: string[]): boolean

/**
 * 判断是否为某角色
 */
function hasRole(value: string | string[], roles: string[]): boolean

/**
 * 判断是否拥有所有指定权限（AND 逻辑）
 */
function hasAllPermissions(values: string[], permissions: string[]): boolean

/**
 * 判断是否拥有任一权限（OR 逻辑）
 */
function hasAnyPermission(values: string[], permissions: string[]): boolean
```

### 4. validate — 表单校验

```typescript
/** 校验手机号（支持所有运营商号段） */
function isPhone(val: string): boolean

/** 校验邮箱地址 */
function isEmail(val: string): boolean

/** 校验身份证号（18位，含校验位算法验证） */
function isIdCard(val: string): boolean

/** 校验 URL */
function isUrl(val: string): boolean

/** 校验车牌号（支持新能源绿牌和普通蓝牌） */
function isLicensePlate(val: string): boolean

/** 判断值是否为空（null / undefined / 空字符串 / 空数组 / 空对象） */
function isEmpty(val: any): boolean

/** 判断是否纯中文字符 */
function isChinese(val: string): boolean

/**
 * 判断是否为合法数字（支持精度校验）
 * @param val - 要校验的值
 * @param decimals - 可选，限制小数位数
 */
function isDecimal(val: string | number, decimals?: number): boolean
```

### 5. file — 文件上传下载

```typescript
interface UploadOptions {
  url: string                          // 上传地址
  file: File | Blob                    // 文件数据
  name?: string                        // 表单字段名，默认 'file'
  data?: Record<string, any>           // 额外表单数据
  headers?: Record<string, string>     // 自定义请求头
  withCredentials?: boolean            // 是否携带凭证
  onProgress?: (percent: number) => void  // 上传进度回调（0-100）
  signal?: AbortSignal                 // 取消信号
}

/**
 * 通过 URL 下载文件（创建 a 标签模拟点击）
 */
function downloadByUrl(url: string, filename?: string): void

/**
 * 通过 Blob 下载文件
 */
function downloadByBlob(blob: Blob, filename: string): void

/**
 * 文件上传（基于 XMLHttpRequest，支持进度监听）
 * @returns Promise 返回服务器响应数据
 */
function uploadFile(options: UploadOptions): Promise<any>

/** 将文件大小转为可读字符串，如 '1.5 MB' */
function getFileSizeStr(bytes: number): string

/** 获取文件扩展名（小写） */
function getFileExtension(filename: string): string

/**
 * 判断文件类型是否符合
 * @param types - 允许的类型列表，如 ['.jpg', '.png']
 */
function isFileType(filename: string, types: string[]): boolean

/** 将 File 对象读取为 DataURL */
function readFileAsDataURL(file: File | Blob): Promise<string>

/** 将 File 对象读取为文本 */
function readFileAsText(file: File | Blob): Promise<string>
```

### 6. image — 图片处理

```typescript
interface CompressOptions {
  maxWidth?: number     // 最大宽度，默认 1920
  maxHeight?: number    // 最大高度
  quality?: number      // 图片质量 0-1，默认 0.8
  format?: string       // 输出格式，默认 'image/jpeg'
}

/**
 * 图片压缩
 * @returns 压缩后的 Blob 对象
 */
function compressImage(file: File | Blob, options?: CompressOptions): Promise<Blob>

/** 图片转 Base64（通过 Canvas 绘制） */
function imageToBase64(img: HTMLImageElement): string

/**
 * 获取图片原始宽高
 * @returns { width: number, height: number }
 */
function getImageDimensions(file: File | Blob): Promise<{ width: number; height: number }>

/**
 * 生成图片缩略图
 * @param maxSize - 缩略图最大边长
 * @returns DataURL 字符串
 */
function createImageThumbnail(file: File | Blob, maxSize: number): Promise<string>
```

### 7. storage — 存储封装

```typescript
interface CookieOptions {
  expires?: number | Date   // 过期天数或具体日期
  path?: string             // 路径，默认 '/'
  domain?: string           // 域名
  secure?: boolean          // 仅 HTTPS
}

// localStorage 封装（自动 JSON 序列化/反序列化）
function getLocal<T = any>(key: string): T | null
function setLocal(key: string, value: any): void
function removeLocal(key: string): void
function clearLocal(): void

// sessionStorage 封装
function getSession<T = any>(key: string): T | null
function setSession(key: string, value: any): void
function removeSession(key: string): void
function clearSession(): void

// Cookie 操作
function getCookie(key: string): string | null
function setCookie(key: string, value: string, options?: CookieOptions): void
function removeCookie(key: string, options?: Omit<CookieOptions, 'expires'>): void
```

### 8. object — 对象工具

```typescript
/**
 * 深拷贝
 * 支持 Date、RegExp、Map、Set、数组、普通对象
 */
function deepClone<T>(obj: T): T

/**
 * 深度合并对象（类似 Object.assign 的深度版本）
 * 数组会进行合并而非替换
 */
function deepMerge<T extends Record<string, any>>(target: T, ...sources: Partial<T>[]): T

/** 排除指定字段 */
function omit<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>

/** 选取指定字段 */
function pick<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>

/**
 * 清空对象属性值
 * @param keepKeys - 保留这些字段不清空
 * 字符串属性清空为 ''，数字为 0，布尔为 false，数组为 []，对象为 {}
 */
function clearObj<T extends Record<string, any>>(obj: T, keepKeys?: (keyof T)[]): T

/** 判断是否纯对象（{} 或 new Object()） */
function isPlainObject(val: any): val is Record<string, any>

/**
 * 按路径安全取值
 * @example get(obj, 'a.b.c') => obj.a.b.c
 */
function get<T = any>(obj: any, path: string, defaultValue?: T): T | undefined

/**
 * 按路径设置值（自动创建中间对象）
 */
function set(obj: Record<string, any>, path: string, value: any): void
```

### 9. format — 数据格式化

```typescript
/**
 * 金额格式化，千分位加逗号
 * @example formatMoney(12345.6) // '12,345.60'
 */
function formatMoney(value: number | string, decimals?: number): string

/** 百分比格式化 */
function formatPercent(value: number | string): string

/** 手机号脱敏 138****1234 */
function formatMobile(mobile: string): string

/** 身份证号脱敏 */
function formatIdCard(id: string): string

/** 银行卡号格式化（每4位加空格） */
function formatBankCard(card: string): string

/** 文件大小格式化（复用 file 模块的 getFileSizeStr） */
function formatFileSize(bytes: number): string
```

### 10. url — URL 参数处理

```typescript
/** 获取指定 URL 参数值 */
function getUrlParam(key: string, search?: string): string | null

/** 获取当前 URL 所有参数 */
function getAllUrlParams(search?: string): Record<string, string>

/**
 * 设置 URL 参数（追加或覆盖）
 * @returns 新的 URL 字符串
 */
function setUrlParam(url: string, key: string, value: string): string

/**
 * 移除 URL 参数
 * @returns 新的 URL 字符串
 */
function removeUrlParam(url: string, key: string): string

/** 对象转 URL 参数字符串 */
function objToUrlParams(obj: Record<string, any>): string

/** URL 参数字符串转对象 */
function urlParamsToObj(search: string): Record<string, string>
```

## 编码规范

1. **所有导出函数**必须包含 JSDoc 注释（描述、@param、@returns、@example）
2. **TypeScript 类型**必须显式标注，避免隐式 `any`
3. **单元测试**每个方法至少包含 1 个基础用例
4. **文件名**使用 kebab-case（但模块内部 index.ts 使用一致导出名）
5. **导入路径**模块内使用相对路径导入

## 开发计划

按以下顺序实现各个模块（从无依赖到有依赖）：

1. `validate` — 纯字符串校验，无依赖
2. `object` — 纯对象操作，无依赖
3. `format` — 纯格式化，无依赖
4. `url` — 纯 URL 操作，依赖 window.location
5. `date` — 日期处理，无依赖
6. `tree` — 树形数据，无依赖
7. `storage` — 存储封装，依赖 Web Storage API
8. `auth` — 权限校验，无依赖
9. `file` — 上传下载，依赖 DOM
10. `image` — 图片处理，依赖 Canvas API
11. `index.ts` — 入口文件，聚合所有模块导出

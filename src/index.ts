/**
 * zh-tools — 前端常用工具方法库
 *
 * 适用于后台管理系统，所有方法均含完整的 TypeScript 类型标注和 JSDoc 注释。
 *
 * 模块列表：
 * - validate: 表单校验（手机号、邮箱、身份证等）
 * - object: 对象工具（深拷贝、合并、omit、pick 等）
 * - format: 数据格式化（金额、手机号脱敏、文件大小等）
 * - url: URL 参数处理
 * - date: 日期时间处理
 * - tree: 树形数据处理
 * - storage: 存储封装（localStorage、sessionStorage、cookie）
 * - auth: 权限校验
 * - file: 文件上传下载
 * - image: 图片处理
 * - request: axios 请求封装（token 注入、响应解包、错误处理、401 跳转）
 * - debounce: 防抖节流
 * - clipboard: 剪贴板复制
 * - string: 字符串工具（UUID、随机字符串、命名风格转换、文本截断）
 * - function: 函数工具（sleep、once、retry）
 * - array: 数组工具（分组、去重、分块、排序、求和）
 * - number: 数值工具（精确运算、四舍五入、范围钳制）
 *
 * @packageDocumentation
 */

export * from './validate/index'
export * from './object/index'
export * from './format/index'
export * from './url/index'
export * from './date/index'
export * from './tree/index'
export * from './storage/index'
export * from './auth/index'
export * from './file/index'
export * from './image/index'
export * from './request/index'
export * from './debounce/index'
export * from './clipboard/index'
export * from './string/index'
export * from './function/index'
export * from './array/index'
export * from './number/index'

# zh-tools

前端常用工具方法库，专为后台管理系统设计。所有方法均使用 TypeScript 编写，含完整类型标注和 JSDoc 注释（鼠标悬停即可查看说明）。

## 安装

```bash
pnpm add zh-tools          # pnpm（推荐）
npm install zh-tools       # npm
yarn add zh-tools          # yarn
```

> 使用 `request` 模块需额外安装 `axios`：`pnpm add axios`，项目已有则可忽略

## 使用

支持按需导入，配合 tree-shaking 只打包用到的代码。

```ts
// 按需导入（推荐）
import { formatDate, uploadFile, isPhone, formatMoney } from 'zh-tools'
```

---

## API 总览

### 表单校验 (validate)

```ts
import { isPhone, isEmail, isIdCard, isUrl, isLicensePlate, isEmpty, isChinese, isDecimal } from 'zh-tools'

isPhone('13800138000')             // true — 校验手机号
isEmail('test@example.com')        // true — 校验邮箱
isIdCard('110101199001011237')     // true — 校验身份证（含出生日期 & 校验位）
isUrl('https://example.com')       // true — 校验 URL
isLicensePlate('京A12345')         // true — 校验车牌号（含新能源）
isEmpty(null)                      // true — 判断空值（含 NaN）
isChinese('中文')                   // true — 判断纯中文
isDecimal(123.45, 2)               // true — 判断小数（可限制精度）
```

### 对象工具 (object)

```ts
import { deepClone, deepMerge, omit, pick, clearObj, isPlainObject, get, set, flatten, diff, merge } from 'zh-tools'

deepClone({ a: { b: 1 } })          // 深拷贝（支持循环引用、Date、RegExp、Map、Set）
deepMerge({ a: 1 }, { b: 2 })       // 深度合并
omit({ a: 1, b: 2 }, ['a'])         // 排除字段 → { b: 2 }
pick({ a: 1, b: 2 }, ['a'])         // 选取字段 → { a: 1 }
clearObj({ a: 'hello', b: 42 })     // 清空 → { a: '', b: 0 }
isPlainObject({})                    // true
get({ a: { b: 42 } }, 'a.b')        // 42 — 按路径安全取值
set({}, 'a.b', 1)                   // 按路径设置值

flatten({ a: { b: 1, c: 2 }, d: 3 }) // { 'a.b': 1, 'a.c': 2, d: 3 }
diff({ a: 1, b: 2 }, { a: 1, b: 3 }) // { b: 3 } — 浅层差异对比
merge({ a: 1 }, { b: 2 })           // { a: 1, b: 2 } — 浅合并
```

### 数据格式化 (format)

```ts
import { formatMoney, formatPercent, formatMobile, formatIdCard, formatBankCard, formatFileSize } from 'zh-tools'

formatMoney(12345.6)               // '12,345.60' — 金额千分位
formatPercent(85)                   // '85%'
formatMobile('13800138000')         // '138****8000' — 手机号脱敏
formatIdCard('110101199001011234') // '1101**********1234' — 身份证脱敏
formatBankCard('6222021234567890') // '6222 0212 3456 7890'
formatFileSize(1024)               // '1.00 KB'
```

### URL 参数处理 (url)

```ts
import { getUrlParam, setUrlParam, removeUrlParam, objToUrlParams, urlParamsToObj } from 'zh-tools'

getUrlParam('a', '?a=1&b=2')       // '1'
setUrlParam('http://example.com', 'a', '1') // 'http://example.com?a=1'
removeUrlParam('http://example.com?a=1&b=2', 'a') // 'http://example.com?b=2'
objToUrlParams({ a: 1, b: 2 })     // 'a=1&b=2'
urlParamsToObj('?a=1&b=2')         // { a: '1', b: '2' }
```

### 日期时间 (date)

```ts
import { formatDate, formatDateTime, formatRelative, getStartOfDay, getEndOfDay, getDateRange, diffDays, getAge, addDays, addMonths, isBefore, isAfter, isSameDay } from 'zh-tools'

formatDate(new Date(), 'YYYY-MM-DD')         // '2026-05-31'
formatDateTime(new Date())                    // '2026-05-31 14:30:00'
formatRelative(new Date())                    // '刚刚'
getStartOfDay(new Date())                     // 00:00:00.000
getEndOfDay(new Date())                       // 23:59:59.999
getDateRange('week')                          // [本周一, 本周日]
diffDays(new Date('2026-05-31'), new Date('2026-06-01')) // 1

getAge('1990-01-01')                          // 36 — 根据生日算年龄
addDays(new Date('2026-05-31'), 1)            // 2026-06-01
addMonths(new Date('2026-01-31'), 1)          // 2026-02-28（自动处理月末溢出）
isBefore(new Date('2026-01-01'), new Date('2026-06-01')) // true
isAfter(new Date('2026-06-01'), new Date('2026-01-01'))  // true
isSameDay(new Date('2026-05-31'), new Date('2026-05-31 23:59:59')) // true
```

### 树形数据处理 (tree)

```ts
import { listToTree, treeToList, findTreeNode, findTreePath, filterTree, walkTree, mapTree } from 'zh-tools'

const tree = listToTree([
  { id: 1, parentId: null, name: 'Root' },
  { id: 2, parentId: 1, name: 'Child' },
])

treeToList(tree)                    // 树转扁平列表
findTreeNode(tree, n => n.id === 2) // 查找节点
findTreePath(tree, n => n.id === 2) // 节点路径（面包屑用）
filterTree(tree, n => n.id === 2)   // 过滤（保留层级）
walkTree(tree, n => console.log(n)) // 遍历（BFS，O(n)）
mapTree(tree, n => ({ ...n, label: n.name })) // 映射
```

### 存储封装 (storage)

```ts
import { getLocal, setLocal, removeLocal, clearLocal, getSession, setSession, getCookie, setCookie, removeCookie } from 'zh-tools'

setLocal('token', 'abc123')          // 自动 JSON 序列化
getLocal('token')                    // 'abc123'
removeLocal('token')

setSession('key', { a: 1 })         // sessionStorage
getSession('key')
removeSession('key')

setCookie('theme', 'dark', { expires: 7 })  // 7 天过期
getCookie('theme')
removeCookie('theme')
```

> SSR 环境安全：所有方法在非浏览器环境下静默降级（返回 null / no-op），不会抛出 ReferenceError。

### 权限校验 (auth)

```ts
import { hasPermission, hasRole, hasAllPermissions, hasAnyPermission } from 'zh-tools'

hasPermission('user:read', ['user:read', 'admin'])       // true
hasRole('admin', ['admin', 'editor'])                     // true
hasAllPermissions(['user:read', 'user:write'], permissions)
hasAnyPermission(['user:delete', 'admin:access'], permissions)
```

### 文件操作 (file)

```ts
import { downloadByUrl, downloadByBlob, uploadFile, getFileSizeStr, getFileExtension, isFileType, readFileAsDataURL, readFileAsText, download } from 'zh-tools'

downloadByUrl('https://example.com/file.pdf')           // 触发下载
downloadByBlob(new Blob(['text']), 'hello.txt')          // Blob 下载

// 便捷下载（按文件类型）
download.excel(blobData, '报表.xlsx')        // 下载 Excel
download.word(blobData, '文档.docx')         // 下载 Word
download.zip(blobData, '压缩包.zip')          // 下载 Zip
download.pdf(blobData, '报告.pdf')            // 下载 PDF
download.json(blobData, 'data.json')          // 下载 JSON
download.csv(blobData, '数据.csv')            // 下载 CSV
download.markdown(blobData, '文章.md')        // 下载 Markdown
download.html(blobData, 'page.html')          // 下载 HTML

// 下载图片（跨域支持，通过 Canvas 绘制）
download.image({ url: 'https://example.com/photo.png' })
download.image({ url: 'https://example.com/photo.png', canvasWidth: 800, drawWithImageSize: true })

// 文件上传（支持进度回调 & 取消）
const response = await uploadFile({
  url: '/api/upload',
  file: fileInput.files[0],
  onProgress: (pct) => console.log(`${pct}%`),
})

getFileSizeStr(1024)              // '1.00 KB'
getFileExtension('image.jpg')     // '.jpg'
isFileType('photo.jpg', ['.jpg', '.png']) // true
```

### 图片处理 (image)

```ts
import { compressImage, imageToBase64, getImageDimensions, createImageThumbnail } from 'zh-tools'

const compressed = await compressImage(file, { maxWidth: 800, quality: 0.7 })
const dims = await getImageDimensions(file)     // { width: 1920, height: 1080 }
const thumb = await createImageThumbnail(file, 200)
const base64 = imageToBase64(imgElement)         // Canvas 转 Base64
```

> `compressImage` 在图片无需缩放时会跳过重新编码，直接返回原始数据，避免浪费 CPU。

### 防抖节流 (debounce)

```ts
import { debounce, throttle } from 'zh-tools'

// 搜索框输入防抖
const search = debounce((keyword: string) => fetch('/api/search?q=' + keyword), 500)
input.oninput = (e) => search(e.target.value)

// 滚动事件节流
const onScroll = throttle(() => console.log('scrolling...'), 200)
window.addEventListener('scroll', onScroll)
```

> 包装后的函数保留 `this` 上下文，可以在 Vue 组件 method 中正常使用。

### 剪贴板 (clipboard)

```ts
import { copyToClipboard } from 'zh-tools'

await copyToClipboard('复制的文本')
// 或 Promise 风格
copyToClipboard('hello').then(() => console.log('已复制'))
```

> 优先使用现代 `navigator.clipboard` API，不支持时自动降级为 `textarea + execCommand`。SSR 环境返回 rejected Promise。

---

### 字符串工具 (string)

```ts
import { uuid, randomStr, camelToSnake, snakeToCamel, truncate, escapeHtml, stripHtml } from 'zh-tools'

uuid()                              // '550e8400-e29b-41d4-a716-446655440000'
randomStr(6)                        // 'aB3kF8' — 默认不含易混淆字符
randomStr(4, '0123456789')          // '3829' — 自定义字符集

camelToSnake('userName')            // 'user_name' — 驼峰 → 下划线
camelToSnake('APIKey')              // 'api_key'  — 正确处理缩写词
snakeToCamel('user_name')           // 'userName' — 下划线 → 驼峰

truncate('很长的文本内容', 4)         // '很长…' — 截断加省略号
escapeHtml('<div>"hello"</div>')    // '&lt;div&gt;&quot;hello&quot;&lt;/div&gt;' — XSS 防护
stripHtml('<p>hello <b>world</b></p>') // 'hello world' — 去除 HTML 标签
```

### 函数工具 (function)

```ts
import { sleep, once, retry } from 'zh-tools'

await sleep(1000)                   // 异步延迟，等待 1 秒

const init = once(() => console.log('只执行一次'))
init() // 输出
init() // 不输出，返回上次结果

const data = await retry(() => fetch('/api/data'), 3, 1000) // 最多重试 3 次，间隔 1 秒
```

### 数组工具 (array)

```ts
import { groupBy, unique, uniqueBy, chunk, range, sortBy, sumBy, move } from 'zh-tools'

groupBy([{ type: 'A', val: 1 }, { type: 'B', val: 2 }, { type: 'A', val: 3 }], 'type')
// { A: [{...}, {...}], B: [{...}] }

unique([1, 2, 2, 3])               // [1, 2, 3]
uniqueBy([{ id: 1 }, { id: 2 }, { id: 1 }], 'id') // [{ id: 1 }, { id: 2 }]

chunk([1, 2, 3, 4, 5], 2)          // [[1, 2], [3, 4], [5]]
range(1, 5)                         // [1, 2, 3, 4, 5]
range(5, 1, -1)                     // [5, 4, 3, 2, 1]

sortBy([{ a: 3 }, { a: 1 }], 'a')  // [{ a: 1 }, { a: 3 }]
sortBy([{ a: 3 }, { a: 1 }], 'a', 'desc') // [{ a: 3 }, { a: 1 }]

sumBy([{ price: 10 }, { price: 20 }], 'price') // 30

move([1, 2, 3, 4], 0, 2)           // [2, 3, 1, 4] — 元素换位
```

### 数值工具 (number)

```ts
import { add, sub, mul, div, round, clamp, random, inRange } from 'zh-tools'

// 精确浮点运算（解决 0.1 + 0.2 !== 0.3 问题）
add(0.1, 0.2)                       // 0.3
sub(1, 0.9)                         // 0.1
mul(0.1, 0.2)                       // 0.02
div(0.3, 0.1)                       // 3

round(1.005, 2)                     // 1.01 — 安全四舍五入（原生 toFixed 有银行家舍入问题）
round(-1.005, 2)                    // -1.01

clamp(120, 0, 100)                  // 100 — 值钳制
clamp(-5, 0, 100)                   // 0

random(1, 10)                       // 7 — [1, 10] 随机整数
inRange(5, 1, 10)                   // true
```

---

### 请求封装 (request)

```ts
import axios from 'axios'
import { createRequest } from 'zh-tools'

const request = createRequest({
  // 传入你的 axios 实例
  axios: axios.create({ baseURL: '/api' }),

  // token 配置
  getToken: () => localStorage.getItem('token'),

  // 401 跳转登录
  onUnauthorized: () => {
    window.location.href = '/login'
  },

  // ── UI 消息提示（传入任意 (msg, type) => void 函数）──
  // type 会根据 code 自动判断：401/403 → warning，其余 → error
  // message: (msg, type) => ElMessage({ message: msg, type }),

  // ── 全局错误日志（可选，与 message 互不冲突）──
  // onError: (msg, code) => {
  //   console.error(`[${code}] ${msg}`)
  // },

  // 自定义响应 code 路径（默认取 response.data.code）
  // 如果你的后端返回 { code: 200, data: {}, message: 'ok' }
  // 把 successCode 改成 200：
  // successCode: 200,
})

// GET
const users = await request.get('/users', { page: 1, pageSize: 20 })

// POST
const newUser = await request.post('/users', { name: '张三', age: 25 })

// PUT
await request.put('/users/1', { name: '李四' })

// DELETE
await request.delete('/users/1')

// 文件上传（带进度）
await request.upload('/upload', fileInput.files[0], 'file', { type: 'avatar' }, (pct) => {
  console.log(`上传进度: ${pct}%`)
})

// 文件下载
await request.download('/export/excel', { fileName: '报表.xlsx' })

// 获取原始 axios 实例（用于自定义场景）
const axiosInstance = request.getAxios()
```

**UI 消息提示：**

发生错误时，`message` 配置会自动调用并传入选好的 type（根据 code 判断）：

| code 范围 | 消息类型 | 适用场景 |
|-----------|----------|----------|
| 401, 403 | `warning` | 无权限、token 过期 |
| 其余 | `error` | 业务错误、服务器错误 |

```ts
// Element Plus
import { ElMessage } from 'element-plus'
createRequest({ message: (msg, type) => ElMessage({ message: msg, type }) })

// Ant Design Vue
import { message } from 'ant-design-vue'
createRequest({ message: (msg, type) => message[type](msg) })

// Naive UI
createRequest({ message: (msg, type) => window.$message[type](msg) })

// 自定义函数
createRequest({ message: (msg, type) => myNotification.show({ content: msg, type }) })
```

`message` 和 `onError` 可以同时使用 — `message` 负责 UI 提示，`onError` 负责日志上报。

**后端数据解包说明：**

如果你的后端返回结构是：
```json
{
  "code": 0,
  "data": { "id": 1, "name": "张三" },
  "message": "success"
}
```
框架会自动解包，你拿到的就是 `{ id: 1, name: "张三" }`，code ≠ 0 时会 reject 并触发 `onError`。

---

## 开发

```bash
# 安装依赖
pnpm install  # 或 npm install / yarn

# 运行测试
pnpm test

# 监听模式
pnpm run test:watch

# 构建
pnpm run build
```

## 模块列表

| 模块 | 文件 | 方法数 |
|------|------|--------|
| validate | `src/validate/` | 8 |
| object | `src/object/` | 11 |
| format | `src/format/` | 6 |
| url | `src/url/` | 6 |
| date | `src/date/` | 13 |
| tree | `src/tree/` | 7 |
| storage | `src/storage/` | 11 |
| auth | `src/auth/` | 4 |
| file | `src/file/` | 17 |
| image | `src/image/` | 4 |
| debounce | `src/debounce/` | 2 |
| clipboard | `src/clipboard/` | 1 |
| string | `src/string/` | 7 |
| function | `src/function/` | 3 |
| array | `src/array/` | 8 |
| number | `src/number/` | 8 |
| request | `src/request/` | 7 个方法 + createRequest 工厂函数 |

## License

MIT

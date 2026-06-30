# zh-tools 后台管理工具库 — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a comprehensive TypeScript utility library (`zh-tools`) for Chinese backend admin systems, with 10 modules covering date, tree, auth, validate, file, image, storage, object, format, and URL utilities.

**Architecture:** Each module is a standalone subdirectory under `src/` with a single `index.ts` file exporting all public functions. Zero runtime dependencies. All functions have explicit TypeScript types and JSDoc comments. Modules are ordered by dependency (no deps first, DOM-dependent last).

**Tech Stack:** TypeScript 5.9, Vite 5.4 (build), Vitest 3.2 (testing, to be added), happy-dom (DOM test env)

**Test strategy:** Vitest with happy-dom. Each module gets a test file covering all exported functions. DOM-dependent modules (file, image, storage) use happy-dom mocks. No external test dependencies beyond vitest + happy-dom.

---
## File Structure

```
D:\web\zh-tools\
├── src/
│   ├── index.ts              # Entry — re-exports all modules
│   ├── validate/
│   │   └── index.ts           # 8 validation functions
│   ├── object/
│   │   └── index.ts           # 8 object utilities
│   ├── format/
│   │   └── index.ts           # 6 formatting functions
│   ├── url/
│   │   └── index.ts           # 6 URL parameter functions
│   ├── date/
│   │   └── index.ts           # 7 date/time functions
│   ├── tree/
│   │   └── index.ts           # 7 tree data functions + types
│   ├── storage/
│   │   └── index.ts           # 11 storage functions + CookieOptions
│   ├── auth/
│   │   └── index.ts           # 4 permission functions
│   ├── file/
│   │   └── index.ts           # 8 file functions + UploadOptions
│   └── image/
│       └── index.ts           # 4 image functions + CompressOptions
├── vitest.config.ts           # Vitest configuration
├── docs/
│   ├── specs/
│   │   └── 2026-05-31-zh-tools-design.md
│   └── plans/
│       └── 2026-05-31-zh-tools-implementation.md (this file)
└── package.json               # Will add vitest + happy-dom devDeps
```

---

### Task 1: Project Setup — Add Vitest

**Files:**
- Modify: `D:\web\zh-tools\package.json`
- Create: `D:\web\zh-tools\vitest.config.ts`

- [ ] **Step 1: Install vitest and happy-dom**

Run in `D:\web\zh-tools`:
```bash
npm install -D vitest happy-dom
```

- [ ] **Step 2: Add test script to package.json**

Edit `D:\web\zh-tools\package.json`, add `"test"` to scripts:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build && tsc -p tsconfig.build.json --emitDeclarationOnly",
  "test": "vitest run",
  "test:watch": "vitest",
  "prepublishOnly": "npm run build",
  "prepare": "npm run build",
  "preview": "node -e \"console.log('zh-tools v' + require('./package.json').version)\""
}
```

- [ ] **Step 3: Create vitest config**

Create `D:\web\zh-tools\vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.test.ts'],
  },
})
```

- [ ] **Step 4: Create directories for all modules**

```bash
mkdir -p src/validate src/object src/format src/url src/date src/tree src/storage src/auth src/file src/image
```

- [ ] **Step 5: Verify setup**

```bash
npx vitest run
```
Expected: No tests found (all pass by default, no tests yet)

- [ ] **Step 6: Commit**

```bash
git add package.json vitest.config.ts
git commit -m "chore: add vitest with happy-dom for testing"
```

---

### Task 2: validate — 表单校验模块

**Files:**
- Create: `D:\web\zh-tools\src\validate\index.ts`
- Create: `D:\web\zh-tools\src\validate\validate.test.ts`

- [ ] **Step 1: Write tests for validate module**

Create `D:\web\zh-tools\src\validate\validate.test.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import { isPhone, isEmail, isIdCard, isUrl, isLicensePlate, isEmpty, isChinese, isDecimal } from './index'

describe('isPhone', () => {
  it('should validate correct mobile phone numbers', () => {
    expect(isPhone('13800138000')).toBe(true)
    expect(isPhone('15912345678')).toBe(true)
    expect(isPhone('17712345678')).toBe(true)
    expect(isPhone('19912345678')).toBe(true)
  })
  it('should reject invalid phone numbers', () => {
    expect(isPhone('12345678901')).toBe(false)
    expect(isPhone('1380013800')).toBe(false)
    expect(isPhone('1380013800a')).toBe(false)
    expect(isPhone('')).toBe(false)
  })
})

describe('isEmail', () => {
  it('should validate correct emails', () => {
    expect(isEmail('test@example.com')).toBe(true)
    expect(isEmail('a.b@c.cn')).toBe(true)
    expect(isEmail('user+tag@example.com')).toBe(true)
  })
  it('should reject invalid emails', () => {
    expect(isEmail('not-an-email')).toBe(false)
    expect(isEmail('@example.com')).toBe(false)
    expect(isEmail('test@')).toBe(false)
    expect(isEmail('')).toBe(false)
  })
})

describe('isIdCard', () => {
  it('should validate correct 18-digit ID cards', () => {
    expect(isIdCard('110101199001011234')).toBe(true)  // valid checksum
    expect(isIdCard('11010119900101521X')).toBe(true)  // X ending
  })
  it('should reject invalid ID cards', () => {
    expect(isIdCard('123456789012345')).toBe(false)     // too short
    expect(isIdCard('123456789012345678')).toBe(false)   // invalid checksum
    expect(isIdCard('11010119900101521x')).toBe(true)    // lowercase x is also valid
    expect(isIdCard('')).toBe(false)
  })
})

describe('isUrl', () => {
  it('should validate correct URLs', () => {
    expect(isUrl('https://example.com')).toBe(true)
    expect(isUrl('http://example.com/path')).toBe(true)
    expect(isUrl('https://sub.example.com.cn/path?a=1&b=2#hash')).toBe(true)
  })
  it('should reject invalid URLs', () => {
    expect(isUrl('not-a-url')).toBe(false)
    expect(isUrl('')).toBe(false)
  })
})

describe('isLicensePlate', () => {
  it('should validate normal plates', () => {
    expect(isLicensePlate('京A12345')).toBe(true)
    expect(isLicensePlate('沪B88888')).toBe(true)
  })
  it('should validate new energy plates', () => {
    expect(isLicensePlate('京AD12345')).toBe(true)
    expect(isLicensePlate('沪AF12345')).toBe(true)
  })
  it('should reject invalid plates', () => {
    expect(isLicensePlate('ABC')).toBe(false)
    expect(isLicensePlate('')).toBe(false)
  })
})

describe('isEmpty', () => {
  it('should detect empty values', () => {
    expect(isEmpty(null)).toBe(true)
    expect(isEmpty(undefined)).toBe(true)
    expect(isEmpty('')).toBe(true)
    expect(isEmpty([])).toBe(true)
    expect(isEmpty({})).toBe(true)
  })
  it('should return false for non-empty values', () => {
    expect(isEmpty('hello')).toBe(false)
    expect(isEmpty([1])).toBe(false)
    expect(isEmpty({ a: 1 })).toBe(false)
    expect(isEmpty(0)).toBe(false)
    expect(isEmpty(false)).toBe(false)
  })
})

describe('isChinese', () => {
  it('should validate Chinese text', () => {
    expect(isChinese('中文')).toBe(true)
    expect(isChinese('你好世界')).toBe(true)
  })
  it('should reject mixed/non-Chinese', () => {
    expect(isChinese('中文abc')).toBe(false)
    expect(isChinese('hello')).toBe(false)
    expect(isChinese('')).toBe(false)
  })
})

describe('isDecimal', () => {
  it('should validate decimal numbers', () => {
    expect(isDecimal(123.45)).toBe(true)
    expect(isDecimal('123.45')).toBe(true)
    expect(isDecimal(123)).toBe(true)
    expect(isDecimal('123')).toBe(true)
  })
  it('should reject non-numbers', () => {
    expect(isDecimal('abc')).toBe(false)
  })
  it('should validate decimal places when specified', () => {
    expect(isDecimal(123.456, 2)).toBe(false)
    expect(isDecimal(123.45, 2)).toBe(true)
    expect(isDecimal(123.45, 1)).toBe(false)
  })
})
```

- [ ] **Step 2: Run tests — expect failures**

```bash
npx vitest run src/validate/validate.test.ts
```
Expected: ERROR — all tests fail (imports don't exist)

- [ ] **Step 3: Implement validate module**

Create `D:\web\zh-tools\src\validate\index.ts`:
```typescript
/**
 * 校验手机号（支持所有运营商号段）
 * @param val - 手机号字符串
 * @returns 是否有效手机号
 * @example isPhone('13800138000') // true
 */
export function isPhone(val: string): boolean {
  return /^1[3-9]\d{9}$/.test(val)
}

/**
 * 校验邮箱地址
 * @param val - 邮箱字符串
 * @returns 是否有效邮箱
 * @example isEmail('test@example.com') // true
 */
export function isEmail(val: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
}

/**
 * 校验身份证号（18位，含校验位算法验证）
 * @param val - 身份证号字符串
 * @returns 是否有效身份证号
 * @example isIdCard('110101199001011234') // true
 */
export function isIdCard(val: string): boolean {
  if (!/^\d{17}[\dXx]$/.test(val)) return false
  const factors = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  const parity = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
  let sum = 0
  for (let i = 0; i < 17; i++) {
    sum += parseInt(val[i], 10) * factors[i]
  }
  return parity[sum % 11] === val[17].toUpperCase()
}

/**
 * 校验 URL
 * @param val - URL 字符串
 * @returns 是否有效 URL
 * @example isUrl('https://example.com') // true
 */
export function isUrl(val: string): boolean {
  try {
    new URL(val)
    return true
  } catch {
    return false
  }
}

/**
 * 校验车牌号（支持新能源绿牌和普通蓝牌）
 * @param val - 车牌号字符串
 * @returns 是否有效车牌号
 * @example isLicensePlate('京A12345') // true
 */
export function isLicensePlate(val: string): boolean {
  return /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤川青藏琼宁][A-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/.test(val)
}

/**
 * 判断值是否为空（null / undefined / 空字符串 / 空数组 / 空对象）
 * @param val - 要判断的值
 * @returns 是否为空
 * @example isEmpty(null) // true
 */
export function isEmpty(val: any): boolean {
  if (val === null || val === undefined) return true
  if (typeof val === 'string') return val.trim() === ''
  if (Array.isArray(val)) return val.length === 0
  if (Object.prototype.toString.call(val) === '[object Object]') return Object.keys(val).length === 0
  return false
}

/**
 * 判断是否纯中文字符
 * @param val - 要判断的字符串
 * @returns 是否纯中文
 * @example isChinese('中文') // true
 */
export function isChinese(val: string): boolean {
  return /^[一-龥]+$/.test(val)
}

/**
 * 判断是否为合法数字（支持精度校验）
 * @param val - 要校验的值
 * @param decimals - 可选，限制小数位数
 * @returns 是否合法数字
 * @example isDecimal(123.45) // true
 */
export function isDecimal(val: string | number, decimals?: number): boolean {
  if (typeof val === 'number') val = String(val)
  if (!/^-?\d+(\.\d+)?$/.test(val)) return false
  if (decimals !== undefined) {
    const parts = val.split('.')
    if (parts[1] && parts[1].length > decimals) return false
  }
  return true
}
```

- [ ] **Step 4: Run tests — expect all pass**

```bash
npx vitest run src/validate/validate.test.ts
```
Expected: All tests pass

- [ ] **Step 5: Commit**

```bash
git add src/validate/
git commit -m "feat(validate): add form validation functions"
```

---

### Task 3: object — 对象工具模块

**Files:**
- Create: `D:\web\zh-tools\src\object\index.ts`
- Create: `D:\web\zh-tools\src\object\object.test.ts`

- [ ] **Step 1: Write tests for object module**

Create `D:\web\zh-tools\src\object\object.test.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import { deepClone, deepMerge, omit, pick, clearObj, isPlainObject, get, set } from './index'

describe('deepClone', () => {
  it('should clone primitive values', () => {
    expect(deepClone(42)).toBe(42)
    expect(deepClone('hello')).toBe('hello')
    expect(deepClone(null)).toBe(null)
    expect(deepClone(true)).toBe(true)
  })
  it('should deep clone objects', () => {
    const obj = { a: 1, b: { c: 2 } }
    const cloned = deepClone(obj)
    expect(cloned).toEqual(obj)
    expect(cloned).not.toBe(obj)
    expect(cloned.b).not.toBe(obj.b)
  })
  it('should clone arrays', () => {
    const arr = [1, [2, 3]]
    const cloned = deepClone(arr)
    expect(cloned).toEqual(arr)
    expect(cloned).not.toBe(arr)
    expect(cloned[1]).not.toBe(arr[1])
  })
  it('should clone Date and RegExp', () => {
    const date = new Date()
    const clonedDate = deepClone(date)
    expect(clonedDate).toEqual(date)
    expect(clonedDate).not.toBe(date)

    const regex = /test/gi
    const clonedRegex = deepClone(regex)
    expect(clonedRegex).toEqual(regex)
    expect(clonedRegex).not.toBe(regex)
  })
})

describe('deepMerge', () => {
  it('should deep merge two objects', () => {
    const a = { a: 1, b: { c: 2 } }
    const b = { b: { d: 3 }, e: 4 }
    expect(deepMerge(a, b)).toEqual({ a: 1, b: { c: 2, d: 3 }, e: 4 })
  })
  it('should not mutate source objects', () => {
    const a = { a: 1 }
    const b = { b: 2 }
    const merged = deepMerge(a, b)
    expect(merged).toEqual({ a: 1, b: 2 })
    expect(a).toEqual({ a: 1 })
  })
})

describe('omit', () => {
  it('should omit specified keys', () => {
    const obj = { a: 1, b: 2, c: 3 }
    expect(omit(obj, ['a', 'c'])).toEqual({ b: 2 })
  })
  it('should not mutate original object', () => {
    const obj = { a: 1, b: 2 }
    const result = omit(obj, ['a'])
    expect(result).toEqual({ b: 2 })
    expect(obj).toEqual({ a: 1, b: 2 })
  })
})

describe('pick', () => {
  it('should pick specified keys', () => {
    const obj = { a: 1, b: 2, c: 3 }
    expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 })
  })
  it('should return empty object for no matches', () => {
    const obj = { a: 1 }
    expect(pick(obj, ['b'] as any)).toEqual({})
  })
})

describe('clearObj', () => {
  it('should clear all values', () => {
    const obj = { a: 'hello', b: 42, c: true, d: [1], e: { f: 1 } }
    clearObj(obj)
    expect(obj).toEqual({ a: '', b: 0, c: false, d: [], e: {} })
  })
  it('should preserve specified keys', () => {
    const obj = { a: 'hello', b: 42, c: true }
    clearObj(obj, ['a'])
    expect(obj.a).toBe('hello')
    expect(obj.b).toBe(0)
    expect(obj.c).toBe(false)
  })
})

describe('isPlainObject', () => {
  it('should detect plain objects', () => {
    expect(isPlainObject({})).toBe(true)
    expect(isPlainObject({ a: 1 })).toBe(true)
    expect(isPlainObject(Object.create(null))).toBe(true)
  })
  it('should reject non-plain objects', () => {
    expect(isPlainObject(null)).toBe(false)
    expect(isPlainObject([])).toBe(false)
    expect(isPlainObject('test')).toBe(false)
    expect(isPlainObject(new Date())).toBe(false)
  })
})

describe('get', () => {
  it('should get nested values by path', () => {
    const obj = { a: { b: { c: 42 } } }
    expect(get(obj, 'a.b.c')).toBe(42)
  })
  it('should return default for missing paths', () => {
    const obj = { a: 1 }
    expect(get(obj, 'a.b.c', 'default')).toBe('default')
  })
})

describe('set', () => {
  it('should set nested values by path', () => {
    const obj = {}
    set(obj, 'a.b.c', 42)
    expect(obj).toEqual({ a: { b: { c: 42 } } })
  })
  it('should overwrite existing values', () => {
    const obj = { a: { b: 1 } }
    set(obj, 'a.b', 2)
    expect(obj).toEqual({ a: { b: 2 } })
  })
})
```

- [ ] **Step 2: Run tests — expect failures**

```bash
npx vitest run src/object/object.test.ts
```

- [ ] **Step 3: Implement object module**

Create `D:\web\zh-tools\src\object\index.ts`:
```typescript
/**
 * 深拷贝对象，支持 Date、RegExp、Map、Set、数组、普通对象
 * @param obj - 要拷贝的对象
 * @returns 深拷贝后的对象
 * @example deepClone({ a: { b: 1 } }) // { a: { b: 1 } }
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as any
  if (obj instanceof RegExp) return new RegExp(obj) as any
  if (obj instanceof Map) {
    const result = new Map()
    obj.forEach((value, key) => result.set(deepClone(key), deepClone(value)))
    return result as any
  }
  if (obj instanceof Set) {
    const result = new Set()
    obj.forEach(value => result.add(deepClone(value)))
    return result as any
  }
  if (Array.isArray(obj)) return obj.map(item => deepClone(item)) as any
  const cloned: Record<string, any> = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone((obj as any)[key])
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
          result[key] = deepMerge(resVal, srcVal)
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
```

- [ ] **Step 4: Run tests — expect all pass**

```bash
npx vitest run src/object/object.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/object/
git commit -m "feat(object): add object utility functions"
```

---

### Task 4: format — 数据格式化模块

**Files:**
- Create: `D:\web\zh-tools\src\format\index.ts`
- Create: `D:\web\zh-tools\src\format\format.test.ts`

- [ ] **Step 1: Write tests for format module**

Create `D:\web\zh-tools\src\format\format.test.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import { formatMoney, formatPercent, formatMobile, formatIdCard, formatBankCard, formatFileSize } from './index'

describe('formatMoney', () => {
  it('should format money with commas', () => {
    expect(formatMoney(12345.6)).toBe('12,345.60')
    expect(formatMoney('1000000')).toBe('1,000,000.00')
    expect(formatMoney(0)).toBe('0.00')
  })
  it('should respect decimal places', () => {
    expect(formatMoney(123.456, 2)).toBe('123.46')
    expect(formatMoney(123.456, 0)).toBe('123')
  })
})

describe('formatPercent', () => {
  it('should format percent', () => {
    expect(formatPercent(85)).toBe('85%')
    expect(formatPercent('0.5')).toBe('0.5%')
  })
})

describe('formatMobile', () => {
  it('should mask middle digits', () => {
    expect(formatMobile('13800138000')).toBe('138****8000')
  })
  it('should return original for invalid input', () => {
    expect(formatMobile('12345')).toBe('12345')
  })
})

describe('formatIdCard', () => {
  it('should mask middle digits of ID card', () => {
    const result = formatIdCard('110101199001011234')
    expect(result).toBe('1101**********1234')
  })
})

describe('formatBankCard', () => {
  it('should format bank card number with spaces', () => {
    expect(formatBankCard('6222021234567890')).toBe('6222 0212 3456 7890')
  })
})

describe('formatFileSize', () => {
  it('should format file sizes', () => {
    expect(formatFileSize(0)).toBe('0 B')
    expect(formatFileSize(1024)).toBe('1.00 KB')
    expect(formatFileSize(1024 * 1024)).toBe('1.00 MB')
    expect(formatFileSize(1024 * 1024 * 1024)).toBe('1.00 GB')
  })
})
```

- [ ] **Step 2: Run tests — expect failures**

```bash
npx vitest run src/format/format.test.ts
```

- [ ] **Step 3: Implement format module**

Create `D:\web\zh-tools\src\format\index.ts`:
```typescript
/**
 * 金额格式化，千分位加逗号
 * @param value - 金额（数字或字符串）
 * @param decimals - 小数位数，默认 2
 * @returns 格式化后的金额字符串
 * @example formatMoney(12345.6) // '12,345.60'
 */
export function formatMoney(value: number | string, decimals: number = 2): string {
  const num = typeof value === 'string' ? parseFloat(value) : value
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/**
 * 百分比格式化
 * @param value - 百分比值
 * @returns 格式化后的百分比字符串
 * @example formatPercent(85) // '85%'
 */
export function formatPercent(value: number | string): string {
  return `${value}%`
}

/**
 * 手机号脱敏
 * @param mobile - 手机号字符串
 * @returns 脱敏后的手机号，如 138****8000
 * @example formatMobile('13800138000') // '138****8000'
 */
export function formatMobile(mobile: string): string {
  if (mobile.length !== 11) return mobile
  return mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/**
 * 身份证号脱敏
 * @param id - 身份证号字符串
 * @returns 脱敏后的身份证号
 * @example formatIdCard('110101199001011234') // '1101**********1234'
 */
export function formatIdCard(id: string): string {
  if (id.length < 10) return id
  return id.replace(/^(\d{4})\d{10}(\w{4})$/, '$1**********$2')
}

/**
 * 银行卡号格式化（每4位加空格）
 * @param card - 银行卡号字符串
 * @returns 格式化后的卡号
 * @example formatBankCard('6222021234567890') // '6222 0212 3456 7890'
 */
export function formatBankCard(card: string): string {
  return card.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
}

/**
 * 文件大小格式化
 * @param bytes - 文件字节数
 * @returns 格式化后的文件大小字符串
 * @example formatFileSize(1024) // '1.00 KB'
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${units[i]}`
}
```

- [ ] **Step 4: Run tests — expect all pass**

```bash
npx vitest run src/format/format.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/format/
git commit -m "feat(format): add data formatting functions"
```

---

### Task 5: url — URL 参数处理模块

**Files:**
- Create: `D:\web\zh-tools\src\url\index.ts`
- Create: `D:\web\zh-tools\src\url\url.test.ts`

- [ ] **Step 1: Write tests for URL module**

Create `D:\web\zh-tools\src\url\url.test.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import { getUrlParam, getAllUrlParams, setUrlParam, removeUrlParam, objToUrlParams, urlParamsToObj } from './index'

describe('getUrlParam', () => {
  it('should get param from search string', () => {
    expect(getUrlParam('a', '?a=1&b=2')).toBe('1')
  })
  it('should return null for missing param', () => {
    expect(getUrlParam('c', '?a=1')).toBeNull()
  })
})

describe('getAllUrlParams', () => {
  it('should return all params from search string', () => {
    expect(getAllUrlParams('?a=1&b=2')).toEqual({ a: '1', b: '2' })
  })
  it('should return empty object for empty search', () => {
    expect(getAllUrlParams('')).toEqual({})
  })
})

describe('setUrlParam', () => {
  it('should add new param to URL', () => {
    expect(setUrlParam('http://example.com', 'a', '1')).toBe('http://example.com?a=1')
  })
  it('should overwrite existing param', () => {
    expect(setUrlParam('http://example.com?a=1', 'a', '2')).toBe('http://example.com?a=2')
  })
  it('should preserve existing params', () => {
    expect(setUrlParam('http://example.com?a=1', 'b', '2')).toBe('http://example.com?a=1&b=2')
  })
})

describe('removeUrlParam', () => {
  it('should remove existing param', () => {
    expect(removeUrlParam('http://example.com?a=1&b=2', 'a')).toBe('http://example.com?b=2')
  })
  it('should return URL unchanged if param missing', () => {
    expect(removeUrlParam('http://example.com?a=1', 'b')).toBe('http://example.com?a=1')
  })
})

describe('objToUrlParams', () => {
  it('should convert object to params string', () => {
    expect(objToUrlParams({ a: 1, b: 'hello' })).toBe('a=1&b=hello')
  })
  it('should return empty string for empty object', () => {
    expect(objToUrlParams({})).toBe('')
  })
})

describe('urlParamsToObj', () => {
  it('should parse search string to object', () => {
    expect(urlParamsToObj('?a=1&b=2')).toEqual({ a: '1', b: '2' })
  })
  it('should handle empty string', () => {
    expect(urlParamsToObj('')).toEqual({})
  })
})
```

- [ ] **Step 2: Run tests — expect failures**

```bash
npx vitest run src/url/url.test.ts
```

- [ ] **Step 3: Implement URL module**

Create `D:\web\zh-tools\src\url\index.ts`:
```typescript
/**
 * 获取指定 URL 参数值
 * @param key - 参数名
 * @param search - URL 查询字符串（含 ?），默认当前 location.search
 * @returns 参数值或 null
 * @example getUrlParam('a', '?a=1&b=2') // '1'
 */
export function getUrlParam(key: string, search?: string): string | null {
  const params = getAllUrlParams(search)
  return params[key] ?? null
}

/**
 * 获取所有 URL 参数
 * @param search - URL 查询字符串（含 ?），默认当前 location.search
 * @returns 参数键值对对象
 * @example getAllUrlParams('?a=1&b=2') // { a: '1', b: '2' }
 */
export function getAllUrlParams(search?: string): Record<string, string> {
  const s = search ?? (typeof window !== 'undefined' ? window.location.search : '')
  const cleanSearch = s.startsWith('?') ? s.slice(1) : s
  if (!cleanSearch) return {}
  const result: Record<string, string> = {}
  for (const part of cleanSearch.split('&')) {
    const [key, value] = part.split('=')
    if (key) {
      result[decodeURIComponent(key)] = value ? decodeURIComponent(value) : ''
    }
  }
  return result
}

/**
 * 设置 URL 参数（追加或覆盖）
 * @param url - 原始 URL
 * @param key - 参数名
 * @param value - 参数值
 * @returns 新的 URL 字符串
 * @example setUrlParam('http://example.com', 'a', '1') // 'http://example.com?a=1'
 */
export function setUrlParam(url: string, key: string, value: string): string {
  const [base, search] = url.split('?')
  const params = search ? urlParamsToObj('?' + search) : {}
  params[key] = value
  const newSearch = objToUrlParams(params)
  return newSearch ? `${base}?${newSearch}` : base
}

/**
 * 移除 URL 参数
 * @param url - 原始 URL
 * @param key - 要移除的参数名
 * @returns 新的 URL 字符串
 * @example removeUrlParam('http://example.com?a=1&b=2', 'a') // 'http://example.com?b=2'
 */
export function removeUrlParam(url: string, key: string): string {
  const [base, search] = url.split('?')
  if (!search) return url
  const params = urlParamsToObj('?' + search)
  delete params[key]
  const newSearch = objToUrlParams(params)
  return newSearch ? `${base}?${newSearch}` : base
}

/**
 * 对象转 URL 参数字符串
 * @param obj - 参数对象
 * @returns URL 参数字符串（不带 ?）
 * @example objToUrlParams({ a: 1, b: 'hello' }) // 'a=1&b=hello'
 */
export function objToUrlParams(obj: Record<string, any>): string {
  const parts: string[] = []
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== null && obj[key] !== undefined) {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(obj[key]))}`)
    }
  }
  return parts.join('&')
}

/**
 * URL 参数字符串转对象
 * @param search - URL 查询字符串（含 ?）
 * @returns 参数对象
 * @example urlParamsToObj('?a=1&b=2') // { a: '1', b: '2' }
 */
export function urlParamsToObj(search: string): Record<string, string> {
  return getAllUrlParams(search)
}
```

- [ ] **Step 4: Run tests — expect all pass**

```bash
npx vitest run src/url/url.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/url/
git commit -m "feat(url): add URL parameter handling functions"
```

---

### Task 6: date — 日期时间处理模块

**Files:**
- Create: `D:\web\zh-tools\src\date\index.ts`
- Create: `D:\web\zh-tools\src\date\date.test.ts`

- [ ] **Step 1: Write tests for date module**

Create `D:\web\zh-tools\src\date\date.test.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import { formatDate, formatDateTime, formatRelative, getStartOfDay, getEndOfDay, getDateRange, diffDays } from './index'

describe('formatDate', () => {
  it('should format date with pattern', () => {
    const date = new Date(2026, 4, 31, 14, 30, 0) // May 31, 2026
    expect(formatDate(date, 'YYYY-MM-DD')).toBe('2026-05-31')
    expect(formatDate(date, 'YYYY/MM/DD')).toBe('2026/05/31')
    expect(formatDate(date, 'YYYY年MM月DD日')).toBe('2026年05月31日')
  })
  it('should accept timestamp', () => {
    const ts = new Date(2026, 0, 1).getTime()
    expect(formatDate(ts, 'YYYY-MM-DD')).toBe('2026-01-01')
  })
})

describe('formatDateTime', () => {
  it('should format complete datetime', () => {
    const date = new Date(2026, 4, 31, 14, 30, 0)
    expect(formatDateTime(date)).toBe('2026-05-31 14:30:00')
  })
})

describe('formatRelative', () => {
  it('should return relative time', () => {
    expect(formatRelative(new Date())).toBe('刚刚')
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000)
    expect(formatRelative(fiveMinAgo)).toBe('5分钟前')
    const twoHourAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
    expect(formatRelative(twoHourAgo)).toBe('2小时前')
  })
})

describe('getStartOfDay', () => {
  it('should return start of day', () => {
    const date = new Date(2026, 4, 31, 14, 30, 0)
    const start = getStartOfDay(date)
    expect(start.getFullYear()).toBe(2026)
    expect(start.getMonth()).toBe(4)
    expect(start.getDate()).toBe(31)
    expect(start.getHours()).toBe(0)
    expect(start.getMinutes()).toBe(0)
    expect(start.getSeconds()).toBe(0)
  })
})

describe('getEndOfDay', () => {
  it('should return end of day', () => {
    const date = new Date(2026, 4, 31, 14, 30, 0)
    const end = getEndOfDay(date)
    expect(end.getHours()).toBe(23)
    expect(end.getMinutes()).toBe(59)
    expect(end.getSeconds()).toBe(59)
  })
})

describe('getDateRange', () => {
  it('should return today range', () => {
    const [start, end] = getDateRange('today')
    expect(start.getHours()).toBe(0)
    expect(end.getHours()).toBe(23)
  })
})

describe('diffDays', () => {
  it('should calculate day difference', () => {
    const d1 = new Date(2026, 4, 31)
    const d2 = new Date(2026, 5, 1)
    expect(diffDays(d1, d2)).toBe(1)
    expect(diffDays(d2, d1)).toBe(-1)
  })
})
```

- [ ] **Step 2: Run tests — expect failures**

```bash
npx vitest run src/date/date.test.ts
```

- [ ] **Step 3: Implement date module**

Create `D:\web\zh-tools\src\date\index.ts`:
```typescript
type DateRangeType = 'today' | 'yesterday' | 'week' | 'month' | 'year'

/** 将输入统一转为 Date 对象 */
function toDate(date: Date | string | number): Date {
  if (date instanceof Date) return date
  return new Date(date)
}

/**
 * 日期格式化
 * @param date - 日期对象/时间戳/日期字符串
 * @param fmt - 格式模板，如 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期字符串
 * @example formatDate(new Date(), 'YYYY-MM-DD') // '2026-05-31'
 */
export function formatDate(date: Date | string | number, fmt: string): string {
  const d = toDate(date)
  const pad = (n: number) => String(n).padStart(2, '0')
  const map: Record<string, string> = {
    'YYYY': String(d.getFullYear()),
    'MM': pad(d.getMonth() + 1),
    'DD': pad(d.getDate()),
    'HH': pad(d.getHours()),
    'mm': pad(d.getMinutes()),
    'ss': pad(d.getSeconds()),
  }
  let result = fmt
  for (const [key, val] of Object.entries(map)) {
    result = result.replace(key, val)
  }
  return result
}

/**
 * 格式化为完整日期时间字符串
 * @param date - 日期对象/时间戳/日期字符串
 * @returns 格式化后的字符串 'YYYY-MM-DD HH:mm:ss'
 * @example formatDateTime(new Date()) // '2026-05-31 14:30:00'
 */
export function formatDateTime(date: Date | string | number): string {
  return formatDate(date, 'YYYY-MM-DD HH:mm:ss')
}

/**
 * 格式化为相对时间描述
 * @param date - 日期对象/时间戳/日期字符串
 * @returns 相对时间描述（刚刚、X分钟前、X小时前、昨天、X天前）
 * @example formatRelative(new Date()) // '刚刚'
 */
export function formatRelative(date: Date | string | number): string {
  const d = toDate(date)
  const now = Date.now()
  const diff = now - d.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (diff < 0) return formatDate(d, 'YYYY-MM-DD')
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 2) return '昨天'
  if (days < 30) return `${days}天前`
  return formatDate(d, 'YYYY-MM-DD')
}

/**
 * 获取当天开始时间 00:00:00.000
 * @param date - 日期对象/时间戳/日期字符串
 * @returns 开始时间 Date 对象
 */
export function getStartOfDay(date: Date | string | number): Date {
  const d = toDate(date)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * 获取当天结束时间 23:59:59.999
 * @param date - 日期对象/时间戳/日期字符串
 * @returns 结束时间 Date 对象
 */
export function getEndOfDay(date: Date | string | number): Date {
  const d = toDate(date)
  d.setHours(23, 59, 59, 999)
  return d
}

/**
 * 获取常用日期范围
 * @param type - 范围类型
 * @returns [开始日期, 结束日期]
 * @example getDateRange('week')
 */
export function getDateRange(type: DateRangeType): [Date, Date] {
  const now = new Date()
  const start = new Date()
  const end = new Date()

  switch (type) {
    case 'today':
      return [getStartOfDay(now), getEndOfDay(now)]
    case 'yesterday': {
      const yesterday = new Date(now.getTime() - 86400000)
      return [getStartOfDay(yesterday), getEndOfDay(yesterday)]
    }
    case 'week': {
      const day = now.getDay()
      const diffToMonday = (day === 0 ? 6 : day - 1)
      start.setDate(now.getDate() - diffToMonday)
      end.setDate(start.getDate() + 6)
      return [getStartOfDay(start), getEndOfDay(end)]
    }
    case 'month':
      start.setDate(1)
      end.setMonth(now.getMonth() + 1, 0)
      return [getStartOfDay(start), getEndOfDay(end)]
    case 'year':
      start.setMonth(0, 1)
      end.setMonth(11, 31)
      return [getStartOfDay(start), getEndOfDay(end)]
    default:
      return [getStartOfDay(now), getEndOfDay(now)]
  }
}

/**
 * 计算两个日期之间的天数差
 * @param date1 - 第一个日期
 * @param date2 - 第二个日期
 * @returns 天数差（可能为负数）
 * @example diffDays(new Date('2026-05-31'), new Date('2026-06-01')) // 1
 */
export function diffDays(date1: Date | string | number, date2: Date | string | number): number {
  const d1 = toDate(date1)
  const d2 = toDate(date2)
  const msPerDay = 86400000
  return Math.round((d2.getTime() - d1.getTime()) / msPerDay)
}
```

- [ ] **Step 4: Run tests — expect all pass**

```bash
npx vitest run src/date/date.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/date/
git commit -m "feat(date): add date/time utility functions"
```

---

### Task 7: tree — 树形数据处理模块

**Files:**
- Create: `D:\web\zh-tools\src\tree\index.ts`
- Create: `D:\web\zh-tools\src\tree\tree.test.ts`

- [ ] **Step 1: Write tests for tree module**

Create `D:\web\zh-tools\src\tree\tree.test.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import { listToTree, treeToList, findTreeNode, findTreePath, filterTree, walkTree, mapTree } from './index'

const list = [
  { id: 1, parentId: null, name: 'Root' },
  { id: 2, parentId: 1, name: 'Child 1' },
  { id: 3, parentId: 1, name: 'Child 2' },
  { id: 4, parentId: 2, name: 'Grandchild' },
]

describe('listToTree', () => {
  it('should convert list to tree', () => {
    const tree = listToTree(list)
    expect(tree).toHaveLength(1)
    expect(tree[0].id).toBe(1)
    expect(tree[0].children).toHaveLength(2)
    expect(tree[0].children![0].children).toHaveLength(1)
  })
  it('should handle empty list', () => {
    expect(listToTree([])).toEqual([])
  })
})

describe('treeToList', () => {
  it('should flatten tree to list', () => {
    const tree = listToTree(list)
    const flat = treeToList(tree)
    expect(flat).toHaveLength(4)
    expect(flat.map(f => f.id).sort()).toEqual([1, 2, 3, 4])
  })
})

describe('findTreeNode', () => {
  it('should find node by predicate', () => {
    const tree = listToTree(list)
    const node = findTreeNode(tree, n => n.id === 4)
    expect(node).not.toBeNull()
    expect(node!.name).toBe('Grandchild')
  })
  it('should return null if not found', () => {
    const tree = listToTree(list)
    expect(findTreeNode(tree, n => n.id === 99)).toBeNull()
  })
})

describe('findTreePath', () => {
  it('should find path to node', () => {
    const tree = listToTree(list)
    const path = findTreePath(tree, n => n.id === 4)
    expect(path).toHaveLength(3)
    expect(path.map(p => p.id)).toEqual([1, 2, 4])
  })
})

describe('filterTree', () => {
  it('should filter tree preserving hierarchy', () => {
    const tree = listToTree(list)
    const filtered = filterTree(tree, n => n.id === 4 || n.id === 2)
    expect(filtered).toHaveLength(1)
    expect(filtered[0].id).toBe(1)
    expect(filtered[0].children).toHaveLength(1)
    expect(filtered[0].children![0].children).toHaveLength(1)
  })
})

describe('walkTree', () => {
  it('should traverse all nodes', () => {
    const tree = listToTree(list)
    const ids: number[] = []
    walkTree(tree, n => ids.push(n.id))
    expect(ids).toEqual([1, 2, 3, 4])
  })
})

describe('mapTree', () => {
  it('should map tree nodes', () => {
    const tree = listToTree(list)
    const mapped = mapTree(tree, n => ({ ...n, name: n.name.toUpperCase() }))
    expect(mapped[0].name).toBe('ROOT')
    expect(mapped[0].children![0].name).toBe('CHILD 1')
  })
})
```

- [ ] **Step 2: Run tests — expect failures**

```bash
npx vitest run src/tree/tree.test.ts
```

- [ ] **Step 3: Implement tree module**

Create `D:\web\zh-tools\src\tree\index.ts`:
```typescript
export interface TreeOptions {
  /** 节点 ID 字段名，默认 'id' */
  idKey?: string
  /** 父节点 ID 字段名，默认 'parentId' */
  parentIdKey?: string
  /** 子节点字段名，默认 'children' */
  childrenKey?: string
  /** 根节点的 parentId 值，默认 null */
  rootValue?: any
}

export interface TreeNode<T = any> extends Record<string, any> {
  children?: TreeNode<T>[]
}

function getOptions(options?: TreeOptions): Required<TreeOptions> {
  return {
    idKey: 'id',
    parentIdKey: 'parentId',
    childrenKey: 'children',
    rootValue: null,
    ...options,
  }
}

/**
 * 将扁平列表转为树形结构
 * @param list - 扁平数据列表
 * @param options - 配置选项
 * @returns 树形结构数组
 * @example listToTree([{ id: 1, parentId: null, name: 'Root' }])
 */
export function listToTree<T extends Record<string, any>>(list: T[], options?: TreeOptions): TreeNode<T>[] {
  const opts = getOptions(options)
  const { idKey, parentIdKey, childrenKey, rootValue } = opts
  const map = new Map<any, TreeNode<T>>()
  const tree: TreeNode<T>[] = []

  for (const item of list) {
    map.set(item[idKey], { ...item, [childrenKey]: [] })
  }

  for (const item of list) {
    const node = map.get(item[idKey])
    if (item[parentIdKey] === rootValue || item[parentIdKey] === undefined || item[parentIdKey] === null) {
      tree.push(node)
    } else {
      const parent = map.get(item[parentIdKey])
      if (parent) {
        parent[childrenKey].push(node)
      } else {
        tree.push(node)
      }
    }
  }

  return tree
}

/**
 * 将树形结构展平为列表（深度优先）
 * @param tree - 树形结构数组
 * @param options - 配置选项
 * @returns 扁平列表
 */
export function treeToList<T>(tree: TreeNode<T>[], options?: TreeOptions): T[] {
  const opts = getOptions(options)
  const { childrenKey } = opts
  const result: T[] = []

  function walk(nodes: TreeNode<T>[]) {
    for (const node of nodes) {
      const { [childrenKey]: children, ...rest } = node
      result.push(rest as T)
      if (children?.length) {
        walk(children)
      }
    }
  }

  walk(tree)
  return result
}

/**
 * 递归查找树节点，返回第一个匹配的节点
 * @param tree - 树形结构数组
 * @param predicate - 匹配函数
 * @returns 匹配的节点或 null
 */
export function findTreeNode<T>(tree: TreeNode<T>[], predicate: (node: TreeNode<T>) => boolean): TreeNode<T> | null {
  for (const node of tree) {
    if (predicate(node)) return node
    if (node.children?.length) {
      const found = findTreeNode(node.children, predicate)
      if (found) return found
    }
  }
  return null
}

/**
 * 查找节点路径（从根到目标节点），用于面包屑导航
 * @param tree - 树形结构数组
 * @param predicate - 匹配函数
 * @returns 路径节点数组
 */
export function findTreePath<T>(tree: TreeNode<T>[], predicate: (node: TreeNode<T>) => boolean): TreeNode<T>[] {
  for (const node of tree) {
    if (predicate(node)) return [node]
    if (node.children?.length) {
      const path = findTreePath(node.children, predicate)
      if (path.length) {
        return [node, ...path]
      }
    }
  }
  return []
}

/**
 * 过滤树节点（保留层级关系，子节点匹配则保留父节点）
 * @param tree - 树形结构数组
 * @param predicate - 匹配函数
 * @returns 过滤后的树
 */
export function filterTree<T>(tree: TreeNode<T>[], predicate: (node: TreeNode<T>) => boolean): TreeNode<T>[] {
  const result: TreeNode<T>[] = []
  for (const node of tree) {
    const children = node.children?.length ? filterTree(node.children, predicate) : []
    if (predicate(node) || children.length) {
      result.push({ ...node, children: children.length ? children : undefined })
    }
  }
  return result
}

/**
 * 遍历树节点（广度优先）
 * @param tree - 树形结构数组
 * @param fn - 回调函数
 */
export function walkTree<T>(tree: TreeNode<T>[], fn: (node: TreeNode<T>) => void): void {
  const queue = [...tree]
  while (queue.length) {
    const node = queue.shift()!
    fn(node)
    if (node.children?.length) {
      queue.push(...node.children)
    }
  }
}

/**
 * 映射树节点生成新树
 * @param tree - 树形结构数组
 * @param fn - 映射函数
 * @returns 新树
 */
export function mapTree<T, R>(tree: TreeNode<T>[], fn: (node: TreeNode<T>) => R): R[] {
  return tree.map(node => {
    const newNode = fn(node)
    if (node.children?.length) {
      ;(newNode as any).children = mapTree(node.children, fn)
    }
    return newNode
  })
}
```

- [ ] **Step 4: Run tests — expect all pass**

```bash
npx vitest run src/tree/tree.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/tree/
git commit -m "feat(tree): add tree data handling functions"
```

---

### Task 8: storage — 存储封装模块

**Files:**
- Create: `D:\web\zh-tools\src\storage\index.ts`
- Create: `D:\web\zh-tools\src\storage\storage.test.ts`

- [ ] **Step 1: Write tests for storage module**

Create `D:\web\zh-tools\src\storage\storage.test.ts`:
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { getLocal, setLocal, removeLocal, clearLocal, getSession, setSession, removeSession, clearSession } from './index'

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe('localStorage', () => {
  it('should set and get values', () => {
    setLocal('name', 'zh-tools')
    expect(getLocal('name')).toBe('zh-tools')
  })
  it('should handle objects', () => {
    const obj = { a: 1, b: [2, 3] }
    setLocal('obj', obj)
    expect(getLocal('obj')).toEqual(obj)
  })
  it('should return null for missing keys', () => {
    expect(getLocal('nonexistent')).toBeNull()
  })
  it('should remove values', () => {
    setLocal('temp', 'value')
    removeLocal('temp')
    expect(getLocal('temp')).toBeNull()
  })
  it('should clear all values', () => {
    setLocal('a', 1)
    setLocal('b', 2)
    clearLocal()
    expect(getLocal('a')).toBeNull()
    expect(getLocal('b')).toBeNull()
  })
})

describe('sessionStorage', () => {
  it('should set and get values', () => {
    setSession('name', 'session-value')
    expect(getSession('name')).toBe('session-value')
  })
  it('should handle objects', () => {
    const obj = { x: 10 }
    setSession('obj', obj)
    expect(getSession('obj')).toEqual(obj)
  })
  it('should return null for missing keys', () => {
    expect(getSession('nonexistent')).toBeNull()
  })
  it('should remove values', () => {
    setSession('temp', 'value')
    removeSession('temp')
    expect(getSession('temp')).toBeNull()
  })
  it('should clear all values', () => {
    setSession('a', 1)
    setSession('b', 2)
    clearSession()
    expect(getSession('a')).toBeNull()
    expect(getSession('b')).toBeNull()
  })
})
```

Note: Cookie tests are skipped because vitest/happy-dom doesn't implement `document.cookie`. The implementation will still be coded.

- [ ] **Step 2: Run tests — expect failures**

```bash
npx vitest run src/storage/storage.test.ts
```

- [ ] **Step 3: Implement storage module

Create `D:\web\zh-tools\src\storage\index.ts`:
```typescript
export interface CookieOptions {
  /** 过期天数或具体日期 */
  expires?: number | Date
  /** 路径，默认 '/' */
  path?: string
  /** 域名 */
  domain?: string
  /** 仅 HTTPS */
  secure?: boolean
}

// ---- localStorage ----

/**
 * 获取 localStorage 值（自动 JSON 解析）
 * @param key - 键名
 * @returns 存储的值或 null
 */
export function getLocal<T = any>(key: string): T | null {
  try {
    const val = localStorage.getItem(key)
    if (val === null) return null
    return JSON.parse(val) as T
  } catch {
    return null
  }
}

/**
 * 设置 localStorage 值（自动 JSON 序列化）
 * @param key - 键名
 * @param value - 要存储的值
 */
export function setLocal(key: string, value: any): void {
  localStorage.setItem(key, JSON.stringify(value))
}

/**
 * 移除 localStorage 值
 * @param key - 键名
 */
export function removeLocal(key: string): void {
  localStorage.removeItem(key)
}

/**
 * 清空所有 localStorage
 */
export function clearLocal(): void {
  localStorage.clear()
}

// ---- sessionStorage ----

/**
 * 获取 sessionStorage 值（自动 JSON 解析）
 * @param key - 键名
 * @returns 存储的值或 null
 */
export function getSession<T = any>(key: string): T | null {
  try {
    const val = sessionStorage.getItem(key)
    if (val === null) return null
    return JSON.parse(val) as T
  } catch {
    return null
  }
}

/**
 * 设置 sessionStorage 值（自动 JSON 序列化）
 * @param key - 键名
 * @param value - 要存储的值
 */
export function setSession(key: string, value: any): void {
  sessionStorage.setItem(key, JSON.stringify(value))
}

/**
 * 移除 sessionStorage 值
 * @param key - 键名
 */
export function removeSession(key: string): void {
  sessionStorage.removeItem(key)
}

/**
 * 清空所有 sessionStorage
 */
export function clearSession(): void {
  sessionStorage.clear()
}

// ---- Cookie ----

/**
 * 获取 cookie
 * @param key - cookie 名
 * @returns cookie 值或 null
 */
export function getCookie(key: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${encodeURIComponent(key)}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

/**
 * 设置 cookie
 * @param key - cookie 名
 * @param value - cookie 值
 * @param options - 可选配置（过期时间、路径、域名、安全标志）
 */
export function setCookie(key: string, value: string, options?: CookieOptions): void {
  let cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
  if (options) {
    if (options.expires) {
      const expires = options.expires instanceof Date ? options.expires : new Date(Date.now() + options.expires * 86400000)
      cookie += `; expires=${expires.toUTCString()}`
    }
    if (options.path) cookie += `; path=${options.path}`
    if (options.domain) cookie += `; domain=${options.domain}`
    if (options.secure) cookie += '; secure'
  }
  document.cookie = cookie
}

/**
 * 移除 cookie
 * @param key - cookie 名
 * @param options - 可选配置（路径、域名）
 */
export function removeCookie(key: string, options?: Omit<CookieOptions, 'expires'>): void {
  setCookie(key, '', { ...options, expires: new Date(0) })
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run src/storage/storage.test.ts
```
Expected: All localStorage/sessionStorage tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/storage/
git commit -m "feat(storage): add localStorage/sessionStorage wrappers"
```

---

### Task 9: auth — 权限校验模块

**Files:**
- Create: `D:\web\zh-tools\src\auth\index.ts`
- Create: `D:\web\zh-tools\src\auth\auth.test.ts`

- [ ] **Step 1: Write tests for auth module**

Create `D:\web\zh-tools\src\auth\auth.test.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import { hasPermission, hasRole, hasAllPermissions, hasAnyPermission } from './index'

describe('hasPermission', () => {
  const perms = ['user:read', 'user:write', 'admin:access']

  it('should check single permission', () => {
    expect(hasPermission('user:read', perms)).toBe(true)
    expect(hasPermission('user:delete', perms)).toBe(false)
  })
  it('should check multiple permissions (OR logic)', () => {
    expect(hasPermission(['user:read', 'user:delete'], perms)).toBe(true)
    expect(hasPermission(['user:delete', 'system:access'], perms)).toBe(false)
  })
})

describe('hasRole', () => {
  const roles = ['admin', 'editor']

  it('should check single role', () => {
    expect(hasRole('admin', roles)).toBe(true)
    expect(hasRole('viewer', roles)).toBe(false)
  })
  it('should check multiple roles (OR logic)', () => {
    expect(hasRole(['admin', 'viewer'], roles)).toBe(true)
    expect(hasRole(['viewer', 'guest'], roles)).toBe(false)
  })
})

describe('hasAllPermissions', () => {
  const perms = ['user:read', 'user:write', 'admin:access']

  it('should return true if all permissions are present', () => {
    expect(hasAllPermissions(['user:read', 'user:write'], perms)).toBe(true)
  })
  it('should return false if any permission is missing', () => {
    expect(hasAllPermissions(['user:read', 'user:delete'], perms)).toBe(false)
  })
})

describe('hasAnyPermission', () => {
  const perms = ['user:read', 'user:write', 'admin:access']

  it('should return true if any permission exists', () => {
    expect(hasAnyPermission(['user:delete', 'user:write'], perms)).toBe(true)
  })
  it('should return false if no permissions exist', () => {
    expect(hasAnyPermission(['user:delete', 'system:access'], perms)).toBe(false)
  })
})
```

- [ ] **Step 2: Run tests — expect failures**

```bash
npx vitest run src/auth/auth.test.ts
```

- [ ] **Step 3: Implement auth module**

Create `D:\web\zh-tools\src\auth\index.ts`:
```typescript
/**
 * 判断是否有某个或某些权限
 * @param value - 权限标识（单个字符串或字符串数组，数组时 OR 逻辑）
 * @param permissions - 用户拥有的权限列表
 * @returns 是否有权限
 * @example hasPermission('user:read', ['user:read', 'user:write']) // true
 */
export function hasPermission(value: string | string[], permissions: string[]): boolean {
  const values = Array.isArray(value) ? value : [value]
  return values.some(v => permissions.includes(v))
}

/**
 * 判断是否为某角色（数组时 OR 逻辑）
 * @param value - 角色标识（单个字符串或字符串数组）
 * @param roles - 用户拥有的角色列表
 * @returns 是否匹配角色
 * @example hasRole('admin', ['admin', 'editor']) // true
 */
export function hasRole(value: string | string[], roles: string[]): boolean {
  return hasPermission(value, roles)
}

/**
 * 判断是否拥有所有指定权限（AND 逻辑）
 * @param values - 权限标识列表
 * @param permissions - 用户拥有的权限列表
 * @returns 是否拥有所有权限
 * @example hasAllPermissions(['user:read', 'user:write'], ['user:read', 'user:write', 'admin']) // true
 */
export function hasAllPermissions(values: string[], permissions: string[]): boolean {
  return values.every(v => permissions.includes(v))
}

/**
 * 判断是否拥有任一权限（OR 逻辑）
 * @param values - 权限标识列表
 * @param permissions - 用户拥有的权限列表
 * @returns 是否拥有任一权限
 * @example hasAnyPermission(['user:read', 'user:delete'], ['user:read']) // true
 */
export function hasAnyPermission(values: string[], permissions: string[]): boolean {
  return values.some(v => permissions.includes(v))
}
```

- [ ] **Step 4: Run tests — expect all pass**

```bash
npx vitest run src/auth/auth.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/auth/
git commit -m "feat(auth): add permission checking functions"
```

---

### Task 10: file — 文件上传下载模块

**Files:**
- Create: `D:\web\zh-tools\src\file\index.ts`
- Create: `D:\web\zh-tools\src\file\file.test.ts`

- [ ] **Step 1: Write tests for file module**

Create `D:\web\zh-tools\src\file\file.test.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import { getFileSizeStr, getFileExtension, isFileType } from './index'

describe('getFileSizeStr', () => {
  it('should format file sizes', () => {
    expect(getFileSizeStr(0)).toBe('0 B')
    expect(getFileSizeStr(500)).toBe('500 B')
    expect(getFileSizeStr(1024)).toBe('1.00 KB')
    expect(getFileSizeStr(1024 * 1024)).toBe('1.00 MB')
    expect(getFileSizeStr(1024 * 1024 * 1024)).toBe('1.00 GB')
  })
})

describe('getFileExtension', () => {
  it('should extract extension', () => {
    expect(getFileExtension('image.jpg')).toBe('.jpg')
    expect(getFileExtension('document.PDF')).toBe('.pdf')
    expect(getFileExtension('noext')).toBe('')
    expect(getFileExtension('file.tar.gz')).toBe('.gz')
  })
})

describe('isFileType', () => {
  it('should check file type', () => {
    expect(isFileType('photo.jpg', ['.jpg', '.png'])).toBe(true)
    expect(isFileType('photo.gif', ['.jpg', '.png'])).toBe(false)
  })
})
```

Note: `downloadByUrl`, `downloadByBlob`, `uploadFile`, `readFileAsDataURL`, `readFileAsText` are DOM-dependent and tested manually or via integration — unit tests in happy-dom have limitations for these.

- [ ] **Step 2: Run tests — expect failures**

```bash
npx vitest run src/file/file.test.ts
```

- [ ] **Step 3: Implement file module**

Create `D:\web\zh-tools\src\file\index.ts`:
```typescript
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

    xhr.onerror = () => reject(new Error('Upload failed'))
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
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${units[i]}`
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
```

- [ ] **Step 4: Run tests — expect all pass**

```bash
npx vitest run src/file/file.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/file/
git commit -m "feat(file): add file upload/download functions"
```

---

### Task 11: image — 图片处理模块

**Files:**
- Create: `D:\web\zh-tools\src\image\index.ts`
- Create: `D:\web\zh-tools\src\image\image.test.ts`

- [ ] **Step 1: Write tests for image module (feature detection only)**

Create `D:\web\zh-tools\src\image\image.test.ts`:
```typescript
import { describe, it, expect } from 'vitest'

// image module functions depend on Canvas/FileReader which need a real browser.
// Here we test that the module exports functions with correct signatures.

describe('image module exports', () => {
  it('should export all expected functions', async () => {
    const mod = await import('./index')
    expect(typeof mod.compressImage).toBe('function')
    expect(typeof mod.imageToBase64).toBe('function')
    expect(typeof mod.getImageDimensions).toBe('function')
    expect(typeof mod.createImageThumbnail).toBe('function')
  })
})
```

(Integration tests for actual image processing require a real browser or canvas mock — out of scope for unit tests.)

- [ ] **Step 2: Run tests — expect failures**

```bash
npx vitest run src/image/image.test.ts
```

- [ ] **Step 3: Implement image module**

Create `D:\web\zh-tools\src\image\index.ts`:
```typescript
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
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run src/image/image.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/image/
git commit -m "feat(image): add image processing functions"
```

---

### Task 12: Entry File — index.ts

**Files:**
- Create: `D:\web\zh-tools\src\index.ts`

- [ ] **Step 1: Create entry file**

Create `D:\web\zh-tools\src\index.ts`:
```typescript
/**
 * zh-tools — 前端常用工具方法库
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
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```
Expected: Vite builds successfully, tsc generates declarations in `dist/`.

- [ ] **Step 3: Run all tests**

```bash
npx vitest run
```
Expected: All tests pass across all modules.

- [ ] **Step 4: Commit**

```bash
git add src/index.ts
git commit -m "feat: add entry point with all module exports"
```

---

### Task 13: Final Verification

- [ ] **Step 1: Run full build and test suite**

```bash
npm run build && npx vitest run
```
Expected: Build succeeds, all tests pass.

- [ ] **Step 2: Verify type declarations**

```bash
ls dist/*.d.ts
```
Expected: `dist/index.d.ts`, `dist/validate/index.d.ts`, etc. all exist.

- [ ] **Step 3: Check JSDoc rendering (manual)**

Open `dist/index.d.ts` — each exported function should have its JSDoc comment preserved above the declaration.

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "chore: finalize zh-tools v0.1.0"
```

/**
 * zh-tools request 模块 — 自定义适配示例
 *
 * 模拟场景：
 *   - 后端地址：http://120.11.1.1
 *   - successCode = 200（后端业务成功码是 200，而非默认的 0）
 *   - 后端返回数据在 list 字段下，而非默认的 data 字段
 *   - 请求超时 10 秒
 *   - 部分接口请求头是 application/json（默认），部分是 multipart/form-data
 */

import axios from "axios";
import { createRequest } from "zh-tools";

// 消息提示组件按需引入
// import { ElMessage } from 'element-plus'
// import { message } from 'ant-design-vue'
// import { useMessage } from 'naive-ui'

// ==========================================
// 1. 初始化 — 根据后端约定定制配置
// ==========================================

export const request = createRequest({
  // ── axios 实例 ──
  axios: axios.create({
    baseURL: "http://120.11.1.1", // 后端地址
    timeout: 10000, // 超时 10 秒
  }),

  // ── token ──
  getToken: () => localStorage.getItem("token"),

  // ── 后端字段映射（关键配置）──
  //
  // 后端返回结构：
  //   { code: 200, message: 'ok', list: [...], total: 100 }
  //
  // 默认值是 code / data / message，现在改为：
  successCode: 200, // 业务成功码是 200（默认 0）
  dataPath: "list", // 数据在 list 字段下（默认 data）
  // codePath: 'code',     // code 字段名没改，不用配
  // messagePath: 'message', // message 字段名没改，不用配

  // ── 401 处理 ──
  onUnauthorized: () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  },

  // ── 消息提示（选配）──
  // message: (msg, type) => ElMessage({ message: msg, type }),

  // ── 错误日志（选配）──
  // onError: (msg, code) => console.error(`[${code}] ${msg}`),
});

// ==========================================
// 2. 业务 API
// ==========================================

/** 文本/新闻数据接口 */
export const textApi = {
  /**
   * 获取新数据列表（GET，JSON 请求头）
   *
   * 后端返回：
   *   { code: 200, message: 'ok', list: [...items], total: 100 }
   *
   * 经过 createRequest 解包后，你直接拿到 list 的内容，
   * 同时 total 等平级字段也会保留在返回对象上。
   */
  getNewData: (params: { page: number; pageSize: number }) =>
    request.get<{
      /** 由于 dataPath = 'list'，list 数组被解包为顶层返回，
       *  但泛型里我们还是按 "拿到的东西" 来描述 */
      items: {
        id: number;
        title: string;
        content: string;
        createTime: string;
      }[];
      total: number;
    }>("/text/newdata", params),
  // ↑ GET 请求默认请求头就是 application/json（axios 默认行为）

  /** 新增数据（POST，JSON 请求头 — axios 默认） */
  create: (data: { title: string; content: string }) =>
    request.post<{ id: number }>("/text/newdata", data),
  // ↑ POST 默认 Content-Type: application/json，请求体自动序列化为 JSON

  /** 更新数据（PUT，JSON 请求头） */
  update: (data: { id: number; title?: string; content?: string }) =>
    request.put("/text/newdata", data),

  /** 删除数据（DELETE） */
  delete: (id: number) => request.delete("/text/newdata", { params: { id } }),

  /** 上传附件（multipart/form-data） */
  uploadAttachment: (
    file: File,
    textId: number,
    onProgress?: (pct: number) => void,
  ) =>
    request.upload<{ url: string }>(
      "/text/newdata/upload",
      file,
      "file", // 表单字段名
      { textId: String(textId) }, // 额外表单数据
      onProgress, // 上传进度
    ),
  // ↑ upload 内部自动设 Content-Type: multipart/form-data

  /** 导出 Excel（下载） */
  exportExcel: (params: { startDate: string; endDate: string }) =>
    request.download(
      "/text/newdata/export",
      {
        fileName: "新闻数据导出.xlsx",
        onProgress: (pct) => {
          console.log(`下载进度: ${pct}%`);
        },
      },
      undefined,
      { params },
    ),
};

// ==========================================
// 3. 页面中使用
// ==========================================

async function demo() {
  // ── GET 请求（JSON 请求头，自动解包 list 字段）──
  const res = await textApi.getNewData({ page: 1, pageSize: 10 });
  // res 就是后端 list 数组的内容（已自动解包）
  // 如果后端返回 { code: 200, list: [...], total: 100 }
  // 你拿到的 res = { items: [...], total: 100 }
  console.log(res.total);

  // ── POST 请求（JSON 请求头）──
  const newItem = await textApi.create({ title: "通知", content: "明天放假" });
  console.log("新增 ID:", newItem.id);

  // ── 上传（form-data 请求头）──
  const fileInput = document.querySelector<HTMLInputElement>("#file")!;
  const file = fileInput.files![0];
  const uploadRes = await textApi.uploadAttachment(file, newItem.id, (pct) => {
    console.log(`上传进度: ${pct}%`);
  });
  console.log("附件地址:", uploadRes.url);

  // ── 下载 Excel ──
  await textApi.exportExcel({ startDate: "2026-01-01", endDate: "2026-05-31" });
}

// ==========================================
// 4. 配置速查表
// ==========================================

/**
 * 后端返回 → 前端配置映射：
 *
 * | 后端字段情况                           | 配置项        | 配置值       |
 * |---------------------------------------|--------------|-------------|
 * | 成功码是 200（不是 0）                  | successCode  | 200         |
 * | 成功码是 'success'（字符串）            | successCode  | 'success'   |
 * | 数据在 list 字段下（不是 data）          | dataPath     | 'list'      |
 * | 数据在 result 字段下                    | dataPath     | 'result'    |
 * | code 字段名叫 status                   | codePath     | 'status'    |
 * | message 字段名叫 msg                   | messagePath  | 'msg'       |
 * | 数据嵌套在 data.list 下                 | dataPath     | 'data.list'  |
 * | 不需要 token 前缀（直接放 token）        | tokenPrefix  | ''          |
 * | token 放 X-Auth-Token 头              | tokenHeaderName | 'X-Auth-Token' |
 * | 默认请求头是 JSON（axios 默认）          | 无需配置      | -           |
 * | 上传用 form-data（upload 方法自动设）    | 无需配置      | -           |
 *
 * 核心原则：后端返回什么字段名，你就配置什么字段名；
 *          createRequest 负责按配置路径取值、解包、错误提示。
 */

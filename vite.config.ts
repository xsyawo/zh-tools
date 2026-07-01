import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ZhKit',
      formats: ['es', 'cjs'],
      fileName: (format) => format === 'es' ? 'zh-kit.js' : 'zh-kit.cjs',
    },
    rollupOptions: {
      external: ['axios'],
      output: {
        globals: {},
      },
    },
    // 生成完整 source map，包含源码内容 (sourcesContent: true)
    // 浏览器 DevTools 中可直接映射回 .ts 源码进行调试
    sourcemap: true,
    // 不压缩，保持输出可读
    minify: false,
  },
});

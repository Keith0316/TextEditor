import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // 格式：/你的仓库名/，前后都必须有斜杠
  base: '/TextEditor/',
})
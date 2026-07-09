# 在线文本编辑器

一个轻量、快速、注重隐私的在线多功能文本编辑工具集，包含纯文本、富文本、Markdown 和代码四种编辑器。

所有数据均在浏览器本地处理，不上传任何服务器，保护你的隐私安全。

---

## 功能特性

| 编辑器 | 主要功能 |
|--------|----------|
| **纯文本编辑器** | 字体大小调节、大小写转换、移除空行、文本排序、JSON 格式化、去重、自动保存、字数统计 |
| **富文本编辑器** | 所见即所得排版、标题/列表/引用/表格/代码块、多色高亮、链接/图片插入、导出 HTML |
| **Markdown 编辑器** | 双栏实时预览、工具栏快捷插入、语法高亮、导出 .md / HTML / PDF |
| **代码编辑器** | Monaco Editor 内核、14+ 语言高亮、上下分栏实时预览、JS 控制台输出模拟 |

---

## 项目结构

```
TextEditor/
├── public/
│   └── favicon.svg             # 网站图标
├── src/
│   ├── components/
│   │   ├── DarkContext.jsx      # 暗色模式 Context
│   │   └── Layout.jsx          # 全局布局（导航栏、页脚、主题切换）
│   ├── pages/
│   │   ├── Home.jsx            # 首页（编辑器导航卡片）
│   │   ├── PlainEditor.jsx     # 纯文本编辑器
│   │   ├── RichEditor.jsx      # 富文本编辑器（Tiptap）
│   │   ├── MarkdownEditor.jsx  # Markdown 编辑器
│   │   └── CodeEditor.jsx      # 代码编辑器（Monaco Editor）
│   ├── App.jsx                 # 路由配置
│   ├── main.jsx                # 应用入口
│   └── index.css               # 全局样式（Tailwind + 自定义）
├── index.html                  # HTML 入口
├── package.json                # 依赖配置
├── vite.config.js              # Vite 构建配置
├── tailwind.config.js          # Tailwind CSS 配置
└── postcss.config.js           # PostCSS 配置
```

---

## 技术栈

- **框架**：React 18 + React Router v6
- **构建工具**：Vite 5
- **样式**：Tailwind CSS 3
- **富文本**：Tiptap 2（StarterKit + 多种扩展）
- **代码编辑器**：Monaco Editor（VS Code 同款内核）
- **Markdown 渲染**：react-markdown + remark-gfm + rehype-highlight
- **代码高亮**：highlight.js

---

## 本地开发

### 环境要求

- Node.js >= 16
- npm >= 8

### 安装与启动

```bash
# 克隆项目
git clone https://github.com/YOUR_USERNAME/text-editor.git
cd text-editor

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 构建生产版本

```bash
npm run build
```

构建产物输出到 `dist/` 目录，可直接部署到任意静态文件服务器。

### 预览构建产物

```bash
npm run preview
```

---

## 部署教程

### 方式一：部署到自己的服务器（Nginx）

**第一步：本地构建**

```bash
npm run build
```

**第二步：上传 dist 目录到服务器**

```bash
# 替换为你的服务器 IP 和目标路径
scp -r dist/* root@your-server-ip:/var/www/html/text-editor/
```

**第三步：配置 Nginx**

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/html/text-editor;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

重启 Nginx：`systemctl reload nginx`

**第四步（可选）：配置 HTTPS**

```bash
certbot --nginx -d your-domain.com
```

---

### 方式二：部署到 GitHub Pages（免费）

详见 [GitHub Pages 部署指南](#github-pages-部署)

---

## 页面路由

| 路径 | 页面 |
|------|------|
| `/` | 首页 |
| `/plain` | 纯文本编辑器 |
| `/rich` | 富文本编辑器 |
| `/markdown` | Markdown 编辑器 |
| `/code` | 代码编辑器 |

---

## License

MIT

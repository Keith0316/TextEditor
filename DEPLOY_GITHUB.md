# 部署教程二：上传到 GitHub + 免费托管（GitHub Pages）

本教程分为两部分：
- **Part 1**：将代码上传到 GitHub 仓库
- **Part 2**：通过 GitHub Pages 免费托管网站（无需服务器）

---

## Part 1：上传代码到 GitHub

### 前提条件

- 已注册 [GitHub](https://github.com) 账号
- 本地已安装 Git（终端运行 `git --version` 验证）

---

### 步骤 1：在 GitHub 创建新仓库

1. 登录 GitHub，点击右上角头像旁边的 **「+」** 按钮
2. 选择 **「New repository」**
3. 填写仓库信息：
   - **Repository name**：`text-editor`（或你喜欢的名字）
   - **Description**：`在线文本编辑器，支持纯文本、富文本、Markdown 和代码编辑`
   - **Visibility**：选 `Public`（GitHub Pages 免费版需要公开仓库）
   - **⚠️ 不要勾选** "Add a README file"（本地已有）
4. 点击 **「Create repository」**

创建后 GitHub 会显示一个页面，复制你的仓库地址，格式类似：
```
https://github.com/你的用户名/text-editor.git
```

---

### 步骤 2：本地初始化 Git 仓库

打开终端，进入项目目录：

```bash
cd /Users/lirixin/Documents/qoder/Test/TextEditor
```

初始化 Git：

```bash
git init
```

---

### 步骤 3：创建 .gitignore 文件

确保不把不必要的文件（如 `node_modules`）上传到 GitHub：

```bash
cat > .gitignore << 'EOF'
# 依赖包（体积大，从不上传）
node_modules/

# 构建产物
dist/

# 系统文件
.DS_Store
Thumbs.db

# 编辑器配置
.vscode/
.idea/

# 环境变量（如有）
.env.local
.env.production
EOF
```

---

### 步骤 4：提交所有文件

```bash
# 将所有文件加入暂存区
git add .

# 查看要提交的文件列表（可选）
git status

# 创建第一次提交
git commit -m "feat: 初始化在线文本编辑器项目"
```

---

### 步骤 5：关联远程仓库并推送

```bash
# 关联到你的 GitHub 仓库（替换为你的地址）
git remote add origin https://github.com/你的用户名/text-editor.git

# 将默认分支命名为 main
git branch -M main

# 推送到 GitHub
git push -u origin main
```

第一次推送会弹出登录验证：
- 输入 GitHub 用户名
- 密码处输入你的 **Personal Access Token**（不是账号密码）

**如何生成 Personal Access Token：**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 点击 **「Generate new token」**
3. 勾选 `repo` 权限
4. 复制生成的 token，**妥善保存**（只显示一次）

---

### 步骤 6：验证上传成功

打开浏览器访问：`https://github.com/你的用户名/text-editor`

可以看到所有文件已上传。

---

### 后续更新代码

每次修改代码后，执行：

```bash
git add .
git commit -m "描述这次改了什么"
git push
```

---

## Part 2：通过 GitHub Pages 免费发布网站

GitHub Pages 可以直接将你的仓库变成一个可访问的网站，完全免费，网址格式为：
```
https://你的用户名.github.io/text-editor/
```

由于这是 React SPA（单页应用），需要先做一些配置。

---

### 步骤 1：修改 Vite 构建配置

GitHub Pages 部署时，网站会在子路径下（如 `/text-editor/`），需要告诉 Vite。

编辑 `vite.config.js`，加入 `base` 配置：

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 3000 },
  // 改为你的仓库名
  base: '/text-editor/',
})
```

---

### 步骤 2：安装 gh-pages 工具

```bash
npm install --save-dev gh-pages
```

---

### 步骤 3：在 package.json 添加部署脚本

打开 `package.json`，添加两处配置：

```json
{
  "homepage": "https://你的用户名.github.io/text-editor",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

---

### 步骤 4：处理 React Router 刷新 404 问题

GitHub Pages 不支持单页应用的路由刷新，需要一个 workaround。

在 `public/` 目录下创建 `404.html`：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>在线文本编辑器</title>
    <script>
      // 将路径重定向到 index.html，保留 query 参数
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + 1).join('/') + '/?/' +
        l.pathname.slice(1).split('/').slice(1).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
</html>
```

同时在 `index.html` 的 `<head>` 里加入：

```html
<script>
  (function(l) {
    if (l.search[1] === '/' ) {
      var decoded = l.search.slice(1).split('&').map(function(s) {
        return s.replace(/~and~/g, '&')
      }).join('?');
      window.history.replaceState(null, null,
          l.pathname.slice(0, -1) + decoded + l.hash
      );
    }
  }(window.location))
</script>
```

---

### 步骤 5：一键部署

```bash
npm run deploy
```

这个命令会自动：
1. 运行 `npm run build` 构建项目
2. 将 `dist/` 目录推送到仓库的 `gh-pages` 分支

等待约 1-3 分钟，访问：
```
https://你的用户名.github.io/text-editor/
```

---

### 步骤 6：在 GitHub 确认 Pages 配置

1. 打开仓库页面 → **Settings** → 左侧菜单 **「Pages」**
2. 确认 **Source** 选择的是 `gh-pages` 分支、`/ (root)` 目录
3. 保存后稍等片刻即可访问

---

### 后续更新网站

每次有代码改动，只需：

```bash
# 先提交代码到 main 分支
git add .
git commit -m "更新说明"
git push

# 再重新部署到 GitHub Pages
npm run deploy
```

---

## 两种方式对比

| 对比项 | 自己服务器（Nginx） | GitHub Pages |
|--------|---------------------|--------------|
| **费用** | 服务器按月付费（约 ¥40+/月） | 完全免费 |
| **访问速度** | 取决于服务器配置和位置 | 国内访问较慢 |
| **域名** | 可绑定任意域名 | 默认子域名，可绑自定义域名 |
| **HTTPS** | 需手动配置 | 自动提供 |
| **私有仓库** | 不受限 | 需要付费 GitHub Pro |
| **适合场景** | 正式产品上线 | 个人展示、学习项目 |

**推荐：**
- 如果是个人展示或学习项目 → **GitHub Pages**（省钱省事）
- 如果是正式上线的工具 → **自己服务器**（性能稳定、可控）

---

## 常见问题

**Q：推送时提示 `remote: Permission to ... denied`**

检查 token 是否有 `repo` 权限，或者重新执行：
```bash
git remote set-url origin https://你的用户名:你的token@github.com/你的用户名/text-editor.git
```

**Q：GitHub Pages 部署后页面空白**

检查 `vite.config.js` 中的 `base` 是否与仓库名一致。

**Q：刷新页面出现 404**

确认 `public/404.html` 已创建，并且 `index.html` 中加入了重定向脚本。

**Q：想绑定自己的域名到 GitHub Pages**

1. 在域名 DNS 处添加 CNAME 记录，指向 `你的用户名.github.io`
2. 在仓库 Settings → Pages 中填写自定义域名
3. GitHub 会自动配置 HTTPS

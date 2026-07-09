# 部署教程一：上传到自己的服务器（Nginx）

本教程适用于已有 Linux 服务器（Ubuntu / CentOS）的用户，通过 Nginx 托管静态文件，支持自定义域名和 HTTPS。

---

## 前提条件

| 条件 | 说明 |
|------|------|
| 一台 Linux 服务器 | 阿里云、腾讯云、Vultr 等均可 |
| 服务器已安装 Nginx | 没有的话本教程会教你安装 |
| 本地已安装 Node.js | 用于构建项目 |
| （可选）一个域名 | 没有域名也可以用 IP 访问 |

---

## 第一步：本地构建项目

在本地终端进入项目目录，执行构建命令：

```bash
cd /Users/lirixin/Documents/qoder/Test/TextEditor

# 安装依赖（如果还没安装）
npm install

# 构建生产版本
npm run build
```

构建完成后，项目根目录会出现一个 `dist/` 文件夹，里面就是打包好的静态文件：

```
dist/
├── index.html
├── assets/
│   ├── index-xxxxxxxx.js
│   ├── index-xxxxxxxx.css
│   └── ...
```

---

## 第二步：连接服务器

打开终端，使用 SSH 连接你的服务器：

```bash
# 使用密码登录
ssh root@你的服务器IP

# 使用密钥登录（推荐）
ssh -i ~/.ssh/your_key.pem root@你的服务器IP
```

---

## 第三步：服务器安装 Nginx（已安装可跳过）

**Ubuntu / Debian 系统：**

```bash
apt update
apt install nginx -y

# 启动 Nginx 并设置开机自启
systemctl start nginx
systemctl enable nginx

# 验证安装成功
nginx -v
```

**CentOS / RHEL 系统：**

```bash
yum install epel-release -y
yum install nginx -y

systemctl start nginx
systemctl enable nginx
```

验证：浏览器访问 `http://你的服务器IP`，看到 Nginx 欢迎页说明安装成功。

---

## 第四步：创建网站目录

在服务器上创建用于存放网站文件的目录：

```bash
# 创建目录
mkdir -p /var/www/html/text-editor

# 设置目录权限
chown -R www-data:www-data /var/www/html/text-editor   # Ubuntu
# 或
chown -R nginx:nginx /var/www/html/text-editor          # CentOS
```

---

## 第五步：上传 dist 文件到服务器

**回到本地终端**（退出 SSH），执行上传命令：

```bash
# 上传 dist 目录下的所有文件（注意末尾的斜杠）
scp -r /Users/lirixin/Documents/qoder/Test/TextEditor/dist/* root@你的服务器IP:/var/www/html/text-editor/

# 如果使用密钥登录
scp -i ~/.ssh/your_key.pem -r dist/* root@你的服务器IP:/var/www/html/text-editor/
```

上传完成后，在服务器上验证文件已到位：

```bash
ls /var/www/html/text-editor/
# 应该看到：index.html  assets/
```

---

## 第六步：配置 Nginx

在服务器上创建 Nginx 配置文件：

```bash
nano /etc/nginx/sites-available/text-editor
```

粘贴以下内容（**根据你的实际情况修改 `server_name`**）：

```nginx
server {
    listen 80;
    listen [::]:80;

    # 替换为你的域名，没有域名就填服务器IP
    server_name your-domain.com www.your-domain.com;

    # 网站根目录
    root /var/www/html/text-editor;
    index index.html;

    # React Router 刷新页面不 404 的关键配置
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源（JS/CSS/图片）长期缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Gzip 压缩（加快加载速度）
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;
    gzip_min_length 1000;
}
```

**启用配置并重启 Nginx：**

```bash
# 创建软链接启用站点
ln -s /etc/nginx/sites-available/text-editor /etc/nginx/sites-enabled/

# 测试配置文件语法是否正确
nginx -t

# 重新加载 Nginx
systemctl reload nginx
```

现在打开浏览器访问 `http://你的服务器IP` 或 `http://你的域名`，应该可以看到网站了！

---

## 第七步：配置 HTTPS（强烈推荐）

使用 Let's Encrypt 免费申请 SSL 证书，前提是你有一个域名并已解析到服务器 IP。

**安装 Certbot：**

```bash
# Ubuntu
apt install certbot python3-certbot-nginx -y

# CentOS
yum install certbot python3-certbot-nginx -y
```

**一键申请并配置证书：**

```bash
certbot --nginx -d your-domain.com -d www.your-domain.com
```

按照提示输入邮箱、同意协议，Certbot 会自动修改 Nginx 配置并开启 HTTPS。

**设置证书自动续期：**

```bash
# 测试自动续期
certbot renew --dry-run

# 证书有效期 90 天，Certbot 会自动续期，也可手动加入 crontab
crontab -e
# 添加这一行（每天凌晨 2 点检查续期）
0 2 * * * certbot renew --quiet
```

---

## 第八步：后续更新网站

每次代码有改动，重新部署只需三步：

```bash
# 1. 本地重新构建
cd /Users/lirixin/Documents/qoder/Test/TextEditor
npm run build

# 2. 上传新文件（覆盖旧文件）
scp -r dist/* root@你的服务器IP:/var/www/html/text-editor/

# 3. 不需要重启 Nginx，静态文件直接生效
```

---

## 常见问题排查

**问题：访问页面显示 403 Forbidden**

```bash
# 检查目录权限
chmod -R 755 /var/www/html/text-editor
```

**问题：刷新子页面（如 /plain）出现 404**

确保 Nginx 配置中有这一行：
```nginx
try_files $uri $uri/ /index.html;
```

**问题：上传文件太慢，文件很多**

使用 `rsync` 代替 `scp`，只同步有变化的文件：
```bash
rsync -avz --delete dist/ root@你的服务器IP:/var/www/html/text-editor/
```

**查看 Nginx 错误日志：**

```bash
tail -f /var/log/nginx/error.log
```

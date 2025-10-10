# GitHub Pages 部署指南

本指南将帮助您将教学辅助赋能平台部署到 GitHub Pages。

## 📋 目录

- [部署架构](#部署架构)
- [前置条件](#前置条件)
- [快速开始](#快速开始)
- [配置说明](#配置说明)
- [部署步骤](#部署步骤)
- [后端部署](#后端部署)
- [故障排查](#故障排查)
- [常见问题](#常见问题)

## 🏗️ 部署架构

```
┌─────────────────┐         ┌──────────────────┐
│  GitHub Pages   │ ───────▶│   后端 API       │
│  (前端静态站点)  │  HTTPS  │  (需单独部署)     │
└─────────────────┘         └──────────────────┘
```

**重要说明**：
- ✅ **前端**：可以部署到 GitHub Pages（静态站点托管）
- ❌ **后端**：不能部署到 GitHub Pages（不支持服务器端代码）
- 🔗 **后端需要单独部署**到支持 Node.js 的平台（见[后端部署](#后端部署)）

## ✅ 前置条件

### 1. GitHub 账号
- 创建 GitHub 账号：https://github.com/signup
- 创建新仓库或使用现有仓库

### 2. Git 安装
```bash
# 检查 Git 是否已安装
git --version

# 如果未安装，访问：https://git-scm.com/downloads
```

### 3. Node.js 环境
```bash
# 检查 Node.js 版本（需要 18.x 或更高）
node --version

# 检查 npm 版本
npm --version
```

## 🚀 快速开始

### 方法 1：自动部署（推荐）

使用 GitHub Actions 实现自动部署，每次推送代码到 main 分支时自动触发。

#### 步骤 1：初始化 Git 仓库

```bash
# 在项目根目录执行
cd C:\Users\micha\Desktop\claude

# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "Initial commit: Teaching Assistant Platform"
```

#### 步骤 2：创建 GitHub 仓库

1. 访问 https://github.com/new
2. 仓库名称：`teaching-assistant`（或其他名称）
3. 可见性：Public（必须是 Public 才能使用 GitHub Pages）
4. 不要初始化 README、.gitignore 或 LICENSE
5. 点击 "Create repository"

#### 步骤 3：关联远程仓库

```bash
# 添加远程仓库（替换为您的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/teaching-assistant.git

# 重命名分支为 main
git branch -M main

# 推送代码
git push -u origin main
```

#### 步骤 4：配置 GitHub Pages

1. 进入仓库设置：Settings → Pages
2. Source 选择：GitHub Actions
3. 等待首次部署完成（约 2-3 分钟）
4. 访问：`https://YOUR_USERNAME.github.io/teaching-assistant/`

#### 步骤 5：配置后端 API URL

1. 进入仓库设置：Settings → Secrets and variables → Actions
2. 点击 "New repository secret"
3. Name: `API_URL`
4. Value: 您的后端 API URL（例如：`https://your-backend.herokuapp.com/api`）
5. 点击 "Add secret"

### 方法 2：手动部署

如果您不想使用 GitHub Actions，可以手动部署。

```bash
# 1. 进入前端目录
cd frontend

# 2. 安装 gh-pages 和 cross-env
npm install --save-dev gh-pages cross-env

# 3. 更新配置
# 编辑 package.json 中的 build:github 脚本，设置正确的 base path

# 4. 构建并部署
npm run deploy
```

## ⚙️ 配置说明

### 1. Vite 配置 (`frontend/vite.config.ts`)

```typescript
export default defineConfig({
  // GitHub Pages 部署路径
  base: process.env.VITE_BASE_PATH || '/',

  // 其他配置...
});
```

**base 路径规则**：
- 如果仓库名是 `teaching-assistant`：设置为 `/teaching-assistant/`
- 如果使用 `username.github.io` 仓库：设置为 `/`
- 如果使用自定义域名：设置为 `/`

### 2. 环境变量

#### 开发环境 (`.env.development`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_BASE_PATH=/
```

#### 生产环境 (`.env.production`)
```env
VITE_API_URL=https://your-backend-url.com/api
VITE_BASE_PATH=/teaching-assistant/
```

### 3. GitHub Actions 工作流 (`.github/workflows/deploy.yml`)

已配置自动部署流程：
- ✅ 触发条件：推送到 main 分支
- ✅ 构建环境：Node.js 18
- ✅ 构建命令：`npm run build`
- ✅ 部署目标：GitHub Pages

## 📝 部署步骤详解

### 步骤 1：准备项目

```bash
# 确保所有依赖已安装
cd frontend
npm install

# 测试本地构建
npm run build

# 预览构建结果
npm run preview
```

### 步骤 2：更新配置

#### 2.1 更新 `frontend/package.json`

找到 `build:github` 脚本，更新 base path：

```json
{
  "scripts": {
    "build:github": "cross-env VITE_BASE_PATH=/your-repo-name/ VITE_API_URL=https://your-backend-url.com tsc && vite build"
  }
}
```

#### 2.2 更新 `frontend/.env.production`

```env
VITE_API_URL=https://your-backend-url.com/api
VITE_BASE_PATH=/your-repo-name/
```

### 步骤 3：提交并推送

```bash
# 添加所有更改
git add .

# 提交
git commit -m "feat: Add GitHub Pages deployment configuration"

# 推送到 GitHub
git push origin main
```

### 步骤 4：检查部署状态

1. 进入 GitHub 仓库
2. 点击 "Actions" 标签
3. 查看最新的工作流运行状态
4. 等待构建和部署完成（绿色勾号）

### 步骤 5：访问网站

部署成功后，访问：
- `https://YOUR_USERNAME.github.io/your-repo-name/`

## 🔧 后端部署

GitHub Pages 只能托管静态文件，后端需要单独部署。推荐以下平台：

### 选项 1：Heroku（免费套餐已取消，付费）

```bash
# 1. 安装 Heroku CLI
# 访问：https://devcenter.heroku.com/articles/heroku-cli

# 2. 登录
heroku login

# 3. 创建应用
heroku create your-app-name

# 4. 部署
git subtree push --prefix backend heroku main

# 5. 配置环境变量
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret-key
```

### 选项 2：Railway（推荐，有免费额度）

1. 访问：https://railway.app/
2. 使用 GitHub 登录
3. 点击 "New Project" → "Deploy from GitHub repo"
4. 选择您的仓库
5. 设置根目录为 `backend`
6. 配置环境变量
7. 部署完成后获取 API URL

### 选项 3：Render（有免费套餐）

1. 访问：https://render.com/
2. 注册并登录
3. 点击 "New +" → "Web Service"
4. 连接 GitHub 仓库
5. 配置：
   - Name: teaching-assistant-api
   - Root Directory: backend
   - Build Command: `npm install`
   - Start Command: `npm start`
6. 添加环境变量
7. 创建 Web Service

### 选项 4：Vercel（推荐用于 serverless）

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 登录
vercel login

# 3. 部署
cd backend
vercel

# 4. 配置环境变量
vercel env add NODE_ENV production
vercel env add JWT_SECRET your-secret-key
```

### 选项 5：自建服务器

如果您有自己的服务器（VPS）：

```bash
# 1. SSH 连接到服务器
ssh user@your-server-ip

# 2. 克隆仓库
git clone https://github.com/YOUR_USERNAME/teaching-assistant.git
cd teaching-assistant/backend

# 3. 安装依赖
npm install

# 4. 配置环境变量
cp .env.example .env
nano .env

# 5. 使用 PM2 运行
npm install -g pm2
pm2 start npm --name "teaching-assistant-api" -- start
pm2 save
pm2 startup

# 6. 配置 Nginx 反向代理（可选）
```

## 🐛 故障排查

### 问题 1：404 错误

**症状**：访问 GitHub Pages 显示 404

**解决方案**：
1. 检查仓库 Settings → Pages 是否启用
2. 确认部署分支是 `main` 或 `gh-pages`
3. 等待几分钟让 DNS 生效
4. 检查 `base` 路径配置是否正确

### 问题 2：资源加载失败

**症状**：页面空白，控制台显示 404 错误

**解决方案**：
```typescript
// 检查 vite.config.ts 中的 base 配置
base: process.env.VITE_BASE_PATH || '/teaching-assistant/',
```

确保与仓库名称匹配！

### 问题 3：API 请求失败

**症状**：CORS 错误或网络错误

**解决方案**：
1. 确认后端已正确部署并运行
2. 检查后端 CORS 配置
3. 在 GitHub Secrets 中设置正确的 `API_URL`
4. 重新触发部署

### 问题 4：GitHub Actions 构建失败

**症状**：Actions 显示红色叉号

**解决方案**：
1. 点击失败的工作流查看详细日志
2. 常见原因：
   - TypeScript 编译错误
   - 依赖安装失败
   - 权限配置错误
3. 修复后重新推送

### 问题 5：音频录制功能不工作

**症状**：部署后音频录制失败

**原因**：GitHub Pages 使用 HTTPS，但某些浏览器 API 需要安全上下文

**解决方案**：
- ✅ GitHub Pages 自动提供 HTTPS，应该正常工作
- 如果使用自定义域名，确保配置了 SSL 证书

## ❓ 常见问题

### Q1：可以部署到 GitHub Pages 吗？

**A**：部分可以
- ✅ **前端**：可以（静态文件）
- ❌ **后端**：不可以（需要服务器运行）
- 需要将后端部署到其他平台

### Q2：如何使用自定义域名？

1. 在仓库根目录创建 `CNAME` 文件：
```bash
echo "your-domain.com" > frontend/dist/CNAME
```

2. 更新 GitHub Actions 工作流，在构建后复制 CNAME：
```yaml
- name: Add CNAME
  run: echo "your-domain.com" > frontend/dist/CNAME
```

3. 在域名 DNS 设置中添加 CNAME 记录：
```
your-domain.com → YOUR_USERNAME.github.io
```

4. 在 GitHub 仓库 Settings → Pages 中设置自定义域名

### Q3：如何更新网站？

```bash
# 1. 修改代码
# 2. 提交更改
git add .
git commit -m "feat: Your changes"
git push origin main

# GitHub Actions 会自动构建和部署
```

### Q4：部署需要多长时间？

- 首次部署：2-5 分钟
- 后续更新：1-3 分钟
- DNS 传播（自定义域名）：5-48 小时

### Q5：如何回滚到之前的版本？

```bash
# 1. 查看提交历史
git log --oneline

# 2. 回滚到指定提交
git revert <commit-hash>

# 3. 推送
git push origin main
```

### Q6：可以使用演示模式吗？

**可以**！如果暂时没有后端，可以：

1. 使用 Mock Service Worker (MSW) 模拟 API
2. 使用 JSON Server 提供模拟数据
3. 修改代码使用本地存储

```typescript
// 示例：使用 localStorage 替代 API
const mockBackend = {
  async getSessions() {
    const data = localStorage.getItem('sessions');
    return data ? JSON.parse(data) : [];
  },
  async saveSession(session) {
    const sessions = await this.getSessions();
    sessions.push(session);
    localStorage.setItem('sessions', JSON.stringify(sessions));
  }
};
```

## 📚 相关资源

### GitHub Pages 文档
- 官方文档：https://docs.github.com/pages
- 自定义域名：https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site

### GitHub Actions 文档
- 官方文档：https://docs.github.com/actions
- Marketplace：https://github.com/marketplace?type=actions

### 后端部署平台
- Railway：https://railway.app/
- Render：https://render.com/
- Vercel：https://vercel.com/
- Heroku：https://www.heroku.com/

### Vite 部署文档
- Static Deploy：https://vitejs.dev/guide/static-deploy.html
- GitHub Pages：https://vitejs.dev/guide/static-deploy.html#github-pages

## 🎯 下一步

部署完成后：

1. ✅ 测试所有功能是否正常
2. ✅ 配置自定义域名（可选）
3. ✅ 设置 Google Analytics（可选）
4. ✅ 优化 SEO
5. ✅ 添加 PWA 支持（可选）

## 📞 获取帮助

遇到问题？
1. 查看 GitHub Issues：https://github.com/YOUR_USERNAME/teaching-assistant/issues
2. 查看 Actions 日志：https://github.com/YOUR_USERNAME/teaching-assistant/actions
3. 参考官方文档
4. 在社区寻求帮助

---

**部署愉快！** 🚀

如有问题，请查看 [故障排查](#故障排查) 或提交 Issue。

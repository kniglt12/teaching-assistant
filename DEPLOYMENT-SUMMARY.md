# GitHub Pages 部署配置总结

## ✅ 已完成的配置

### 1. 前端配置

#### Vite 配置 (`frontend/vite.config.ts`)
- ✅ 添加 `base` 路径配置（支持环境变量）
- ✅ 优化构建输出设置
- ✅ 配置资源目录结构

#### 环境变量文件
- ✅ `.env.example` - 环境变量模板
- ✅ `.env.development` - 开发环境配置
- ✅ `.env.production` - 生产环境配置

#### 部署脚本 (`frontend/package.json`)
```json
{
  "scripts": {
    "build:github": "构建用于 GitHub Pages",
    "deploy": "手动部署命令"
  },
  "devDependencies": {
    "gh-pages": "手动部署工具",
    "cross-env": "跨平台环境变量"
  }
}
```

### 2. GitHub Actions 工作流

文件：`.github/workflows/deploy.yml`

**功能**：
- ✅ 自动触发（推送到 main 分支）
- ✅ Node.js 18 构建环境
- ✅ 自动安装依赖
- ✅ 构建前端应用
- ✅ 部署到 GitHub Pages

**触发条件**：
- 推送到 main 分支
- 手动触发（workflow_dispatch）

### 3. API 配置

文件：`frontend/src/services/api.ts`

**已支持**：
- ✅ 环境变量配置 API URL
- ✅ 自动添加认证 token
- ✅ 统一错误处理
- ✅ 请求/响应拦截器

### 4. 文档

- ✅ `DEPLOYMENT-GUIDE.md` - 完整部署指南
- ✅ `QUICK-DEPLOY.md` - 快速开始指南
- ✅ `DEPLOYMENT-SUMMARY.md` - 配置总结（本文件）

## 📝 部署清单

### 部署前检查

- [ ] 已安装 Git
- [ ] 已安装 Node.js 18+
- [ ] 有 GitHub 账号
- [ ] 前端本地构建成功（`cd frontend && npm run build`）

### GitHub 仓库设置

- [ ] 创建 Public 仓库
- [ ] 上传代码到 main 分支
- [ ] 启用 GitHub Pages (Settings → Pages → Source: GitHub Actions)
- [ ] 配置 API_URL Secret (Settings → Secrets → Actions)

### 后端部署（必需）

后端需要单独部署到支持 Node.js 的平台：

推荐选项：
- [ ] Railway (https://railway.app/) - 推荐
- [ ] Render (https://render.com/)
- [ ] Vercel (https://vercel.com/)
- [ ] Heroku (https://www.heroku.com/) - 需付费
- [ ] 自建服务器

### 部署后验证

- [ ] 前端可以访问（https://USERNAME.github.io/repo-name/）
- [ ] 后端 API 正常响应
- [ ] 登录功能正常
- [ ] 音频录制功能正常（需要 HTTPS）
- [ ] 数据保存正常

## 🔧 配置参数

### 需要替换的占位符

#### 1. GitHub 用户名
```bash
# 替换所有 YOUR_USERNAME
git remote add origin https://github.com/YOUR_USERNAME/teaching-assistant.git
```

#### 2. 仓库名称
如果不是 `teaching-assistant`，需要更新：

```json
// frontend/package.json
"build:github": "cross-env VITE_BASE_PATH=/your-repo-name/ ..."
```

```typescript
// frontend/vite.config.ts
base: process.env.VITE_BASE_PATH || '/your-repo-name/',
```

#### 3. 后端 API URL
```env
# frontend/.env.production
VITE_API_URL=https://your-actual-backend-url.com/api
```

```yaml
# .github/workflows/deploy.yml
env:
  VITE_API_URL: ${{ secrets.API_URL || 'https://your-backend-url.com' }}
```

## 🎯 部署步骤速览

### 快速部署（推荐）

```bash
# 1. 初始化 Git
git init
git add .
git commit -m "Initial commit"

# 2. 连接 GitHub（替换 YOUR_USERNAME 和 repo-name）
git remote add origin https://github.com/YOUR_USERNAME/repo-name.git
git branch -M main
git push -u origin main

# 3. 在 GitHub 启用 Pages (Settings → Pages → GitHub Actions)
# 4. 等待自动部署完成
```

### 手动部署

```bash
# 进入前端目录
cd frontend

# 安装依赖（如果需要）
npm install

# 部署
npm run deploy
```

## 🌐 访问地址

### GitHub Pages 默认地址
```
https://YOUR_USERNAME.github.io/teaching-assistant/
```

### 自定义域名（可选）
```
https://your-custom-domain.com/
```

## ⚙️ 环境变量

### 前端环境变量

| 变量名 | 说明 | 开发环境 | 生产环境 |
|--------|------|----------|----------|
| `VITE_API_URL` | 后端 API 地址 | `http://localhost:5000/api` | 后端实际 URL |
| `VITE_BASE_PATH` | 前端部署路径 | `/` | `/teaching-assistant/` |

### GitHub Secrets（Actions）

| Secret 名称 | 说明 | 示例值 |
|-------------|------|--------|
| `API_URL` | 生产环境后端 API | `https://api.example.com` |

设置位置：仓库 Settings → Secrets and variables → Actions → New repository secret

## 📊 部署架构

```
用户浏览器
    │
    ├─→ 前端 (GitHub Pages)
    │   https://username.github.io/teaching-assistant/
    │   - 静态 HTML/CSS/JS
    │   - 音频录制功能
    │   - 数据可视化
    │
    └─→ 后端 API (单独部署)
        https://your-backend.railway.app/api
        - RESTful API
        - 数据存储
        - 认证授权
```

## 🔍 验证部署

### 1. 检查 GitHub Actions

进入仓库 Actions 标签，确认：
- ✅ 工作流已运行
- ✅ 所有步骤都是绿色勾号
- ✅ 部署成功完成

### 2. 测试前端访问

```bash
# 访问网站
https://YOUR_USERNAME.github.io/teaching-assistant/

# 检查项：
# - 页面正常加载
# - 样式正确显示
# - 可以访问登录页
```

### 3. 测试 API 连接

打开浏览器控制台（F12），检查：
- ✅ 无 CORS 错误
- ✅ API 请求返回 200 状态码
- ✅ 可以成功登录

## 🐛 常见问题解决

### 问题 1：页面显示 404

**检查清单**：
- [ ] 仓库是否为 Public
- [ ] GitHub Pages 是否启用
- [ ] Actions 工作流是否成功
- [ ] base 路径配置是否正确

### 问题 2：资源加载失败

**检查清单**：
- [ ] `vite.config.ts` 的 `base` 配置
- [ ] 仓库名称是否匹配
- [ ] 浏览器控制台错误信息

### 问题 3：API 请求失败

**检查清单**：
- [ ] 后端是否已部署
- [ ] 后端 CORS 配置
- [ ] GitHub Secret `API_URL` 是否正确
- [ ] 前端 `.env.production` 配置

### 问题 4：音频录制不工作

**检查清单**：
- [ ] 网站是否使用 HTTPS（GitHub Pages 自动提供）
- [ ] 浏览器是否支持 Web Audio API
- [ ] 用户是否授予麦克风权限

## 📈 性能优化建议

### 构建优化

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    // 代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['antd', '@ant-design/icons'],
          'chart-vendor': ['echarts', 'echarts-for-react'],
        },
      },
    },
    // 压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 生产环境移除 console
      },
    },
  },
});
```

### 缓存策略

在 `public` 目录添加 `_headers` 文件：

```
/*
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: public, max-age=0, must-revalidate

/api/*
  Cache-Control: no-cache
```

## 🔐 安全建议

### 1. 环境变量

- ✅ 不要在代码中硬编码 API URL
- ✅ 使用 GitHub Secrets 存储敏感信息
- ✅ 定期更换 API 密钥

### 2. CORS 配置

后端需要正确配置 CORS：

```javascript
// backend/src/app.ts
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://YOUR_USERNAME.github.io'
  ],
  credentials: true
}));
```

### 3. HTTPS

- ✅ GitHub Pages 自动提供 HTTPS
- ✅ 后端也应使用 HTTPS
- ✅ 避免混合内容（HTTP + HTTPS）

## 📚 相关链接

### 文档
- [完整部署指南](./DEPLOYMENT-GUIDE.md)
- [快速开始](./QUICK-DEPLOY.md)
- [音频功能说明](./docs/音频录制和语音识别功能说明.md)

### 外部资源
- [GitHub Pages 文档](https://docs.github.com/pages)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
- [Railway 文档](https://docs.railway.app/)

## 💡 后续优化

### 短期
- [ ] 添加 Service Worker（PWA）
- [ ] 优化首屏加载速度
- [ ] 添加错误边界组件
- [ ] 配置 Google Analytics

### 中期
- [ ] 实现 CDN 加速
- [ ] 添加单元测试
- [ ] 配置 CI/CD 测试流程
- [ ] 优化图片资源

### 长期
- [ ] 多环境部署（staging/production）
- [ ] A/B 测试支持
- [ ] 性能监控集成
- [ ] 自动化 SEO 优化

## ✅ 总结

您的项目现在已经：

1. ✅ 配置好 Vite 用于 GitHub Pages 部署
2. ✅ 设置 GitHub Actions 自动化工作流
3. ✅ 支持环境变量配置
4. ✅ 提供完整的部署文档

**下一步**：

1. 初始化 Git 仓库
2. 推送代码到 GitHub
3. 启用 GitHub Pages
4. 部署后端到 Railway/Render
5. 配置 API URL
6. 测试验证

**预计时间**：10-15 分钟

---

祝部署顺利！如有问题，请查看 [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md) 的故障排查部分。

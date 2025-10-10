# 快速部署到 GitHub Pages

5 分钟快速部署指南 ⚡

## 🚀 三步部署

### 第 1 步：创建 GitHub 仓库

1. 访问 https://github.com/new
2. 仓库名称：`teaching-assistant`
3. 可见性：**Public**（必须）
4. 点击 "Create repository"

### 第 2 步：上传代码

在项目根目录执行：

```bash
# 初始化 Git
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 连接远程仓库（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/teaching-assistant.git

# 推送代码
git branch -M main
git push -u origin main
```

### 第 3 步：启用 GitHub Pages

1. 进入仓库 Settings → Pages
2. Source 选择：**GitHub Actions**
3. 等待 2-3 分钟自动部署完成
4. 访问：`https://YOUR_USERNAME.github.io/teaching-assistant/`

## ✅ 完成！

前端已部署成功！

## ⚠️ 重要提示

**后端需要单独部署**，GitHub Pages 只能托管前端静态文件。

### 推荐后端部署平台：

1. **Railway** (https://railway.app/) - 推荐，有免费额度
2. **Render** (https://render.com/) - 有免费套餐
3. **Vercel** (https://vercel.com/) - 适合 serverless

### 快速部署后端到 Railway：

1. 访问 https://railway.app/ 并登录
2. 点击 "New Project" → "Deploy from GitHub repo"
3. 选择您的仓库
4. Root Directory 设置为：`backend`
5. 等待部署完成，复制 API URL

### 配置前端连接后端：

1. 进入 GitHub 仓库 Settings → Secrets and variables → Actions
2. 点击 "New repository secret"
3. Name: `API_URL`
4. Value: 粘贴 Railway 提供的 API URL
5. 重新运行 GitHub Actions 工作流（Actions → 最新工作流 → Re-run jobs）

## 📝 自定义配置

### 更改仓库名称

如果您的仓库名不是 `teaching-assistant`，需要更新配置：

```bash
# 编辑 frontend/package.json
# 找到 build:github 脚本，更新 VITE_BASE_PATH：
"build:github": "cross-env VITE_BASE_PATH=/your-repo-name/ ..."
```

### 使用自定义域名

1. 在 `frontend/dist/` 创建 CNAME 文件：
```bash
echo "your-domain.com" > CNAME
```

2. 在域名 DNS 中添加 CNAME 记录：
```
your-domain.com → YOUR_USERNAME.github.io
```

3. 在 GitHub Pages 设置中添加自定义域名

## 🐛 常见问题

### 404 错误
- 确认仓库是 Public
- 等待 2-5 分钟让 GitHub Pages 生效
- 检查 Actions 是否成功运行

### API 请求失败
- 确认后端已部署
- 检查 GitHub Secrets 中的 `API_URL` 是否正确
- 重新触发 Actions 构建

### 资源加载失败
- 检查 `vite.config.ts` 中的 `base` 路径
- 确保与仓库名称一致

## 📚 详细文档

查看完整部署指南：[DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)

---

**祝部署顺利！** 🎉

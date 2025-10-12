# Logo 图片加载修复说明

## 问题描述
在 GitHub Pages 上部署时，logo.png 无法正确加载。请求路径为：
```
https://kniglt12.github.io/picture/logo.png
```

但实际应该是：
```
https://kniglt12.github.io/teaching-assistant/logo.png
```

## 原因分析
1. GitHub Pages 部署时，项目路径会包含仓库名 `/teaching-assistant/`
2. 之前使用的绝对路径 `/picture/logo.png` 没有考虑仓库名前缀
3. `picture` 目录不在 `public` 目录下，Vite 构建时不会正确处理

## 解决方案

### 1. 移动图片到 public 目录
将 `logo.png` 从 `frontend/picture/` 移动到 `frontend/public/`

### 2. 创建资源路径工具函数
创建 `frontend/src/utils/assets.ts`：
```typescript
export const getAssetPath = (path: string): string => {
  const base = import.meta.env.BASE_URL || '/';
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  return `${cleanBase}${cleanPath}`;
};
```

### 3. 添加 Vite 类型定义
创建 `frontend/src/vite-env.d.ts` 以支持 TypeScript 类型检查

### 4. 更新所有图片引用
将所有组件中的图片路径从：
```tsx
src="/picture/logo.png"
```
改为：
```tsx
src={getAssetPath('logo.png')}
```

更新的文件：
- `frontend/src/pages/Auth/DistrictLogin.tsx`
- `frontend/src/pages/Auth/SchoolLogin.tsx`
- `frontend/src/pages/Auth/TeacherLogin.tsx`
- `frontend/src/pages/PortalSelection/PortalSelection.tsx`

## 如何工作

1. **本地开发**（`npm run dev`）:
   - `BASE_URL = '/'`
   - `getAssetPath('logo.png')` → `/logo.png`

2. **GitHub Pages 部署**（设置 `VITE_BASE_PATH=/teaching-assistant/`）:
   - `BASE_URL = '/teaching-assistant/'`
   - `getAssetPath('logo.png')` → `/teaching-assistant/logo.png`

## 部署步骤

1. 确保环境变量已设置：
   ```bash
   # .env.production 或 GitHub Actions 中
   VITE_BASE_PATH=/teaching-assistant/
   ```

2. 构建项目：
   ```bash
   cd frontend
   npm run build
   ```

3. 部署到 GitHub Pages
   构建产物会自动包含正确的路径前缀

## 验证
部署后访问以下 URL 应该能正确加载 logo：
- 主页: `https://kniglt12.github.io/teaching-assistant/`
- Logo 路径: `https://kniglt12.github.io/teaching-assistant/logo.png`

## 未来建议
所有静态资源都应该：
1. 放在 `frontend/public/` 目录下
2. 使用 `getAssetPath()` 工具函数引用
3. 避免使用硬编码的绝对路径

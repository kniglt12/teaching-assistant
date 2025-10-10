# 快速开始指南

## 5分钟快速体验

### 方式一：Docker一键启动（推荐）

确保已安装 Docker 和 Docker Compose，然后：

```bash
# 1. 克隆项目
git clone <repository-url>
cd teaching-assistant-platform

# 2. 启动所有服务
docker-compose up -d

# 3. 等待服务启动（约30秒）
docker-compose logs -f

# 4. 访问应用
# 打开浏览器访问: http://localhost
```

**默认登录账号：**
- 用户名: `teacher`
- 密码: `password123`

### 方式二：本地开发启动

#### 前置条件
- Node.js 18+
- PostgreSQL 14+
- MongoDB 6+

#### 步骤

**1. 安装依赖**
```bash
# 后端
cd backend
npm install

# 前端
cd ../frontend
npm install
```

**2. 配置环境**
```bash
# 后端配置
cd backend
cp .env.example .env
# 编辑 .env 文件，配置数据库连接

# 前端配置
cd ../frontend
cp .env.example .env
```

**3. 初始化数据库**
```bash
# 创建PostgreSQL数据库
createdb teaching_assistant

# 执行初始化脚本
psql -d teaching_assistant -f scripts/init-db.sql
```

**4. 启动服务**
```bash
# 启动后端（新终端）
cd backend
npm run dev

# 启动前端（新终端）
cd frontend
npm run dev
```

**5. 访问应用**
打开浏览器访问: http://localhost:3000

## 核心功能体验

### 1. M1阶段 - 课堂采集与报告

**步骤：**
1. 登录后点击左侧菜单 "M1 - 数据闭环" → "课堂采集器"
2. 填写课堂基本信息
3. 点击"开始课堂采集"
4. 模拟一段课堂（系统会模拟采集过程）
5. 点击"停止采集"
6. 查看自动生成的课堂分析报告

**特色功能：**
- 实时采集状态显示
- 自动数据脱敏
- 课堂指标雷达图
- 改进建议清单

### 2. M2阶段 - PPT生成

**步骤：**
1. 点击 "M2 - 教学增效" → "PPT生成器"
2. 输入课程主题（如"《红楼梦》人物分析"）
3. 选择科目和年级
4. 点击"开始生成"
5. 系统自动生成PPT教案底稿
6. 支持在线编辑和导出

**特色功能：**
- 情境导入自动生成
- 本地素材智能匹配
- 多种模板选择
- 一键导出PPT

### 3. M2阶段 - 差异化作业生成

**步骤：**
1. 点击 "M2 - 教学增效" → "作业生成器"
2. 输入知识点
3. 选择题目数量
4. 系统生成基础/提升/拓展三层难度作业
5. 查看题目来源和使用建议

**特色功能：**
- 三层难度自适应
- 知识点精准覆盖
- 题目来源标注
- 批量导出支持

### 4. M3阶段 - 校级数据看板

**步骤：**
1. 点击 "M3 - 组织赋能" → "校级看板"
2. 查看全校使用统计
3. 年级对比分析
4. 趋势变化追踪

**特色功能：**
- 多维度数据可视化
- 参与分布热力图
- 对比分析报告
- 数据导出功能

## 常见问题

### Q1: Docker启动失败
```bash
# 检查Docker服务状态
docker info

# 查看错误日志
docker-compose logs backend
docker-compose logs frontend

# 重启服务
docker-compose restart
```

### Q2: 端口被占用
```bash
# 查看端口占用
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# 停止占用进程或修改端口配置
```

### Q3: 数据库连接失败
```bash
# 检查PostgreSQL服务
pg_isready -h localhost -p 5432

# 检查MongoDB服务
mongosh --eval "db.adminCommand('ping')"

# 验证环境变量配置
cat backend/.env
```

### Q4: 前端无法访问后端
```bash
# 检查后端服务状态
curl http://localhost:5000/health

# 检查CORS配置
# 编辑 backend/src/app.ts 确认CORS设置

# 检查前端环境变量
cat frontend/.env
```

## 下一步

- 📖 阅读 [完整文档](./README.md)
- 🏗️ 了解 [系统架构](./ARCHITECTURE.md)
- 🚀 查看 [部署指南](./DEPLOYMENT.md)
- 🔧 参考 [API文档](./API.md)

## 获取帮助

- 提交Issue: [GitHub Issues]
- 技术支持: support@example.com
- 开发者社区: [Discussion]

祝你使用愉快！ 🎉

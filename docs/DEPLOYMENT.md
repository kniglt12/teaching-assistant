# 部署指南

## 目录
- [环境要求](#环境要求)
- [本地开发部署](#本地开发部署)
- [Docker部署](#docker部署)
- [生产环境部署](#生产环境部署)
- [数据库初始化](#数据库初始化)
- [常见问题](#常见问题)

## 环境要求

### 基础环境
- Node.js >= 18.x
- npm >= 9.x 或 yarn >= 1.22.x
- PostgreSQL >= 14.x
- MongoDB >= 6.x
- Docker >= 20.x (可选，用于容器化部署)

### 系统要求
- CPU: 2核心以上
- 内存: 4GB以上
- 磁盘: 20GB以上可用空间

## 本地开发部署

### 1. 克隆项目
```bash
git clone <repository-url>
cd teaching-assistant-platform
```

### 2. 安装依赖

**后端：**
```bash
cd backend
npm install
```

**前端：**
```bash
cd frontend
npm install
```

### 3. 配置环境变量

**后端环境变量：**
```bash
cd backend
cp .env.example .env
# 编辑 .env 文件，填入实际配置
```

**前端环境变量：**
```bash
cd frontend
cp .env.example .env
# 编辑 .env 文件，填入实际配置
```

### 4. 初始化数据库

```bash
# 启动PostgreSQL和MongoDB
# 然后执行数据库初始化脚本
psql -U postgres -d teaching_assistant -f scripts/init-db.sql
```

### 5. 启动服务

**启动后端：**
```bash
cd backend
npm run dev
```

**启动前端：**
```bash
cd frontend
npm run dev
```

访问 http://localhost:3000 查看应用。

## Docker部署

### 快速启动

使用Docker Compose一键部署所有服务：

```bash
# 构建并启动所有容器
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

服务访问地址：
- 前端应用: http://localhost
- 后端API: http://localhost:5000
- PostgreSQL: localhost:5432
- MongoDB: localhost:27017

### 单独构建镜像

**构建后端镜像：**
```bash
docker build -f docker/Dockerfile.backend -t teaching-backend:latest ./backend
```

**构建前端镜像：**
```bash
docker build -f docker/Dockerfile.frontend -t teaching-frontend:latest ./frontend
```

## 生产环境部署

### 1. 服务器准备

- 推荐使用Ubuntu 20.04 LTS或更高版本
- 确保已安装Docker和Docker Compose
- 配置防火墙规则，开放必要端口（80, 443, 5000）

### 2. 环境配置

```bash
# 创建生产环境配置
cp backend/.env.example backend/.env.production
cp frontend/.env.example frontend/.env.production

# 修改配置文件
# - 设置强密码和安全密钥
# - 配置生产数据库地址
# - 配置域名和HTTPS证书
```

### 3. 构建与部署

```bash
# 使用生产配置启动
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### 4. 配置HTTPS（可选但推荐）

使用Let's Encrypt证书：
```bash
# 安装certbot
sudo apt-get install certbot

# 获取证书
sudo certbot certonly --standalone -d yourdomain.com

# 配置Nginx使用证书
# 修改 frontend/nginx.conf 添加SSL配置
```

### 5. 配置备份

```bash
# 数据库备份脚本示例
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup"

# 备份PostgreSQL
docker exec teaching-postgres pg_dump -U postgres teaching_assistant > $BACKUP_DIR/postgres_$DATE.sql

# 备份MongoDB
docker exec teaching-mongodb mongodump --db teaching_assistant --out $BACKUP_DIR/mongodb_$DATE

# 保留最近7天的备份
find $BACKUP_DIR -type f -mtime +7 -delete
```

## 数据库初始化

### PostgreSQL初始化

```bash
# 进入PostgreSQL容器
docker exec -it teaching-postgres psql -U postgres

# 创建数据库
CREATE DATABASE teaching_assistant;

# 切换到数据库
\c teaching_assistant

# 执行初始化脚本
\i /scripts/init-db.sql
```

### MongoDB初始化

```bash
# 进入MongoDB容器
docker exec -it teaching-mongodb mongosh

# 创建数据库和集合
use teaching_assistant

# 创建索引
db.transcripts.createIndex({ "sessionId": 1 })
db.transcripts.createIndex({ "timestamp": 1 })
```

## 性能优化

### 1. 数据库优化

**PostgreSQL：**
```sql
-- 分析表
ANALYZE class_sessions;

-- 创建额外索引
CREATE INDEX CONCURRENTLY idx_sessions_composite
ON class_sessions(teacher_id, created_at DESC);
```

### 2. 应用优化

- 启用Gzip压缩
- 配置静态资源缓存
- 使用CDN加速
- 配置Redis缓存（可选）

### 3. 监控与日志

```bash
# 查看容器资源使用
docker stats

# 查看应用日志
docker-compose logs -f backend
docker-compose logs -f frontend

# 配置日志轮转
# 编辑 /etc/docker/daemon.json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

## 常见问题

### Q1: 端口冲突
**解决方案：** 修改 docker-compose.yml 中的端口映射

### Q2: 数据库连接失败
**解决方案：**
- 检查数据库服务是否正常运行
- 验证环境变量配置是否正确
- 检查网络连接

### Q3: 前端无法连接后端
**解决方案：**
- 确认后端服务已启动
- 检查CORS配置
- 验证API_URL环境变量

### Q4: 内存不足
**解决方案：**
- 增加服务器内存
- 优化Node.js内存限制
- 配置swap空间

## 技术支持

遇到问题请查看：
- 项目文档: ./docs/
- Issue追踪: [GitHub Issues]
- 技术支持邮箱: support@example.com

## 更新日志

- v1.0.0 (2025-10-10): 初始版本发布
  - M1阶段功能完成
  - M2阶段功能开发中
  - M3阶段功能规划中

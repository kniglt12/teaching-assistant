# AI Agent 配置和使用指南

## 概述

课堂助手Agent已经成功集成了OpenAI API,可以根据课堂知识点为教师提供智能化的教学建议。

## 功能特性

### ✅ 已实现功能

1. **智能知识点提取**
   - 根据选择的课堂,自动提取对应的知识点内容
   - 精准定位课程章节,避免无关信息干扰

2. **上下文感知对话**
   - 保持对话历史(最近5轮对话)
   - 理解上下文,提供连贯的回答

3. **专业教学建议**
   - 案例推荐
   - 重难点分析
   - 教学方法建议
   - 课堂活动设计

4. **降级机制**
   - 当OpenAI API不可用时,自动切换到模拟回答
   - 确保系统稳定性

## 配置步骤

### 1. 获取OpenAI API密钥

1. 访问 [OpenAI官网](https://platform.openai.com/)
2. 注册/登录账号
3. 进入 API Keys 页面
4. 创建新的API密钥
5. 复制密钥(注意保密!)

### 2. 配置环境变量

在 `backend/.env` 文件中添加以下配置:

```env
# OpenAI配置
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL=gpt-4o-mini
OPENAI_BASE_URL=https://api.openai.com/v1
```

**参数说明:**
- `OPENAI_API_KEY`: 你的OpenAI API密钥 **(必需)**
- `OPENAI_MODEL`: 使用的模型(默认: gpt-4o-mini)
  - `gpt-4o-mini`: 成本较低,速度快,适合大部分场景
  - `gpt-4o`: 能力更强,成本较高
  - `gpt-3.5-turbo`: 成本最低,速度最快
- `OPENAI_BASE_URL`: API基础URL(默认使用官方地址)

### 3. 使用国内代理(可选)

如果在国内使用,可能需要配置代理:

```env
OPENAI_BASE_URL=https://your-proxy-url.com/v1
```

一些可用的代理服务:
- Azure OpenAI
- 国内OpenAI代理服务商

### 4. 启动服务

```bash
cd backend
npm run dev
```

查看日志确认初始化成功:
```
✅ OpenAI client initialized successfully
```

## 使用方法

### 1. 选择课堂

1. 登录教师端
2. 进入"课前" -> "课堂助手"
3. 选择单元和课堂
4. 点击"开始对话"

### 2. 提问示例

#### 案例推荐
```
这节课有什么合适的案例?
能给我推荐一些生活化的案例吗?
```

#### 重难点分析
```
这节课的重点和难点是什么?
学生最容易理解错误的地方在哪里?
如何突破教学难点?
```

#### 教学方法
```
这节课应该采用什么教学方法?
如何设计课堂导入?
怎样组织小组讨论?
```

#### 活动设计
```
能帮我设计一个课堂活动吗?
如何让学生参与到课堂中来?
有什么互动环节可以推荐?
```

## 技术实现

### 架构设计

```
Frontend (React)
    ↓ HTTP Request
Backend (Express)
    ↓ Call Service
AgentService
    ├─ Extract Knowledge (知识点提取)
    ├─ Build Context (构建上下文)
    └─ Call OpenAI API
         ↓
    OpenAI GPT-4
```

### 核心组件

#### 1. AgentService (`agent.service.ts`)

**主要功能:**
- OpenAI客户端管理
- 知识点智能提取
- 系统提示词生成
- 对话历史管理
- 错误处理和降级

**关键方法:**
```typescript
// 智能提取课程知识点
extractLessonKnowledge(lessonId, lessonName, fullContent)

// 生成专业的系统提示词
generateSystemPrompt(lessonName, knowledgeContent)

// 处理AI对话
chat(lessonId, lessonName, question, conversationHistory)
```

#### 2. Agent Routes (`agent.routes.ts`)

**API端点:**
- `GET /api/agent/classrooms` - 获取课堂列表
- `GET /api/agent/classrooms/:lessonId/knowledge` - 获取知识点
- `POST /api/agent/chat` - 对话接口

#### 3. 知识点提取算法

使用正则表达式和文本分析:
1. 根据课程名称定位开始位置
2. 查找下一课或下一单元作为结束位置
3. 提取中间内容作为课程知识点
4. 失败时降级使用部分内容

### 系统提示词设计

```
你是一位专业的教学助手,专门帮助教师进行课程设计和教学准备。

当前课堂: [课程名称]

课堂知识点内容:
[提取的知识点]

你的任务:
1. 基于上述知识点,为教师提供专业的教学建议
2. 推荐合适的教学案例和活动设计
3. 分析重点难点,提供突破方法
4. 推荐适合的教学方法和策略

回答要求:
- 紧密结合课堂知识点
- 提供具体可行的建议
- 语言简洁专业,条理清晰
- 使用项目符号或编号列表
- 回答长度适中(200-500字)
```

## 成本优化建议

### 1. 模型选择

| 模型 | 成本 | 速度 | 质量 | 推荐场景 |
|------|------|------|------|----------|
| gpt-3.5-turbo | ★ | ★★★ | ★★ | 测试、高频使用 |
| gpt-4o-mini | ★★ | ★★ | ★★★ | **推荐日常使用** |
| gpt-4o | ★★★ | ★ | ★★★★ | 重要场景 |

### 2. Token优化

**当前设置:**
- 最大输出: 1000 tokens
- 对话历史: 保留最近5轮(10条消息)
- 知识点: 智能提取相关章节

**优化建议:**
- 缩短系统提示词(当前已优化)
- 精简知识点内容(已实现智能提取)
- 限制对话轮数(已实现)

### 3. 请求控制

**建议实现:**
- 添加请求频率限制
- 实现缓存机制(相同问题返回缓存)
- 设置每日请求上限

## 错误处理

### 1. API密钥无效
```
错误: 401 Unauthorized
处理: 返回提示 "请联系管理员配置正确的API密钥"
```

### 2. 请求频率限制
```
错误: 429 Too Many Requests
处理: 返回提示 "请求过于频繁,请稍后再试"
```

### 3. 网络连接失败
```
错误: ENOTFOUND / ECONNREFUSED
处理: 降级到模拟回答
```

### 4. API密钥未配置
```
处理: 自动使用模拟回答,记录警告日志
```

## 监控和日志

### 查看日志

```bash
# 开发环境
npm run dev

# 查看日志文件
cat logs/combined.log
cat logs/error.log
```

### 关键日志

```
✅ OpenAI client initialized successfully
📝 Agent chat request - lessonId: lesson1, question: ...
✅ Extracted 2547 characters for lesson: 丰富的社会生活
✅ OpenAI API call successful
⚠️  Using mock response for question: ...
❌ Error in agent chat: ...
```

## 高级配置

### 1. 调整温度参数

在 `agent.service.ts` 中修改:

```typescript
const completion = await this.openai.chat.completions.create({
  temperature: 0.7,  // 0-2,越高越有创意,越低越精确
  // ...
});
```

### 2. 自定义系统提示词

修改 `generateSystemPrompt()` 方法来调整AI的行为风格。

### 3. 扩展到其他学科

1. 准备其他学科的知识点文档
2. 更新 `classrooms.json`
3. 修改知识点加载逻辑(支持多文件)

## 常见问题

### Q: 回答不够准确怎么办?
**A:**
1. 检查知识点是否正确提取
2. 调整系统提示词
3. 尝试使用更强大的模型(gpt-4o)

### Q: 响应速度慢?
**A:**
1. 使用更快的模型(gpt-3.5-turbo)
2. 减少max_tokens设置
3. 缩短系统提示词

### Q: 成本过高?
**A:**
1. 使用gpt-3.5-turbo或gpt-4o-mini
2. 实现问答缓存
3. 添加请求频率限制

### Q: 不想使用OpenAI,可以换其他AI吗?
**A:** 可以!修改 `AgentService` 类来支持其他AI服务:
- Anthropic Claude
- 讯飞星火
- 文心一言
- 通义千问

## 测试

### 手动测试

1. 确保后端运行
2. 访问课堂助手页面
3. 选择任一课堂
4. 输入测试问题:
   - "这节课有什么案例?"
   - "重点是什么?"
   - "怎么教?"

### API测试

使用curl或Postman:

```bash
curl -X POST http://localhost:5000/api/agent/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "lessonId": "lesson1",
    "question": "这节课有什么案例?",
    "conversationHistory": []
  }'
```

## 安全建议

1. **保护API密钥**
   - 不要将API密钥提交到Git
   - 使用环境变量
   - 定期更换密钥

2. **访问控制**
   - 已实现JWT认证
   - 考虑添加用户级别的请求限制

3. **内容审核**
   - 监控用户提问内容
   - 过滤敏感信息

## 更新日志

### v1.0.0 (2025-10-15)
- ✅ 集成OpenAI API
- ✅ 智能知识点提取
- ✅ 上下文对话支持
- ✅ 降级机制
- ✅ 错误处理

---

**维护者**: 开发团队
**最后更新**: 2025-10-15
**文档版本**: 1.0.0

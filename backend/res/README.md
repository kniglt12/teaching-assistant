# 课堂助手 Agent 资源说明

## 概述

课堂助手是一个基于课堂知识点的AI对话系统,教师可以选择特定的课堂,然后向AI助手提问关于教学方法、案例推荐、重难点分析等问题。

## 文件结构

### 1. `classrooms.json`
课堂信息配置文件,包含了年级、学科、单元和课程的结构化信息。

**数据结构:**
```json
{
  "grade": "8",              // 年级
  "semester": "1",            // 学期
  "subject": "道德与法治",     // 学科
  "units": [                  // 单元列表
    {
      "id": "unit1",
      "name": "走进社会生活",
      "lessons": [             // 课程列表
        {
          "id": "lesson1",
          "name": "丰富的社会生活",
          "topics": ["我与社会", "在社会中成长"]
        }
      ]
    }
  ]
}
```

### 2. `8_1.txt`
八年级上学期道德与法治的知识点文档,包含详细的教学内容。

**内容结构:**
- 第一单元: 走进社会生活
  - 第一课: 丰富的社会生活
  - 第二课: 网络生活新空间
- 第二单元: 遵守社会规则
  - 第三课: 社会生活离不开规则
  - 第四课: 社会生活讲道德
  - 第五课: 做守法的公民
- 第三单元: 勇担社会责任
  - 第六课: 责任与角色同在
  - 第七课: 积极奉献社会
- 第四单元: 维护国家利益
  - 第八课: 国家利益至上
  - 第九课: 树立总体国家安全观
  - 第十课: 建设美好祖国

## 如何扩展到其他年级/学科

### 步骤1: 准备知识点文档

1. 将知识点文档转换为文本格式 (`.txt`)
2. 命名格式建议: `{年级}_{学期}.txt` (例如: `7_1.txt`, `9_2.txt`)
3. 放置在 `backend/res/` 目录下

使用命令转换 `.doc` 到 `.txt`:
```bash
antiword your_file.doc > your_file.txt
```

### 步骤2: 创建对应的课堂配置

1. 根据知识点文档,创建或更新 `classrooms.json`
2. 添加新的年级/学期配置

**示例 - 添加七年级:**
```json
{
  "7_1": {
    "grade": "7",
    "semester": "1",
    "subject": "道德与法治",
    "units": [
      {
        "id": "unit1",
        "name": "成长的节拍",
        "lessons": [
          {
            "id": "lesson1",
            "name": "中学时代",
            "topics": ["中学序曲", "少年有梦"]
          }
        ]
      }
    ]
  },
  "8_1": {
    // 八年级配置...
  }
}
```

### 步骤3: 更新后端API

修改 `backend/src/modules/agent/agent.routes.ts`:

1. **更新获取课堂列表接口** - 支持多年级查询:
```typescript
router.get('/classrooms', asyncHandler(async (req: Request, res: Response) => {
  const { grade, semester } = req.query;

  const classroomsPath = path.join(__dirname, '../../../res/classrooms.json');
  const allClassrooms = JSON.parse(fs.readFileSync(classroomsPath, 'utf-8'));

  // 根据grade和semester筛选
  const key = `${grade}_${semester}`;
  const classroomData = allClassrooms[key];

  res.json({
    success: true,
    data: classroomData || { units: [] },
  });
}));
```

2. **更新知识点加载** - 根据年级学期加载对应文件:
```typescript
router.get('/classrooms/:lessonId/knowledge', asyncHandler(async (req: Request, res: Response) => {
  const { lessonId } = req.params;
  const { grade, semester } = req.query;

  // 动态构建知识点文件路径
  const knowledgePath = path.join(__dirname, `../../../res/${grade}_${semester}.txt`);

  if (!fs.existsSync(knowledgePath)) {
    return res.status(404).json({
      success: false,
      message: '知识点文件不存在',
    });
  }

  const knowledgeContent = fs.readFileSync(knowledgePath, 'utf-8');

  res.json({
    success: true,
    data: {
      lessonId,
      content: knowledgeContent,
    },
  });
}));
```

### 步骤4: 更新前端选择器

修改 `frontend/src/pages/PreClass/ClassroomAgent.tsx`,添加年级选择:

```typescript
const [selectedGrade, setSelectedGrade] = useState<string>('8');
const [selectedSemester, setSelectedSemester] = useState<string>('1');

// 在UI中添加年级选择器
<FormControl fullWidth>
  <InputLabel>选择年级</InputLabel>
  <Select
    value={selectedGrade}
    label="选择年级"
    onChange={(e) => {
      setSelectedGrade(e.target.value);
      setSelectedUnit('');
      setSelectedLesson('');
      fetchClassrooms(e.target.value, selectedSemester);
    }}
  >
    <MenuItem value="7">七年级</MenuItem>
    <MenuItem value="8">八年级</MenuItem>
    <MenuItem value="9">九年级</MenuItem>
  </Select>
</FormControl>
```

## 接入真实AI API

目前后端使用模拟数据。要接入真实AI服务:

### 方法1: 使用OpenAI API

1. 安装依赖:
```bash
npm install openai
```

2. 修改 `agent.routes.ts`:
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/chat', asyncHandler(async (req: Request, res: Response) => {
  const { lessonId, question, conversationHistory } = req.body;

  // 加载知识点
  const knowledgePath = path.join(__dirname, '../../../res/8_1.txt');
  const knowledgeContent = fs.readFileSync(knowledgePath, 'utf-8');

  // 构建提示词
  const systemPrompt = `你是一个专业的教学助手。以下是当前课堂的知识点:

${knowledgeContent}

请基于这些知识点,为教师提供专业的教学建议、案例推荐和方法指导。`;

  // 调用OpenAI API
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt },
      ...conversationHistory.map((msg: Message) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: "user", content: question }
    ],
  });

  res.json({
    success: true,
    data: {
      answer: completion.choices[0].message.content,
      timestamp: new Date().toISOString(),
    },
  });
}));
```

### 方法2: 使用Claude API

```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

router.post('/chat', asyncHandler(async (req: Request, res: Response) => {
  const { lessonId, question, conversationHistory } = req.body;

  const knowledgePath = path.join(__dirname, '../../../res/8_1.txt');
  const knowledgeContent = fs.readFileSync(knowledgePath, 'utf-8');

  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    system: `你是一个专业的教学助手。以下是当前课堂的知识点:\n\n${knowledgeContent}\n\n请基于这些知识点,为教师提供专业的教学建议。`,
    messages: [
      ...conversationHistory.map((msg: Message) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: "user", content: question }
    ],
  });

  res.json({
    success: true,
    data: {
      answer: message.content[0].text,
      timestamp: new Date().toISOString(),
    },
  });
}));
```

## 环境变量配置

在 `.env` 文件中添加:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Or Anthropic Configuration
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

## 功能特性

- ✅ 年级课堂选择
- ✅ 知识点加载
- ✅ 对话界面
- ✅ 模拟AI回答
- ⏳ 真实AI API集成 (待实现)
- ⏳ 对话历史保存
- ⏳ 知识点搜索优化
- ⏳ 多轮对话上下文管理

## 注意事项

1. **知识点文档格式**: 确保文档使用UTF-8编码
2. **文件大小**: 对于大型知识点文档,考虑分块处理或使用向量数据库
3. **API成本**: 使用真实AI API时注意控制token消耗
4. **响应时间**: 考虑添加流式响应以改善用户体验
5. **错误处理**: 完善API调用失败时的降级策略

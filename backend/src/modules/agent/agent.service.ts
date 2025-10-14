import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import logger from '../../common/logger';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

class AgentService {
  private openai: OpenAI | null = null;
  private model: string;

  constructor() {
    this.model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    // 只在有API key时初始化OpenAI客户端
    if (process.env.OPENAI_API_KEY) {
      try {
        this.openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
          baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
        });
        logger.info('OpenAI client initialized successfully');
      } catch (error) {
        logger.error('Failed to initialize OpenAI client:', error);
      }
    } else {
      logger.warn('OPENAI_API_KEY not found, using mock responses');
    }
  }

  /**
   * 提取指定课程的知识点
   */
  extractLessonKnowledge(lessonId: string, lessonName: string, fullContent: string): string {
    try {
      // 根据lessonId提取对应课程的知识点
      // 使用课程名称作为关键词进行匹配
      const lines = fullContent.split('\n');
      const lessonStartPattern = new RegExp(`第.{1,3}课.*${lessonName}`, 'i');
      const nextLessonPattern = /^第.{1,3}课/;

      let startIndex = -1;
      let endIndex = -1;

      // 查找课程开始位置
      for (let i = 0; i < lines.length; i++) {
        if (lessonStartPattern.test(lines[i])) {
          startIndex = i;
          break;
        }
      }

      // 如果找到开始位置，查找结束位置(下一课开始或文件末尾)
      if (startIndex !== -1) {
        for (let i = startIndex + 1; i < lines.length; i++) {
          if (nextLessonPattern.test(lines[i]) || lines[i].includes('第') && lines[i].includes('单元')) {
            endIndex = i;
            break;
          }
        }

        if (endIndex === -1) {
          endIndex = lines.length;
        }

        // 提取课程内容
        const lessonContent = lines.slice(startIndex, endIndex).join('\n');

        if (lessonContent.trim().length > 100) {
          logger.info(`Extracted ${lessonContent.length} characters for lesson: ${lessonName}`);
          return lessonContent;
        }
      }

      // 如果提取失败，返回部分内容(前5000字符)
      logger.warn(`Could not extract specific content for ${lessonName}, using partial content`);
      return fullContent.substring(0, 5000);
    } catch (error) {
      logger.error('Error extracting lesson knowledge:', error);
      // 出错时返回部分内容
      return fullContent.substring(0, 5000);
    }
  }

  /**
   * 生成系统提示词
   */
  private generateSystemPrompt(lessonName: string, knowledgeContent: string): string {
    return `你是一位专业的教学助手,专门帮助教师进行课程设计和教学准备。

当前课堂: ${lessonName}

课堂知识点内容:
${knowledgeContent}

你的任务:
1. 基于上述知识点,为教师提供专业的教学建议
2. 推荐合适的教学案例和活动设计
3. 分析重点难点,提供突破方法
4. 推荐适合的教学方法和策略

回答要求:
- 紧密结合课堂知识点
- 提供具体可行的建议
- 语言简洁专业,条理清晰
- 使用纯文本格式,不要使用Markdown语法(如**加粗**、#标题等)
- 可以使用数字序号、项目符号(-)进行列表
- 回答长度适中(200-500字)`;
  }


  /**
   * 处理聊天请求
   */
  async chat(
    lessonId: string,
    lessonName: string,
    question: string,
    conversationHistory: Message[]
  ): Promise<string> {
    try {
      // 加载知识点内容
      const knowledgePath = path.join(__dirname, '../../../res/8_1.txt');
      const knowledgeContent = fs.readFileSync(knowledgePath, 'utf-8');

      // 提取当前课程的知识点
      const lessonKnowledge = this.extractLessonKnowledge(lessonId, lessonName, knowledgeContent);

      // 检查OpenAI客户端是否可用
      if (!this.openai) {
        logger.error('OpenAI client not available');
        throw new Error('AI服务未配置,请联系管理员配置OpenAI API密钥');
      }

      // 构建系统提示词
      const systemPrompt = this.generateSystemPrompt(lessonName, lessonKnowledge);

      // 构建消息历史
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: systemPrompt,
        },
      ];

      // 添加对话历史(最多保留最近5轮对话)
      const recentHistory = conversationHistory.slice(-10); // 5轮对话 = 10条消息
      for (const msg of recentHistory) {
        messages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content,
        });
      }

      // 添加当前问题
      messages.push({
        role: 'user',
        content: question,
      });

      logger.info(`Calling OpenAI API with model: ${this.model}`);

      // 调用OpenAI API
      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      const answer = completion.choices[0]?.message?.content || '抱歉，我无法生成回答，请重试。';

      logger.info('OpenAI API call successful');

      return answer;
    } catch (error: any) {
      logger.error('Error in agent chat:', error);

      // 如果是API错误，抛出更友好的错误信息
      if (error.status === 401) {
        throw new Error('OpenAI API密钥无效,请联系管理员配置正确的API密钥');
      } else if (error.status === 429) {
        throw new Error('请求过于频繁,请稍后再试');
      } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        throw new Error('无法连接到AI服务,请检查网络连接或稍后再试');
      }

      // 抛出通用错误
      throw new Error('AI服务暂时不可用,请稍后再试');
    }
  }
}

// 导出单例
export const agentService = new AgentService();

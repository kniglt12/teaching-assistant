import { Router, Request, Response } from 'express';
import { asyncHandler } from '../../common/middleware/error.middleware';
import * as fs from 'fs';
import * as path from 'path';
import { agentService } from './agent.service';
import logger from '../../common/logger';

const router = Router();

// 获取课堂列表
router.get(
  '/classrooms',
  asyncHandler(async (req: Request, res: Response) => {
    const { grade, semester } = req.query;

    // 读取课堂信息
    const classroomsPath = path.join(__dirname, '../../../res/classrooms.json');
    const classroomsData = JSON.parse(fs.readFileSync(classroomsPath, 'utf-8'));

    // 过滤符合条件的课堂
    if (grade && classroomsData.grade !== grade) {
      return res.json({
        success: true,
        data: {
          grade: classroomsData.grade,
          semester: classroomsData.semester,
          subject: classroomsData.subject,
          units: [],
        },
      });
    }

    res.json({
      success: true,
      data: classroomsData,
    });
  })
);

// 获取指定课堂的知识点
router.get(
  '/classrooms/:lessonId/knowledge',
  asyncHandler(async (req: Request, res: Response) => {
    const { lessonId } = req.params;

    // 读取知识点文档
    const knowledgePath = path.join(__dirname, '../../../res/8_1.txt');
    const knowledgeContent = fs.readFileSync(knowledgePath, 'utf-8');

    // TODO: 根据lessonId提取相应的知识点
    // 这里简化处理,返回全部内容

    res.json({
      success: true,
      data: {
        lessonId,
        content: knowledgeContent,
      },
    });
  })
);

// Agent对话接口
router.post(
  '/chat',
  asyncHandler(async (req: Request, res: Response) => {
    const { lessonId, question, conversationHistory = [] } = req.body;

    if (!lessonId || !question) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数',
      });
    }

    logger.info(`Agent chat request - lessonId: ${lessonId}, question: ${question}`);

    // 获取课程名称
    const classroomsPath = path.join(__dirname, '../../../res/classrooms.json');
    const classroomsData = JSON.parse(fs.readFileSync(classroomsPath, 'utf-8'));

    let lessonName = lessonId;
    for (const unit of classroomsData.units) {
      const lesson = unit.lessons.find((l: any) => l.id === lessonId);
      if (lesson) {
        lessonName = lesson.name;
        break;
      }
    }

    // 调用Agent服务
    const answer = await agentService.chat(
      lessonId,
      lessonName,
      question,
      conversationHistory
    );

    res.json({
      success: true,
      data: {
        answer,
        timestamp: new Date().toISOString(),
      },
    });
  })
);

export default router;

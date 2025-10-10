import { Router } from 'express';
import { asyncHandler } from '../../common/middleware/error.middleware';

const router = Router();

// 生成PPT
router.post(
  '/ppt',
  asyncHandler(async (req, res) => {
    const { topic, subject, grade, objectives } = req.body;
    // TODO: PPT生成逻辑
    res.json({
      success: true,
      data: {
        pptId: `ppt_${Date.now()}`,
        slides: [],
      },
    });
  })
);

// 生成作业
router.post(
  '/homework',
  asyncHandler(async (req, res) => {
    const { sessionId, subject, grade, knowledgePoints } = req.body;
    // TODO: 作业生成逻辑
    res.json({
      success: true,
      data: {
        homeworkId: `hw_${Date.now()}`,
        levels: [],
      },
    });
  })
);

// 获取模板库
router.get(
  '/templates',
  asyncHandler(async (req, res) => {
    const { type } = req.query;
    // TODO: 查询模板
    res.json({
      success: true,
      data: {
        templates: [],
      },
    });
  })
);

export default router;

import { Router } from 'express';
import { asyncHandler } from '../../common/middleware/error.middleware';

const router = Router();

// 生成课堂报告
router.post(
  '/reports',
  asyncHandler(async (req, res) => {
    const { sessionId } = req.body;
    // TODO: 生成报告逻辑
    res.json({
      success: true,
      data: {
        reportId: `report_${Date.now()}`,
      },
    });
  })
);

// 获取报告详情
router.get(
  '/reports/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    // TODO: 查询报告
    res.json({
      success: true,
      data: {
        id,
        summary: '课堂整体表现良好',
        metrics: [],
        improvements: [],
      },
    });
  })
);

// 获取指标库
router.get(
  '/metrics',
  asyncHandler(async (req, res) => {
    // TODO: 查询指标库
    res.json({
      success: true,
      data: {
        metrics: [],
      },
    });
  })
);

export default router;

import { Router, Request, Response } from 'express';
import { asyncHandler } from '../../common/middleware/error.middleware';

const router = Router();

// 获取统计数据
router.get(
  '/stats',
  asyncHandler(async (req: Request, res: Response) => {
    // TODO: 查询统计数据
    res.json({
      success: true,
      data: {
        totalSessions: 28,
        totalGenerations: 64,
        totalReports: 18,
        averageEfficiency: 87.5,
      },
    });
  })
);

// 获取趋势数据
router.get(
  '/trends',
  asyncHandler(async (req: Request, res: Response) => {
    const { period } = req.query;
    // TODO: 查询趋势数据
    res.json({
      success: true,
      data: {
        trends: [],
      },
    });
  })
);

// 获取学习力雷达数据
router.get(
  '/radar/:classId',
  asyncHandler(async (req: Request, res: Response) => {
    const { classId } = req.params;
    // TODO: 查询雷达数据
    res.json({
      success: true,
      data: {
        dimensions: [],
      },
    });
  })
);

export default router;

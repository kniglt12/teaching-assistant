import { Router } from 'express';
import { asyncHandler } from '../../common/middleware/error.middleware';
// 使用演示模式服务（无需数据库）
import collectionService from './collection.service.demo';
import { SessionStatus } from '../../../../shared/types';

const router = Router();

// 创建新的课堂会话
router.post(
  '/sessions',
  asyncHandler(async (req, res) => {
    const { courseName, subject, className, grade, objectives } = req.body;

    // 从认证中间件获取用户ID（实际项目中应该从token中获取）
    const teacherId = (req as any).user?.id || 'teacher_demo';

    const session = await collectionService.createSession({
      teacherId,
      courseName,
      subject,
      className,
      grade,
      objectives,
    });

    res.json({
      success: true,
      data: session,
      message: 'Session created successfully',
    });
  })
);

// 获取会话列表
router.get(
  '/sessions',
  asyncHandler(async (req, res) => {
    const teacherId = (req as any).user?.id || 'teacher_demo';
    const { page = 1, pageSize = 10, status } = req.query;

    const result = await collectionService.getTeacherSessions(teacherId, {
      page: Number(page),
      pageSize: Number(pageSize),
      status: status as SessionStatus,
    });

    res.json({
      success: true,
      data: {
        sessions: result.sessions,
        total: result.total,
        page: Number(page),
        pageSize: Number(pageSize),
        hasMore: result.total > Number(page) * Number(pageSize),
      },
    });
  })
);

// 获取单个会话详情（不含文字稿）
router.get(
  '/sessions/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const sessionWithTranscript = await collectionService.getSessionWithTranscript(id);

    if (!sessionWithTranscript) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SESSION_NOT_FOUND',
          message: 'Session not found',
        },
      });
    }

    // 只返回会话信息，不包含文字稿
    const { transcript, ...session } = sessionWithTranscript;

    res.json({
      success: true,
      data: session,
    });
  })
);

// 获取会话的完整文字稿
router.get(
  '/sessions/:id/transcript',
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const transcript = await collectionService.getSessionTranscript(id);

    res.json({
      success: true,
      data: {
        sessionId: id,
        transcript,
        total: transcript.length,
      },
    });
  })
);

// 获取会话详情（含文字稿）
router.get(
  '/sessions/:id/full',
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const sessionWithTranscript = await collectionService.getSessionWithTranscript(id);

    if (!sessionWithTranscript) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SESSION_NOT_FOUND',
          message: 'Session not found',
        },
      });
    }

    res.json({
      success: true,
      data: sessionWithTranscript,
    });
  })
);

// 停止会话
router.post(
  '/sessions/:id/stop',
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const session = await collectionService.stopSession(id);

    if (!session) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SESSION_NOT_FOUND',
          message: 'Session not found',
        },
      });
    }

    res.json({
      success: true,
      data: session,
      message: 'Session stopped successfully',
    });
  })
);

// 完成会话处理
router.post(
  '/sessions/:id/complete',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { audioUrl } = req.body;

    const session = await collectionService.completeSession(id, audioUrl);

    if (!session) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SESSION_NOT_FOUND',
          message: 'Session not found',
        },
      });
    }

    res.json({
      success: true,
      data: session,
      message: 'Session completed successfully',
    });
  })
);

// 保存文字稿片段
router.post(
  '/sessions/:id/transcript',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { segments } = req.body;

    if (!Array.isArray(segments)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'segments must be an array',
        },
      });
    }

    const savedSegments = await collectionService.saveTranscriptSegments(
      segments.map(seg => ({
        ...seg,
        sessionId: id,
      }))
    );

    res.json({
      success: true,
      data: {
        saved: savedSegments.length,
        segments: savedSegments,
      },
      message: 'Transcript segments saved successfully',
    });
  })
);

// 删除会话
router.delete(
  '/sessions/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const deleted = await collectionService.deleteSession(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SESSION_NOT_FOUND',
          message: 'Session not found',
        },
      });
    }

    res.json({
      success: true,
      message: 'Session deleted successfully',
    });
  })
);

// 生成模拟文字稿（用于演示）
router.post(
  '/sessions/:id/generate-mock-transcript',
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    await collectionService.generateMockTranscript(id);

    res.json({
      success: true,
      message: 'Mock transcript generated successfully',
    });
  })
);

// 上传音频数据（预留接口）
router.post(
  '/sessions/:id/audio',
  asyncHandler(async (req, res) => {
    // TODO: 实现音频上传和处理逻辑
    // 1. 接收音频文件
    // 2. 保存到存储服务（如 OSS）
    // 3. 调用语音识别服务
    // 4. 保存文字稿片段

    res.json({
      success: true,
      message: 'Audio upload endpoint (to be implemented)',
    });
  })
);

export default router;

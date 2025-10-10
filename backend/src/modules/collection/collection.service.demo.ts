/**
 * 演示模式的课堂采集服务
 * 使用内存存储，无需数据库连接
 */

import { ClassSession, ClassSessionWithTranscript, TranscriptSegment, SessionStatus, SpeakerRole } from '../../../../shared/types';
import logger from '../../common/logger';

// 内存存储
const sessionsStore = new Map<string, ClassSession>();
const transcriptsStore = new Map<string, TranscriptSegment[]>();

/**
 * 创建新的课堂会话
 */
export const createSession = async (data: {
  teacherId: string;
  courseName: string;
  className: string;
  subject: string;
  grade: string;
  objectives?: string;
}): Promise<ClassSession> => {
  const session: ClassSession = {
    id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    teacherId: data.teacherId,
    courseName: data.courseName,
    className: data.className,
    subject: data.subject,
    grade: data.grade,
    objectives: data.objectives,
    startTime: new Date(),
    duration: 0,
    status: SessionStatus.RECORDING,
    transcriptCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  sessionsStore.set(session.id, session);
  transcriptsStore.set(session.id, []);
  logger.info(`[DEMO] Created session: ${session.id}`);

  return session;
};

/**
 * 更新会话状态
 */
export const updateSession = async (
  sessionId: string,
  updates: Partial<ClassSession>
): Promise<ClassSession | null> => {
  const session = sessionsStore.get(sessionId);
  if (!session) {
    logger.warn(`[DEMO] Session not found: ${sessionId}`);
    return null;
  }

  const updatedSession = {
    ...session,
    ...updates,
    updatedAt: new Date(),
  };

  sessionsStore.set(sessionId, updatedSession);
  return updatedSession;
};

/**
 * 停止会话录制
 */
export const stopSession = async (sessionId: string): Promise<ClassSession | null> => {
  const session = sessionsStore.get(sessionId);
  if (!session) {
    logger.warn(`[DEMO] Session not found: ${sessionId}`);
    return null;
  }

  const endTime = new Date();
  const duration = Math.floor((endTime.getTime() - new Date(session.startTime).getTime()) / 1000);

  return updateSession(sessionId, {
    endTime,
    duration,
    status: SessionStatus.PROCESSING,
  });
};

/**
 * 保存文字稿片段
 */
export const saveTranscriptSegment = async (
  segment: Omit<TranscriptSegment, 'id' | 'createdAt'>
): Promise<TranscriptSegment> => {
  const transcriptSegment: TranscriptSegment = {
    id: `transcript_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...segment,
    createdAt: new Date(),
  };

  const transcripts = transcriptsStore.get(segment.sessionId) || [];
  transcripts.push(transcriptSegment);
  transcriptsStore.set(segment.sessionId, transcripts);

  // 更新会话的文字稿计数
  const session = sessionsStore.get(segment.sessionId);
  if (session) {
    session.transcriptCount = (session.transcriptCount || 0) + 1;
    session.updatedAt = new Date();
    sessionsStore.set(segment.sessionId, session);
  }

  return transcriptSegment;
};

/**
 * 批量保存文字稿片段
 */
export const saveTranscriptSegments = async (
  segments: Omit<TranscriptSegment, 'id' | 'createdAt'>[]
): Promise<TranscriptSegment[]> => {
  if (segments.length === 0) {
    return [];
  }

  const transcriptSegments: TranscriptSegment[] = segments.map(segment => ({
    id: `transcript_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...segment,
    createdAt: new Date(),
  }));

  const sessionId = segments[0].sessionId;
  const existingTranscripts = transcriptsStore.get(sessionId) || [];
  transcriptsStore.set(sessionId, [...existingTranscripts, ...transcriptSegments]);

  // 更新会话的文字稿计数
  const session = sessionsStore.get(sessionId);
  if (session) {
    session.transcriptCount = (session.transcriptCount || 0) + segments.length;
    session.updatedAt = new Date();
    sessionsStore.set(sessionId, session);
  }

  logger.info(`[DEMO] Saved ${segments.length} transcript segments for session: ${sessionId}`);

  return transcriptSegments;
};

/**
 * 获取会话的文字稿
 */
export const getSessionTranscript = async (sessionId: string): Promise<TranscriptSegment[]> => {
  const transcripts = transcriptsStore.get(sessionId) || [];
  return transcripts.sort((a, b) => a.timestamp - b.timestamp);
};

/**
 * 获取会话详情（包含文字稿）
 */
export const getSessionWithTranscript = async (
  sessionId: string
): Promise<ClassSessionWithTranscript | null> => {
  const session = sessionsStore.get(sessionId);
  if (!session) {
    logger.warn(`[DEMO] Session not found: ${sessionId}`);
    return null;
  }

  const transcript = await getSessionTranscript(sessionId);

  return {
    ...session,
    transcript,
  };
};

/**
 * 获取教师的会话列表
 */
export const getTeacherSessions = async (
  teacherId: string,
  options: {
    page?: number;
    pageSize?: number;
    status?: SessionStatus;
  } = {}
): Promise<{ sessions: ClassSession[]; total: number }> => {
  const { page = 1, pageSize = 10, status } = options;

  // 获取所有会话并过滤
  let sessions = Array.from(sessionsStore.values())
    .filter(session => session.teacherId === teacherId);

  if (status) {
    sessions = sessions.filter(session => session.status === status);
  }

  // 排序（最新的在前）
  sessions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const total = sessions.length;
  const startIndex = (page - 1) * pageSize;
  const paginatedSessions = sessions.slice(startIndex, startIndex + pageSize);

  return {
    sessions: paginatedSessions,
    total,
  };
};

/**
 * 删除会话及其文字稿
 */
export const deleteSession = async (sessionId: string): Promise<boolean> => {
  const deleted = sessionsStore.delete(sessionId);
  transcriptsStore.delete(sessionId);

  if (deleted) {
    logger.info(`[DEMO] Deleted session: ${sessionId}`);
    return true;
  }

  return false;
};

/**
 * 完成会话处理
 */
export const completeSession = async (
  sessionId: string,
  audioUrl?: string
): Promise<ClassSession | null> => {
  return updateSession(sessionId, {
    status: SessionStatus.COMPLETED,
    audioUrl,
  });
};

/**
 * 标记会话失败
 */
export const failSession = async (sessionId: string): Promise<ClassSession | null> => {
  return updateSession(sessionId, {
    status: SessionStatus.FAILED,
  });
};

/**
 * 生成模拟文字稿数据（用于演示）
 */
export const generateMockTranscript = async (sessionId: string): Promise<void> => {
  const mockSegments: Omit<TranscriptSegment, 'id' | 'createdAt'>[] = [
    {
      sessionId,
      timestamp: 0,
      speaker: SpeakerRole.TEACHER,
      speakerName: '张老师',
      text: '同学们好，今天我们来学习《红楼梦》中的人物性格分析。',
      confidence: 0.95,
    },
    {
      sessionId,
      timestamp: 8,
      speaker: SpeakerRole.STUDENT,
      text: '老师好！',
      confidence: 0.98,
    },
    {
      sessionId,
      timestamp: 12,
      speaker: SpeakerRole.TEACHER,
      speakerName: '张老师',
      text: '请大家打开课本第23页，我们先来看看林黛玉这个人物。谁能说说林黛玉的性格特点？',
      confidence: 0.93,
      keywords: ['林黛玉', '性格特点'],
    },
    {
      sessionId,
      timestamp: 25,
      speaker: SpeakerRole.STUDENT,
      speakerName: '李明',
      text: '老师，我觉得林黛玉性格敏感、多愁善感。',
      confidence: 0.91,
      keywords: ['敏感', '多愁善感'],
    },
    {
      sessionId,
      timestamp: 33,
      speaker: SpeakerRole.TEACHER,
      speakerName: '张老师',
      text: '说得很好！那么她为什么会有这样的性格呢？这和她的身世有什么关系？',
      confidence: 0.96,
      sentiment: 0.7,
    },
    {
      sessionId,
      timestamp: 45,
      speaker: SpeakerRole.STUDENT,
      speakerName: '王芳',
      text: '因为她自幼丧母，寄人篱下，所以特别敏感。',
      confidence: 0.94,
      keywords: ['丧母', '寄人篱下'],
    },
    {
      sessionId,
      timestamp: 55,
      speaker: SpeakerRole.TEACHER,
      speakerName: '张老师',
      text: '非常正确！林黛玉的性格形成与她的成长环境密切相关。大家还能想到其他例子吗？',
      confidence: 0.95,
      sentiment: 0.8,
    },
  ];

  await saveTranscriptSegments(mockSegments);
  logger.info(`[DEMO] Generated mock transcript for session: ${sessionId}`);
};

export default {
  createSession,
  updateSession,
  stopSession,
  saveTranscriptSegment,
  saveTranscriptSegments,
  getSessionTranscript,
  getSessionWithTranscript,
  getTeacherSessions,
  deleteSession,
  completeSession,
  failSession,
  generateMockTranscript,
};

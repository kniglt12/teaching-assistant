import { getCollection } from '../../common/database/mongodb';
import { ClassSession, ClassSessionWithTranscript, TranscriptSegment, SessionStatus, SpeakerRole } from '../../../../shared/types';
import logger from '../../common/logger';

const SESSIONS_COLLECTION = 'class_sessions';
const TRANSCRIPTS_COLLECTION = 'transcripts';

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
  const collection = getCollection(SESSIONS_COLLECTION);

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

  await collection.insertOne(session);
  logger.info(`Created session: ${session.id}`);

  return session;
};

/**
 * 更新会话状态
 */
export const updateSession = async (
  sessionId: string,
  updates: Partial<ClassSession>
): Promise<ClassSession | null> => {
  const collection = getCollection(SESSIONS_COLLECTION);

  const result = await collection.findOneAndUpdate(
    { id: sessionId },
    {
      $set: {
        ...updates,
        updatedAt: new Date(),
      },
    },
    { returnDocument: 'after' }
  );

  if (!result) {
    logger.warn(`Session not found: ${sessionId}`);
    return null;
  }

  return result as unknown as ClassSession;
};

/**
 * 停止会话录制
 */
export const stopSession = async (sessionId: string): Promise<ClassSession | null> => {
  const collection = getCollection(SESSIONS_COLLECTION);

  const session = await collection.findOne({ id: sessionId }) as unknown as ClassSession;
  if (!session) {
    logger.warn(`Session not found: ${sessionId}`);
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
  const collection = getCollection(TRANSCRIPTS_COLLECTION);

  const transcriptSegment: TranscriptSegment = {
    id: `transcript_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...segment,
    createdAt: new Date(),
  };

  await collection.insertOne(transcriptSegment);

  // 更新会话的文字稿计数
  const sessionsCollection = getCollection(SESSIONS_COLLECTION);
  await sessionsCollection.updateOne(
    { id: segment.sessionId },
    {
      $inc: { transcriptCount: 1 },
      $set: { updatedAt: new Date() }
    }
  );

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

  const collection = getCollection(TRANSCRIPTS_COLLECTION);

  const transcriptSegments: TranscriptSegment[] = segments.map(segment => ({
    id: `transcript_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...segment,
    createdAt: new Date(),
  }));

  await collection.insertMany(transcriptSegments);

  // 更新会话的文字稿计数
  const sessionsCollection = getCollection(SESSIONS_COLLECTION);
  const sessionId = segments[0].sessionId;
  await sessionsCollection.updateOne(
    { id: sessionId },
    {
      $inc: { transcriptCount: segments.length },
      $set: { updatedAt: new Date() }
    }
  );

  logger.info(`Saved ${segments.length} transcript segments for session: ${sessionId}`);

  return transcriptSegments;
};

/**
 * 获取会话的文字稿
 */
export const getSessionTranscript = async (sessionId: string): Promise<TranscriptSegment[]> => {
  const collection = getCollection(TRANSCRIPTS_COLLECTION);

  const transcripts = await collection
    .find({ sessionId })
    .sort({ timestamp: 1 })
    .toArray();

  return transcripts as unknown as TranscriptSegment[];
};

/**
 * 获取会话详情（包含文字稿）
 */
export const getSessionWithTranscript = async (
  sessionId: string
): Promise<ClassSessionWithTranscript | null> => {
  const sessionsCollection = getCollection(SESSIONS_COLLECTION);

  const session = await sessionsCollection.findOne({ id: sessionId }) as unknown as ClassSession;
  if (!session) {
    logger.warn(`Session not found: ${sessionId}`);
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
  const collection = getCollection(SESSIONS_COLLECTION);
  const { page = 1, pageSize = 10, status } = options;

  const filter: any = { teacherId };
  if (status) {
    filter.status = status;
  }

  const total = await collection.countDocuments(filter);
  const sessions = await collection
    .find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .toArray();

  return {
    sessions: sessions as unknown as ClassSession[],
    total,
  };
};

/**
 * 删除会话及其文字稿
 */
export const deleteSession = async (sessionId: string): Promise<boolean> => {
  const sessionsCollection = getCollection(SESSIONS_COLLECTION);
  const transcriptsCollection = getCollection(TRANSCRIPTS_COLLECTION);

  // 删除文字稿
  await transcriptsCollection.deleteMany({ sessionId });

  // 删除会话
  const result = await sessionsCollection.deleteOne({ id: sessionId });

  if (result.deletedCount > 0) {
    logger.info(`Deleted session: ${sessionId}`);
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
  logger.info(`Generated mock transcript for session: ${sessionId}`);
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

/**
 * 共享类型定义
 * 前后端通用的数据结构
 * 注意：此文件是从项目根目录 shared/types/index.ts 复制而来
 * 修改时请保持两个文件同步
 */

// ============ 用户相关 ============
export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  school: string;
  grade?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  TEACHER = 'teacher',
  ADMIN = 'admin',
  SCHOOL_ADMIN = 'school_admin',
}

// ============ 课堂采集相关 ============
export interface ClassSession {
  id: string;
  teacherId: string;
  courseName: string;
  className: string;
  subject: string;
  grade: string;
  objectives?: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // 秒
  status: SessionStatus;
  recordingId?: string;
  audioUrl?: string; // 音频文件URL
  transcriptCount?: number; // 文字稿段落数
  createdAt: Date;
  updatedAt: Date;
}

export enum SessionStatus {
  RECORDING = 'recording',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface TranscriptSegment {
  id: string;
  sessionId: string;
  timestamp: number; // 相对于课堂开始的秒数
  speaker: SpeakerRole;
  speakerName?: string; // 说话人名称
  text: string;
  sentiment?: number; // 情感分数 -1 到 1
  keywords?: string[];
  confidence?: number; // 识别置信度 0-1
  createdAt: Date;
}

export enum SpeakerRole {
  TEACHER = 'teacher',
  STUDENT = 'student',
  UNKNOWN = 'unknown',
}

// 完整的课堂会话数据（包含文字稿）
export interface ClassSessionWithTranscript extends ClassSession {
  transcript: TranscriptSegment[];
}

// ============ 指标相关 ============
export interface MetricsIndicator {
  id: string;
  name: string;
  category: MetricsCategory;
  description: string;
  formula: string;
  threshold: ThresholdConfig;
}

export enum MetricsCategory {
  PRE_CLASS = 'pre_class',
  IN_CLASS = 'in_class',
  POST_CLASS = 'post_class',
}

export interface ThresholdConfig {
  low: number;
  medium: number;
  high: number;
}

// ============ 分析报告相关 ============
export interface ClassReport {
  id: string;
  sessionId: string;
  teacherId: string;
  summary: string;
  metrics: MetricsResult[];
  improvements: Improvement[];
  interactionAnalysis: InteractionAnalysis;
  generatedAt: Date;
}

export interface MetricsResult {
  indicatorId: string;
  indicatorName: string;
  value: number;
  level: 'low' | 'medium' | 'high';
  interpretation: string;
}

export interface Improvement {
  area: string;
  issue: string;
  suggestion: string;
  priority: 'high' | 'medium' | 'low';
}

export interface InteractionAnalysis {
  totalInteractions: number;
  teacherTalkRatio: number;
  studentParticipationRate: number;
  hotZones: TimeZone[];
  coldZones: TimeZone[];
}

export interface TimeZone {
  startTime: number;
  endTime: number;
  intensity: number;
  description: string;
}

// ============ M2 生成相关 ============
export interface PPTTemplate {
  id: string;
  title: string;
  subject: string;
  grade: string;
  slides: Slide[];
  thumbnailUrl: string;
}

export interface Slide {
  id: string;
  order: number;
  type: SlideType;
  content: SlideContent;
}

export enum SlideType {
  TITLE = 'title',
  SITUATION = 'situation',
  CONTENT = 'content',
  EXERCISE = 'exercise',
  SUMMARY = 'summary',
}

export interface SlideContent {
  title?: string;
  text?: string;
  imageUrl?: string;
  bulletPoints?: string[];
  notes?: string;
}

export interface HomeworkSet {
  id: string;
  sessionId: string;
  teacherId: string;
  subject: string;
  grade: string;
  levels: HomeworkLevel[];
  generatedAt: Date;
}

export interface HomeworkLevel {
  level: 'basic' | 'advanced' | 'extension';
  questions: Question[];
  estimatedTime: number;
  targetStudents?: string[];
}

export interface Question {
  id: string;
  content: string;
  type: QuestionType;
  difficulty: number;
  knowledgePoints: string[];
  source?: string;
  answer?: string;
  explanation?: string;
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  SHORT_ANSWER = 'short_answer',
  ESSAY = 'essay',
  PRACTICE = 'practice',
}

// ============ M3 看板相关 ============
export interface DashboardStats {
  schoolId: string;
  period: TimePeriod;
  participation: ParticipationStats;
  performance: PerformanceStats;
  trends: TrendData[];
}

export interface TimePeriod {
  start: Date;
  end: Date;
}

export interface ParticipationStats {
  totalSessions: number;
  totalTeachers: number;
  totalStudents: number;
  activeRate: number;
  distribution: Record<string, number>;
}

export interface PerformanceStats {
  averageMetrics: Record<string, number>;
  topPerformers: string[];
  improvementNeeded: string[];
}

export interface TrendData {
  date: Date;
  metric: string;
  value: number;
}

export interface StudentLearningRadar {
  studentId: string;
  className: string;
  dimensions: RadarDimension[];
  generatedAt: Date;
}

export interface RadarDimension {
  name: string;
  value: number;
  maxValue: number;
  description: string;
}

// ============ 合规与审计 ============
export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  details: Record<string, any>;
  ipAddress: string;
  timestamp: Date;
}

export interface ComplianceCheck {
  id: string;
  checkType: ComplianceType;
  status: 'passed' | 'failed' | 'warning';
  details: string;
  checkedAt: Date;
}

export enum ComplianceType {
  DATA_ENCRYPTION = 'data_encryption',
  ACCESS_CONTROL = 'access_control',
  DATA_RETENTION = 'data_retention',
  PRIVACY_PROTECTION = 'privacy_protection',
}

// ============ API 响应格式 ============
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

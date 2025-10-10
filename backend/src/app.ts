import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';

// 加载环境变量
dotenv.config();

// 导入路由
import collectionRoutes from './modules/collection/collection.routes';
import analysisRoutes from './modules/analysis/analysis.routes';
import generationRoutes from './modules/generation/generation.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import authRoutes from './common/auth/auth.routes';

// 导入中间件
import { errorHandler } from './common/middleware/error.middleware';
import { requestLogger } from './common/middleware/logger.middleware';
import { authMiddleware } from './common/auth/auth.middleware';

// 导入数据库连接
import { connectPostgres } from './common/database/postgres';
import { connectMongoDB } from './common/database/mongodb';

// 导入日志工具
import logger from './common/logger';

class App {
  public app: Application;
  public server: http.Server;
  public io: Server;
  private port: number;

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = new Server(this.server, {
      cors: {
        origin: (origin, callback) => {
          // 允许的源列表
          const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:5173',
            'https://kniglt12.github.io',
            process.env.FRONTEND_URL
          ].filter((url): url is string => Boolean(url));

          // 允许所有 localhost 端口访问（开发环境）
          if (!origin || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
            callback(null, true);
          }
          // 检查是否在允许列表中
          else if (allowedOrigins.some((allowed) => origin.startsWith(allowed))) {
            callback(null, true);
          }
          else {
            callback(new Error('Not allowed by CORS'));
          }
        },
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });
    this.port = parseInt(process.env.PORT || '5000', 10);

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.initializeWebSocket();
  }

  private initializeMiddlewares(): void {
    // 安全中间件
    this.app.use(helmet());

    // CORS配置
    this.app.use(
      cors({
        origin: (origin, callback) => {
          // 允许的源列表
          const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:5173',
            'https://kniglt12.github.io',
            process.env.FRONTEND_URL
          ].filter((url): url is string => Boolean(url));

          // 允许所有 localhost 端口访问（开发环境）
          if (!origin || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
            callback(null, true);
          }
          // 检查是否在允许列表中
          else if (allowedOrigins.some((allowed) => origin.startsWith(allowed))) {
            callback(null, true);
          }
          else {
            callback(new Error('Not allowed by CORS'));
          }
        },
        credentials: true,
      })
    );

    // 请求解析
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '50mb' }));

    // 请求日志
    this.app.use(morgan('combined'));
    this.app.use(requestLogger);

    // 健康检查
    this.app.get('/health', (req: Request, res: Response) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
  }

  private initializeRoutes(): void {
    // 公开路由（不需要认证）
    this.app.use('/api/auth', authRoutes);

    // 需要认证的路由
    this.app.use('/api/collection', authMiddleware, collectionRoutes);
    this.app.use('/api/analysis', authMiddleware, analysisRoutes);
    this.app.use('/api/generation', authMiddleware, generationRoutes);
    this.app.use('/api/dashboard', authMiddleware, dashboardRoutes);

    // 404处理
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        message: 'Route not found',
      });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  private initializeWebSocket(): void {
    this.io.on('connection', (socket) => {
      logger.info(`WebSocket client connected: ${socket.id}`);

      // 加入房间（按会话ID）
      socket.on('join-session', (sessionId: string) => {
        socket.join(`session-${sessionId}`);
        logger.info(`Client ${socket.id} joined session ${sessionId}`);
      });

      // 离开房间
      socket.on('leave-session', (sessionId: string) => {
        socket.leave(`session-${sessionId}`);
        logger.info(`Client ${socket.id} left session ${sessionId}`);
      });

      socket.on('disconnect', () => {
        logger.info(`WebSocket client disconnected: ${socket.id}`);
      });
    });

    // 使WebSocket实例在应用中全局可用
    this.app.set('io', this.io);
  }

  private async connectDatabases(): Promise<void> {
    try {
      await connectPostgres();
      await connectMongoDB();
      logger.info('All databases connected successfully');
    } catch (error) {
      logger.warn('Database connection failed, running in demo mode:', error);
      // 演示模式：不退出程序，继续运行
    }
  }

  public async start(): Promise<void> {
    try {
      // 尝试连接数据库（失败也继续）
      await this.connectDatabases();

      // 启动服务器
      this.server.listen(this.port, () => {
        logger.info(`
          ╔═══════════════════════════════════════╗
          ║   教学辅助赋能平台 Backend Server    ║
          ║                                       ║
          ║   Server running on port ${this.port}         ║
          ║   Environment: ${process.env.NODE_ENV || 'development'}            ║
          ║                                       ║
          ║   API: http://localhost:${this.port}/api     ║
          ║   Health: http://localhost:${this.port}/health║
          ╚═══════════════════════════════════════╝
        `);
      });

      // 优雅关闭
      process.on('SIGTERM', this.gracefulShutdown.bind(this));
      process.on('SIGINT', this.gracefulShutdown.bind(this));
    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  private gracefulShutdown(): void {
    logger.info('Received shutdown signal, closing server gracefully...');
    this.server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });

    // 强制关闭超时
    setTimeout(() => {
      logger.error('Forced shutdown due to timeout');
      process.exit(1);
    }, 10000);
  }
}

// 启动应用
const app = new App();
app.start();

export default app;

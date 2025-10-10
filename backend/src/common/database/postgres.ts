import { Pool } from 'pg';
import logger from '../logger';

let pool: Pool | null = null;

export const connectPostgres = async (): Promise<Pool> => {
  if (pool) {
    return pool;
  }

  try {
    pool = new Pool({
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
      database: process.env.POSTGRES_DB || 'teaching_assistant',
      user: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // 测试连接
    const client = await pool.connect();
    logger.info('PostgreSQL connected successfully');
    client.release();

    return pool;
  } catch (error) {
    logger.error('Failed to connect to PostgreSQL:', error);
    throw error;
  }
};

export const getPool = (): Pool => {
  if (!pool) {
    throw new Error('PostgreSQL pool not initialized. Call connectPostgres() first.');
  }
  return pool;
};

export const query = async (text: string, params?: any[]) => {
  const pool = getPool();
  return pool.query(text, params);
};

export default {
  connectPostgres,
  getPool,
  query,
};

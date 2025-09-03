import { Pool } from 'pg';

interface PostgreSQLConfig {
  connectionString: string;
}

let postgresPool: Pool;

export const connectPostgreSQL = async (config: PostgreSQLConfig): Promise<Pool> => {
  try {
    postgresPool = new Pool({
      connectionString: config.connectionString,
    });
    
    await postgresPool.connect();
    console.log('✅ PostgreSQL connected successfully');
    
    return postgresPool;
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', error);
    process.exit(1);
  }
};

export const disconnectPostgreSQL = async (): Promise<void> => {
  try {
    if (postgresPool) {
      await postgresPool.end();
      console.log('✅ PostgreSQL disconnected successfully');
    }
  } catch (error) {
    console.error('❌ PostgreSQL disconnection error:', error);
  }
};

export const getPostgreSQLStatus = (): boolean => {
  return postgresPool ? postgresPool.totalCount > 0 : false;
};

export const getPostgresPool = (): Pool => {
  if (!postgresPool) {
    throw new Error('PostgreSQL pool not initialized. Call connectPostgreSQL first.');
  }
  return postgresPool;
};

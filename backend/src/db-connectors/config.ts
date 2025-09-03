interface Environment {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  MONGODB_URI: string;
  POSTGRES_URI: string;
  JWT_SECRET: string;
}

interface DatabaseConfig {
  mongodb: {
    uri: string;
    options?: {
      useNewUrlParser?: boolean;
      useUnifiedTopology?: boolean;
    };
  };
  postgresql: {
    connectionString: string;
  };
}

// Environment configuration
export const environment: Environment = {
  NODE_ENV: (process.env['NODE_ENV'] as 'development' | 'production' | 'test') || 'development',
  PORT: parseInt(process.env['PORT'] || '5000', 10),
  MONGODB_URI: process.env['MONGODB_URI'] || 'mongodb://admin:password123@mongodb:27017/crm?authSource=admin',
  POSTGRES_URI: process.env['POSTGRES_URI'] || 'postgresql://admin:password123@postgresql:5432/crm',
  JWT_SECRET: process.env['JWT_SECRET'] || 'your-super-secret-jwt-key-change-in-production'
};

// Database configuration
export const databaseConfig: DatabaseConfig = {
  mongodb: {
    uri: environment.MONGODB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },
  postgresql: {
    connectionString: environment.POSTGRES_URI
  }
};

export type { Environment, DatabaseConfig };

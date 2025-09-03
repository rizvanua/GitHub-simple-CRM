# Database Connectors

This module contains the database connection logic for MongoDB and PostgreSQL, separated from the main server file for better organization and maintainability.

## Structure

```
db-connectors/
├── index.ts          # Main exports
├── config.ts         # Database and environment configuration
├── mongodb.ts        # MongoDB connection logic
├── postgresql.ts     # PostgreSQL connection logic
└── README.md         # This file
```

## Configuration (`config.ts`)

### Environment Configuration

```typescript
interface Environment {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  MONGODB_URI: string;
  POSTGRES_URI: string;
  JWT_SECRET: string;
}
```

### Database Configuration

```typescript
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
```

### Exports

- `environment` - Environment configuration object
- `databaseConfig` - Database configuration object
- `Environment` - Environment interface type
- `DatabaseConfig` - Database configuration interface type

## MongoDB Connector (`mongodb.ts`)

### Functions

- `connectMongoDB(config: MongoDBConfig): Promise<void>` - Establishes connection to MongoDB
- `disconnectMongoDB(): Promise<void>` - Gracefully closes MongoDB connection
- `getMongoDBStatus(): boolean` - Returns connection status

### Configuration

```typescript
interface MongoDBConfig {
  uri: string;
  options?: {
    useNewUrlParser?: boolean;
    useUnifiedTopology?: boolean;
  };
}
```

## PostgreSQL Connector (`postgresql.ts`)

### Functions

- `connectPostgreSQL(config: PostgreSQLConfig): Promise<Pool>` - Establishes connection to PostgreSQL
- `disconnectPostgreSQL(): Promise<void>` - Gracefully closes PostgreSQL connection
- `getPostgreSQLStatus(): boolean` - Returns connection status
- `getPostgresPool(): Pool` - Returns the PostgreSQL pool instance

### Configuration

```typescript
interface PostgreSQLConfig {
  connectionString: string;
}
```

## Usage

```typescript
import { 
  connectMongoDB, 
  disconnectMongoDB, 
  getMongoDBStatus,
  connectPostgreSQL, 
  disconnectPostgreSQL, 
  getPostgreSQLStatus,
  getPostgresPool,
  environment,
  databaseConfig
} from './db-connectors';

// Use environment configuration
const PORT = environment.PORT;
const NODE_ENV = environment.NODE_ENV;

// Connect to databases using centralized config
await connectMongoDB(databaseConfig.mongodb);
await connectPostgreSQL(databaseConfig.postgresql);

// Get connection status
const mongoStatus = getMongoDBStatus();
const postgresStatus = getPostgreSQLStatus();

// Get PostgreSQL pool for models
const pool = getPostgresPool();

// Graceful shutdown
await disconnectMongoDB();
await disconnectPostgreSQL();
```

## Benefits

1. **Separation of Concerns**: Database connection logic is separated from server setup
2. **Centralized Configuration**: All database and environment configuration in one place
3. **Reusability**: Database connectors can be used in other parts of the application
4. **Testability**: Each connector can be tested independently
5. **Maintainability**: Easier to modify database connection logic without touching server code
6. **Error Handling**: Centralized error handling for database connections
7. **Type Safety**: Full TypeScript support with proper interfaces

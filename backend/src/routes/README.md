# Routes

This directory contains Express.js route handlers organized by feature.

## Structure

```
routes/
├── index.ts        # Route registration and configuration
├── auth.ts         # Authentication routes (login, register)
├── health.ts       # Health check route
├── projects.ts     # Project management routes (CRUD)
├── github.ts       # GitHub integration routes
└── README.md       # This file
```

## Route Registration (`index.ts`)

### Purpose
Centralized route registration that automatically registers all API routes with the Express application.

### Functions
- `useEndpoints(app: Express)` - Registers all API routes with the Express app

### Configuration
```typescript
const API_ENDPOINTS = [
  { route: "/api/auth", function: authRoutes },
  { route: "/api/projects", function: projectRoutes },
  { route: "/api/github", function: githubRoutes },
] as const;
```

### Usage
```typescript
import { useEndpoints } from './routes';

// Register all routes
useEndpoints(app);
```

## Health Check Route (`health.ts`)

### Purpose
Provides system health status and database connection monitoring.

### Functions
- `healthCheckHandler` - Returns health status of database connections

### Endpoints
- `GET /health` - Get system health status

### Response Format
```json
{
  "status": "healthy",
  "mongodb": true,
  "postgresql": true,
  "timestamp": "2025-09-04T07:09:15.838Z"
}
```

### Features
- Database connection status monitoring
- Real-time health checks
- Timestamp for monitoring purposes

## Authentication Routes (`auth.ts`)

### Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Features
- JWT token generation
- Password hashing with bcrypt
- Input validation
- Error handling

## Project Routes (`projects.ts`)

### Endpoints
- `GET /api/projects` - Get user's projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Features
- User-specific project filtering
- CRUD operations
- Input validation
- Authentication required

## GitHub Routes (`github.ts`)

### Endpoints
- `GET /api/github/check/:repoPath` - Check if repository exists
- `POST /api/github` - Add GitHub repository to projects

### Features
- GitHub API integration
- Repository validation
- Data fetching from GitHub
- Authentication required

## Benefits

1. **Centralized Registration**: All routes are registered in one place
2. **Modularity**: Each route module handles a specific feature
3. **Maintainability**: Easy to add, remove, or modify routes
4. **Consistency**: Standardized route structure across the application
5. **Type Safety**: Full TypeScript support with proper interfaces
6. **Scalability**: Easy to add new route modules
7. **Health Monitoring**: Built-in system health monitoring

## Best Practices

1. **Route Organization**: Group routes by feature/domain
2. **Middleware**: Apply authentication middleware to protected routes
3. **Validation**: Use input validation for all routes
4. **Error Handling**: Consistent error responses across all routes
5. **Documentation**: Document complex route logic
6. **Testing**: Test each route module independently
7. **Health Monitoring**: Use health check for system monitoring

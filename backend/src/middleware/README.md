# Middleware

This directory contains Express.js middleware functions that handle cross-cutting concerns across the application.

## Structure

```
middleware/
├── auth.ts           # Authentication middleware
├── cors.ts           # CORS configuration middleware
├── errorHandler.ts   # Global error handling middleware
└── README.md         # This file
```

## Authentication Middleware (`auth.ts`)

### Purpose
Handles JWT token validation and user authentication for protected routes.

### Functions
- `authMiddleware` - Validates JWT tokens and attaches user to request
- `setUserModel` - Dependency injection for UserModel

### Usage
```typescript
import { authMiddleware } from './middleware/auth';

// Apply to protected routes
app.use('/api/projects', authMiddleware, projectRoutes);
```

## CORS Middleware (`cors.ts`)

### Purpose
Handles Cross-Origin Resource Sharing (CORS) configuration for the API.

### Functions
- `corsMiddleware` - Standard CORS configuration for development
- `corsDevMiddleware` - Development CORS (allows all origins)
- `corsProdMiddleware` - Production CORS (restricted origins)

### Configuration
- **Origin**: Allows requests from `http://localhost:3000` and `http://127.0.0.1:3000`
- **Credentials**: Enabled for authentication
- **Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Headers**: Content-Type, Authorization

### Usage
```typescript
import { corsMiddleware } from './middleware/cors';

// Apply CORS middleware
app.use(corsMiddleware);
```

### Environment Variables
- `FRONTEND_URL` - Frontend URL for production CORS (optional)

## Error Handler Middleware (`errorHandler.ts`)

### Purpose
Global error handling middleware that catches and processes all application errors.

### Functions
- `errorHandler` - Global error handler function
- `AppError` - Error interface type

### Features
- Logs error stack traces
- Returns consistent error response format
- Handles both operational and programming errors
- Sets appropriate HTTP status codes

### Response Format
```json
{
  "success": false,
  "error": "Error message"
}
```

### Usage
```typescript
import { errorHandler } from './middleware/errorHandler';

// Apply as the last middleware
app.use(errorHandler);
```

## Benefits

1. **Separation of Concerns**: Each middleware handles a specific cross-cutting concern
2. **Reusability**: Middleware can be applied to multiple routes
3. **Consistency**: Standardized error handling and authentication across the application
4. **Maintainability**: Centralized logic for common functionality
5. **Testability**: Each middleware can be tested independently
6. **Type Safety**: Full TypeScript support with proper interfaces
7. **Environment Flexibility**: Different CORS configurations for different environments

## Best Practices

1. **Order Matters**: Apply middleware in the correct order (CORS → auth → routes → error handler)
2. **Error Handling**: Always use the global error handler as the final middleware
3. **Authentication**: Apply auth middleware to all protected routes
4. **CORS**: Apply CORS middleware early in the middleware chain
5. **Dependency Injection**: Use setter functions for dependency injection when needed
6. **Environment Configuration**: Use appropriate CORS configuration for each environment

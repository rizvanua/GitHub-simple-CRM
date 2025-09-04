# Middleware

This directory contains Express.js middleware functions that handle cross-cutting concerns across the application.

## Structure

```
middleware/
├── auth.ts           # Authentication middleware
├── cors.ts           # CORS configuration middleware
├── errorHandler.ts   # Global error handling middleware
├── notFound.ts       # 404 Not Found middleware
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

## 404 Not Found Middleware (`notFound.ts`)

### Purpose
Handles requests to routes that don't exist in the application.

### Functions
- `notFoundHandler` - 404 handler function

### Features
- Returns consistent 404 response format
- Must be placed after all route definitions
- Provides clear error message for missing routes

### Response Format
```json
{
  "success": false,
  "error": "Route not found"
}
```

### Usage
```typescript
import { notFoundHandler } from './middleware/notFound';

// Apply after all routes but before error handler
app.use('*', notFoundHandler);
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

1. **Order Matters**: Apply middleware in the correct order (CORS → auth → routes → 404 → error handler)
2. **Error Handling**: Always use the global error handler as the final middleware
3. **Authentication**: Apply auth middleware to all protected routes
4. **CORS**: Apply CORS middleware early in the middleware chain
5. **404 Handler**: Apply 404 handler after all routes but before error handler
6. **Dependency Injection**: Use setter functions for dependency injection when needed
7. **Environment Configuration**: Use appropriate CORS configuration for each environment

## Middleware Order

The correct order for applying middleware is:

1. **CORS** - Handle cross-origin requests
2. **Authentication** - Validate user tokens for protected routes
3. **Routes** - Application route handlers
4. **404 Handler** - Handle non-existent routes
5. **Error Handler** - Handle all errors (must be last)

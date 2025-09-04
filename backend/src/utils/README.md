# Utils

This directory contains utility functions and helpers that provide common functionality across the application.

## Structure

```
utils/
├── gracefulShutdown.ts   # Graceful shutdown handlers
└── README.md             # This file
```

## Graceful Shutdown (`gracefulShutdown.ts`)

### Purpose
Handles graceful shutdown of the application by properly closing database connections and handling various termination signals.

### Functions

#### `gracefulShutdown(signal: string): Promise<void>`
- Handles the actual shutdown process
- Closes MongoDB and PostgreSQL connections
- Logs shutdown progress
- Exits the process with appropriate exit codes

#### `setupGracefulShutdown(): void`
- Sets up event listeners for various termination signals
- Handles SIGTERM (termination signal)
- Handles SIGINT (interrupt signal - Ctrl+C)
- Handles uncaught exceptions
- Handles unhandled promise rejections

### Signal Handlers

1. **SIGTERM**: Termination signal (e.g., from Docker stop command)
2. **SIGINT**: Interrupt signal (e.g., Ctrl+C in terminal)
3. **Uncaught Exception**: Handles unexpected errors
4. **Unhandled Rejection**: Handles unhandled promise rejections

### Usage

```typescript
import { setupGracefulShutdown } from './utils/gracefulShutdown';

// Setup graceful shutdown handlers
setupGracefulShutdown();
```

### Features

- **Database Cleanup**: Properly closes MongoDB and PostgreSQL connections
- **Error Handling**: Handles errors during shutdown process
- **Logging**: Provides clear logging of shutdown progress
- **Signal Management**: Handles multiple types of termination signals
- **Process Exit**: Ensures clean process termination

## Benefits

1. **Centralized Shutdown Logic**: All shutdown handling in one place
2. **Comprehensive Signal Handling**: Handles various termination scenarios
3. **Database Cleanup**: Ensures proper connection closure
4. **Error Resilience**: Handles errors during shutdown
5. **Reusability**: Can be used across different parts of the application
6. **Maintainability**: Easy to modify shutdown behavior

## Best Practices

1. **Early Setup**: Call `setupGracefulShutdown()` early in the application lifecycle
2. **Error Handling**: Always handle potential errors during shutdown
3. **Logging**: Provide clear logging for debugging shutdown issues
4. **Timeout Handling**: Consider adding timeouts for long-running shutdown operations
5. **Resource Cleanup**: Ensure all resources are properly cleaned up

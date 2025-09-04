import { disconnectMongoDB, disconnectPostgreSQL } from '../db-connectors';

/**
 * Handles graceful shutdown of the application
 * Closes database connections and exits the process
 */
const gracefulShutdown = async (signal: string): Promise<void> => {
  console.log(`${signal} received, shutting down gracefully`);
  
  try {
    // Close database connections
    await disconnectMongoDB();
    await disconnectPostgreSQL();
    
    console.log('✅ All connections closed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during graceful shutdown:', error);
    process.exit(1);
  }
};

/**
 * Sets up graceful shutdown handlers for SIGTERM and SIGINT signals
 */
export const setupGracefulShutdown = (): void => {
  // Handle SIGTERM (termination signal)
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  
  // Handle SIGINT (interrupt signal - Ctrl+C)
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  
  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    gracefulShutdown('UNCAUGHT_EXCEPTION');
  });
  
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('UNHANDLED_REJECTION');
  });
};

export { gracefulShutdown };

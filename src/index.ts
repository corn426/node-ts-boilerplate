import { config } from 'dotenv';
import { logger } from './utils/logger';

// Load environment variables
config();

async function main() {
  logger.info('🚀 Node.js TypeScript Boilerplate');
  logger.info('================================');
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`Node version: ${process.version}`);
  
  // Your main application logic here
  logger.info('✅ Application started successfully!');
}

// Run the main function
main()
  .then(() => {
    logger.info('✅ Completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    logger.error('❌ Error occurred', { error });
    process.exit(1);
  });

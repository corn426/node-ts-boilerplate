/**
 * Winston Logger Configuration
 * 
 * Usage:
 *   import { logger } from './utils/logger';
 *   
 *   logger.info('Information message');
 *   logger.error('Error message', { error: err });
 *   logger.debug('Debug message', { data: someData });
 */

import winston from 'winston';

// 환경 변수에서 로그 레벨 설정 (기본값: info)
const logLevel = process.env.LOG_LEVEL || 'info';

// 커스텀 포맷: 타임스탬프 + 레벨 + 메시지
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}]: ${message}${metaStr}`;
  })
);

// 컬러 포맷 (콘솔용)
const colorFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level}: ${message}${metaStr}`;
  })
);

// Winston 로거 생성
export const logger = winston.createLogger({
  level: logLevel,
  format: customFormat,
  transports: [
    // 콘솔 출력 (컬러)
    new winston.transports.Console({
      format: colorFormat,
    }),
    // 파일 출력 - 모든 로그
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: customFormat,
    }),
    // 파일 출력 - 에러만
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: customFormat,
    }),
  ],
});

// 프로덕션이 아닐 때는 debug 레벨도 활성화
if (process.env.NODE_ENV !== 'production') {
  logger.level = 'debug';
}

/**
 * 특정 prefix를 가진 child logger 생성
 * 
 * @param prefix - 로그 앞에 붙을 접두사
 * @returns child logger instance
 * 
 * @example
 * const myLogger = createLogger('MyModule');
 * myLogger.info('This is my module'); // [timestamp] [INFO]: [MyModule] This is my module
 */
export const createLogger = (prefix: string) => {
  return logger.child({ service: prefix });
};

export default logger;

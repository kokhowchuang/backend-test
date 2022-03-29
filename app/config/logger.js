import * as winston from 'winston';
import * as fs from 'fs';

const logDir = 'log';
const tsFormat = new Date().toLocaleTimeString();

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

export const logger = new winston.createLogger({
  transports: [
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      level: 'info'
    }),
    new (require('winston-daily-rotate-file'))({
      filename: `${logDir}/-results.log`,
      timestamp: tsFormat,
      datePattern: 'yyyy-MM-D',
      prepend: true,
      level: process.env.NODE_ENV === 'development' ? 'verbose' : 'info'
    })
  ]
});

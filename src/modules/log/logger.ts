import * as winston from 'winston';

import { loglevelColors } from './loglevel-colors';
import { getTransport } from './transports';

winston.addColors(loglevelColors);

export const appLoglevels = {
  error:   0,
  warn:    1,
  info:    2,
  verbose: 3,
  debug:   4,
  silly:   5
};

const appLogger = new winston.Logger({
  transports: [
    getTransport('app', 'console'),
    getTransport('app', 'file')
  ]
});

appLogger.setLevels(appLoglevels);

export const logger = appLogger;

import * as winston from 'winston';
import * as stripAnsi from 'strip-ansi';

import { loglevelColors } from './loglevel-colors';
import { getTransport } from './transports';

winston.addColors(loglevelColors);

export const serverLoglevels = {
  error:    0,
  info:     1,
  response: 2,
  request:  3,
  ops:      4
};

const logger = new winston.Logger({

  filters: [

    (level, msg, meta) => {
      // remove internal timestamp (use winston timestamps instead)
      msg = msg.replace(/^\d+\/\d+\.\d+,\s/, '');
      // remove internal log tags (use winston loglevels instead)
      msg = msg.replace(/^\[\w+\]\s/, '');
      // remove ansi colors and trim
      msg = stripAnsi(msg).trim();
      return msg;
    }

  ],

  transports: [
    getTransport('server', 'console'),
    getTransport('server', 'file')
  ]

});

logger.setLevels(serverLoglevels);

export const serverLogger = logger;

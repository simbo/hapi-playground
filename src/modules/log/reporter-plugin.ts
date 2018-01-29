import * as GoodWinston from 'good-winston';
import * as good from 'good';

import { config } from './../server/config';
import { serverLogger } from './server-logger';

export const reporterPlugin = {

  name: 'reporter',

  async register(server, options) {

    const goodWinston = new GoodWinston({
      winston: serverLogger,
      level: {
        error: 'error',
        other: 'info',
        ops: 'ops',
        request: 'request',
        response: 'response'
      }
    });

    await server.register({
      plugin: good,
      options: {
        ops: {
          interval: config.log.opsInterval
        },
        reporters: {
          winston: [goodWinston]
        }
      }
    });

  }

};

import { join } from 'path';
import * as dotenv from 'dotenv';
import Chalk from 'chalk';

dotenv.config({
  path: join(__dirname, '.env')
});

import { logger } from './modules/log/logger';
import { initServer } from './modules/server/server';
import { config } from './modules/server/config';

initServer({
  host: config.connection.host,
  port: config.connection.port
})
  .then((server) => {
    logger.info([
      '✅ ',
      Chalk.bold('App started.'),
      `Listening on ${server.info.host}:${server.info.port}…`
    ].join(' '));
  })
  .catch((err) => {
    logger.error(err);
  });

export const config = {

  connection: {
    host: process.env.APP_HTTP_INTERFACE,
    port: parseInt(process.env.APP_HTTP_PORT, 10)
  },

  log: {

    path: process.env.APP_LOG_PATH,

    // interval to log server system and process performance (cpu, memory, disk,…)
    opsInterval: 1000 * 60 * 15,

    transports: {

      server: {
        console: {
          level: 'ops',
          silent: false
        },
        file: {
          level: 'ops',
          silent: process.env.APP_LOG_PATH === ''
        }
      },

      app: {
        console: {
          level: 'silly',
          silent: false
        },
        file: {
          level: 'silly',
          silent: process.env.APP_LOG_PATH === ''
        }
      }

    }

  }

};

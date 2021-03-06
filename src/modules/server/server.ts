import { Server } from 'hapi';
import * as Inert from 'inert';
import * as Vision from 'vision';
import * as Accept from 'accept';

import { reporterPlugin } from './../log/reporter-plugin';
import { authPlugin } from './../auth/auth-plugin';
import { stylistPlugin } from './../stylist/stylist-plugin';
import { viewManager } from './view-manager';
import { routes } from './routes';

const plugins = [
  reporterPlugin,
  authPlugin,
  Inert,
  Vision,
  stylistPlugin
];

export async function initServer(options): Promise<Server> {

  const server = new Server(options);

  await server.register(plugins);

  server.views(viewManager);

  server.route(routes);

  server.ext('onPreResponse', async (req, h) => {

    // if response is error and preferred mediatype is html, respond with error view
    if (
      req.response.isBoom &&
      Accept.parseAll(req.headers).mediaTypes[0] === 'text/html'
    ) {
      return h.view('error', { error: req.response })
        .code(req.response.output.statusCode);
    }
    return h.continue;

  });

  await server.start();

  return server;

}

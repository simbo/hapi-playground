import { authScheme } from './auth-scheme';
import { generateToken } from './token-helpers';

export const authPlugin = {

  name: 'auth',

  async register(server, options) {

    server.auth.scheme('jwt', authScheme);
    server.auth.strategy('jwt', 'jwt');

    server.route([

      {
        method: 'get',
        path: '/token',
        async handler(req, h) {
          const token = await generateToken();
          return h.response({ token })
            .header('Authorization', `Bearer ${token}`);
        }
      }

    ])

  }

};

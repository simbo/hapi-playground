import * as Boom from 'boom';

import { TokenData } from './token-data.interface';
import { verifyToken, tokenFromRequest } from './token-helpers';

export function authScheme(server, options) {
  return {
    async authenticate(request, h) {
      let credentials: TokenData;
      try {
        const token = tokenFromRequest(request);
        let credentials = await verifyToken(token);
      } catch (err) {
        throw Boom.unauthorized();
      }
      return h.authenticated({ credentials });
    }
  };
}

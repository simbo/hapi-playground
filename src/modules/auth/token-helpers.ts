import { sign, verify, decode } from 'jsonwebtoken';
import * as uuid from 'uuid/v4';
import { TokenData } from './token-data.interface';

const jwtSecret = process.env.APP_JWT_SECRET;

export const tokenPattern = /^Bearer\s([A-Za-z0-9\._]+)$/;

export function generateToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    const data: TokenData = {
      id: uuid()
    };
    sign(data, jwtSecret, {}, (err, token) => {
      if (err) reject(err);
      else resolve(token);
    });
  });
}

export async function verifyToken(token: string): Promise<TokenData> {
  return await new Promise<TokenData>((resolve, reject) => {
    verify(token, jwtSecret, {}, (err, credentials) => {
      if (err) reject(err);
      else resolve(credentials as TokenData);
    });
  });
}

export function decodeToken(token: string): TokenData {
  return decode(token) as TokenData;
}

export function tokenFromRequest(request): string {
  const auth = request.raw.req.headers.authorization;
  if (auth && typeof auth === 'string') {
    const match = auth.match(tokenPattern);
    if (match && match.length === 2) {
      return match[1];
    }
  }
  return null;
}

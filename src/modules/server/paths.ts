import { join, dirname } from 'path';

const srcPath = dirname(dirname(__dirname));
const rootPath = dirname(srcPath);

function baseJoin(basePath) {
  return (...trailers: string[]) => join(basePath, ...trailers)
}

export const src = baseJoin(srcPath);
export const root = baseJoin(rootPath);

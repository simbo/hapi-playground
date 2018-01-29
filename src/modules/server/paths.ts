import { join, dirname } from 'path';

const srcPath = dirname(dirname(__dirname));
const rootPath = dirname(srcPath);

export const src = (...trailers: string[]) => join(srcPath, ...trailers);
export const root = (...trailers: string[]) => join(rootPath, ...trailers);

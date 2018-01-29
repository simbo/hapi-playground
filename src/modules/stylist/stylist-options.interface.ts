import { StylistRenderer } from './stylist-renderer.interface';

export interface StylistOptions {
  cache: any;
  postcssPlugins: any[];
  stylesBasePath: string;
  renderers: StylistRenderer[];
  routeBasePath: string;
  importPaths: string[];
}

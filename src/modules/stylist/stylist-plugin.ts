import { basename, dirname, join } from 'path';
import * as autoprefixer from 'autoprefixer';
import * as cssnano from 'cssnano';
import * as cssMqpacker from 'css-mqpacker';

import { src, root } from './../server/paths';
import { Stylist } from './stylist';
import { StylistOptions } from './stylist-options.interface';
import { CssRenderer } from './renderers/css-renderer';
import { StylusRenderer } from './renderers/stylus-renderer';
import { ScssRenderer } from './renderers/scss-renderer';

/**
 * Stylist
 *
 * This plugin handles css and respective sourcemap routes by generating css
 * on-thy-fly using one or more renderers (stylus, scss,...) with postcss or
 * returning cached results using hapi's server cache policy.
 */

export const stylistPlugin = {

  name: 'stylist',

  async register(server, options) {

    const stylistOptions: StylistOptions = {
      routeBasePath: '/styles',
      stylesBasePath: src('styles'),
      renderers: [
        CssRenderer,
        StylusRenderer
        // ScssRenderer
      ],
      cache: {
        expiresIn: 24 * 60 * 60 * 1000
      },
      postcssPlugins: [
        autoprefixer({
          browsers: [
            'last 2 versions',
            '> 0.2%'
          ],
          remove: false
        }),
        cssMqpacker(),
        cssnano({
          zindex: false
        })
      ],
      importPaths: [
        src('styles', 'imports'),
        root('node_modules')
      ]
    };

    const stylist = new Stylist(server, stylistOptions);

    await stylist.initialize();

  }

};

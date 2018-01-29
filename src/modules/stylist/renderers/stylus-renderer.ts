import * as Boom from 'boom';
import * as stylus from 'stylus';

import { StylistRenderer } from './../stylist-renderer.interface';

export const StylusRenderer: StylistRenderer = {

  type: 'styl',

  async render(source, options) {
    return await new Promise<string>((resolve, reject) => {
      stylus(source.contents)
        .set('filename', source.filename)
        .set('sourcemap', { inline: true })
        .set('paths', options.importPaths)
        .render((err, css) => {
          if (err) reject(Boom.boomify(err));
          else resolve(css);
        });
    });
  }

};

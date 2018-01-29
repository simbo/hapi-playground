import * as Boom from 'boom';
import * as sass from 'node-sass';

import { StylistRenderer } from './../stylist-renderer.interface';

export const ScssRenderer: StylistRenderer = {

  type: 'scss',

  async render(source, options) {
    return await new Promise<string>((resolve, reject) => {
      sass.render({
        file: source.filename,
        data: source.contents,
        includePaths: options.importPaths,
        sourceMapEmbed: true
      }, (err, result) => {
        if (err) reject(Boom.boomify(err));
        else resolve(result.css.toString());
      });
    });
  }

};

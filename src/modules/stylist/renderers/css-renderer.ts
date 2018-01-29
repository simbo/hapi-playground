import { StylistRenderer } from './../stylist-renderer.interface';

export const CssRenderer: StylistRenderer = {

  type: 'css',

  async render(source, options) {
    return source.contents;
  }

};

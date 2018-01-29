import { basename, extname, dirname, join } from 'path';
import { readFile, stat } from 'fs';
import { Server } from 'hapi';
import * as denodeify from 'denodeify';
import * as Boom from 'boom';
import * as postcss from 'postcss';

import { StylistOptions } from './stylist-options.interface';
import { StylistSource } from './stylist-source.interface';
import { StylistResult } from './stylist-result.interface';
import { StylistRenderer } from './stylist-renderer.interface';

export class Stylist {

  private readonly cache;
  private readonly renderers: { [type: string]: StylistRenderer };
  private readonly renderTypes: string[];

  constructor(
    private readonly server: Server,
    private readonly options: StylistOptions
  ) {
    this.cache = this.server.cache(this.options.cache);
    this.renderers = this.options.renderers
      .reduce((renderers, renderer) => {
        renderers[renderer.type] = renderer;
        return renderers;
      }, {});
    this.renderTypes = Object.keys(this.renderers);
  }

  public async initialize(): Promise<void> {
    this.server.route({
      method: 'get',
      path: `${this.options.routeBasePath}/{any*}`,
      handler: async (req, h) => {
        if (!/\.css(\.map)?$/.test(req.path)) throw Boom.notFound();
        const contents = await this.getStyles(req.path);
        const type = extname(req.path) === '.map'
            ? 'application/octet-stream' : 'text/css';
        return h.response(contents).type(type);
      }
    });
  }

  public async getStyles(
    requestPath: string,
    forceGenerate: boolean = false
  ): Promise<string> {
    if (!forceGenerate) {
      const cached = await this.cache.get(requestPath);
      if (cached) return cached;
    }
    const styles = await this.generateStyles(requestPath);
    if (extname(requestPath) === '.map') return styles.map;
    return styles.css;
  }

  private async generateStyles(requestPath: string): Promise<StylistResult> {
    const requestExt = extname(requestPath) === '.map' ? '.css.map' : '.css';
    const requestCssPath = join(
      dirname(requestPath), `${basename(requestPath, requestExt)}.css`
    );
    const source = await this.getStylistSource(requestCssPath);
    if (!source) throw Boom.notFound();
    const renderer = this.renderers[source.type];
    const renderResult = await renderer.render(source, this.options);
    const result = await this.applyPostcss(renderResult, source);
    await this.cache.set(requestCssPath, result.css);
    await this.cache.set(`${requestCssPath}.map`, result.map);
    return result;
  }

  private async getStylistSource(requestPath: string): Promise<StylistSource> {
    const requestRelativePath = requestPath.replace(
      new RegExp(`^(${this.options.routeBasePath.replace('/', '\/')})?\/`), ''
    );
    const filePathBasename = join(
      dirname(requestRelativePath), basename(requestRelativePath, '.css')
    );
    let type: string;
    let contents: string;
    let filename: string;
    let i = 0;
    while (i < this.renderTypes.length && !contents) {
      try {
        type = this.renderTypes[i++];
        filename = join(
          this.options.stylesBasePath, `${filePathBasename}.${type}`
        );
        contents = (await denodeify(readFile)(filename)).toString();
      } catch (err) {
        type = filename = contents = null;
      }
    }
    if (!contents) return null;
    return { type, filename, contents };
  }

  private async applyPostcss(
    contents: string,
    source: StylistSource
  ): Promise<StylistResult> {
    const processor = postcss(this.options.postcssPlugins);
    return await new Promise<StylistResult>((resolve, reject) => {
      processor
        .process(contents, {
          from: source.filename,
          to: `${basename(source.filename, `.${source.type}`)}.css`,
          map: { inline: false }
        })
        .then((result) => {
          const css = result.css;
          const map = result.map.toString();
          resolve({ css, map });
        })
        .catch((err) => {
          if (err.name === 'CssSyntaxError') reject(new Boom(err.message));
          else reject(Boom.boomify(err));
        });
    });
  }

}

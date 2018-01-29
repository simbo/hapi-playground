import * as Pug from 'pug';

import { src } from './paths';

interface RenderFunction {
  (
    context: Pug.LocalsObject,
    options: Pug.Options,
    callback: (err: Error, html?: string) => void
  ): void;
}

const defaultOptions = {
  pretty: false
};

function compile(
  template: string,
  options: Pug.Options,
  done: (err: Error, view?: RenderFunction) => void
): void {
  options = { ...defaultOptions, ...options };
  try {
    const render = Pug.compile(template, options);
    done(null, renderFunctionFactory(render, options));
  } catch (err) {
    done(err);
  }
};

function renderFunctionFactory(
  render: Pug.compileTemplate,
  globalOptions: Pug.Options
): RenderFunction {
  return (context, options, done) => {
    options = { ...globalOptions, ...options };
    try {
      const output = render(context);
      done(null, output);
    } catch (err) {
      done(err);
    }
  };
}

export const viewManager = {
  engines: {
    pug: {
      module: { compile },
      compileMode: 'async'
    }
  },
  path: src('views')
};

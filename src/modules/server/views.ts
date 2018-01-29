import * as Pug from 'pug';

import { src } from './paths';

interface CompileFunction {
  (
    template: string,
    options: Pug.Options,
    callback: CompileFunctionCallback
  ): void;
}

interface CompileFunctionCallback {
  (err: Error, view?: ViewFunction): void;
}

interface ViewFunction {
  (
    context: Pug.LocalsObject,
    options: Pug.Options,
    callback: ViewFunctionCallback
  ): void;
}

interface ViewFunctionCallback {
  (err: Error, html?: string): void;
}

const defaultOptions = {
  pretty: false
};

const compile: CompileFunction = (template, options, done) => {
  options = { ...defaultOptions, ...options };
  try {
    const render = Pug.compile(template, options);
    done(null, viewFunctionFactory(render, options));
  } catch (err) {
    done(err);
  }
};

function viewFunctionFactory(
  render: Pug.compileTemplate,
  globalOptions: Pug.Options
): ViewFunction {
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

export const views = {
  engines: {
    pug: {
      module: { compile },
      compileMode: 'async'
    }
  },
  path: src('views')
};

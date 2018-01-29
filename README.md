hapi-playground
=================

> A node webserver playground using hapi 17 and typescript.

---

## Features [WIP]

  - [x] static file serving using [inert](https://github.com/hapijs/inert)

  - [x] view management using [vision](https://github.com/hapijs/vision)
    and [pug](https://github.com/pugjs/pug)

  - [x] monitoring and logging using [good](https://github.com/hapijs/good)
    and [winston](https://github.com/winstonjs/winston)

  - [x] custom error views

  - [x] on-the-fly css processing and caching using custom renderers
    ([stylus](https://github.com/stylus/stylus),
    [scss](https://github.com/sass/node-sass), whatever)
    and [postcss](https://github.com/postcss/postcss) with plugins
  
  - [ ] on-the-fly js processing, bundling and caching

  - [x] auth strategy using jwt

  - [ ] interactive debugging console using [tv](https://github.com/hapijs/tv)

  - [ ] generated api documentation using [lout](https://github.com/hapijs/lout)


## Development Usage

With node.js 8.9.x present, you can just install dependencies and use
`package.json` scripts as usual.  
Using `yarn` instead of `npm` is recommended.

You can also use `docker-compose` to provide the environment. For example:

``` sh
# install dependencies
docker-compose run --rm app yarn
# run dev service
docker-compose run --rm -p 3000:3000 app yarn dev
# open a shell
docker-compose run --rm app sh -l
```

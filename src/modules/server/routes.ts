import { src } from './paths';

export const routes = [

  // index view
  {
    method: 'get',
    path: '/',
    handler: (req, h) => h.view('index')
  },

  // serve static files from /public
  {
    method: 'get',
    path: '/{any*}',
    handler: {
      directory: {
        path: src('public')
      }
    }
  }

];

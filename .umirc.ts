import { defineConfig } from 'dumi';

export default defineConfig({
  title: '重学ES6',
  mode: 'doc',
  // routes: [
  //   { path: '/', component: './src/index.md' },
  //   { path: '/let-const', component: './src/let-const.md' },
  //   { path: '/destructuring', component: './src/destructuring.md' },
  // ],
  history: {
    type: 'hash'
  }
  // more config: https://d.umijs.org/config
});

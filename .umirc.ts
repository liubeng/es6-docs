import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'ES6知识点梳理',
  mode: 'doc',
  // routes: [
  //   { path: '/', component: './src/index.md' },
  //   { path: '/let-const', component: './src/let-const.md' },
  //   { path: '/destructuring', component: './src/destructuring.md' },
  // ],
  history: {
    type: 'hash'
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/doc-sit/' : '/',
  navs: [
    null,
    { title: 'GitHub', path: 'https://github.com/liubeng' }
  ]
  // more config: https://d.umijs.org/config
});

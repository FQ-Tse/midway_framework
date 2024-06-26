import { MidwayConfig } from '@midwayjs/core';

// 这是尝试用midway写的web框架
export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1717550208204_7961',
  koa: {
    port: 7001,
  },
  jwt: {
    secret: 'fq-tse', // fs.readFileSync('xxxxx.key')
    expiresIn: '2h', // https://github.com/vercel/ms
  },
  passport: {
    session: false,
  },
} as MidwayConfig;

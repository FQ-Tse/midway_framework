import { MidwayConfig } from '@midwayjs/core';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1717550208204_7961',
  koa: {
    port: 7001,
  },
  jwt: {
    secret: 'fq-tse', // fs.readFileSync('xxxxx.key')
    sign: {
      // signOptions
      expiresIn: '2d', // https://github.com/vercel/ms
    },
    verify: {
      // verifyOptions
    },
    decode: {
      // decodeOptions
    },
  },
  // close user data save to session
  passport: {
    session: false,
  },
  // csrf status
  security: {
    csrf: {
      enable: false,
    },
  },
} as MidwayConfig;

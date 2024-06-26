import { Controller, Get, Inject } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
// import _ = require('lodash');

@Controller('/')
export class HomeController {
  @Inject()
  ctx: Context;
  @Get('/')
  async home(): Promise<any> {
    // const array = [1, 2, 3];
    // return array.reduce((cur, acc) => {
    //   return cur + acc;
    // }, 0);
    // const arrayObj = [
    //   { dir: 'left', code: 97 },
    //   { dir: 'right', code: 100 },
    // ];
    // return _.keyBy(arrayObj, n => n.dir);

    // const users = [
    //   { user: 'fred', age: 48 },
    //   { user: 'barney', age: 34 },
    //   { user: 'fred', age: 40 },
    //   { user: 'barney', age: 36 },
    // ];
    //
    // const array = [];
    // // return _.orderBy(users, ['user', 'age'], ['asc', 'desc']);
    // users.forEach(u => {
    //   if (u.age === 48) {
    //     array.push(u);
    //   }
    // });
    //
    // return array;

    const str = "<script>alert('xss')</script>";
    const escapedStr = this.ctx.security.escape(str);
    console.log(escapedStr);
    // &lt;script&gt;alert(&quot;xss&quot;) &lt;/script&gt;
    return escapedStr;
  }
}

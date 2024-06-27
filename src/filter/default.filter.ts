import { Catch } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

@Catch()
export class DefaultErrorFilter {
  async catch(err: Error, ctx: Context) {
    // throw error log
    ctx.logger.error(new Error(err.message));
    // 所有的未分类错误会到这里
    return {
      success: false,
      message: err.message,
    };
  }
}

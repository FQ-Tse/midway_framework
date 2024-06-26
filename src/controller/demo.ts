import { Controller, Get, Inject, Post, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { MidwayI18nService } from '@midwayjs/i18n';

@Controller('/api/demo')
export class Demo {
  @Inject()
  ctx: Context;

  @Inject()
  i18nService: MidwayI18nService;

  @Post('/test')
  async test() {
    return this.ctx.headers;
  }

  @Get('/i18n')
  async index(@Query('username') username: string) {
    return await this.i18nService.translate('hello', {
      args: {
        username,
      },
      locale: 'en_US',
    });
  }
}

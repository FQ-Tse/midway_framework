import { Configuration, App } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import { join } from 'path';
import { ReportMiddleware } from './middleware/report.middleware';
import * as passport from '@midwayjs/passport';
import * as jwt from '@midwayjs/jwt';
import * as security from '@midwayjs/security';
import { JwtMiddleware } from './middleware/jwt.middleware';
import * as i18n from '@midwayjs/i18n';
import { NotFoundFilter } from './filter/notfound.filter';
import { DefaultErrorFilter } from './filter/default.filter';
import * as swagger from '@midwayjs/swagger';
import * as typeorm from '@midwayjs/typeorm';
import * as redis from '@midwayjs/redis';

@Configuration({
  imports: [
    koa,
    validate,
    security,
    passport,
    jwt,
    i18n,
    info,
    swagger,
    typeorm,
    redis,
    {
      component: [info, swagger],
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [join(__dirname, './config')],
})
export class MainConfiguration {
  @App('koa')
  app: koa.Application;

  async onReady() {
    // add middleware
    this.app.useMiddleware([ReportMiddleware, JwtMiddleware]);
    // add filter
    this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
  }
}

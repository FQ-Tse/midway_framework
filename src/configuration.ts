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

@Configuration({
  imports: [
    koa,
    validate,
    security,
    passport,
    jwt,
    i18n,
    info,
    {
      component: info,
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
    // this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
  }
}

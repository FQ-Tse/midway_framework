import { Post, Inject, Controller } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { JwtService } from '@midwayjs/jwt';
import { JwtPassportMiddleware } from '../middleware/jwt.middleware';

@Controller('/')
export class JwtController {
  @Inject()
  jwt: JwtService;

  @Inject()
  ctx: Context;

  @Post('/passport/jwt', { middleware: [JwtPassportMiddleware] })
  async jwtPassport() {
    console.log('jwt user: ', this.ctx.state.user);
    return this.ctx.state.user;
  }

  @Post('/jwt')
  async genJwt() {
    return {
      t: await this.jwt.sign({ msg: 'Hello Midway' }),
    };
  }
}

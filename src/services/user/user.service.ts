import { Inject, Provide } from '@midwayjs/core';
import { JwtService } from '@midwayjs/jwt';
import _ from 'lodash';
import { LoginDTO } from '../../dto';
import { Context } from '@midwayjs/koa';

@Provide('UserService')
export class UserService {
  @Inject()
  jwtService: JwtService;

  @Inject()
  ctx: Context;

  async login(user: LoginDTO) {
    console.log(this.ctx);
    return {
      access_token: this.ctx.getAttr('Authorization'),
    };
  }
}

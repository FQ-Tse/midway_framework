import { Body, Controller, Inject, Post } from '@midwayjs/core';
import { UserService } from '../../services/user/user.service';
import { LoginDTO } from '../../dto';
import { Context } from '@midwayjs/koa';

@Controller('/api/user')
export class UserController {
  @Inject()
  userService: UserService;

  @Inject()
  ctx: Context;

  @Post('/login')
  async login(@Body() param: LoginDTO) {
    return await this.userService.login(param);
  }
}

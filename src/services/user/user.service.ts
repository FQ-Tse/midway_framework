import {Inject, Provide} from "@midwayjs/core";
import {IUser} from "../../interfaces";
import {JwtService} from "@midwayjs/jwt";

@Provide('UserService')
export class UserService {

  @Inject()
  jwtService: JwtService;

  async login(user: IUser) {
    // TODO: 先入库查找是否存在此账户
    const payload = {
      username: user.username,
      password: user.password
    }
    return {
      access_token: this.jwtService.sign(payload)
    }
  }
}

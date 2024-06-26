import {Body, Controller, Inject} from "@midwayjs/core";
import {UserService} from "../../services/user/user.service";
import {IUser} from "../../interfaces";


@Controller('/api/user')
export class UserController {

  @Inject()
  userService: UserService;

  async login(@Body() param: IUser) {
    return await this.userService.login(param);
  }
}

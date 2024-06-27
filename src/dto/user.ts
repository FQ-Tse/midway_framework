// src/dto/user.ts
import { Rule, RuleType } from '@midwayjs/validate';
import { ApiProperty } from '@midwayjs/swagger';

export class LoginDTO {
  @ApiProperty({ example: 'admin', description: '用户名' })
  @Rule(RuleType.string().required())
  username: string;

  @ApiProperty({ example: '123456', description: '密码' })
  @Rule(RuleType.string().required().max(10))
  password: string;
}

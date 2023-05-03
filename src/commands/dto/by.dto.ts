import { Param, ParamType } from '@discord-nestjs/core';

export class ByDto {
  @Param({
    name: 'name',
    description: 'user name',
    type: ParamType.STRING,
    required: true,
  })
  username: string;
}

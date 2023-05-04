import { Param, ParamType } from '@discord-nestjs/core';

export class byDto {
  @Param({
    name: 'username',
    description: 'get comments by username',
    type: ParamType.STRING,
    // required: true,
    // autocomplete: true,
  })
  username: string;
}

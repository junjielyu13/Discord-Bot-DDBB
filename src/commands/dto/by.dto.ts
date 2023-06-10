import { Param, ParamType } from '@discord-nestjs/core';

export class byDto {
  @Param({
    name: 'username',
    description: 'get comments by username',
    type: ParamType.STRING,
  })
  username: string;

  @Param({
    name: 'page',
    description: 'page of comments list',
    type: ParamType.INTEGER,
  })
  page: number;
}

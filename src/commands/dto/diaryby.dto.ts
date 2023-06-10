import { Param, ParamType } from '@discord-nestjs/core';

export class diarybyDto {
  @Param({
    name: 'date',
    description: 'get diary channel time by date type:(yyyy-mm-dd)',
    type: ParamType.STRING,
  })
  date: string;

  @Param({
    name: 'page',
    description: 'page of list',
    type: ParamType.INTEGER,
  })
  page: number;
}

import { Injectable, Logger } from '@nestjs/common';
import { Command, Handler } from '@discord-nestjs/core';
import { CommandInteraction } from 'discord.js';

import { HttpService } from '@nestjs/axios';

@Command({
  name: 'ping',
  description: 'test',
})
@Injectable()
export class PingCommand {
  constructor(private readonly http: HttpService) {}

  @Handler()
  async test(): Promise<any> {
    // this.http
    //   .get('http://localhost:3000/prisma/addServer')
    //   .toPromise()
    //   .then((res) => res.data);
    return 'test';
  }
}

import { Injectable } from '@nestjs/common';
import { Command, Handler } from '@discord-nestjs/core';

@Command({
  name: 'ping',
  description: 'ping on server',
})
@Injectable()
export class PingCommand {
  @Handler()
  async ping(): Promise<any> {
    return `pong`;
  }
}

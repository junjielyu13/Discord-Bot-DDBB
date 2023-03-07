import { Injectable, Logger } from '@nestjs/common';
import { Command, Handler } from '@discord-nestjs/core';
import { CommandInteraction } from 'discord.js';

import { HttpService } from '@nestjs/axios';

@Command({
  name: 'ping',
  description: 'test ping',
})
@Injectable()
export class PingCommand {
  constructor(private readonly httpService: HttpService) {}

  @Handler()
  async onPlaylist(interaction: CommandInteraction): Promise<any> {
    await this.httpService.get('http://localhost:3000/prisma/user');
    return 'pong';
  }
}

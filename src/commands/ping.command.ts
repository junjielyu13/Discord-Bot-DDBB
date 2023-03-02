import { Injectable, Logger } from '@nestjs/common';
import { Command, Handler } from '@discord-nestjs/core';
import { CommandInteraction } from 'discord.js';

@Command({
  name: 'ping',
  description: 'test ping',
})
@Injectable()
export class PingCommand {
  @Handler()
  onPlaylist(interaction: CommandInteraction): string {
    return 'pong';
  }
}

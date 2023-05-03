import { SlashCommandPipe } from '@discord-nestjs/common';
import {
  Command,
  EventParams,
  Handler,
  InteractionEvent,
} from '@discord-nestjs/core';
import { ClientEvents } from 'discord.js';

import { ByDto } from './dto/by.dto';
import { Logger } from '@nestjs/common';

@Command({
  name: 'play',
  description: 'Plays a song',
})
export class CommentByCommand {
  private readonly logger = new Logger(CommentByCommand.name);

  @Handler()
  onPlayCommand(
    @InteractionEvent(SlashCommandPipe) options: ByDto,
    @EventParams() args: ClientEvents['interactionCreate'],
  ): string {
    this.logger.log(options);
    this.logger.log(options.username);
    this.logger.log(args);

    return `username: ${options.username}`;
  }
}

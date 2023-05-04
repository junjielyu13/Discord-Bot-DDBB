import { SlashCommandPipe } from '@discord-nestjs/common';
import {
  Command,
  EventParams,
  Handler,
  IA,
  InteractionEvent,
} from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import { ClientEvents } from 'discord.js';

import { byDto } from './dto/by.dto';

@Command({
  name: 'commentsby',
  description: 'get comments by username',
})
@Injectable()
export class CommentsBy {
  @Handler()
  onPlayCommand(
    @IA(SlashCommandPipe) dto: byDto,
    @EventParams() args: ClientEvents['interactionCreate'],
  ): string {
    console.log('DTO', dto);
    console.log('Event args', args);

    return `Start playing ${dto.username}.`;
  }
}

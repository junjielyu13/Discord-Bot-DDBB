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

// import { PlayDto } from './dto/by.dto';

import { Param, ParamType } from '@discord-nestjs/core';

export class PlayDto {
  @Param({
    name: 'song',
    description:
      'Name or URL of song/playlist. Could be from (Youtube, Spotify, SoundCloud)',
    type: ParamType.STRING,
    // required: true,
    // autocomplete: true,
  })
  song: string;
}

@Injectable()
@Command({
  name: 'play',
  description: 'Plays a song',
})
export class PlayCommand {
  @Handler()
  onPlayCommand(
    @IA(SlashCommandPipe) dto: PlayDto,
    @EventParams() args: ClientEvents['interactionCreate'],
  ): string {
    console.log('DTO', dto);
    console.log('Event args', args);

    return `Start playing ${dto.song}.`;
  }
}

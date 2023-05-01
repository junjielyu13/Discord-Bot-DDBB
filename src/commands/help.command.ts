import { Injectable } from '@nestjs/common';
import { Command, Handler } from '@discord-nestjs/core';
import { CommandInteraction } from 'discord.js';

import { HttpService } from '@nestjs/axios';

import { EmbedBuilder } from 'discord.js';

@Command({
  name: 'help',
  description: 'help to server',
})
@Injectable()
export class HelpCommand {
  constructor(private readonly http: HttpService) {}

  @Handler()
  async help(interaction: CommandInteraction): Promise<any> {
    return `help`;
  }
}

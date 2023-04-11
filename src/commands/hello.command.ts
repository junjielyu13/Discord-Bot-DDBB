import { Injectable } from '@nestjs/common';
import { Command, Handler } from '@discord-nestjs/core';
import { CommandInteraction } from 'discord.js';

import { HttpService } from '@nestjs/axios';

import { EmbedBuilder } from 'discord.js';

@Command({
  name: 'hello',
  description: 'hello to server',
})
@Injectable()
export class HelloCommand {
  constructor(private readonly http: HttpService) {}

  @Handler()
  async hello(interaction: CommandInteraction): Promise<any> {
    return `hello`;
  }
}

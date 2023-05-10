import { Injectable } from '@nestjs/common';
import { Command, Handler } from '@discord-nestjs/core';
import { PermissionFlagsBits } from 'discord.js';

@Command({
  name: 'ping',
  description: 'ping on server',
  defaultMemberPermissions: [PermissionFlagsBits.UseApplicationCommands],
  dmPermission: false,
})
@Injectable()
export class PingCommand {
  @Handler()
  async ping(): Promise<any> {
    return `pong`;
  }
}

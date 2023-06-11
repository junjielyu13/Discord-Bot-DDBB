import {
  Command,
  EventParams,
  Handler,
  InteractionEvent,
} from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import { ClientEvents } from 'discord.js';
import { PermissionFlagsBits } from 'discord.js';

import { DBController } from '../db/db.controller';

@Command({
  name: 'rankcommands',
  description: 'rank of top commands by user',
  defaultMemberPermissions: [PermissionFlagsBits.UseApplicationCommands],
  dmPermission: false,
})
@Injectable()
export class RankCommands {
  constructor(private readonly dbController: DBController) {}

  @Handler()
  async onRankComments(
    @EventParams() args: ClientEvents['interactionCreate'],
    @InteractionEvent() interaction,
  ): Promise<any> {
    let results = 'TOP10 Users who Commands the most \n\n';
    await this.dbController
      .getAllCommands({
        serverId: args['guildId'],
      })
      .then((comments) => {
        const usernameCount: { [username: string]: number } = {}; // Specify the type for usernameCount

        comments.forEach((comment) => {
          const username = comment.user.userName;
          if (usernameCount[username]) {
            usernameCount[username]++;
          } else {
            usernameCount[username] = 1;
          }
        });

        const usernameRanking = Object.entries(usernameCount).sort(
          (a, b) => b[1] - a[1],
        );

        // Output the ranking results
        for (let i = 0; i < 10 && i < usernameRanking.length; i++) {
          const entry = usernameRanking[i];
          const username = entry[0];
          const count = entry[1];
          results += `TOP ${i + 1}: ${username.padStart(
            24,
            ' ',
          )}   -   ${count}\n\n`;
        }
      });

    interaction.reply(results);
  }
}

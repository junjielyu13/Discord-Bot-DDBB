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
  name: 'rankchanneltimediary',
  description: 'rank of top channel time by dairy',
  defaultMemberPermissions: [PermissionFlagsBits.UseApplicationCommands],
  dmPermission: false,
})
@Injectable()
export class RankChannelTimeDiary {
  constructor(private readonly dbController: DBController) {}

  @Handler()
  async onRankComments(
    @EventParams() args: ClientEvents['interactionCreate'],
    @InteractionEvent() interaction,
  ): Promise<any> {
    let results = 'TOP10 Channel time dairy the most \n\n';
    await this.dbController
      .getAllUserChannelTime({
        serverId: args['guildId'],
      })
      .then((channelTimes) => {
        const usernameCount: { [username: string]: number } = {}; // Specify the type for usernameCount

        channelTimes.forEach((channelTime) => {
          const username = this.convertTime(channelTime.createdAt);
          const usertime = Math.abs(parseFloat(channelTime.time));
          if (usernameCount[username]) {
            usernameCount[username] += usertime;
          } else {
            usernameCount[username] = usertime;
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
          )}   -   ${count.toFixed(2)}s \n\n`;
        }
      });

    interaction.reply(results);
  }

  private convertTime(data) {
    const inputDate = new Date(data);
    const day = String(inputDate.getDate()).padStart(2, '0');
    const month = String(inputDate.getMonth() + 1).padStart(2, '0');
    const year = String(inputDate.getFullYear());

    return `${day}/${month}/${year}`;
  }
}

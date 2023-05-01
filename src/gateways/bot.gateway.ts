import { Injectable, Logger } from '@nestjs/common';
import { On, Once, InjectDiscordClient } from '@discord-nestjs/core';
import {
  Client,
  Message,
  VoiceChannel,
  VoiceState,
  Interaction,
} from 'discord.js';

import { EmbedBuilder } from 'discord.js';

import { Cron } from '@nestjs/schedule';

import { HttpService } from '@nestjs/axios';

@Injectable()
export class BotGateway {
  private readonly logger = new Logger(BotGateway.name);

  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    private readonly http: HttpService,
  ) {}

  @Once('ready')
  async onReady() {
    this.client.guilds.cache.map(async (guild) => {
      let guildId = -1;

      this.http
        .post('http://localhost:3000/prisma/createServer', {
          guildId: guild.id,
          guildName: guild.name,
        })
        .toPromise()
        .then(async (res) => {
          guildId = res.data.id;
        });

      (await guild.members.fetch()).forEach((member) => {
        this.http
          .post('http://localhost:3000/prisma/createUser', {
            userId: member.id,
            userName: member.user.username,
          })
          .toPromise()
          .then(async (res) => {
            this.http
              .post('http://localhost:3000/prisma/createRegistreUser', {
                userId: res.data.id,
                serverId: guildId,
              })
              .toPromise()
              .then();
          });
      });

      (await guild.channels.fetch()).forEach((channel) => {
        this.http
          .post('http://localhost:3000/prisma/createChannel', {
            serverId: guildId,
            channelId: channel.id,
            channelName: channel.name,
            channelType: channel.type,
          })
          .toPromise()
          .then();
      });
    });
  }

  @On('messageCreate')
  async onMessage(message: Message): Promise<void> {
    let userId = -1;
    let channelId = -1;

    if (!message.author.bot) {
      await this.http
        .get('http://localhost:3000/prisma/getUser', {
          params: { userId: message.author.id },
        })
        .toPromise()
        .then((user) => {
          userId = user.data.id;
        });

      await this.http
        .get('http://localhost:3000/prisma/getChannel', {
          params: { channelId: message.channel.id },
        })
        .toPromise()
        .then((channel) => {
          channelId = channel.data.id;
        });

      await this.http
        .post('http://localhost:3000/prisma/createComment', {
          commentId: message.id,
          userId: userId,
          channelId: channelId,
          message: message.content,
        })
        .toPromise()
        .then();
    }
  }

  @On('interactionCreate')
  async onInteraction(action: Interaction): Promise<void> {
    let userId = -1;
    let channelId = -1;

    if (action) {
      await this.http
        .get('http://localhost:3000/prisma/getUser', {
          params: { userId: action.user.id },
        })
        .toPromise()
        .then((user) => {
          userId = user.data.id;
        });

      await this.http
        .get('http://localhost:3000/prisma/getChannel', {
          params: { channelId: action.channel.id },
        })
        .toPromise()
        .then((channel) => {
          channelId = channel.data.id;
        });

      await this.http
        .post('http://localhost:3000/prisma/createCommand', {
          commandId: action.toString(),
          userId: userId,
          channelId: channelId,
        })
        .toPromise()
        .then();
    }
  }

  @On('voiceStateUpdate')
  async onVoice(oldState: VoiceState, newState: VoiceState): Promise<void> {
    const member = newState.member;
    if (!member.user.bot) {
      const newChannelID = newState.channelId;
      const oldChannelID = oldState.channelId;

      if (newChannelID && !oldChannelID) {
        await this.http
          .post('http://localhost:3000/prisma/joinTempOnChannel', {
            userId: member.id,
            channelId: newChannelID,
            statu: false,
          })
          .toPromise()
          .then();
      } else if (!newChannelID && oldChannelID) {
        await this.http
          .post('http://localhost:3000/prisma/joinTempOnChannel', {
            userId: member.id,
            channelId: oldChannelID,
            statu: false,
          })
          .toPromise()
          .then(async () => {
            await this.http
              .get('http://localhost:3000/prisma/GetTimeChannelByUserId', {
                params: { userId: member.id },
              })
              .toPromise()
              .then(async (res) => {
                let totalSeconds = 0;
                for (let i = 0; i < res.data.length - 1; i++) {
                  const startTime = new Date(res.data[i].createdAt).getTime();
                  const endTime = new Date(res.data[i + 1].createdAt).getTime();
                  totalSeconds += (endTime - startTime) / 1000;
                }
                this.logger.log(`${totalSeconds}`);

                let userId = -1;
                let channelId = -1;
                await this.http
                  .get('http://localhost:3000/prisma/getUser', {
                    params: { userId: member.id },
                  })
                  .toPromise()
                  .then((user) => {
                    userId = user.data.id;
                  });

                await this.http
                  .get('http://localhost:3000/prisma/getChannel', {
                    params: { channelId: oldChannelID },
                  })
                  .toPromise()
                  .then((channel) => {
                    channelId = channel.data.id;
                  });

                await this.http
                  .post('http://localhost:3000/prisma/writeUserChannelTime', {
                    userId: userId,
                    channelId: channelId,
                    time: String(totalSeconds),
                  })
                  .toPromise()
                  .then(async () => {
                    if (totalSeconds) {
                      await this.http
                        .get(
                          'http://localhost:3000/prisma/DeleteAllTimeChannelByUserId',
                          {
                            params: { userId: member.id },
                          },
                        )
                        .toPromise()
                        .then();
                    }
                  });
              });
          });
      } else {
        await this.http
          .post('http://localhost:3000/prisma/joinTempOnChannel', {
            userId: member.id,
            channelId: newChannelID,
            statu: false,
          })
          .toPromise()
          .then(async () => {
            await this.http
              .get('http://localhost:3000/prisma/GetTimeChannelByUserId', {
                params: { userId: member.id },
              })
              .toPromise()
              .then(async (res) => {
                let totalSeconds = 0;
                for (let i = 0; i < res.data.length - 1; i++) {
                  const startTime = new Date(res.data[i].createdAt).getTime();
                  const endTime = new Date(res.data[i + 1].createdAt).getTime();
                  totalSeconds += (endTime - startTime) / 1000;
                }
                this.logger.log(`${totalSeconds}`);

                let userId = -1;
                let channelId = -1;
                await this.http
                  .get('http://localhost:3000/prisma/getUser', {
                    params: { userId: member.id },
                  })
                  .toPromise()
                  .then((user) => {
                    userId = user.data.id;
                  });

                await this.http
                  .get('http://localhost:3000/prisma/getChannel', {
                    params: { channelId: newChannelID },
                  })
                  .toPromise()
                  .then((channel) => {
                    channelId = channel.data.id;
                  });

                await this.http
                  .post('http://localhost:3000/prisma/writeUserChannelTime', {
                    userId: userId,
                    channelId: channelId,
                    time: String(totalSeconds),
                  })
                  .toPromise()
                  .then(async () => {
                    if (totalSeconds) {
                      await this.http
                        .get(
                          'http://localhost:3000/prisma/DeleteTimeChannelByUserId',
                          {
                            params: { userId: member.id },
                          },
                        )
                        .toPromise()
                        .then();
                    }
                  });
              });
          });
      }
    }
  }

  @Cron('0 0 0 * * *')
  async handleCron() {
    this.logger.log('Called when the current second is 45');
  }
}

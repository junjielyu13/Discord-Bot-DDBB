import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Channel } from '@prisma/client';

@Injectable()
export class DBChannelService {
  constructor(private readonly prismaService: PrismaService) {}

  async upsertChannel(params: {
    where: Prisma.ChannelWhereUniqueInput;
    data: Prisma.ChannelCreateInput;
    server: Prisma.ServerCreateNestedOneWithoutChannelsInput;
  }): Promise<Channel> {
    const { where, data, server } = params;
    return this.prismaService.channel.upsert({
      where: {
        channelId: where.channelId,
      },
      update: {},
      create: {
        server: server,
        channelName: data.channelName,
        channelId: data.channelId,
        channelType: data.channelType,
      },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Channel } from '@prisma/client';

@Injectable()
export class DBChannelService {
  constructor(private readonly prismaService: PrismaService) {}

  async createChannel(data: Prisma.ChannelCreateInput): Promise<Channel> {
    return this.prismaService.channel.create({
      data,
    });
  }
}

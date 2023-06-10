import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DBCommandService {
  constructor(private readonly prismaService: PrismaService) {}

  async createCommand(data: any): Promise<any> {
    return this.prismaService.command.create({
      data: {
        commandId: data.commandId,
        user: {
          connect: {
            id: data.user.id,
          },
        },
        channel: {
          connect: {
            id: data.channel.id,
          },
        },
      },
    });
  }

  async getAllCommands(where: any): Promise<any> {
    return this.prismaService.command.findMany({
      where: {
        channel: {
          server: {
            ServerId: where.serverId,
          },
        },
      },
      select: {
        commandId: true,
        releaseAt: true,
        user: {
          select: {
            userName: true,
          },
        },
        channel: {
          select: {
            channelName: true,
          },
        },
      },
      orderBy: [
        {
          releaseAt: 'desc',
        },
      ],
      skip: where.page,
      take: 10,
    });
  }

  async getAllCommandsByUername(where: any): Promise<any> {
    return this.prismaService.command.findMany({
      where: {
        user: {
          userName: where.userName,
        },
        channel: {
          server: {
            ServerId: where.serverId,
          },
        },
      },
      select: {
        commandId: true,
        releaseAt: true,
        user: {
          select: {
            userName: true,
          },
        },
        channel: {
          select: {
            channelName: true,
          },
        },
      },
      orderBy: [
        {
          releaseAt: 'desc',
        },
      ],
      skip: where.page,
      take: 10,
    });
  }
}

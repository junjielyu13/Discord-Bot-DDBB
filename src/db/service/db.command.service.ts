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
}

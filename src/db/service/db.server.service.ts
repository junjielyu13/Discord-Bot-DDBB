import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Server } from '@prisma/client';

@Injectable()
export class DBServerService {
  constructor(private readonly prismaService: PrismaService) {}

  async upsertServer(params: {
    where: Prisma.ServerWhereUniqueInput;
    data: Prisma.ServerCreateInput;
  }): Promise<Server> {
    const { where, data } = params;
    return this.prismaService.server.upsert({
      where: {
        ServerId: where.ServerId,
      },
      update: {},
      create: {
        ServerId: data.ServerId,
        ServerName: data.ServerName,
      },
    });
  }
}

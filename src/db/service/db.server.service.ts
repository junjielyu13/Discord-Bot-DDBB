import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Server } from '@prisma/client';

@Injectable()
export class DBServerService {
  constructor(private readonly prismaService: PrismaService) {}

  async createServer(data: Prisma.ServerCreateInput): Promise<Server> {
    return this.prismaService.server.create({
      data,
    });
  }
}

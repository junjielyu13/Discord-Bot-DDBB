import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Command } from '@prisma/client';

@Injectable()
export class DBCommandService {
  constructor(private readonly prismaService: PrismaService) {}

  async createCommand(data: Prisma.CommandCreateInput): Promise<Command> {
    return this.prismaService.command.create({
      data,
    });
  }
}

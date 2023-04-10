import {
  Controller,
  Logger,
  Post,
  Req,
  Get,
  Body,
  Query,
  Param,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('/prisma')
export class PrismaController {
  private readonly logger = new Logger(PrismaController.name);
  constructor(private readonly prismaService: PrismaService) {}

  @Post('user')
  async createUser(@Body() body): Promise<any> {
    return this.prismaService.user.upsert({
      where: {
        userId: body.userId,
      },
      update: {},
      create: {
        userId: body.userId,
        userName: body.userName,
      },
    });
  }

  @Post('server')
  async createServer(@Body() body): Promise<any> {
    return this.prismaService.server.upsert({
      where: {
        ServerId: body.guildId,
      },
      update: {},
      create: {
        ServerId: body.guildId,
        ServerName: body.guildName,
      },
    });
  }
}

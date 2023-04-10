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

  @Post('createUser')
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

  // @Get('getUser')
  // async getUser(@Body() body): Promise<any> {

  // }

  @Post('createServer')
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

  @Post('createRegistreUser')
  async createRegistreUser(@Body() body): Promise<any> {
    return this.prismaService.registreUser.upsert({
      where: {
        registreUserServerId: {
          userId: body.userId,
          serverId: body.serverId,
        },
      },
      update: {},
      create: {
        userId: body.userId,
        serverId: body.serverId,
      },
    });
  }
}

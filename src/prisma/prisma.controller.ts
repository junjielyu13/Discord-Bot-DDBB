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

  @Get('user')
  async createDraft(): Promise<any> {
    return this.prismaService.user.create({
      data: {
        userId: 'sdsdsdsd',
        userName: '1000000',
      },
    });
  }

  @Post('server')
  async createServer(@Body() body): Promise<any> {
    this.logger.log(body);

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

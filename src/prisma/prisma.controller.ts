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

  @Get('getUser')
  async getUser(@Query() query): Promise<any> {
    return await this.prismaService.user.findUnique({
      where: {
        userId: query.userId,
      },
    });
  }

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

  @Post('createChannel')
  async createChannel(@Body() body): Promise<any> {
    return this.prismaService.channel.upsert({
      where: {
        channelId: body.channelId,
      },
      update: {},
      create: {
        serverId: body.serverId,
        channelName: body.channelName,
        channelId: body.channelId,
        channelType: body.channelType,
      },
    });
  }

  @Get('getChannel')
  async getChaneel(@Query() query): Promise<any> {
    return await this.prismaService.channel.findUnique({
      where: {
        channelId: query.channelId,
      },
    });
  }

  @Post('createComment')
  async createComment(@Body() body): Promise<any> {
    return this.prismaService.comment.create({
      data: {
        commentId: body.commentId,
        userId: body.userId,
        channelId: body.channelId,
        message: body.message,
      },
    });
  }

  // @Post('createCommand')
  // async createCommand(@Body() body): Promise<any> {
  //   return this.prismaService.command.create({
  //     data: {
  //       commandId: body.commandId,
  //       userId: body.userId,
  //       channelId: body.channelId,
  //       description: body.description,
  //     },
  //   });
  // }
}

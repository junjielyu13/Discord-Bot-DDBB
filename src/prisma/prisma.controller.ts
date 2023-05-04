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

  @Get('getAllComment')
  async getAllComment(@Query() query): Promise<any> {
    return this.prismaService.comment.findMany({
      where: {
        channel: {
          server: {
            ServerId: query.serverId,
          },
        },
      },
      select: {
        message: true,
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
    });
  }

  @Get('getCommentBy')
  async getCommentBy(@Query() query): Promise<any> {
    return this.prismaService.comment.findMany({
      where: {
        user: {
          userName: query.userName,
        },
        channel: {
          server: {
            ServerId: query.serverId,
          },
        },
      },
      select: {
        message: true,
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
    });
  }

  @Post('createCommand')
  async createCommand(@Body() body): Promise<any> {
    return this.prismaService.command.create({
      data: {
        commandId: body.commandId,
        userId: body.userId,
        channelId: body.channelId,
      },
    });
  }

  @Get('getAllCommand')
  async getAllCommand(@Query() query): Promise<any> {
    return this.prismaService.command.findMany({
      where: {
        channel: {
          server: {
            ServerId: query.serverId,
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
      take: 25,
    });
  }

  @Get('getCommandBy')
  async getCommandBy(@Query() query): Promise<any> {
    return this.prismaService.command.findMany({
      where: {
        user: {
          userName: query.userName,
        },
        channel: {
          server: {
            ServerId: query.serverId,
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
      take: 25,
    });
  }

  @Post('joinTempOnChannel')
  async joinTempOnChannel(@Body() body): Promise<any> {
    return this.prismaService.temps.create({
      data: {
        userId: body.userId,
        channelId: body.channelId,
        statu: body.statu,
      },
    });
  }

  @Get('GetTimeChannelByUserId')
  async GetTimeChannelByUserId(@Query() query): Promise<any> {
    return this.prismaService.temps.findMany({
      where: {
        userId: query.userId,
      },
      select: {
        createdAt: true,
      },
    });
  }

  @Get('DeleteTimeChannelByUserId')
  async DeleteTimeChannelByUserId(@Query() query): Promise<any> {
    const temps = await this.prismaService.temps.findMany({
      where: {
        userId: query.userId,
      },
      // orderBy: {
      //   createdAt: 'desc', // Sort by creation date in descending order
      // },
    });

    const lastTemp = temps[0]; // Get the last created temp
    const tempIdsToDelete = temps.slice(1).map((temp) => temp.id); // Get the IDs of all temps except the last one

    await this.prismaService.temps.deleteMany({
      where: {
        userId: query.userId,
        id: {
          notIn: tempIdsToDelete, // Exclude all temps except the last one
        },
      },
    });

    return lastTemp; // Return the last temp object
  }

  @Get('DeleteAllTimeChannelByUserId')
  async DeleteAllTimeChannelByUserId(@Query() query): Promise<any> {
    return this.prismaService.temps.deleteMany({
      where: {
        userId: query.userId,
      },
    });
  }

  @Post('writeUserChannelTime')
  async writeUserChannelTime(@Body() body): Promise<any> {
    return this.prismaService.userChannelTime.create({
      data: {
        userId: body.userId,
        channelId: body.channelId,
        time: body.time,
      },
    });
  }

  @Get('getAllUserChannelTime')
  async getAllUserChannelTime(@Query() query): Promise<any> {
    return this.prismaService.userChannelTime.findMany({
      where: {
        channel: {
          server: {
            ServerId: query.serverId,
          },
        },
      },
      select: {
        time: true,
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
          createdAt: 'desc',
        },
      ],
      take: 25,
    });
  }

  @Get('getUserChannelTimeByUsername')
  async getUserChannelTimeByUsername(@Query() query): Promise<any> {
    return this.prismaService.userChannelTime.findMany({
      where: {
        user: {
          userName: query.userName,
        },
        channel: {
          server: {
            ServerId: query.serverId,
          },
        },
      },
      select: {
        time: true,
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
          createdAt: 'desc',
        },
      ],
      take: 25,
    });
  }
}

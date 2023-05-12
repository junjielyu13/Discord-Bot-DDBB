import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DBTempsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createTemps(data: any): Promise<any> {
    return this.prismaService.temps.create({
      data: {
        userId: data.userId,
        channelId: data.channelId,
        statu: data.statu,
      },
    });
  }

  async getTempsByUserId(where: any): Promise<any> {
    return this.prismaService.temps.findMany({
      where: {
        userId: where.userId,
      },
      select: {
        createdAt: true,
      },
    });
  }

  async getAllTempsByUserId(where: any): Promise<any> {
    return await this.prismaService.temps.findMany({
      where: {
        userId: where.userId,
      },
      select: {
        createdAt: true,
      },
    });
  }

  async deleteAllTempsByUserId(where: any): Promise<any> {
    await this.prismaService.temps.deleteMany({
      where: {
        userId: where.userId,
      },
    });
  }

  async deleteAllTempsByUserIdWithNotIn(
    where: any,
    condition: any,
  ): Promise<any> {
    console.log(condition);

    await this.prismaService.temps.deleteMany({
      where: {
        userId: where.userId,
        id: {
          notIn: condition,
        },
      },
    });
  }
}

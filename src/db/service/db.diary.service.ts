import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Diary } from '@prisma/client';

@Injectable()
export class DBDiaryService {
  constructor(private readonly prismaService: PrismaService) {}

  async createDiary(data: Prisma.DiaryCreateInput): Promise<Diary> {
    return this.prismaService.diary.create({
      data,
    });
  }
}

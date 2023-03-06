import { Controller, Post, Req, Body } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('db')
export class PrismaController {
  constructor(private readonly prismaService: PrismaService) {}
  // @Post('createGame')
  // createGame(@Request() req): any {
  //   return this.prismaService.createGame(req);
  // }
  // @Post('createPlayer')
  // createPlayer(@Request() req): any {
  //   return this.prismaService.createPlayer(req);
  // }

  // @Post('createPlayer')
  // createPlayer(@Req() req): any {
  //   console.log("query:" + req.query);
  //   console.log("body: " + req.body);
  //   return this.prismaService.testAdd(parseInt(req.query.value));
  // }
}

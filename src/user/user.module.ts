// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { PrismaService } from '../prisma/service/prisma.service';
import { UserController } from './controller/user.controller';

@Module({
  providers: [UserService, PrismaService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}

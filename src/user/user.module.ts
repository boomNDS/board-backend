// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { PrismaService } from '../prisma/service/prisma.service';

@Module({
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}

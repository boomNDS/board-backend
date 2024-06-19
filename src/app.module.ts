// src/app.module.ts
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/service/prisma.service';
import { ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';

@Module({
  imports: [
    AuthModule,
    UserModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '180m' },
    }),
  ],
  controllers: [AppController],
  providers: [PrismaService, ConfigService, AppService],
})
export class AppModule {}

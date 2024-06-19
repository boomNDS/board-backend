import { Injectable, ConflictException } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/service/prisma.service';
import { IUser } from '../interface/user.interface';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async create(userData: IUser): Promise<User> {
    const user = await this.findOne(userData.username);
    if (user) {
      throw new ConflictException('Username already exists!');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
  }
}
``;

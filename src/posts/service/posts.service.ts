import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/service/prisma.service';
import { Post } from '@prisma/client';
import { IPost } from '../interface/post.interface';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(payload: IPost): Promise<Post> {
    return this.prisma.post.create({
      data: {
        ...payload,
      },
    });
  }

  async findAll(): Promise<Post[]> {
    return this.prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            author: {
              select: {
                id: true,
                username: true,
                name: true,
              },
            },
          },
        },
      },
    });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  async update(id: number, payload: IPost): Promise<Post> {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    } else if (post.authorId !== payload.authorId) {
      throw new ConflictException('You can only update your own post');
    }

    return this.prisma.post.update({
      where: { id },
      data: {
        ...payload,
      },
    });
  }

  async remove(id: number): Promise<Post> {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return this.prisma.post.delete({ where: { id } });
  }
}
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PostsService } from '../service/posts.service';
import { CreateCommentDto, CreatePostDto } from '../dto/create-post.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() payload: CreatePostDto) {
    return this.postsService.create({ ...payload, authorId: +req.user.userId });
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() payload: CreatePostDto,
  ) {
    return this.postsService.update(+id, {
      ...payload,
      authorId: req.user.userId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/Comment')
  addComment(
    @Param('id') id: string,
    @Request() req,
    @Body() payload: CreateCommentDto,
  ) {
    return this.postsService.addComment({
      ...payload,
      postId: +id,
      authorId: +req.user.userId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/Comment/:commendId')
  removeComment(@Param('id') id: string, @Param('id') commentId: string) {
    return this.postsService.removeComment(+id, +commentId);
  }
}

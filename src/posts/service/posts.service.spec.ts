import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { PrismaService } from '../../prisma/service/prisma.service';
import { mockComment, mockPost } from '../factory/post.factory';

describe('PostsService', () => {
  let service: PostsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsService, PrismaService],
    }).compile();

    service = module.get<PostsService>(PostsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a post', async () => {
      const post = mockPost();
      prismaService.post.create = jest.fn().mockResolvedValue(post);

      const result = await service.create(post);
      expect(result).toEqual(post);
      expect(prismaService.post.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all posts', async () => {
      const posts = [mockPost(), mockPost()];
      prismaService.post.findMany = jest.fn().mockResolvedValue(posts);

      const result = await service.findAll();
      expect(result).toEqual(posts);
      expect(prismaService.post.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a post by id', async () => {
      const post = mockPost();
      prismaService.post.findUnique = jest.fn().mockResolvedValue(post);

      const result = await service.findOne(1);
      expect(result).toEqual(post);
      expect(prismaService.post.findUnique).toHaveBeenCalled();
    });

    it('should throw error if post is not found', async () => {
      prismaService.post.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(
        'Post with ID 1 not found',
      );
    });
  });

  describe('update', () => {
    it('should throw error if post is not found', async () => {
      prismaService.post.findUnique = jest.fn().mockResolvedValue(null);

      await expect(
        service.update(1, mockPost({ authorId: 2 })),
      ).rejects.toThrow('Post with ID 1 not found');
    });

    it('should throw error if user is not author', async () => {
      prismaService.post.findUnique = jest
        .fn()
        .mockResolvedValue(mockPost({ authorId: 1 }));

      await expect(
        service.update(1, mockPost({ authorId: 2 })),
      ).rejects.toThrow('You can only update your own post');
    });

    it('should update post if user is author', async () => {
      const post = mockPost({ authorId: 1 });
      prismaService.post.findUnique = jest.fn().mockResolvedValue(post);
      prismaService.post.update = jest.fn().mockResolvedValue(post);

      const result = await service.update(1, post);
      expect(result).toEqual(post);
      expect(prismaService.post.findUnique).toHaveBeenCalled();
      expect(prismaService.post.update).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should throw error if post is not found', async () => {
      prismaService.post.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(
        'Post with ID 1 not found',
      );
    });

    it('should delete post if it exists', async () => {
      const post = mockPost({ id: 1 });
      prismaService.post.findUnique = jest.fn().mockResolvedValue(post);
      prismaService.post.delete = jest.fn().mockResolvedValue(post);

      const result = await service.remove(1);
      expect(result).toEqual(post);
      expect(prismaService.post.findUnique).toHaveBeenCalled();
      expect(prismaService.post.delete).toHaveBeenCalled();
    });
  });

  describe('addComment', () => {
    it('should add a comment to a post', async () => {
      service.findOne = jest.fn().mockResolvedValue(mockPost());
      prismaService.comment.create = jest.fn().mockResolvedValue(mockComment());

      const result = await service.addComment(mockComment());
      expect(result).toEqual(mockComment());
      expect(service.findOne).toHaveBeenCalled();
      expect(prismaService.comment.create).toHaveBeenCalled();
    });
  });

  describe('removeComment', () => {
    it('should throw error if comment is not found', async () => {
      service.findOne = jest.fn().mockResolvedValue(mockPost());
      prismaService.comment.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.removeComment(1, 2)).rejects.toThrow(
        'Comment not found',
      );
    });

    it('should delete comment if it exists', async () => {
      const comment = mockComment({ id: 2 });
      service.findOne = jest.fn().mockResolvedValue(mockPost());
      prismaService.comment.findUnique = jest.fn().mockResolvedValue(comment);
      prismaService.comment.delete = jest.fn().mockResolvedValue(comment);

      const result = await service.removeComment(1, 2);
      expect(result).toEqual(comment);
      expect(service.findOne).toHaveBeenCalled();
      expect(prismaService.comment.findUnique).toHaveBeenCalled();
      expect(prismaService.comment.delete).toHaveBeenCalled();
    });
  });
});

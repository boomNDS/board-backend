import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../../prisma/service/prisma.service';
import { mockUser } from '../factory/user.factory';

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const mockUser = {
        id: 1,
        username: 'testUser',
        password: 'testpassword',
      };
      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      const user = await service.findOne('testUser');
      expect(user).toEqual(mockUser);
    });

    it('should return null if user is not found', async () => {
      prismaService.user.findUnique = jest.fn().mockResolvedValue(null);

      const user = await service.findOne('unknown');
      expect(user).toBeNull();
    });
  });

  describe('create', () => {
    it('should create user', async () => {
      const user = mockUser();
      prismaService.user.findUnique = jest.fn().mockResolvedValue(null);
      prismaService.user.create = jest.fn().mockResolvedValue(user);

      const result = await service.create(user);
      expect(result).toEqual(user);
      expect(prismaService.user.create).toHaveBeenCalled();
    });

    it('should throw error if username already exists', async () => {
      prismaService.user.findUnique = jest
        .fn()
        .mockResolvedValue(
          mockUser({ username: 'testUser', password: 'testpassword' }),
        );

      await expect(
        service.create({ username: 'testUser', password: 'testpassword' }),
      ).rejects.toThrow('Username already exists');
    });
  });
});

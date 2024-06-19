import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../../user/service/user.service';
import { JwtService } from '@nestjs/jwt';
import { mockUser } from '../../user/factory/user.factory';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user without password if validation is successful', async () => {
      const user = await mockUser();
      userService.findOne = jest.fn().mockResolvedValue(user);

      const result = await service.validateUser('testUser', 'testpassword');
      expect(result).toEqual(
        expect.objectContaining({ id: 1, username: 'testUser' }),
      );
    });

    it('should return null if user is not found', async () => {
      userService.findOne = jest.fn().mockResolvedValue(null);

      const result = await service.validateUser('testUser', 'testpassword');
      expect(result).toBeNull();
    });

    it('should return null if password is incorrect', async () => {
      const user = await mockUser({
        id: 1,
        password: await bcrypt.hash('wrongpassword', 10),
      });
      userService.findOne = jest.fn().mockResolvedValue(user);

      const result = await service.validateUser('testUser', 'testpassword');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const mockToken = 'mockToken';
      jwtService.sign = jest.fn().mockReturnValue(mockToken);

      const user = await mockUser();
      const result = await service.login(user);
      expect(result).toEqual({ access_token: mockToken });
    });
  });

  describe('register', () => {
    it('should create a new user and return an access token', async () => {
      const mockToken = 'mockToken';
      const user = await mockUser();

      userService.create = jest.fn().mockResolvedValue(user);
      jwtService.sign = jest.fn().mockReturnValue(mockToken);

      const mockUserData = {
        username: 'testUser',
        password: 'testpassword',
      };

      const result = await service.register(mockUserData);
      expect(result).toEqual({ access_token: mockToken });
    });
  });
});

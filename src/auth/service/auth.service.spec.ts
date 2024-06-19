import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../../user/service/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { mockUser } from '../../user/factory/user.factory';

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
      userService.findOne = jest.fn().mockReturnValue(mockUser());

      const result = await service.validateUser('testUser', 'testpassword');
      expect(result).toEqual(
        expect.objectContaining({ id: 1, username: 'testUser' }),
      );
    });

    it('should return null if user is not found', async () => {
      userService.findOne = jest.fn().mockReturnValue(null);

      const result = await service.validateUser('testUser', 'testpassword');
      expect(result).toBeNull();
    });

    it('should return null if password is incorrect', async () => {
      userService.findOne = jest
        .fn()
        .mockReturnValue(mockUser({ id: 1, password: 't' }));

      const result = await service.validateUser('testUser', 'testpassword');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const mockToken = 'mockToken';
      jwtService.sign = jest.fn().mockReturnValue(mockToken);

      const result = await service.login(mockUser);
      expect(result).toEqual({ access_token: mockToken });
    });
  });

  describe('register', () => {
    it('should create a new user and return an access token', async () => {
      const mockUserData = {
        username: 'testUser',
        password: 'testpassword',
      };
      const mockToken = 'mockToken';
      userService.create = jest.fn().mockReturnValue(mockUser());
      jwtService.sign = jest.fn().mockReturnValue(mockToken);

      const result = await service.register(mockUserData);
      expect(result).toEqual({ access_token: mockToken });
    });
  });
});

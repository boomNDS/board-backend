import { User } from '@prisma/client';
import { IUser } from '../interface/user.interface';

export const mockUser = (overrides: Partial<User> = {}): IUser => {
  return {
    id: overrides.id || 1,
    username: overrides.username || 'testUser',
    password: overrides.password || 'password',
    ...overrides,
  };
};

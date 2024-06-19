import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export const mockUser = async (
  overrides: Partial<User> = {},
): Promise<User> => {
  const password = overrides.password || 'testpassword';
  const hashedPassword = await bcrypt.hash(password, 10);

  return {
    id: overrides.id || 1,
    username: overrides.username || 'testUser',
    password: hashedPassword,
    name: overrides.name || 'Test User',
    ...overrides,
  };
};

import { Comment, Post } from '@prisma/client';
import { IComment, IPost } from '../interface/post.interface';
import { $Enums } from '@prisma/client';

export const mockPost = (overrides: Partial<Post> = {}): IPost => {
  const id = typeof overrides.id === 'number' ? overrides.id : 1;
  return {
    id,
    title: overrides.title || 'title topic',
    content: overrides.content || 'content', // Ensure content is a string
    authorId: overrides.authorId || 1,
    community: overrides.community || $Enums.PostCommunity.history, // Adjust with your default community
    ...overrides,
  };
};

export const mockComment = (overrides: Partial<Comment> = {}): IComment => {
  const id = typeof overrides.id === 'number' ? overrides.id : 1;
  return {
    id,
    content: overrides.content || 'content', // Ensure content is a string
    postId: overrides.postId || 1,
    authorId: overrides.authorId || 1,
    ...overrides,
  };
};

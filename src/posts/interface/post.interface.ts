import { $Enums } from '@prisma/client';

export interface IPost {
  id?: number;
  title: string;
  content: string;
  authorId: number;
  community: $Enums.PostCommunity;
}

export interface IComment {
  id?: number;
  content: string;
  postId: number;
  authorId: number;
}

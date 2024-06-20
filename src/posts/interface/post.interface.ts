import { $Enums } from '@prisma/client';

export interface IPost {
  id?: number;
  title: string;
  content: string;
  authorId: number;
  community: $Enums.PostCommunity;
}

-- CreateEnum
CREATE TYPE "PostCommunity" AS ENUM ('history', 'food', 'pets', 'health', 'fashion', 'exercise', 'others');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "community" "PostCommunity" NOT NULL DEFAULT 'history';

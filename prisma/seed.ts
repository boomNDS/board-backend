import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const saltOrRounds = 10;
  const password = 'password';
  const hash = await bcrypt.hash(password, saltOrRounds);

  // Create a user with a post
  const user1 = await prisma.user.create({
    data: {
      username: 'mr.boom',
      name: 'Mr.Boom',
      password: hash,
      posts: {
        create: {
          title: 'Check out Prisma with Next.js',
          content: 'https://www.prisma.io/nextjs',
          published: true,
        },
      },
    },
  });

  // Assuming the post created above has the id we need
  const post = await prisma.post.findFirst({
    where: { authorId: user1.id },
  });

  // Create another user with a comment referencing the post created above
  await prisma.user.create({
    data: {
      username: 'amCool',
      name: 'Cool guy',
      password: hash,
      comments: {
        create: {
          content: 'Great post on Prisma with Next.js!',
          post: {
            connect: {
              id: post.id,
            },
          },
        },
      },
    },
  });
}

main()
  .then(async () => {
    console.log('Seeding successful');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

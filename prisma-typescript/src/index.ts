import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create a new user with a profile
  const user = await prisma.user.create({
    data: {
      email: 'john@example.com',
      name: 'John',
      profile: {
        create: {
          bio: 'I like turtles'
        }
      }
    },
    include: {
      profile: true
    }
  })
  console.log('Created user:', user)

  // Create a category
  const category = await prisma.category.create({
    data: {
      name: 'Technology'
    }
  })
  console.log('Created category:', category)

  // Create a post
  const post = await prisma.post.create({
    data: {
      title: 'Hello World',
      content: 'This is my first post',
      published: true,
      author: {
        connect: { id: user.id }
      },
      categories: {
        connect: { id: category.id }
      }
    },
    include: {
      author: true,
      categories: true
    }
  })
  console.log('Created post:', post)

  // Query all published posts
  const publishedPosts = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        include: {
          profile: true
        }
      },
      categories: true
    }
  })
  console.log('Published posts:', JSON.stringify(publishedPosts, null, 2))

  // Update a post
  const updatedPost = await prisma.post.update({
    where: { id: post.id },
    data: { 
      content: 'This is my updated first post'
    }
  })
  console.log('Updated post:', updatedPost)

  // Find users with posts
  const usersWithPosts = await prisma.user.findMany({
    include: {
      posts: true
    }
  })
  console.log('Users with posts:', JSON.stringify(usersWithPosts, null, 2))
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
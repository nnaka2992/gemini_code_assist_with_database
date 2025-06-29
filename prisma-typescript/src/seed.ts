import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.$transaction(async (tx) => {
    // Clean up existing data
    await tx.post.deleteMany()
    await tx.category.deleteMany()
    await tx.profile.deleteMany()
    await tx.user.deleteMany()

    // Create categories
    const categories = await Promise.all([
      tx.category.create({ data: { name: 'Technology' } }),
      tx.category.create({ data: { name: 'Science' } }),
      tx.category.create({ data: { name: 'Travel' } }),
      tx.category.create({ data: { name: 'Food' } }),
    ])

    // Create users with profiles
      const alice = await tx.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice',
      profile: {
        create: {
          bio: 'I love writing about technology and science.'
        }
      },
      posts: {
        create: [
          {
            title: 'Getting Started with Prisma',
            content: 'Prisma is a next-generation ORM...',
            published: true,
            categories: {
              connect: [{ id: categories[0].id }]
            }
          },
          {
            title: 'Understanding Database Relationships',
            content: 'In this post, we explore different types of database relationships...',
            published: true,
            categories: {
              connect: [{ id: categories[0].id }, { id: categories[1].id }]
            }
          }
        ]
      }
    },
    include: {
      profile: true,
      posts: true
    }
  })

    const bob = await tx.user.create({
    data: {
      email: 'bob@example.com',
      name: 'Bob',
      profile: {
        create: {
          bio: 'Travel enthusiast and food lover.'
        }
      },
      posts: {
        create: [
          {
            title: 'My Trip to Japan',
            content: 'Japan is an amazing country with rich culture...',
            published: true,
            categories: {
              connect: [{ id: categories[2].id }, { id: categories[3].id }]
            }
          },
          {
            title: 'Best Ramen in Tokyo',
            content: 'Here are my top 5 ramen places in Tokyo...',
            published: false,
            categories: {
              connect: [{ id: categories[3].id }]
            }
          }
        ]
      }
    },
    include: {
      profile: true,
      posts: true
    }
  })

    const charlie = await tx.user.create({
    data: {
      email: 'charlie@example.com',
      name: 'Charlie',
      posts: {
        create: [
          {
            title: 'The Future of AI',
            content: 'Artificial Intelligence is rapidly evolving...',
            published: true,
            categories: {
              connect: [{ id: categories[0].id }, { id: categories[1].id }]
            }
          }
        ]
      }
    },
    include: {
      posts: true
    }
  })

    console.log('Seed data created:')
    console.log(`- ${categories.length} categories`)
    console.log(`- 3 users (Alice, Bob, Charlie)`)
    console.log(`- ${alice.posts.length + bob.posts.length + charlie.posts.length} posts`)
    console.log('\nDatabase seeded successfully!')
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Error seeding database:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
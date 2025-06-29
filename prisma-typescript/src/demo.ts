import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('=== Prisma + PostgreSQL Demo ===\n')

  // Count records
  const userCount = await prisma.user.count()
  const postCount = await prisma.post.count()
  const categoryCount = await prisma.category.count()
  
  console.log(`Database contains:`)
  console.log(`- ${userCount} users`)
  console.log(`- ${postCount} posts`) 
  console.log(`- ${categoryCount} categories\n`)

  // Fetch all users with their profiles and posts
  console.log('=== Users with their profiles and posts ===')
  const users = await prisma.user.findMany({
    include: {
      profile: true,
      posts: {
        include: {
          categories: true
        }
      }
    }
  })
  
  users.forEach(user => {
    console.log(`\n${user.name} (${user.email})`)
    if (user.profile) {
      console.log(`  Bio: ${user.profile.bio}`)
    }
    console.log(`  Posts: ${user.posts.length}`)
    user.posts.forEach(post => {
      console.log(`    - "${post.title}" [${post.published ? 'Published' : 'Draft'}]`)
      if (post.categories.length > 0) {
        console.log(`      Categories: ${post.categories.map(c => c.name).join(', ')}`)
      }
    })
  })

  // Find all published posts
  console.log('\n=== Published Posts ===')
  const publishedPosts = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: true,
      categories: true
    }
  })
  
  publishedPosts.forEach(post => {
    console.log(`\n"${post.title}" by ${post.author.name}`)
    console.log(`  ${post.content}`)
    if (post.categories.length > 0) {
      console.log(`  Categories: ${post.categories.map(c => c.name).join(', ')}`)
    }
  })

  // Categories with post count
  console.log('\n=== Categories ===')
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { posts: true }
      }
    }
  })
  
  categories.forEach(category => {
    console.log(`- ${category.name}: ${category._count.posts} posts`)
  })
}

main()
  .catch(async (e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create a new user to test automatic timestamps
  const newUser = await prisma.user.create({
    data: {
      email: `test-${Date.now()}@example.com`,
      name: 'Test User'
    }
  })
  
  console.log('Created new user:')
  console.log(`- Email: ${newUser.email}`)
  console.log(`- Name: ${newUser.name}`)
  console.log(`- Created At: ${newUser.createdAt}`)
  console.log(`- Updated At: ${newUser.updatedAt}`)
  
  // Clean up
  await prisma.user.delete({
    where: { id: newUser.id }
  })
  console.log('\nTest user deleted successfully')
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
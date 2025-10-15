import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashed = await hash('testpassword', 10)
  await prisma.user.create({
    data: {
      name: 'testuser',
      email: 'test@example.com',
      password: hashed,
    }
  })
  console.log('Test user created!')
}

main().then(() => prisma.$disconnect())
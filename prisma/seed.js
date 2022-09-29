import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main(){
  const test1 = await prisma.test.upsert({
    name: 'test1'
  })
}


main()
    .then(async () => {
      await prisma.$disconnect()
    })
    .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

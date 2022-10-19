import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

async function main(){
  await Promise.all(
    getTests().map((test)=> {
      return db.test.create({ data: test})
    })
  )
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


function getTests(){
  return [
    { name: "testOne"},
    { name: "testTwo"}
  ]
}

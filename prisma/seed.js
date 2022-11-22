const {PrismaClient} = require('@prisma/client') // for some reason we're not an ES module
const prisma = new PrismaClient()

async function main() {
    seedTextBox()
    return {}
}

const seedTextBox = async () => {
    prisma.textBox.upsert({
        where: {id: 1},
        update: {},
        create: {serializedContent: '{"blocks":[{"key":"9lhsg","text":"Hello world!","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}'}
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
    })

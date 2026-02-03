import { PrismaClient } from "@prisma/client/extension";

const prisma = new PrismaClient()

process.on('beforeExit',async ()=>{
    await prisma.$disconnect()
})

module.exports = {prisma};
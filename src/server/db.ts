import { PrismaClient } from "@prisma/client"
import { env } from "~/env"


const createPrismaClient = () =>
    new PrismaClient({
        log: env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
    })

const globalPrisma = globalThis as unknown as {
    prisma: ReturnType<typeof createPrismaClient> | undefined
}


export const db = globalPrisma.prisma ?? createPrismaClient()

if (env.NODE_ENV !== "production") globalPrisma.prisma = db
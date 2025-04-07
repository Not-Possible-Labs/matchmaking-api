import { prisma } from '../../prisma/client.ts'

export const initDatabase = async (): Promise<void> => {
  console.log("🔄 Initializing database connection...");
  try {
    await prisma.$connect();
    console.log("\x1b[32m%s\x1b[0m", "✅ Successfully connected to PostgreSQL database");
    await prisma.$disconnect();
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", "❌ Error connecting to PostgreSQL database:");
    console.error(error);
    Deno.exit(1);
  }
};

export default prisma;

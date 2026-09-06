import prisma from "./lib/prisma";

async function testDatabase() {
  try {
    await prisma.$connect();

    console.log("✅ Database connected successfully");

    const result = await prisma.user.count();

    console.log(`✅ User table accessible. Current users: ${result}`);
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
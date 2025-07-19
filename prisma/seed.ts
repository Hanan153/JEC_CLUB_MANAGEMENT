const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await hash('admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@jec.ac.in' },
    update: {},
    create: {
      email: 'admin@jec.ac.in',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      department: 'Administration',
      regNo: 'ADMIN001',
    },
  });

  console.log({ admin });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
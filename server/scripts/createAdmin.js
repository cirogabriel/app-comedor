import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const email = process.env.ADMIN_EMAIL || process.argv[2];
const password = process.env.ADMIN_PASSWORD || process.argv[3];
const username = process.env.ADMIN_USERNAME || process.argv[4] || 'admin';

if (!email || !password) {
  console.error('Uso: node scripts/createAdmin.js email password [username]');
  process.exit(1);
}

async function main() {
  const hash = await bcrypt.hash(password, 10);

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    await prisma.admin.update({
      where: { email },
      data: { password: hash, username },
    });
    console.log('Admin existente actualizado:', email);
  } else {
    await prisma.admin.create({
      data: {
        email,
        password: hash,
        username,
      },
    });
    console.log('Admin creado:', email);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const students = [
  { name: 'Juan Carlos', surname: 'Quispe Mamani',     code: '134401', career: 'Ingeniería Informática', email: '134401@unsaac.edu.pe', password: '241101' },
  { name: 'María Elena', surname: 'Huanca Flores',     code: '134402', career: 'Ingeniería Civil',        email: '134402@unsaac.edu.pe', password: '241102' },
  { name: 'Pedro',       surname: 'Ccallo Ttito',      code: '134403', career: 'Contabilidad',            email: '134403@unsaac.edu.pe', password: '241103' },
  { name: 'Ana Lucía',   surname: 'Vargas Condori',    code: '134404', career: 'Derecho',                 email: '134404@unsaac.edu.pe', password: '241104' },
  { name: 'Luis',        surname: 'Apaza Huallpa',     code: '134405', career: 'Medicina Humana',         email: '134405@unsaac.edu.pe', password: '241105' },
  { name: 'Rosa',        surname: 'Choque Sánchez',    code: '134406', career: 'Educación',               email: '134406@unsaac.edu.pe', password: '241106' },
  { name: 'Carlos',      surname: 'Mamani Ccorimanya', code: '134407', career: 'Ingeniería Informática',  email: '134407@unsaac.edu.pe', password: '241107' },
  { name: 'Sofía',       surname: 'Ttito Quispe',      code: '134408', career: 'Arquitectura',            email: '134408@unsaac.edu.pe', password: '241108' },
  { name: 'Diego',       surname: 'Huallpa Farfán',    code: '134409', career: 'Ingeniería Civil',        email: '134409@unsaac.edu.pe', password: '241109' },
  { name: 'Valeria',     surname: 'Condori Puma',      code: '134410', career: 'Psicología',              email: '134410@unsaac.edu.pe', password: '241110' },
];

async function main() {
  console.log('Limpiando datos anteriores...');
  await prisma.booking.deleteMany();
  await prisma.diningDay.deleteMany();
  await prisma.student.deleteMany();

  console.log('Creando estudiantes...');
  const createdStudents = await Promise.all(
    students.map(s => prisma.student.create({ data: s }))
  );

  console.log('Creando días de comedor...');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const diningDays = await Promise.all([
    prisma.diningDay.create({ data: { date: yesterday, capacity: 8 } }),
    prisma.diningDay.create({ data: { date: today,     capacity: 10 } }),
    prisma.diningDay.create({ data: { date: tomorrow,  capacity: 10 } }),
  ]);

  const [dayYesterday, dayToday] = diningDays;

  console.log('Creando reservas...');

  await Promise.all(
    createdStudents.slice(0, 8).map(s =>
      prisma.booking.create({
        data: { studentId: s.id, diningDayId: dayYesterday.id, status: true }
      })
    )
  );

  await Promise.all(
    createdStudents.slice(0, 6).map(s =>
      prisma.booking.create({
        data: { studentId: s.id, diningDayId: dayToday.id, status: true }
      })
    )
  );
  await Promise.all(
    createdStudents.slice(6, 8).map(s =>
      prisma.booking.create({
        data: { studentId: s.id, diningDayId: dayToday.id, status: false }
      })
    )
  );

  console.log('✓ Seed completado');
  console.log(`  ${createdStudents.length} estudiantes creados`);
  console.log(`  3 días de comedor creados (ayer, hoy, mañana)`);
  console.log(`  Hoy: 6 confirmadas, 2 canceladas, 2 sin reserva`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
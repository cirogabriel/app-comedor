import boom from "@hapi/boom";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class BookingService {

    async find(filters = {}) {
        const where = {};
        if (filters.diningDayId) where.diningDayId = parseInt(filters.diningDayId);
        if (filters.status !== undefined) where.status = filters.status === 'true';

        return await prisma.booking.findMany({
            where,
            include: {
                student: {
                    select: { id: true, name: true, surname: true, code: true, career: true, email: true }
                },
                diningDay: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findToday() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const diningDay = await prisma.diningDay.findUnique({ where: { date: today } });
        if (!diningDay) throw boom.notFound('No hay día habilitado hoy');

        const bookings = await prisma.booking.findMany({
            where: { diningDayId: diningDay.id },
            include: {
                student: {
                    select: { id: true, name: true, surname: true, code: true, career: true, email: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return {
            diningDay,
            total: bookings.length,
            confirmed: bookings.filter(b => b.status === true).length,
            cancelled: bookings.filter(b => b.status === false).length,
            bookings
        };
    }

    async cancel(id) {
        const booking = await prisma.booking.findUnique({ where: { id } });
        if (!booking) throw boom.notFound('Reserva no encontrada');
        return await prisma.booking.update({
            where: { id },
            data: { status: false }
        });
    }
}
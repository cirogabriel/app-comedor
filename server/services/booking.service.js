import boom from "@hapi/boom";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class BookingService {

    async find(filters = {}) {
        const where = {};

        if (filters.diningDayId) {
            where.diningDayId = parseInt(filters.diningDayId);
        }

        if (filters.status !== undefined) {
            where.status = filters.status === 'true';
        }

        if (filters.date) {
            const [y, m, d] = filters.date.split('-').map(Number);
            const startOfDay = new Date(y, m - 1, d, 0, 0, 0);
            const endOfDay   = new Date(y, m - 1, d, 23, 59, 59);
            const diningDay = await prisma.diningDay.findFirst({
                where: {
                    date: { gte: startOfDay, lte: endOfDay }
                }
            });
            if (!diningDay) return [];
            where.diningDayId = diningDay.id;
        }

        return await prisma.booking.findMany({
            where,
            include: {
                student: {
                    select: {
                        id: true, name: true, surname: true,
                        code: true, career: true, email: true
                    }
                },
                diningDay: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findToday() {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        const endOfToday   = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

        const diningDay = await prisma.diningDay.findFirst({
            where: { date: { gte: startOfToday, lte: endOfToday } }
        });

        if (!diningDay) throw boom.notFound('No hay día habilitado hoy');

        const bookings = await prisma.booking.findMany({
            where: { diningDayId: diningDay.id },
            include: {
                student: {
                    select: {
                        id: true, name: true, surname: true,
                        code: true, career: true, email: true
                    }
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
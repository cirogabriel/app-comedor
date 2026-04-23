import boom from "@hapi/boom";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


const findTodayDiningDay = async () => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfToday   = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    return await prisma.diningDay.findFirst({
        where: {
            date: {
                gte: startOfToday,
                lte: endOfToday,
            }
        }
    });
};

export class BookService {

    async getOrCreateToday() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const diningDay = await prisma.diningDay.findUnique({
            where: { date: today }
        });

        if (!diningDay) {
            throw boom.notFound('El comedor no está habilitado para hoy. Contacta al administrador.');
        }

        return diningDay;
    }

    async findByCode(code) {
        return await prisma.student.findUnique({ where: { code } });
    }

    async checkIfHaveBooked(studentId, diningDayId) {
        const existing = await prisma.booking.findFirst({
            where: {
                studentId,
                diningDayId,
                status: true
            }
        });
        return !!existing;
    }

    async checkBook(studentId, diningDayId, capacity) {
        const activeBookings = await prisma.booking.count({
            where: {
                diningDayId,
                status: true
            }
        });

        if (activeBookings < capacity) {
            await prisma.booking.create({
                data: {
                    studentId,
                    diningDayId,
                    status: true
                }
            });
            return true;
        }

        return false;
    }

    async getBooking(studentId, diningDayId) {
        return await prisma.booking.findFirst({
            where: { studentId, diningDayId, status: true }
        });
    }

    async cancelBooking(bookingId) {
        return await prisma.booking.update({
            where: { id: bookingId },
            data: { status: false }
        });
    }

    async resetBook() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const diningDay = await prisma.diningDay.findUnique({ where: { date: today } });
        if (!diningDay) return;
        await prisma.booking.updateMany({
            where: { diningDayId: diningDay.id },
            data: { status: false }
        });
    }
}
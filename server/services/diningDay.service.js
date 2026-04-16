import boom from "@hapi/boom";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class DiningDayService {

    async find() {
        return await prisma.diningDay.findMany({
            orderBy: { date: 'desc' }
        });
    }

    async findOne(id) {
        const day = await prisma.diningDay.findUnique({
            where: { id },
            include: { bookings: true }
        });
        if (!day) throw boom.notFound('Día no encontrado');
        return day;
    }

    async findToday() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return await prisma.diningDay.findUnique({
            where: { date: today },
            include: { _count: { select: { bookings: true } } }
        });
    }

    async create(data) {
        try {
            return await prisma.diningDay.create({ data });
        } catch (error) {
            throw boom.badRequest('Ya existe un día registrado para esa fecha');
        }
    }

    async update(id, change) {
        await this.findOne(id);
        return await prisma.diningDay.update({ where: { id }, data: change });
    }

    async delete(id) {
        await this.findOne(id);
        return await prisma.diningDay.delete({ where: { id } });
    }
}
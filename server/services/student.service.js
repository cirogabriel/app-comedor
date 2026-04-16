import boom from "@hapi/boom";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class StudentService {

    async find() {
        return await prisma.student.findMany();
    }

    async findOne(id) {
        const student = await prisma.student.findUnique({ where: { id } });
        if (!student) throw boom.notFound("Student not found");
        return student;
    }

    async findByCode(code) {
        return await prisma.student.findUnique({ where: { code } });
    }

    async create(data) {
        return await prisma.student.create({ data });
    }

    async update(id, change) {
        await this.findOne(id);
        return await prisma.student.update({ where: { id }, data: change });
    }

    async delete(id) {
        await this.findOne(id);
        return await prisma.student.delete({ where: { id } });
    }
}
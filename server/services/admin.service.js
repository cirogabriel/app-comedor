import boom from "@hapi/boom";
import bcrypt from 'bcrypt';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class AdminService {

    async find() {
        return await prisma.admin.findMany();
    }

    async findOne(id) {
        const admin = await prisma.admin.findUnique({ where: { id } });
        if (!admin) throw boom.notFound('Admin not found');
        return admin;
    }

    async findByEmail(email) {
        return await prisma.admin.findUnique({ where: { email } });
    }

    async create(data) {
        const { username, email, password } = data;
        const hashedPassword = await bcrypt.hash(password, 10);
        try {
            const admin = await prisma.admin.create({
                data: { username, email, password: hashedPassword }
            });
            delete admin.password;
            return admin;
        } catch (error) {
            throw boom.badRequest('Error creating admin', error);
        }
    }

    async update(id, change) {
        await this.findOne(id); 
        return await prisma.admin.update({ where: { id }, data: change });
    }

    async delete(id) {
        await this.findOne(id);
        return await prisma.admin.delete({ where: { id } });
    }
}
import { Router } from "express";
import { BookService } from "../services/book.service.js";

const router = Router();
const service = new BookService();

router.post('/', async (req, res, next) => {
    try {
        const student = await service.findByCode(req.body.code);
        if (!student) {
            return res.json({ status: 404, message: 'Estudiante no encontrado' });
        }

        const diningDay = await service.getOrCreateToday();

        const hasBooked = await service.checkIfHaveBooked(student.id, diningDay.id);
        if (hasBooked) {
            const booking = await service.getBooking(student.id, diningDay.id);
            return res.json({
                status: 409,
                message: 'Ya tienes una reserva para hoy',
                bookingId: booking.id,
                student: {
                    name: student.name,
                    surname: student.surname,
                    code: student.code,
                    career: student.career,
                }
            });
        }

        const success = await service.checkBook(student.id, diningDay.id, diningDay.capacity);
        if (success) {
            const booking = await service.getBooking(student.id, diningDay.id);
            return res.json({
                status: 200,
                message: '¡Reserva confirmada! ¡Buen provecho!',
                bookingId: booking.id,
                student: {
                    name: student.name,
                    surname: student.surname,
                    code: student.code,
                    career: student.career,
                }
            });
        } else {
            return res.json({ status: 409, message: 'Se agotaron los cupos para hoy' });
        }

    } catch (error) {
        if (error.isBoom && error.output.statusCode === 404) {
            return res.json({
                status: 503,
                message: 'El comedor no está habilitado para hoy'
            });
        }
        next(error);
    }
});

router.patch('/cancel/:bookingId', async (req, res, next) => {
    try {
        const bookingId = parseInt(req.params.bookingId);
        await service.cancelBooking(bookingId);
        res.json({ status: 200, message: 'Reserva cancelada exitosamente' });
    } catch (error) {
        next(error);
    }
});

export default router;
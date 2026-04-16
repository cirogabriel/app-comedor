import { Router } from "express";
import { BookService } from "../services/book.service.js";

const router = Router();
const service = new BookService();

router.post('/', async (req, res, next) => {
    try {
        const student = await service.findByCode(req.body.code);

        if (!student) {
            return res.json({ 
                    status: 404, 
                    message: 'Estudiante no encontrado' 
                });
        }

        const diningDay = await service.getOrCreateToday();

        const hasBooked = await service.checkIfHaveBooked(student.id, diningDay.id);

        if (hasBooked) {
            return res.json({
                    status: 409, 
                    message: 'Ya tienes una reserva para hoy'
                 });
        }

        const success = await service.checkBook(student.id, diningDay.id, diningDay.capacity);

        if (success) {
            return res.json({
                    status: 200, 
                    message: 'Reserva confirmada. ¡Buen provecho!'
                 });
        } else {
            return res.json({ 
                status: 409, 
                message: 'Se agotaron los cupos para hoy' 
            });
        }

    } catch (error) {
        next(error);
    }
});

router.patch('/cancel/:bookingId', async (req, res, next) => {
    try {
        const bookingId = parseInt(req.params.bookingId);
        await service.cancelBooking(bookingId);

        res.json({ 
            status: 200, 
            message: 'Reserva cancelada' 
        });
    } catch (error) {
        next(error);
    }
});

export default router;
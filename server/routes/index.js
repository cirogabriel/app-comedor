import { Router } from "express";
import routerStudent from './student.router.js';
import routerAdmin from './admin.router.js';
import routerAuth from './auth.router.js';
import routerBook from './book.router.js';
import routerDiningDay from './diningDay.router.js';
import routerBooking from './ booking.router.js';

export const routerApi = (app) => {
    const router = Router();
    app.use("/api/v1", router);
    router.use("/students", routerStudent);
    router.use('/admins', routerAdmin);
    router.use('/auth', routerAuth);
    router.use('/book', routerBook);           // estudiante reserva
    router.use('/dining-days', routerDiningDay); // admin gestiona días
    router.use('/bookings', routerBooking);      // admin gestiona reservas
};
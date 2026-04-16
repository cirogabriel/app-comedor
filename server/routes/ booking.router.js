import { Router } from "express";
import { BookingService } from "../services/booking.service.js";
import passport from "passport";

const router = Router();
const service = new BookingService();

router.get('/',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
        try {
            res.json(await service.find(req.query));
        } catch (error) {
            next(error);
        }
    }
);

router.get('/today',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
        try {
            res.json(await service.findToday());
        } catch (error) {
            next(error);
        }
    }
);

router.patch('/:id/cancel',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            res.json(await service.cancel(id));
        } catch (error) {
            next(error);
        }
    }
);

export default router;
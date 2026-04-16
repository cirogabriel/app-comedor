import { Router } from "express";
import { DiningDayService } from "../services/diningDay.service.js";
import passport from "passport";

const router = Router();
const service = new DiningDayService();

router.use(passport.authenticate('jwt', { session: false }));

router.get('/', async (req, res, next) => {
    try {
        res.json(await service.find());
    } catch (error) {
        next(error);
    }
});

router.get('/today', async (req, res, next) => {
    try {
        const today = await service.findToday();
        if (!today) {
            return res.json({
                    status: 404, 
                    message: 'No hay día habilitado para hoy' 
                });
        }
        res.json(today);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        res.status(201).json(await service.create(req.body));
    } catch (error) {
        next(error);
    }
});

router.patch('/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        res.json(await service.update(id, req.body));
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        res.json(await service.delete(id));
    } catch (error) {
        next(error);
    }
});

export default router;
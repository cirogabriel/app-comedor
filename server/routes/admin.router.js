import { Router } from "express";
import { AdminService } from "../services/admin.service.js";
import { handleValidation } from "../middleware/handleValidation.js";
import { createAdminSchema, getAdminSchema, updateAdminSchema } from "../schema/admin.schema.js";
import passport from "passport";

const router = Router();
const service = new AdminService();

router.get('/',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
        try {
            res.json(await service.find());
        } catch (error) {
            next(error);
        }
    }
);

router.get('/:id',
    passport.authenticate('jwt', { session: false }),
    handleValidation(getAdminSchema, 'params'),
    async (req, res, next) => {
        try {
            const id = parseInt(req.params.id, 10);
            res.json(await service.findOne(id));
        } catch (error) {
            next(error);
        }
    }
);

router.post('/',
    passport.authenticate('jwt', { session: false }),
    handleValidation(createAdminSchema, 'body'),
    async (req, res, next) => {
        try {
            res.status(201).json(await service.create(req.body));
        } catch (error) {
            next(error);
        }
    }
);

router.patch('/:id',
    passport.authenticate('jwt', { session: false }),
    handleValidation(getAdminSchema, 'params'),
    handleValidation(updateAdminSchema, 'body'),
    async (req, res, next) => {
        try {
            const id = parseInt(req.params.id, 10);
            res.json(await service.update(id, req.body));
        } catch (error) {
            next(error);
        }
    }
);

router.delete('/:id',
    passport.authenticate('jwt', { session: false }),
    handleValidation(getAdminSchema, 'params'),
    async (req, res, next) => {
        try {
            const id = parseInt(req.params.id, 10);
            await service.delete(id);
            res.status(200).json({ id });
        } catch (error) {
            next(error);
        }
    }
);

export default router;
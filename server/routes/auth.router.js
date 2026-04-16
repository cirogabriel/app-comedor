import { Router } from "express";
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { configure } from "../config/config.js";
import { BookService } from "../services/book.service.js";

const service = new BookService();
const router = Router();

router.post('/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, async (err, user, info) => {
        try {
            if (err || !user) {
                return res.json({ status: 401, message: info.message || 'Authentication failed' });
            }
            const payload = { sub: user.id };
            const token = jwt.sign(payload, configure.jwtSecret);
            res.header('Authorization', 'Bearer ' + token);
            res.json({ user, token });
        } catch (error) {
            next(error);
        }
    })(req, res, next);
});

router.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/');
    });
});

router.post('/reset', async (req, res, next) => {
    try {
        await service.resetBook();
        res.json({ status: 200, message: 'Reservas del día canceladas' });
    } catch (error) {
        next(error);
    }
});

export default router;
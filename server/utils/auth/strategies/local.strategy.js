import { Strategy } from 'passport-local';
import { AdminService } from "../../../services/admin.service.js";
import bcrypt from "bcrypt";

const service = new AdminService();

export const localStrategy = new Strategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const admin = await service.findByEmail(email);
        if (!admin) {
            return done(null, false, { message: 'El email no existe' });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return done(null, false, { message: 'Contraseña incorrecta' });
        }
        delete admin.password;
        return done(null, admin);
    } catch (error) {
        return done(error);
    }
});
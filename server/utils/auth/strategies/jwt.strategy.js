// import pkg from 'passport-jwt';
// import { configure } from "../../../config/config.js";

// const { Strategy, ExtractJwt } = pkg;

// const options = {
//     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//     secretOrKey: configure.jwtSecret
// }

// export const jwtStrategy = new Strategy(options, (payload, done) => {
//     return done(null, payload)
// })

import pkg from 'passport-jwt';
import { configure } from "../../../config/config.js";
import { AdminService } from "../../../services/admin.service.js";

const { Strategy, ExtractJwt } = pkg;
const service = new AdminService();

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: configure.jwtSecret
}

export const jwtStrategy = new Strategy(options, async (payload, done) => {
    try {
        const admin = await service.findOne(payload.sub);
        if (!admin) return done(null, false);
        return done(null, admin);
    } catch (error) {
        return done(error);
    }
});
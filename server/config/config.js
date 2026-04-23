import { config } from "dotenv";

config();

export const configure = {
    env: process.env.NODE_ENV || "dev",
    port: process.env.PORT || 3000,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbHost: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    dbPort: process.env.DB_PORT,
    jwtSecret: process.env.JWT_SECRET,
    recaptchaSecretKey: process.env.RECAPTCHA_SECRET_KEY,
    recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY
}


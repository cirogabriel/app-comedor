import Joi from "joi";

const id = Joi.number().integer();
const username = Joi.string();
const email = Joi.string().email();
const password = Joi.string().min(6);

export const createAdminSchema = Joi.object({
    username: username.required(),
    email: email.required(),
    password: password.required(),
});

export const updateAdminSchema = Joi.object({
    username,
    email,
    password
});

export const getAdminSchema = Joi.object({
    id: id.required()
});
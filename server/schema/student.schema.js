import Joi from "joi";

const id = Joi.number().integer();
const name = Joi.string();
const surname = Joi.string();
const code = Joi.string().length(6).pattern(/^\d{6}$/);
const career = Joi.string();
const email = Joi.string().email();
const password = Joi.string().min(6);

export const createStudentSchema = Joi.object({
    name: name.required(),
    surname: surname.required(),
    code: code.required(),
    career: career.required(),
    email: email,
    password: password
});

export const updateStudentSchema = Joi.object({
    name,
    surname,
    code,
    career,
    email,
    password
});

export const getStudentSchema = Joi.object({
    id: id.required()
});
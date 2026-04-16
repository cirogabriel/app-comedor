import Joi from "joi";

const id = Joi.number().integer();
const date = Joi.date();
const capacity = Joi.number().integer().min(1).max(500);

export const createDiningDaySchema = Joi.object({
    date: date.required(),
    capacity: capacity.required()
});

export const updateDiningDaySchema = Joi.object({
    date,
    capacity
});

export const getDiningDaySchema = Joi.object({
    id: id.required()
});
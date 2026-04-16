import Joi from "joi";

const id = Joi.number().integer();
const studentId = Joi.number().integer();
const diningDayId = Joi.number().integer();
const status = Joi.boolean();

export const createBookingSchema = Joi.object({
    studentId: studentId.required(),
    diningDayId: diningDayId.required(),
    status: status
});

export const updateBookingSchema = Joi.object({
    status
});

export const getBookingSchema = Joi.object({
    id: id.required()
});
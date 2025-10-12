import Joi from "joi";

export const resetPasswordValidationSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .trim()
        .lowercase()
        .max(200)
        .required()
        .messages({
            "string.empty": "Поле обов'язкове",
            "string.email": "Введіть коректний E-mail",
            "string.max": "E-mail не може бути довшим за 200 символів",
        }),
});
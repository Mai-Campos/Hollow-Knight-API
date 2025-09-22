import { body } from 'express-validator';

export const registerValidator = [
    body("email")
        .notEmpty().withMessage("El email es requerido")
        .isEmail().withMessage("Debe ser un email valido"),

    body("password")
        .notEmpty().withMessage("La contraseña es requerida")
        .isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),


    body("name")
        .notEmpty().withMessage("El nombre de usuario es requerido")
        .isLength({ min: 3 }).withMessage("El nombre debe tener al menos 3 caracteres")
];




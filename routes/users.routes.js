const { Router } = require("express");
const { check } = require("express-validator");

const {
    validateFields,
    validateJWT,
} = require("../middlewares");

const {
    rutExists,
} = require("../helpers/database-validators");

const {
    usersGet,
    usersPost
} = require("../controllers/users.controller");

const messages = require("../utils/messages");

const router = Router();

router.get("/", [validateJWT], usersGet);

router.post(
    "/", [
        //validateJWT,
        check("name", messages.NAME_PRESENT_VALIDATION).not().isEmpty(),
        check("password", messages.PASSWORD_LENGTH_VALIDATION).isLength({ min: 6 }),
        check("email", messages.EMAIL_FORMAT_VALIDATION).isEmail(),
        check("rut").custom(rutExists),
        validateFields, // Middleware para verificar los errores
    ],
    usersPost
);

module.exports = router;
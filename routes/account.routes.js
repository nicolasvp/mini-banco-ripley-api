const { Router } = require("express");
const { check } = require("express-validator");

const {
    validateFields,
    validateJWT,
} = require("../middlewares");

const {
    rutExists,
    userExistById,
} = require("../helpers/database-validators");

const {
    movements,
    loadBalance,
    withdrawals,
    transferBalance,
} = require("../controllers/users.controller");

const messages = require("../utils/messages");

const router = Router();

router.get(
    "/movements", [
        validateJWT,
        validateFields, // Middleware para verificar los errores
    ],
    movements
);

router.post(
    "/load-balance", [
        validateJWT,
        check("amount", messages.INVALID_AMOUNT_ERROR).isInt({ min: 1, max: 1000000 }),
        validateFields, // Middleware para verificar los errores
    ],
    loadBalance
);

router.post(
    "/withdrawals", [
        validateJWT,
        check("amount", messages.INVALID_AMOUNT_ERROR).isInt({ min: 1, max: 1000000 }),
        validateFields, // Middleware para verificar los errores
    ],
    withdrawals
);

router.post(
    "/transfer-balance", [
        validateJWT,
        check("amount", messages.INVALID_AMOUNT_ERROR).isInt({ min: 1, max: 1000000 }),
       // check("rut", messages.NAME_PRESENT_VALIDATION),
        validateFields, // Middleware para verificar los errores
    ],
    transferBalance
);

module.exports = router;
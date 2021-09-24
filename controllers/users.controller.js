const {response, request} = require('express');

const bcryptjs = require('bcryptjs');

const User = require('../models/user');
const Movement = require('../models/movement');
const jwt = require("jsonwebtoken");
const messages = require("../utils/messages");

/**
 * Recibe las peticiones realizadas mediante el método GET
 * Se buscan todos los usuarios según los limites que se pasen por parametro
 * Por defecto el límite max es 5
 * Se declara el tipo 'res = response' para obtener los metodos asociados al tipo de dato de 'res'
 * Se declara el tipo 'req = request' para obtener los metodos asociados al tipo de dato de 'req'
 * @param {*} req Request de la petición entrante
 * @param {*} res Response de la petición
 */
const usersGet = async (req = request, res = response) => {

    const {to = 5, from = 0} = req.query;
    const query = {status: true};

    /**
     * Realiza 2 queries
     * 1. Contando todos los registros de usuarios que esten con status: true
     * 2. Busca todos los usuarios entre los rangos que se definan en 'from' y 'to'
     */
    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query).skip(Number(from)).limit(Number(to)),
    ]);

    res.json({
        total,
        users,
    });
};

/**
 * Recibe las peticiones realizadas mediante el método POST, obtiene el name y age del body del request y los devuelve en la respuesta.
 * Se declara el tipo 'res = response' para obtener los metodos asociados al tipo de dato de 'res'
 * 'async' se utiliza ya que las llamadas a la base de datos son asincronas y se utiliza 'await'
 * @param {*} req Request de la petición entrante
 * @param {*} res Response de la petición
 */
const usersPost = async (req, res = response) => {
    const {name, email, rut, password} = req.body;
    const user = new User({name, email, rut, password});

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    // Guardar en BD
    await user.save();

    res.json({
        user
    });
};

const movements = async (req, res = response) => {
    const {to = 5, from = 0} = req.query;
    const query = {status: true};
    const token = req.header("Authorization").split(" ")[1];
    const {uid} = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findById(uid);

    /**
     * Realiza 2 queries
     * 1. Contando todos los registros de usuarios que esten con status: true
     * 2. Busca todos los usuarios entre los rangos que se definan en 'from' y 'to'
     */
    const [total, movements] = await Promise.all([
        Movement.countDocuments(query),
        Movement.find({$or: [{"from": user.rut}, {"destiny": user.rut}]},
            function (err, docs) {
            }).skip(Number(from)).limit(Number(to))]);

        res.json({
            data: {
                movements,
                total
            }
        });
};

const loadBalance = async (req, res = response) => {
    const {amount} = req.body;

    const token = req.header("Authorization").split(" ")[1];

    const {uid} = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findById(uid);

    const newBalance = user.balance + amount;

    const updatedUser = await User.findByIdAndUpdate(uid, {"balance": newBalance});

    const movement = new Movement({
        "rut": user.rut,
        "amount": amount,
        "balance": user.balance,
        "from": user.rut,
        "destiny": user.rut,
        "action": "LOAD"
    });

    await movement.save();

    res.json({
        updatedUser
    });
};

const withdrawals = async (req, res = response) => {
    const {amount} = req.body;

    const token = req.header("Authorization").split(" ")[1];

    const {uid} = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findById(uid);

    const newBalance = user.balance - amount;

    if (newBalance < 0) {
        return res.status(500).json({
            msg: messages.WITHDRAWALS_ERROR,
        });
    }

    const updatedUser = await User.findByIdAndUpdate(uid, {"balance": newBalance});

    const movement = new Movement({
        "rut": user.rut,
        "amount": amount,
        "balance": user.balance,
        "from": user.rut,
        "destiny": user.rut,
        "action": "WITHDRAWALS"
    });

    await movement.save();

    res.json({
        updatedUser
    });
};

const transferBalance = async (req, res = response) => {
    const {amount, rut} = req.body;

    const token = req.header("Authorization").split(" ")[1];

    const {uid} = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findById(uid);

    const newBalance = user.balance - amount;

    // Se debe aplicar validacion antes de llegar a este punto
    if (newBalance < 0) {
        return res.status(500).json({
            msg: messages.WITHDRAWALS_ERROR,
        });
    }

    const updatedUser = await User.findByIdAndUpdate(uid, {"balance": newBalance});

    // Se debe aplicar validacion de que existe el usuario antes de que llegue a este punto
    const transferToUser = await User.findOne({"rut": rut});

    const newBalanceTransferUser = transferToUser.balance + amount;

    await User.findOneAndUpdate({"rut": rut}, {"balance": newBalanceTransferUser});

    const movement = new Movement({
        "rut": user.rut,
        "amount": amount,
        "balance": user.balance,
        "from": user.rut,
        "destiny": rut,
        "action": "TRANSFER"
    });

    await movement.save();

    res.json({
        updatedUser
    });
};

module.exports = {
    usersGet,
    usersPost,
    loadBalance,
    withdrawals,
    transferBalance,
    movements
};
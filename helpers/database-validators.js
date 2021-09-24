const { User } = require("../models");

/**
 * Helper para centralización de validaciones custom
 * Validadores que se utilizan consultando a la base de datos para verificar si los datos de los request ya se encuentran o no en la base de datos
 */

/**
 * Verifica si el rut existe en la base de datos
 * @param {*} email
 */
const rutExists = async(rut = "") => {
    // Verificar si el rut existe
    const rutExist = await User.findOne({ rut });

    // Si existe el correo en la base de datos, lanza un error indicando que ya existe
    if (rutExist) {
        throw new Error(`Rut '${rutExist}', already exists in database`);
    }
};

/**
 * Verifica si el usuario existe en la base de datos, buscandolo por el id
 * @param {*} id
 */
const userExistById = async(id) => {
    const user = await User.findById(id);

    // Si no existe el usuario en la base de datos, lanza un error indicando que no existe
    if (!user) {
        throw new Error(`User with id '${id}', does not exists in database`);
    }
};

module.exports = {
    rutExists,
    userExistById
};
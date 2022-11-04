const Joi = require('joi');

const validarUsuario = (nombre) => {
    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });
    return (schema.validate({ nombre }));
}

module.exports = {
    validarUsuario
}

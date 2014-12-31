var joi = require('joi');

module.exports = joi.object().keys({
    pipe: joi.func().required(),
    on: joi.func().required(),
    emit: joi.func().required(),
    write: joi.func().required(),
    end: joi.func().required()
}).unknown();
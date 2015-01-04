var joi = require('joi')
    , streamSchema = require('./streamSchema.js')
    ;

module.exports = joi.object().keys({
    tasks: joi.array().includes(joi.string(), joi.func(), streamSchema),
    stream: joi.func(),
    tagTemplate: joi.func(),
    tag: joi.string()
}).xor('tasks', 'stream').without('tagTemplate', 'tag');
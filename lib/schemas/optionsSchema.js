var joi = require('joi');

module.exports = joi.object().keys({
    tagTemplates: joi.object().unknown().pattern(/.*/, joi.func()),
    regExps: joi.object().keys({
        start: joi.object().type(RegExp),
        end: joi.object().type(RegExp)
    })
});
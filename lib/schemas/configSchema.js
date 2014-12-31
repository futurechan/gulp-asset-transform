var joi = require('joi')
    , blockConfigSchema = require('./blockConfigSchema.js')
    ;

module.exports = joi.object().required().unknown().pattern(/.*/, blockConfigSchema);
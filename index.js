var through = require('through2')
    , gutil = require('gulp-util')
    , PluginError = gutil.PluginError
    , PLUGIN_NAME = 'gulp-asset-transform'
    , parser = require('./lib/parser')
    , Processor = require('./lib/processor')
    , path = require('path')
    , joi = require('joi')
    , configSchema = require('./lib/schemas/configSchema.js')
    , optionsSchema = require('./lib/schemas/optionsSchema.js')
    , _ = require('lodash')
    , gulpConcat = require('gulp-concat')
    ;

var validate = function (config, opts) {

    if (config && config.tagTemplates) {
        opts.tagTemplates = config.tagTemplates;
        delete config.tagTemplates;
        gutil.log('tagTemplates configuration has moved to the secondary options parameter.');
    }

    joi.validate(config, configSchema, function (err, validatedConfig) {
        if (err) {
            throw new PluginError(PLUGIN_NAME, err, { showStack: false });
        }
        _.extend(config, validatedConfig);
    });

    joi.validate(opts, optionsSchema, function (err, validatedOpts) {
        if (err) {
            throw new PluginError(PLUGIN_NAME, err, { showStack: false });
        }
        _.extend(opts, validatedOpts);
    });

};

module.exports = function(config, opts){
    opts = opts || {};

    validate(config, opts);

    var stream = through.obj(function(file, enc, cb) {
        var push = this.push.bind(this);

        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
            return cb();
        }

        var parseBlocks = parser(config, opts);

        var processor = new Processor(config, push);

        parseBlocks(String(file.contents), file.base, function(err, blocks){
            if(err){
                this.emit('error', new PluginError(PLUGIN_NAME, err));
                return cb();
            }

            processor.processBlocks(blocks, function(err, processedFile){

                var gFile = new gutil.File({
                    path: path.basename(file.path),
                    contents: new Buffer(processedFile)
                });

                // make sure the file goes through the next gulp plugin
                push(gFile);

                // tell the stream engine that we are done with this file
                cb();
            })
        })


    });

    // returning the file stream
    return stream;

}

module.exports.concat = function (customFilename, options) {
    if (!options) {
        options = {};
    } else if (typeof options === 'string') {
        options = { newLine: options }
    }

    return function (filename) {
        return gulpConcat(customFilename || filename, options);
    }
};

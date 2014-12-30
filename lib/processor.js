var gulp = require('gulp')
    , async = require('async')
    , path = require('path')
    , _ = require('lodash')
    , joi = require('joi')
    , gutil = require('gulp-util')
;

var pipelineStrategyFactory  = require('./pipelineStrategies/pipelineStrategyFactory');

var startReg = /<!--\s*at:(\w+)\s*(?:>>\s*(?:(\w+):)?(\/?\S*))?\s*-->/gi
    , endReg = /<!--\s*at:end\s*-->/gi
    , linkReg = /href="(.*)"/gi
    , scriptReg = /src="(.*)"/gi
;

var streamObjectSchema = joi.object().keys({
    pipe: joi.func().required()
}).unknown();

var transConfigSchema = joi.object().keys({
    tasks: joi.array().includes(joi.string(), joi.func(), streamObjectSchema),
    stream: joi.func(),
    tagTemplate: joi.func(),
    tag: joi.string()
}).xor('tasks', 'stream').without('tagTemplate', 'tag');

module.exports = function(config, push){

    var tagTemplates = _.defaults(config.tagTemplates || {}, require('./tagTemplates'));

    function getFilename(tag){
        if(!tag) return;

        var match = tag.match(linkReg);
        if(match)
            return match[0].split(linkReg)[1];

        match = tag.match(scriptReg);
        if(match)
            return match[0].split(scriptReg)[1];
    }

    function getFilePaths(block){
        var files = [];

        var linkMatches = block.match(linkReg) || [];
        linkMatches.forEach(function(match){
            var file = match.split(linkReg)[1];

            files.push(file);
        })

        var scriptMatches = block.match(scriptReg) || [];
        scriptMatches.forEach(function(match){
            var file = match.split(scriptReg)[1];

            files.push(file);
        })

        return files;
    }

    function getTagTemplate(instance, ref, filename){
        if(instance) return instance;

        if(!ref){
            var ext = path.extname(filename);
            var dotIdx = ext.indexOf('.');

            if(dotIdx > -1)
                ext = ext.substring(dotIdx + 1);

            ref = ext;
        }

        if(ref) return tagTemplates[ref];
    }

    function parseBlock(content){
        var sections = content.split(startReg);

        var block = {
            html : sections[0],
            pipelineId : sections[1],
            assetTags : sections[sections.length-1]
        };

        var transConfig = config[block.pipelineId];

        if(!transConfig) return block;

        joi.validate(transConfig, transConfigSchema, function (err, validatedConfig) {
            if (err) {
                throw new gutil.PluginError('gulp-asset-transform', err, { showStack: false });
            }

            block.tasks = validatedConfig.tasks;
            block.stream = validatedConfig.stream;

            block.filename = sections[3] || getFilename(validatedConfig.tag);

            block.tag = validatedConfig.tag ||
                getTagTemplate(validatedConfig.tagTemplate, sections[2],  block.filename)(block.filename);

        });

        return block;
    }

    function processBlock(content, basePath, callback){

        // this isn't a block
        if (!content.match(startReg)) return callback(null, content);

        //this is a block
        var block = parseBlock(content);

        if(block.pipelineId=='remove')
            return callback(null, block.html);

        //get asset files
        var assetFilePaths = getFilePaths(block.assetTags)
            .map(function(assetFilePath){
                return path.join(basePath, assetFilePath);
            });

        var strategy = pipelineStrategyFactory.getPipelineStrategy(block)
        var pipeEnd = strategy(block, assetFilePaths).pipeEnd;

        pipeEnd.on('data', function(newFile){
            var oldName = path.basename(block.filename);
            var newName = path.basename(newFile.path);

            block.filename = block.filename.replace(oldName, newName);
            block.tag = block.tag.replace(oldName, newName);

            push(newFile);
        });

        pipeEnd.on('end', function() {
            //callback when all tasks have completed for all blocks
            var html = block.html + block.tag;

            callback(null, html);
        })
    }

    function processBlocks(content, basePath, callback){
        var blocks = content.split(endReg);

        var mapper = function(content, cb){
            processBlock(content, basePath, cb)
        }
        //for all blocks
        async.map(blocks, mapper, function(err, results){
            // if any of the saves produced an error, err would equal that error
            callback(null, results.join(''));
        });
    }

    return processBlocks;
}

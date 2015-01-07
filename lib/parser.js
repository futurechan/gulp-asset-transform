var gutil = require('gulp-util')
    , path = require('path')
    , _ = require('lodash')
    , PluginError = gutil.PluginError
    , PLUGIN_NAME = require('../package.json').name
;

var defaultRegExps = {
    start:/<!--\s*at:(\w+)\s*(?:>>\s*(?:(\w+):)?(\/?\S*))?\s*-->/gi,
    end:/<!--\s*at:end\s*-->/gi,
    link:/href="(.*)"/gi,
    script:/src="(.*)"/gi
}


module.exports = function(config, opts){

    var regExps = _.defaults(opts.regExps || {}, defaultRegExps);

    var tagTemplates = _.defaults(opts.tagTemplates || {}, require('./tagTemplates'));

    function getFilename(tag){
        if(!tag) return;

        var linkReg = regExps.link;
        var scriptReg = regExps.script;

        var match = tag.match(linkReg);
        if(match)
            return match[0].split(linkReg)[1];

        match = tag.match(scriptReg);
        if(match)
            return match[0].split(scriptReg)[1];
    }

    function getFilePaths(block){
        var linkReg = regExps.link;
        var scriptReg = regExps.script;
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

        var message = 'Could not determine the tag template. Please define either an output filename in the block or a tagTemplate function or a tag string';
        throw new PluginError(PLUGIN_NAME, message, { showStack: false });
    }

    function parseBlock(token, basePath){
        var startReg = regExps.start;

        if (!token.match(startReg)) return { html: token};

        var sections = token.split(startReg);

        var block = {
            html : sections[0],
            pipelineId : sections[1],
            assetTags : sections[sections.length-1]
        };

        var transConfig = config[block.pipelineId];

        if(!transConfig) return block;

        block.tasks = transConfig.tasks;
        block.stream = transConfig.stream;

        block.filename = sections[3] || getFilename(transConfig.tag);

        block.tag = transConfig.tag ||
        getTagTemplate(transConfig.tagTemplate, sections[2],  block.filename)(block.filename);

        block.assetFilePaths = getFilePaths(block.assetTags)
            .map(function(assetFilePath){
                return path.join(basePath, assetFilePath);
            });

        return block;
    }

    function getTokens(content){
        var endReg = regExps.end;

        return content.split(endReg);
    }

    function getBlocks(content, basePath, callback){
        try {
            var tokens = getTokens(content);

            var blocks = tokens.map(function (token) {
                return parseBlock(token, basePath);
            })

            callback(null, blocks);
        } catch (err) {
            callback(err);
        }
    }

    return getBlocks;
}

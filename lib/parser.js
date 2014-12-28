var gutil = require('gulp-util')
    , path = require('path')
    , _ = require('lodash')
;

var defaultRegExps = {
    start:/<!--\s*at:(\w+)\s*(?:>>\s*(?:(\w+):)?(\/?\S*))?\s*-->/gi,
    end:/<!--\s*at:end\s*-->/gi,
    link:/href="(.*)"/gi,
    script:/src="(.*)"/gi
}


module.exports = function(config, opts){

    var regExps = _.defaults(opts.regExps || {}, defaultRegExps);

    if(config.tagTemplates){
        opts.tagTemplates = config.tagTemplates;
        gutil.log("tagTemplates configuration has moved to the secondary options parameter.")
    }

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

        //if(transConfig.tasks && transConfig.stream)
        //    throw new Error("Pipeline cannot have both tasks and stream. Pipeline: " + block.pipelineId)

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
        var tokens  = getTokens(content);

        var blocks = tokens.map(function(token){
            return parseBlock(token, basePath);
        })

        callback(null, blocks);
    }

    return getBlocks;
}

var gulp = require('gulp')
    , async = require('async')
    , path = require('path')
    , concat = require('gulp-concat')
;

var startReg = /<!--\s*at:(\w+)\s*-->/gi
    , endReg = /<!-- at:end -->/gi
    , linkReg = /href="(.*)"/gi
    , scriptReg = /src="(.*)"/gi
;

module.exports = function(config, push){

    function getFilename(tag){
        var p = tag.match(linkReg) || tag.match(scriptReg);

        return path.basename(p);
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

    function getTask(t, filename){
        return (t != 'concat')
            ? t
            : concat(filename)
    }

    function processBlock(content, basePath, callback){

        // this isn't a block
        if (!content.match(startReg)) return callback(null, content);

        //this is a block

        var sections = content.split(startReg);

        //get block tasks
        var transConfig = config[sections[1]];
        var tasks = transConfig.tasks;
        var filename = getFilename(transConfig.tag);

        //get asset files
        var assetFilePaths = getFilePaths(sections[2])
            .map(function(assetFilePath){
                return path.join(basePath, assetFilePath);
            });

        //run block tasks
        var pipeEnd = gulp.src(assetFilePaths)
        for(var i=0;i<tasks.length;i++)
            pipeEnd = pipeEnd.pipe(getTask(tasks[i], filename));

        pipeEnd.on('data', function(newFile){
            push(newFile);
        })

        pipeEnd.on('end', function() {
            //callback when all tasks have completed for all blocks
            var html = sections[0]
                    + transConfig.tag
                ;

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
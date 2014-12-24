var gulp = require('gulp')
    , async = require('async')
    , path = require('path')
    , _ = require('lodash')
;

var BlockParser = require('./blockParser')
    , pipelineStrategyFactory  = require('./pipelineStrategies/pipelineStrategyFactory');

module.exports = function(config, push){

    var blockParser = BlockParser(config);

    function processBlock(content, basePath, callback){

        var block = blockParser.parseBlock(content);

        if (!block) return callback(null, content);

        if(block.pipelineId=='remove')
            return callback(null, block.html);

        //get asset files
        var assetFilePaths = blockParser.getFilePaths(block.assetTags)
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
        var blocks = blockParser.getTokens(content);

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

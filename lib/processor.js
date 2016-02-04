var async = require('async')
    , path = require('path')
    , gutil = require('gulp-util')
;

var pipelineStrategyFactory  = require('./pipelineStrategies/pipelineStrategyFactory');

var Processor = function(config, push){
  this.config = config;
  this.push = push;
}

module.exports = Processor;

Processor.prototype.processBlock = function(block, callback){

    var self = this;

    if(Object.keys(block).length == 1)
        return callback(null, block.html);

    if(block.pipelineId=='remove')
        return callback(null, block.html);

    var strategy = pipelineStrategyFactory.getPipelineStrategy(block)
    var pipeEnd = strategy(block, block.assetFilePaths).pipeEnd;

    pipeEnd.on('data', function(newFile){
        var oldName = path.basename(block.filename);
        var newName = path.basename(newFile.path);

        block.filename = block.filename.replace(oldName, newName);
        block.tag = block.tag.replace(oldName, newName);

        self.push(newFile);
    });

    pipeEnd.on('end', function() {
        //callback when all tasks have completed for all blocks
        var html = block.html + block.tag;

        callback(null, html);
    })
}

Processor.prototype.processBlocks = function (blocks, callback){

  var self = this;

    var mapper = function(block, cb){
        self.processBlock(block, cb)
    }
    //for all blocks
    async.map(blocks, mapper, function(err, results){
        // if any of the saves produced an error, err would equal that error
        callback(null, results.join(''));
    });
}

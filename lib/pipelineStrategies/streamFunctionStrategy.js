var gulp = require('gulp');

module.exports = function(block){

    var stream = block.stream;
    var pipeStart = gulp.src(block.assetFilePaths);
    var pipeEnd = stream(pipeStart, block.filename);

    return {
        pipeEnd:pipeEnd
    }

}
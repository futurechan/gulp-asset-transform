var gulp = require('gulp');

module.exports = function(block, files){

    var pipeEnd = block.stream(gulp.src(files), block.filename);

    return {
        pipeEnd:pipeEnd
    }

}
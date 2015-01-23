var fs = require('vinyl-fs');

module.exports = function(block, files){

    var pipeEnd = block.stream(fs.src(files), block.filename);

    return {
        pipeEnd:pipeEnd
    }

}
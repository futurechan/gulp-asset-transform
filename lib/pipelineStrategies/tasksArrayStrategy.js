var fs = require('vinyl-fs')
    , concat = require('gulp-concat')
;

function getTask(t, filename){
    if (t == 'concat') {
        return concat(filename);
    } else if (typeof(t) == 'function') {
        return t(filename);
    } else {
        return t;
    }
}

module.exports = function(block, files){

    var tasks = block.tasks;

    var pipeEnd = fs.src(files);

    for (var i=0;i<tasks.length;i++) {
        pipeEnd = pipeEnd.pipe(getTask(tasks[i], block.filename));
    }

    return {
        pipeEnd:pipeEnd
    }

}
var at = require('../../index')
    , less = require('gulp-less')
    , minifyCss = require('gulp-minify-css')
    , gutil = require('gulp-util')
    , path = require('path')
    , fs = require('fs')
;

describe('less transformation', function(){

    var indexHtml;

    before(function(){
        var filePath = path.join(__dirname, '../assets/less-only.html');

        indexHtml = new gutil.File({
            path:     filePath,
            base:     path.dirname(filePath),
            contents: fs.readFileSync(filePath)
        });
    })

    it('should handle less compilation', function(done){

        var stream = at({
            less: {
                tag:'<link rel="stylesheet" type="text/css" href="assets/site_less.css">',
                tasks:[less(), minifyCss(), 'concat']
            }
        });

        stream.on('data', function(newFile) {
            //do assertions?
        });

        stream.on('end', function() {
            done();
        });

        stream.write(indexHtml);
        stream.end();

    })

})
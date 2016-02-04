var at = require('../../index')
    , less = require('gulp-less')
    , minifyCss = require('gulp-minify-css')
    , concat = require('gulp-concat')
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

    describe('using non-reentrant tasks', function(){

        it.skip('should handle less compilation', function(done){

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

    describe('using stream strategy', function(){

        it('should handle less compilation', function(done){

            var stream = at({
                less: {
                    tag:'<link rel="stylesheet" type="text/css" href="assets/site_less.css">',
                    stream:function(filestream, outputFilename) {
                        return filestream
                            .pipe(less())
                            .pipe(minifyCss())
                            .pipe(concat(outputFilename));
                    }
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

})
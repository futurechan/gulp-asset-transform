var at = require('../../index')
    , less = require('gulp-less')
    , minifyCss = require('gulp-minify-css')
    , uglify = require('gulp-uglify')
    , concat = require('gulp-concat')
    , gutil = require('gulp-util')
    , path = require('path')
    , fs = require('fs')
    , chai = require('chai')
    , expect = chai.expect
;

describe('index transformation', function(){

    var indexHtml;

    before(function(){
        var filePath = path.join(__dirname, '../assets/index.html');

        indexHtml = new gutil.File({
            path:     filePath,
            base:     path.dirname(filePath),
            contents: fs.readFileSync(filePath)
        });
    })

    describe.skip('using non-reentrant tasks', function() {

        it('should handle multiple asset transform blocks', function (done) {

            var stream = at({
                less: {
                    tag: '<link rel="stylesheet" type="text/css" href="assets/site_less.css">',
                    tasks: [less(), minifyCss(), 'concat']
                },
                js: {
                    tag: '<script src="assets/site.js"></script>',
                    tasks: [uglify(), 'concat']
                }
            });

            stream.on('data', function (newFile) {
                //do assertions?
            });

            stream.on('end', function () {
                done();
            });

            stream.write(indexHtml);
            stream.end();

        })

    })

    describe('using stream strategy', function() {

        it('should handle multiple asset transform blocks', function (done) {

            var stream = at({
                less: {
                    tag: '<link rel="stylesheet" type="text/css" href="assets/site_less.css">',
                    stream: function (filestream, outputFilename) {
                        return filestream
                            .pipe(less())
                            .pipe(minifyCss())
                            .pipe(concat(outputFilename)); //concat is gulp-concat
                    }
                },
                js: {
                    tag: '<script src="assets/site.js"></script>',
                    stream: function (filestream, outputFilename) {
                        return filestream
                            .pipe(uglify())
                            .pipe(concat(outputFilename)); //concat is gulp-concat
                    }
                }
            });

            stream.on('data', function (newFile) {
                //do assertions?
            });

            stream.on('end', function () {
                done();
            });

            stream.write(indexHtml);
            stream.end();

        })

    })

})
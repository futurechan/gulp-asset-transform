var at = require('../../index')
    , uglify = require('gulp-uglify')
    , gutil = require('gulp-util')
    , path = require('path')
    , fs = require('fs')
    , chai = require('chai')
    , concat = require('gulp-concat')
    , expect = chai.expect
;

describe('js transformation', function(){

    var indexHtml;

    before(function(){
        var filePath = path.join(__dirname, '../assets/js-only.html');

        indexHtml = new gutil.File({
            path:     filePath,
            base:     path.dirname(filePath),
            contents: fs.readFileSync(filePath)
        });
    })

    it('should handle js compilation', function(done){

        var stream = at({
            js: {
                tag:'<script src="assets/site.js"></script>',
                tasks:[uglify(), 'concat']
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

    });

    it('should handle js stream', function(done){

        var stream = at({
            js: {
                tag:'<script src="assets/site.js"></script>',
                stream: function (files, filename) {
                  return files
                    .pipe(uglify())
                    .pipe(concat(filename));
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

var at = require('../../index')
    , less = require('gulp-less')
    , minifyCss = require('gulp-minify-css')
    , uglify = require('gulp-uglify')
    , gutil = require('gulp-util')
    , path = require('path')
    , fs = require('fs')
    , chai = require('chai')
    , expect = chai.expect
;

describe('remove transformation', function(){

    var indexHtml;

    before(function(){
        var filePath = path.join(__dirname, '../assets/js-only.html');

        indexHtml = new gutil.File({
            path:     filePath,
            base:     path.dirname(filePath),
            contents: fs.readFileSync(filePath)
        });
    })

    it('', function(done){

        var stream = at({
            less: {
                tag:'<link rel="stylesheet" type="text/css" href="assets/site_less.css">',
                tasks:[less(), minifyCss(), 'concat']
            },
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

    })

})
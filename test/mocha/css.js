var at = require('../../index')
    , minifyCss = require('gulp-minify-css')
    , gutil = require('gulp-util')
    , path = require('path')
    , fs = require('fs')
    , chai = require('chai')
    , expect = chai.expect
;

describe('css transformation', function(){

    var indexHtml;

    before(function(){
        var filePath = path.join(__dirname, '../assets/css-only.html');

        indexHtml = new gutil.File({
            path:     filePath,
            base:     path.dirname(filePath),
            contents: fs.readFileSync(filePath)
        });
    })

    it('', function(done){

        var stream = at({
            css: {
                tag:'<link rel="stylesheet" type="text/css" href="assets/site.css">',
                tasks:[minifyCss(), 'concat']
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
var at = require('../../index')
    , gutil = require('gulp-util')
    , react = require('gulp-react')
    , path = require('path')
    , fs = require('fs')
    , chai = require('chai')
    , expect = chai.expect
;

describe('jsx transformation', function(){

    var indexHtml;

    before(function(){
        var filePath = path.join(__dirname, '../assets/jsx-only.html');

        indexHtml = new gutil.File({
            path:     filePath,
            base:     path.dirname(filePath),
            contents: fs.readFileSync(filePath)
        });
    })

    it('should handle jsx compilation', function(done){

        var stream = at({
            jsx: {
                tasks:[react(), 'concat']
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
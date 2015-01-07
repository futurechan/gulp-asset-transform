var at = require('../../index')
    , gutil = require('gulp-util')
    , path = require('path')
    , fs = require('fs')
    , chai = require('chai')
    , concat = require('gulp-concat')
    , expect = chai.expect
    ;

describe('at.concat', function(){

    var indexHtml;

    before(function(){
        var filePath = path.join(__dirname, '../assets/js-only.html');

        indexHtml = new gutil.File({
            path:     filePath,
            base:     path.dirname(filePath),
            contents: fs.readFileSync(filePath)
        });
    });

    it('should concat files with name defined in the block', function (done) {

        var stream = at({
            js: {
                tag:'<script src="assets/bundle.js"></script>',
                tasks: [at.concat()]
            }
        });

        stream.on('data', function(newFile) {
            var filename = path.basename(newFile.relative);
            var ext = path.extname(newFile.relative);
            switch (ext) {
                case '.js':
                    expect(filename).to.be.equal('bundle.js');
                    break;
                case '.html':
                    expect(filename).to.be.equal('js-only.html');
                    break;
            }
        });

        stream.on('end', function() {
            done();
        });

        stream.write(indexHtml);
        stream.end();

    });

    it('should concat files with name passed as argument', function (done) {

        var stream = at({
            js: {
                tag:'<script src="assets/bundle.js"></script>',
                tasks: [at.concat('assets/scripts.js')]
            }
        });

        stream.on('data', function(newFile) {
            var filename = path.basename(newFile.relative);
            var ext = path.extname(newFile.relative);
            switch (ext) {
                case '.js':
                    expect(filename).to.be.equal('scripts.js');
                    break;
                case '.html':
                    expect(filename).to.be.equal('js-only.html');
                    break;
            }
        });

        stream.on('end', function() {
            done();
        });

        stream.write(indexHtml);
        stream.end();

    });

});

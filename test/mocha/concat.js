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
    var js1Contents, js2Contents;

    before(function(){
        var filePath = path.join(__dirname, '../assets/js-only.html');

        indexHtml = new gutil.File({
            path:     filePath,
            base:     path.dirname(filePath),
            contents: fs.readFileSync(filePath)
        });

        js1Contents = fs.readFileSync(path.join(__dirname, '../assets/js/js1.js'));
        js2Contents = fs.readFileSync(path.join(__dirname, '../assets/js/js2.js'));
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

    it('should concat files with name and file separator passed as arguments', function (done) {

        var sep = ';';

        var stream = at({
            js: {
                tag:'<script src="assets/bundle.js"></script>',
                tasks: [at.concat('assets/scripts.js', sep)]
            }
        });

        var jsContents = '';

        stream.on('data', function(newFile) {
            var filename = path.basename(newFile.relative);
            var ext = path.extname(newFile.relative);
            switch (ext) {
                case '.js':
                    expect(filename).to.be.equal('scripts.js');
                    jsContents += String(newFile._contents);
                    break;
                case '.html':
                    expect(filename).to.be.equal('js-only.html');
                    break;
            }
        });

        stream.on('end', function() {
            expect(jsContents).to.be.equal(js1Contents + sep + js2Contents);
            done();
        });

        stream.write(indexHtml);
        stream.end();

    });

    it('should concat files with separator passed as \'concat\' suffix', function (done) {

        var sep = ';\n';

        var stream = at({
            js: {
                tag:'<script src="assets/bundle.js"></script>',
                tasks: ['concat:' + sep]
            }
        });

        var jsContents = '';

        stream.on('data', function(newFile) {
            var filename = path.basename(newFile.relative);
            var ext = path.extname(newFile.relative);
            switch (ext) {
                case '.js':
                    expect(filename).to.be.equal('bundle.js');
                    jsContents += String(newFile._contents);
                    break;
                case '.html':
                    expect(filename).to.be.equal('js-only.html');
                    break;
            }
        });

        stream.on('end', function() {
            expect(jsContents).to.be.equal(js1Contents + sep + js2Contents);
            done();
        });

        stream.write(indexHtml);
        stream.end();

    });

});

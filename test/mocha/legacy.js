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

describe('tag-template transformation', function(){

    var indexHtml;

    before(function(){
        var filePath = path.join(__dirname, '../assets/legacy.html');

        indexHtml = new gutil.File({
            path:     filePath,
            base:     path.dirname(filePath),
            contents: fs.readFileSync(filePath)
        });
    })

    it('should use build/endbuild', function(done){

        var stream = at({
            id1: {
                tasks:[less(), minifyCss(), 'concat']
            },
            id2: {
                tasks:[uglify(), 'concat']
            }
        }, {
            regExps:{
                start: /<!--\s*build:(\w+)(?:(?:\(([^\)]+?)\))?\s+(\/?([^\s]+?))?)?\s*-->/gim,
                end: /<!--\s*endbuild\s*-->/gim
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
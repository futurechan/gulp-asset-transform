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
        var filePath = path.join(__dirname, '../assets/tag-template.html');

        indexHtml = new gutil.File({
            path:     filePath,
            base:     path.dirname(filePath),
            contents: fs.readFileSync(filePath)
        });
    })

    it('should use the default tag templates', function(done){

        var stream = at({
            id1: {
                tasks:[less(), minifyCss(), 'concat']
            },
            id2: {
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

    it('should allow the tag templates to be overridden globally', function(done){

        var stream = at({
            id1: {
                tasks:[less(), minifyCss(), 'concat']
            },
            id2: {
                tasks:[uglify(), 'concat']
            },
            tagTemplates:{
                css:function(){ return '<css-tag></css-tag>'},
                js:function(){ return '<js-tag></js-tag>'}
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

    it('should allow the tag templates to be overridden at the block level', function(done){

        var stream = at({
            id1: {
                tasks:[less(), minifyCss(), 'concat'],
                tagTemplate:function(){ return '<css-tag></css-tag>'}
            },
            id2: {
                tasks:[uglify(), 'concat'],
                tagTemplate:function(){ return '<js-tag></js-tag>'}
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
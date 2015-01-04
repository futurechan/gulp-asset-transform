var at = require('../../index')
    , minifyCss = require('gulp-minify-css')
	, size = require('gulp-size')
    , gutil = require('gulp-util')
    , path = require('path')
    , fs = require('fs')
    , chai = require('chai')
    , expect = chai.expect
;

describe('css transformation', function(){

	describe('with explicit tags', function(){			

		var indexHtml;

		before(function(){
			var filePath = path.join(__dirname, '../assets/css-only.html');

			indexHtml = new gutil.File({
				path:     filePath,
				base:     path.dirname(filePath),
				contents: fs.readFileSync(filePath)
			});
		})

		it('should handle css compilation', function(done){		
			var stream = at({
				css: {
					tag:'<link rel="stylesheet" type="text/css" href="assets/site.css">',
					tasks:[minifyCss(), 'concat']
				}
			});
			
			var results = {
				
			}

			stream.on('data', function(newFile) {
				var filename = path.basename(newFile.relative);
				var contents = String(newFile._contents);
				switch(filename){
					case "site.css":
						results.css = contents;
						break;
					case "css-only.html":
						results.html = contents;
						break;			
				}
			});

			stream.on('end', function() {
				expect(results.css).to.be.not.null;
				expect(results.html).to.be.not.null;
				
				//assert css is correct
				expect(results.css).to.have.string('test-class');
				expect(results.css).to.have.string('test-class2');
				
				//assert html contains the proper tag
				expect(results.html).to.have.string('<link rel="stylesheet" type="text/css" href="assets/site.css">');
				
				done();
			});

			stream.write(indexHtml);
			stream.end();

		})
	})

	describe('single asset pipelines', function(){			

		var indexHtml;

		before(function(){
			var filePath = path.join(__dirname, '../assets/css-single-asset-pipeline.html');

			indexHtml = new gutil.File({
				path:     filePath,
				base:     path.dirname(filePath),
				contents: fs.readFileSync(filePath)
			});
		})
		
		it('should handle gulp-size only', function(done){		
			
			var stream = at({
				css: {
					tasks:[
						function(){ return size({ title: 'css', showFiles: true }) }
					]
				}
			});
			
			var results = {
				
			}

			stream.on('data', function(newFile) {
				var filename = path.basename(newFile.relative);
				var contents = String(newFile._contents);
				switch(filename){
					case "css1.css":
						results.css1 = contents;
						break;
					case "css2.css":
						results.css2 = contents;
						break;
					case "css-single-asset-pipeline.html":
						results.html = contents;
						break;			
				}
			});

			stream.on('end', function() {
				expect(results.css1).to.be.not.null;
				expect(results.css2).to.be.not.null;
				expect(results.html).to.be.not.null;
				
				//assert css is correct
				expect(results.css1).to.have.string('test-class');
				expect(results.css2).to.have.string('test-class2');
				
				//assert html contains the proper tag
				expect(results.html).to.have.string('<link rel="stylesheet" type="text/css" href="assets/css1.css">');
				expect(results.html).to.have.string('<link rel="stylesheet" type="text/css" href="assets/css2.css">');
				
				done();
			});

			stream.write(indexHtml);
			stream.end();

		})
	})

})
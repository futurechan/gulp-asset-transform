A fully async Usemin-like Gulp library
===================

Inspired by [gulp-usemin](https://github.com/zont/gulp-usemin "gulp-usemin")

##Status

[![BuildStatus](https://travis-ci.org/futurechan/gulp-asset-transform.png?branch=master)](https://travis-ci.org/futurechan/gulp-asset-transform) [![DependencyStatus](https://david-dm.org/futurechan/gulp-asset-transform.png?branch=master)](https://david-dm.org/futurechan/gulp-asset-transform.png?branch=master) [![TestCoverage](https://coveralls.io/repos/futurechan/gulp-asset-transform/badge.png)](https://coveralls.io/repos/futurechan/gulp-asset-transform/badge.png)


##Installation

Using npm:

```javascript
npm install gulp-asset-transform
```

##Documentation
* [comment directive explanation](#comment_directive)
* [html](#html)
* [gulpfile](#gulpfile)
* [tasks array](#tasks_array)
* [reusing pipelines](#reusing_pipelines)
* [stream function](#stream_function)
* [remove](#remove)
* [implicit tag template references](#implicit_references)
* [tag templates](#tag_templates)
* [explicit tags](#explicit_tags)
* [legacy directives](#legacy_directives)

##Examples

```javascript
var at = require('gulp-asset-transform');
```

<a name="comment_directive"/>
### comment directive explanation
Processing is defined with comments that enclose asset tags
```html
<!-- at:id1 >> assets/site.css -->
<link rel="stylesheet" type="text/css" href="app/css1.css">
<link rel="stylesheet" type="text/css" href="app/css2.css">
<!-- at:end -->
```

Each start directive is composed of a few parts, some of which are optional.
The required portion
```html
<!-- at:some_pipeline_id -->
```

Additionally you can include a desired filename and a tag template to use in case you don't want to match on the extension of the desired filename.
```html
<!-- at:some_pipeline_id >> tag_template_name:sub/path/and/filename.ext -->
```

<a name="html"/>
### html
```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>

    <!-- at:id1 >> assets/site.css -->
    <link rel="stylesheet/less" type="text/css" href="less/less1.less">
    <link rel="stylesheet/less" type="text/css" href="less/less2.less">
    <!-- at:end -->

</head>
<body>

	<!-- at:id2 >> assets/site.js -->
	<script src="js/js1.js"></script>
	<script src="js/js2.js"></script>
	<!-- at:end -->

	<!-- at:remove -->
	<script src="js/less.js"></script>
	<!-- at:end -->

</body>
</html>
```

<a name="gulpfile"/>
### gulpfile
```javascript
gulp.task('build', function() {
	gulp.src('./src/client/index.html')
		.pipe(at({
			id1: {
				tasks:[less(), minifyCss(), 'concat']
			},
			id2: {
				stream:function(filestream, outputFilename){
					return filestream
						.pipe(uglify())
						.pipe(concat(outputFilename)); //concat is gulp-concat
				}
			}
		}))
		.pipe(gulp.dest('build/client'));
});
```

<a name="tasks_array"/>
### tasks array
You can set the tasks key on the configuration object to an array of gulp tasks.
```javascript
gulp.task('build', function() {
	gulp.src('./src/client/index.html')
		.pipe(at({
			id1: {
				tasks:[less(), minifyCss(), 'concat']
			}
		}))
		.pipe(gulp.dest('build/client'));
});
```

If you use the tasks array configuration, gulp-concat is provided for you via 'concat', and the filename is parsed from the tag field.

<a name="reusing_pipelines"/>
### reusing pipelines
If you need to call the same pipeline twice, you need to define each task as a function that returns the stream object that should be used.
This function also receives the filename as the only parameter.

```javascript
gulp.task('build', function () {
  gulp.src('./src/client/index.html')
    .pipe(at({
      less: {
        tasks: [
          less,
          minifyCss,
          function (filename) { return concat(filename); }
        ]
      }
    }))
    .pipe(gulp.dest('build/client'));
});
```

<a name="stream_function"/>
### stream function
Alternatively, you can set the stream key on the configuration object to a function that returns a gulp stream.
The function receives two arguments, the glob stream and the output filename (for concat).
While more verbose than the tasks array, it has the advantage of supporting logic.

```javascript
gulp.task('build', function() {
	gulp.src('./src/client/index.html')
		.pipe(at({
			id2: {
				stream:function(filestream, outputFilename){
					return filestream
						.pipe(uglify())
						.pipe(concat(outputFilename)); //concat is gulp-concat
				}
			}
		}))
		.pipe(gulp.dest('build/client'));
});
```

<a name="remove"/>
### remove
A special 'remove' directive is provided to remove any tags that should not survive the build process.

<a name="implicit_references"/>
### implicit tag template references
A js and css template have been provided. The template to be used is inferred from the extension of the desired filename.

```html
<!-- at:id >> assets/site.css -->
<link rel="stylesheet/less" type="text/css" href="less/less1.less">
<link rel="stylesheet/less" type="text/css" href="less/less2.less">
<!-- at:end -->
```
This will use the tag template assigned to 'css'.

These can be overridden by explicitly specifying a template reference before the desired filename.
```html
<!-- at:id >> css1:assets/site.css -->
<link rel="stylesheet/less" type="text/css" href="less/less1.less">
<link rel="stylesheet/less" type="text/css" href="less/less2.less">
<!-- at:end -->
```
In this case, we expect to use a tag template called 'css1'.
If you specify something other than css or js, you will need to provide the tag template.

<a name="tag_templates"/>
### tag templates
Tag templates can be overridden at both the global and task level
```javascript
gulp.task('build', function() {
	gulp.src('./src/client/index.html')
		.pipe(at({
			id1: {
				tasks:[less(), minifyCss(), 'concat'],
				tagTemplate:function(filename){ return '<local-css-tag></local-css-tag>'}
			},
			id2: {
				tasks:[uglify(), 'concat'],
			},
			tagTemplates:{
				js:function(filename){ return '<global-js-tag></global-js-tag>'}
			}
		}))
		.pipe(gulp.dest('build/client'));
});
```
All asset transform blocks with a desired filename with a '.js' extension and all blocks using ' >> js: ... ' will return '```<global-js-tag></global-js-tag>```'.
All asset transform blocks using the pipelineId 'id1' will return '```<local-css-tag></local-css-tag>```'.

<a name="explicit_tags"/>
### explicit tags
An explicit tag can be provided for a block.
```javascript
gulp.task('build', function() {
	gulp.src('./src/client/index.html')
		.pipe(at({
			id1: {
				tag:'<link rel="stylesheet" type="text/css" href="assets/css/site.css">',
				tasks:[less(), minifyCss(), 'concat']
			},
			id2: {
				tasks:[uglify(), 'concat'],
			}
		}))
		.pipe(gulp.dest('build/client'));
});
```

<a name="legacy_directives"/>
### legacy directives
In effort to conform to the more popular ```build/endbuild``` directives, you can override any of the regular expressions by supplying a regExps object.
The alternate path in the comment directive will be ignored.
```javascript
gulp.task('build', function() {
	gulp.src('./src/client/index.html')
		.pipe(at({
			regExps:{
				start: /<!--\s*build:(\w+)(?:(?:\(([^\)]+?)\))?\s+(\/?([^\s]+?))?)?\s*-->/gim,
				end: /<!--\s*endbuild\s*-->/gim,
				//script: regexp for script tags,
				//link: regexp for link tags,
			},
			id1: {
				tasks:[less(), minifyCss(), 'concat']
			},
			id2: {
				tasks:[uglify(), 'concat']
			}
		}))
		.pipe(gulp.dest('build/client'));
});
```
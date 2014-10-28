A fully async Usemin-like Gulp library
===================

Inspired by [gulp-usemin](https://github.com/zont/gulp-usemin "gulp-usemin")

##Status

[![BuildStatus](https://travis-ci.org/futurechan/gulp-asset-transform.png?branch=master)](https://travis-ci.org/futurechan/gulp-asset-transform)


##Installation

Using npm:

```javascript
npm install gulp-asset-transform
```

##Documentation
* [comment directive explanation](#comment_directive)
* [html](#html)
* [gulpfile](#gulpfile)
* [remove](#remove)
* [tag templates](#tag_templates)
* [explicit tags](#explicit_tags)

##Examples

```javascript
var at = require('gulp-asset-transform');
```

<a name="comment_directive"/>
### comment directive explanation
Processing is defined with comments that enclose asset tags
```html
<!-- at:id1 >> css:assets/site.css -->
<link rel="stylesheet" type="text/css" href="app/css1.css">
<link rel="stylesheet" type="text/css" href="app/css2.css">
<!-- at:end -->
```

Each start directive is composed of a few parts, some of which are optional.
The required portion
```html
<!-- at:some_pipeline_id -->
```

Additionally you can include an output template name and desired filename.
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

    <!-- at:id1 >> css:assets/site.css -->
    <link rel="stylesheet/less" type="text/css" href="less/less1.less">
    <link rel="stylesheet/less" type="text/css" href="less/less2.less">
    <!-- at:end -->

</head>
<body>

	<!-- at:id2 >> js:assets/site.js -->
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
				tasks:[ngAnnotate(), uglify(), 'concat']
			}
		}))
		.pipe(gulp.dest('build/client'));
});
```

If you use 'concat', gulp-concat is provided for you, and the filename is parsed from the tag field.

<a name="remove"/>
### remove
A special 'remove' directive is provided to remove any tags that should not survive the build process.

<a name="tag_templates"/>
### tag templates
A js and css template have been provided, but they can be overridden at both the global and task level
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
			}
			tagTemplates:{
				js:function(filename){ return '<global-js-tag></global-js-tag>'}
			}
		}))
		.pipe(gulp.dest('build/client'));
});
```
All asset transform blocks using ' >> js: ... ' will return '<global-js-tag></global-js-tag>'.
All asset transform blocks using the pipelineId 'id1' will return '<local-css-tag></local-css-tag>'.

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
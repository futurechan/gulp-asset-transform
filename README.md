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

* [html](#html)
* [gulpfile](#gulpfile)
* [remove](#remove)

##Examples

```javascript
var at = require('gulp-asset-transform');
```

<a name="html"/>
### html
```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>

    <!-- at:less -->
    <link rel="stylesheet/less" type="text/css" href="less/less1.less">
    <link rel="stylesheet/less" type="text/css" href="less/less2.less">
    <!-- at:end -->

</head>
<body>

	<!-- at:js -->
	<script src="js/js1.js"></script>
	<script src="js/js2.js"></script>
	<!-- at:end -->

	<!-- at:remove -->
	<script src="bower_components/less/dist/less-1.7.5.js"></script>
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
			less: {
				tag:'<link rel="stylesheet" type="text/css" href="assets/css/site.css">',
				tasks:[less(), minifyCss(), 'concat']
			},
			js: {
				tag:'<script src="assets/js/site.js"></script>',
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

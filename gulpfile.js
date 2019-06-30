var gulp = require('gulp');
var shell = require('gulp-shell');

gulp.task('createDocs', shell.task([
  'rm -rf out',
  './node_modules/.bin/jsdoc -c conf.json'
]));
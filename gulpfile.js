var gulp        = require('gulp');
var concat      = require('gulp-concat');
var imagemin    = require('gulp-imagemin');
var sourcemaps  = require('gulp-sourcemaps');
var composer    = require('gulp-uglify/composer');

var del         = require('del');
var uglifyes    = require('uglify-es');
var uglify      = composer(uglifyes, console);
var pump        = require('pump');

var jsDir = 'gulp/ss-mods-chrome/js'
var cssDir = 'gulp/ss-mods-chrome/css'
var imgDir = 'gulp/ss-mods-chrome/images'

var source = {
  chrome: 'chrome/**/*.*',
  
  scripts: [
    'src/config.js',
    'src/gozer.js',
    'src/ss.js',
    'src/resources.js',
    // 'src/skins.js',
    // 'src/clans.js',
    'src/main.js'
  ],
  
  sass: [
    'mods/css/*.css',
    'mods/css/*.scss'
  ],
  
  images: 'client/img/**/*'
};

gulp.task('clean', function() {
  return del(['gulp']);
});

gulp.task ('copy-chrome', function () {
  gulp.src('chrome/**/*.*')
      .pipe(gulp.dest('gulp/ss-mods-chrome'));
});

gulp.task ('scripts', function() {
  return gulp.src (source.scripts)
    .pipe (sourcemaps.init())
    .pipe (uglify())
    .pipe (concat('ss.min.js'))
    .pipe (sourcemaps.write())
    .pipe (gulp.dest (jsDir));
});

gulp.task ('sass', function() {
  return gulp.src (source.sass)
    .pipe (sourcemaps.init())
    // .pipe (uglify())
    // .pipe (concat('ss.min.css'))
    .pipe (sourcemaps.write())
    .pipe (gulp.dest (cssDir));
});

// // Copy all static images
// gulp.task('images', ['clean'], function() {
//   return gulp.src(source.images)
//     // Pass in options to the task
//     .pipe(imagemin({optimizationLevel: 5}))
//     .pipe(gulp.dest('build/img'));
// });

// Rerun the task when a file changes
gulp.task ('watch', function() {
  gulp.watch (source.scripts, ['scripts']);
  // gulp.watch(source.images, ['images']);
});

// The default task (called when you run `gulp` from cli)
gulp.task ('default', ['watch', 'scripts' ]);

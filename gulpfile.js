var gulp = require('gulp');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');
var composer = require('gulp-uglify/composer');

var del = require('del');
var uglifyes = require('uglify-es');
var uglify = composer(uglifyes, console);
var pump = require('pump');

var jsDir = 'gulp/ss-mods-chrome/js'
var cssDir = 'gulp/ss-mods-chrome/css'
var imgDir = 'gulp/ss-mods-chrome/images'

var paths = {
  scripts: [
    'src/config.js',
    'src/gozer.js',
    'src/ss.js',
    'src/resources.js',
    'src/skins.js',
    'src/clans.js',
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

gulp.task('scripts', ['clean'], function() {
  return gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(concat('ss.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(jsDir));
});

gulp.task('sass', ['clean'], function() {
  return gulp.src(paths.sass)
    .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(concat('ss.min.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(cssDir));
});

// // Copy all static images
// gulp.task('images', ['clean'], function() {
//   return gulp.src(paths.images)
//     // Pass in options to the task
//     .pipe(imagemin({optimizationLevel: 5}))
//     .pipe(gulp.dest('build/img'));
// });

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  // gulp.watch(paths.images, ['images']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'scripts' ]);


 
// gulp.task('compress', function (cb) {
//   // the same options as described above 
//   var options = {};
 
//   pump([
//       gulp.src('lib/*.js'),
//       minify(options),
//       gulp.dest('dist')
//     ],
//     cb
//   );
// });
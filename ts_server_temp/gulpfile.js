var gulp = require("gulp");
var ts = require("gulp-typescript");
var sourcemap = require("gulp-sourcemaps");
const $ = require('gulp-load-plugins')({});
const open = require('open');
var tsProject = ts.createProject("tsconfig.json");


const app = {
    devPath: 'src/',
    prdPath: 'dist/'
  };
gulp.task("ts", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("src/js"));
});
gulp.task('images', () => {
    gulp.src(app.devPath + 'images/**/*')
        .pipe(gulp.dest(app.prdPath + 'images'))
        .pipe($.connect.reload())
});
gulp.task('html', () => {
    gulp.src(app.devPath + '*.html')
        .pipe(gulp.dest(app.prdPath))
        .pipe($.connect.reload())
});
  
gulp.task('js', () => {
gulp.src(app.devPath + 'js/**/*.js')
    .pipe(gulp.dest(app.prdPath + 'js'))
    .pipe($.connect.reload())
});

gulp.task('build',['ts','images', 'js', 'html']);

gulp.task('server', ['build'], () => {
    $.connect.server({
      root: [app.devPath],
      livereload: true,
      port: 8000
    });
  
    open('http://localhost:8000');
  
    gulp.watch(app.devPath + '**/*.html', ['html']);
    gulp.watch(app.devPath + 'js/*.js', ['js']);
    gulp.watch(app.devPath + 'ts/*.ts', ['ts']);
    gulp.watch(app.devPath + 'images/*', ['images']);
});

gulp.task('default', ['server']);
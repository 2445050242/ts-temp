var gulp = require("gulp");
// 将把所有模块捆绑成一个JavaScript文件
var browserify = require("browserify");
// 将Browserify的输出文件适配成gulp能够解析的格式
var source = require('vinyl-source-stream');
// 能够访问TypeScript编译器
var tsify = require("tsify");
// 启动Gulp并保持运行状态，当你保存文件时自动编译。 帮你进入到编辑-保存-刷新浏览器的循环中
var watchify = require("watchify");
// Uglify帮你压缩代码，将花费更少的时间去下载它们
var gutil = require("gulp-util");
// Uglify是用于混淆你的代码
var uglify = require('gulp-uglify');
// 支持sourcemaps
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');



const app = {
    devPath: 'src/',
    prdPath: 'dist/'
};

var paths = {
    pages: ['src/*.html']
};

gulp.task("copyHtml", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest(app.prdPath));
});
var watchedBrowserify = watchify(browserify({
    basedir: '.',
    debug: true,
    entries: ['src/main.ts'],
    cache: {},
    packageCache: {}
}).plugin(tsify));

function bundle() {
    return watchedBrowserify
        .transform('babelify', {
            presets: ['es2015'],
            extensions: ['.ts']
        })
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(app.prdPath));
}

gulp.task("default", ["copyHtml"], bundle);
watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", gutil.log);


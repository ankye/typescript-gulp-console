var gulp = require("gulp");
var ts = require('gulp-typescript')
var sourcemaps = require('gulp-sourcemaps')
var clean = require('gulp-clean');
var pump = require('pump');

var browserify = require("browserify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");
var gutil = require("gulp-util");
var babelify = require("babelify");

var tsProject = ts.createProject('tsconfig.json')


var PATH = {
    pages: ['src/*.png'],
    outdir: "dist"
};


gulp.task('clean', function (cb) {
    pump([
        gulp.src('./dist/*.*'),
        clean()
    ], cb)
})

gulp.task('compile-ts', gulp.series("clean", function () {
    return tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest(PATH.outdir))
}));



gulp.task("copy-config", function () {
    return gulp.src(PATH.pages)
        .pipe(gulp.dest(PATH.outdir));
});


gulp.task("default", gulp.series("copy-config", "compile-ts"));


gulp.watch("src/**", gulp.series("compile-ts"));
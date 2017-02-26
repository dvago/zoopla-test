var gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    clean = require('gulp-clean'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    environments = require('gulp-environments'),
    cssnano = require('cssnano'),
    autoprefixer = require('autoprefixer'),
    gls = require('gulp-live-server'),
    chalk = require('chalk'),
    eslint = require('rollup-plugin-eslint'),
    sassLint = require('gulp-sass-lint'),
    plumber = require('gulp-plumber'),
    rollup = require('gulp-better-rollup'),
    babel = require('rollup-plugin-babel'),
    resolver = require('rollup-plugin-node-resolve'),
    uglify = require('rollup-plugin-uglify'),
    runSequence = require('run-sequence').use(gulp),
    fileinclude = require('gulp-file-include'),
    rename = require('gulp-rename'),
    path = require('path'),
    historyFallback = require('connect-history-api-fallback'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload;

// config
var config = require('./gulp-config.js').config;

// set environment variables
var development = environments.development;
var production = environments.production;

/**
 * Set environment to development
 */
gulp.task('set-dev-node-env', function() {
    environments.current(development);
});

/**
 * Set environment to production
 */
gulp.task('set-prod-node-env', function() {
    environments.current(production);
});

/**
 * Watch task for sass
 */
gulp.task('watch:sass', ['sass'], function() {
    gulp.watch(config.sass.src, ['sass']);
});

/**
 * Watch task for scripts
 */
gulp.task('watch:scripts', ['scripts'], function() {
    gulp.watch(config.scripts.watcher, ['scripts']);
});

/**
 * Watch HTML
 */
gulp.task('watch:html', function() {

    gulp.watch([config.html.index, config.html.src], ['html']);

});


gulp.task('html', function() {
    gulp.src(config.html.src)
        .pipe(gulp.dest(config.html.tpl));
});

/**
 * Copy dummy data
 */
gulp.task('data', function() {
    gulp.src(config.data.src)
        .pipe(gulp.dest(config.data.dest));
});


/**
 * Removes dist folder and files
 */
gulp.task('clean', function() {
    return gulp.src(config.dirs.dest)
        .pipe(clean({
            force: true
        }));
});

/**
 * Generate the index.html (/dist/ folder)
 */
gulp.task('fileinclude', function() {

    return gulp.src(config.html.index)
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(rename({
            basename: 'index',
            extname: '.html'
        }))
        .pipe(gulp.dest(config.html.dest));
});

/**
 * Sass build
 */
gulp.task('sass', function() {

    return gulp.src(config.sass.src)
        .pipe(
            sass(config.sassOptions).on('error', onError)
        )
        .pipe(development(sourcemaps.init()))
        .pipe(postcss([
            autoprefixer(config.autoprefixerOptions),
            cssnano()
        ]))
        .pipe(development(sourcemaps.write('./maps')))
        .pipe(gulp.dest(config.sass.dest))
        .pipe(development(browserSync.stream()));
});

/**
 * Build JavaScript
 */
gulp.task('scripts', function () {
    return gulp.src(config.scripts.src + '/' + config.scripts.entry)
        .pipe(rollup({
            format: 'iife',
            sourceMap: 'inline',
            plugins: [
                resolver({
                    jsnext: true,
                    main: true,
                    module: true,
                    browser: true,
                }),
                eslint({ /* your options */ }),
                babel({
                    exclude: 'node_modules/**'
                }),
                uglify({
                    exclude: [
                        'node_modules/**',
                    ]
                })
            ]
        }, {
            // also rollups `sourceMap` option is replaced by gulp-sourcemaps plugin
            format: 'cjs'
        }))
        .on('error', onError)
        .pipe(gulp.dest(config.scripts.dest))
});

/**
 * removes dist folder and files
 */
gulp.task('clean', function() {
    return gulp.src(config.dirs.dist)
        .pipe(clean({
            force: true
        }));
});

/**
 * dev build
 */
gulp.task('dev', ['set-dev-node-env'], function() {

    var browserSyncOptions = {
        server: {
            baseDir: './dist',
            serveStatic: [{
                route: '/assets'
            }],
            serveStaticOptions: {
               extensions: ['css', 'js']
            },
            middleware: function(req,res,next) {

                historyFallback();

                if (req.url === '/results') {
                    req.url = '/assets/templates/results.html';
                } else if (req.url === '/' || req.url === '/search') {
                    req.url = '/assets/templates/search.html';
                } else if (req.url.match(/\.css|.js|.png|.jpg/)){
                    return next();
                } else {
                    req.url = '/assets/templates/404.html';
                }

                return next();
            }
        }
    };

    // run tasks in sequence, tasks in array run in parallel
    runSequence( ['clean'], ['sass', 'data', 'scripts', 'fileinclude', 'html'], ['watch:html', 'watch:sass', 'watch:scripts'], function () {

        browserSync.init(browserSyncOptions);

        //reload when templates change
        gulp.watch([config.html.index, config.html.src]).on('change', reload);
    });


});

/**
 * production build
 */

gulp.task('dist', ['set-prod-node-env'], function() {

    // run tasks in sequence, tasks in array run in parallel
    runSequence(
        'clean', ['scripts', 'sass', 'data', 'html'],
        'fileinclude'
    );
});

/**
 * Default task
 */

gulp.task('default', function() {

    console.log(
        '\n' +
        '\n' +
        ' **************************************' + '\n' +
        '  run `gulp dev` for development or `gulp dist`' + '\n' +
        '  for production' + '\n' +
        ' **************************************' +
        '\n' +
        '\n'
    );
});

/**
 * onError - handle errors in pipes, if in production mode, break,
 * otherwise continue
 * @param  {Object} err [description]
 */
var onError = function(err) {

    if (development()) {
        var errorMessage = err.plugin + ' : ' + err.message;
        console.error(chalk.white.bgRed.bold( errorMessage ));
        this.emit('end');
    } else {
        process.exit(1);
    }
};

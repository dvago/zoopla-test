/**
 * base dirs
 * @type {Object}
 */
var dirs = {
    src: './src/assets',
    dest: './dist/assets',
    dev: './src',
    dist: './dist'
};

/**
 * paths config object
 * @type {Object}
 */
var config = {
    dirs: dirs,
    index: dirs.src + '/templates/index.html',

    /**
     * SASS paths
     * @prop src : path to sass files
     * @prop dest : destination dir
     */

    sass: {
        src: dirs.src + '/scss/**/*.{scss,sass}',
        dest: dirs.dest + '/css/'
    },

    /**
     * SASS options
     * @see package https://github.com/dlmanning/gulp-sass
     * @see reference https://github.com/sass/node-sass#options
     */

    sassOptions: {
        outputStyle: 'compressed',
        errLogToConsole: true,
        precision: 5,
        sync: true,
        includePaths: [
            './node_modules/'
        ],
        sourceComments: 'map',
        sourceMap: 'sass'
    },

    /**
     * options for autoprefixer
     * define your browser support here
     * @type {Object}
     */

    autoprefixerOptions : {
        browsers: ['last 6 version']
    },

    /**
     * template file paths
     * @type {Object}
     */

    html: {
        src: dirs.src + '/templates/**/*.html',
        index: dirs.dev + '/index.html',
        compiled: dirs.dev + '/',
        tpl: dirs.dist + '/assets/templates/',
        dest: dirs.dist
    },

    /**
     * Data path
     * @prop entry : the common data folder
     * @prop exit : the output folder
     */
    data: {
        src: dirs.src + '/data/**/*.*',
        dest: dirs.dest + '/data'
    },

    /**
     * Scripts path
     * @prop entry : the common javascript folder
     * @prop exit : the output folder
     */

    scripts: {
        src: dirs.src + '/js',
        dest: dirs.dest + '/js',
        entry: 'main.js',
        watcher: dirs.src + '/js/**/*.js'
    }

};

exports.config = config;

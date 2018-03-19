'use strict';

// TODO: Remove this from package.json when Materialize issue is fixed. See: https://github.com/Dogfalo/materialize/issues/3139
// "postinstall": "ln -s ../js/date_picker/picker.js node_modules/materialize-css/bin/picker.js"

var gulp            = require('gulp'),
    mkdirp          = require('mkdirp'),
    gulpif          = require('gulp-if'),
    file            = require('gulp-file'),
    concat          = require('concat-stream'),
    browserify      = require('browserify'),
    babelify        = require('babelify'),
    watchify        = require('watchify'),
    uglify          = require('gulp-uglify'),
    buffer          = require('vinyl-buffer'),
    factor          = require('factor-bundle'),
    source          = require('vinyl-source-stream'),
    merge           = require('merge-stream'),
    livereload      = require('gulp-livereload'),
    sourcemaps      = require('gulp-sourcemaps'),
    sass            = require('gulp-sass'),
    notify          = require('gulp-notify'),
    logger          = require('gulp-logger'),
    nodeResolve     = require('resolve'),
    path            = require('path'),
    del             = require('del'),
    _               = require('lodash'),
    shell           = require('gulp-shell'),
    exec            = require('child_process').exec;

var env = process.env.NODE_ENV;

var dirs = {
    src:            './app/src/',
    dist:           './app/dist/',
    // materialize:    path.join(__dirname, 'node_modules/materialize-css/')
    node:           path.join(__dirname, 'node_modules/')
};

var paths = {
    scripts:        ['scripts/'],
    styles:         ['styles/'],
    images:         ['images/'],
    fonts:          ['fonts/'],
    resources:      ['resources/']
};

// Getters / Setters
//
gulp.task('set-dev-node-env', function() {
    console.log("Setting Environment to Dev");
    return process.env.NODE_ENV = env = 'development';
});
gulp.task('set-prod-node-env', function() {
    console.log("Setting Environment to Prod");
    return process.env.NODE_ENV = env = 'production';
});

function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

/**
 * Gets a list of all project (non-dev) dependencies from NPM (from package.json).
 */
function getNPMPackageIds() {
    // read package.json and get dependencies' package ids
    var npmManifest = {};
    try {
        npmManifest = require('./package.json');
    } catch (e) {
        // does not have a package.json manifest
    }
    return _.keys(npmManifest.dependencies) || [];
}

/**
 * Correctly handle errors when bundling scripts.
 */
function handleErrors() {
    var args = Array.prototype.slice.call(arguments);
    notify.onError({
        title: "Compile Error",
        message: "<%= error.message %>"
    }).apply(this, args);
    this.emit('end'); // Keep gulp from hanging on this task
}

/**
 * Creates the Javascript bundle.
 * 
 * @param file The filename to create the bundle with.
 * @param bundler The Reactify bundler to use.
 * @param factorBundleFunction An optional function to setup factor bundling and return an array of additional streams to include.
 */
function doBundle(file, bundler, factorBundleFunction) {
    function rebundle() {
        var streams = (isFunction(factorBundleFunction) ? factorBundleFunction(bundler) : null);
        
        var stream = bundler.bundle().on('error', handleErrors)
            .pipe(source(file));

        stream = (streams && streams.constructor === Array) ? merge([stream].concat(streams)) : stream;

        return stream
            .pipe(logger({
                before:         'Bundling scripts...',
                beforeEach:         '\t',
                after:          'Bundling scripts complete.'
            }))
            .pipe(buffer())
            .pipe(sourcemaps.init({ /*debug: true,*/ loadMaps: true }))
            // .pipe(gulpif((env === 'production'), uglify(/*"", { outSourceMap: true }*/)))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(dirs.dist + paths.scripts));
    }

    bundler.on('update', function() {
        rebundle();
    });

    return rebundle();
}

/**
 * Bundles (project, i.e. non-external) scripts into separate JS files.
 * 
 * Each HTML page has an associated bundle, (e.g. 'index-bundle', 'login-bundle')
 * these contain all scripts 'required' by the main Javascript for that page (e.g. 'index.js', 'login.js').
 * 
 * Scripts required by multiple 'root' scripts are bundled into a 'common-bundle', to avoid duplication.
 * 
 * React .jsx files are compiled into plain Javascript.
 * 
 * @param watch Should this be ran as a watch or a build?
 */
function buildProjectScripts(watch) {
    var props = {
        entries: [
            dirs.src + paths.scripts + 'index.js',
            dirs.src + paths.scripts + 'login.js'], // Only need initial file(s), browserify finds the deps
        transform: [babelify], // Convert JSX to normal javascript
        debug: (env !== 'production'), cache: {}, packageCache: {}, fullPaths: true};

    var bundler = watch ? watchify(browserify(props)) : browserify(props);

    // This is necessary as factor-bundle panics if the directory doesn't already exist.
    mkdirp(dirs.dist + paths.scripts);

    var makeFactorBundle = function(bundlerIn) {
        // File output order must match entry order
        var sourceStreams = [ source('index-bundle.js'), source('login-bundle.js')];

        bundlerIn.plugin(factor, {
            outputs: sourceStreams
        });

        return sourceStreams;
    };

    getNPMPackageIds().forEach(function (id) {
        bundler.external(id);
    });
    
    return doBundle("common-bundle.js", bundler, makeFactorBundle);
}

// function buildRoutingScripts(file, watch) {
//     var props = {
//         entries: [dirs.src + paths.scripts + 'paddington-router.js'], // Only need initial file(s), browserify finds the deps
//         transform: [reactify], // Convert JSX to normal javascript
//         debug: !production, cache: {}, packageCache: {}, fullPaths: true};
//
//     var bundler = watch ? watchify(browserify(props)) : browserify(props);
//
//     getNPMPackageIds().forEach(function (id) {
//         bundler.external(id);
//     });
//    
//     [dirs.src + paths.scripts + 'paddington.js', dirs.src + paths.scripts + 'login-page.js'].forEach(function (id) {
//         bundler.external(id);
//     });
//
//     return doBundle(file, bundler);
// }

/**
 * Bundles external NPM dependencies into a single dependencies JS file.
 * 
 * Dependencies are resolved based on what deps are defined in package.json.
 */
function buildExternalScripts() {
    var props = {
        debug: (env !== 'production'), cache: {}, packageCache: {}, fullPaths: true
    };

    var bundler = browserify(props);

    getNPMPackageIds().forEach(function (id) {
        bundler.require(nodeResolve.sync(id), { expose: id });
    });

    return doBundle('external-deps.js', bundler);
}

/**
 * *** TASK: sass ***
 * 
 * Compile sass sources into a single css file in the distribution directory, including Bootstrap sass.
 *
 * Minified when building for production.
 */
gulp.task('sass', function () {
    return gulp.src(dirs.src + paths.styles + 'main.scss')
        .pipe(logger({
            before:         'Bundling .sass files...',
            beforeEach:         '\t',
            extname:        '.css',
            showChange:     true,
            after:          'Bundling .sass files complete.'
        }))
        .pipe(sass({
            outputStyle: ((env === 'production') ? 'compressed' : ''),
            includePaths: dirs.node
        }))
        .pipe(gulp.dest(dirs.dist + paths.styles))
});

/**
 * *** TASK: copy ***
 * 
 * Copy all files that don't have a special build process into distribution (images, fonts).
 */
gulp.task('copy', function() {
    // Copy images
    gulp.src(dirs.src + paths.images + '*')
        .pipe(logger({
            before:         'Copying image files...',
            beforeEach:         '\t',
            after:          'Copying image files complete.'
        }))
        .pipe(gulp.dest(dirs.dist + paths.images));

    // Copy fonts (currently only from Materialize)
    gulp.src(dirs.node + "materialize-css/dist/" + paths.fonts + 'roboto/*')
        .pipe(logger({
            before:         'Copying fonts...',
            beforeEach:         '\t',
            after:          'Copying fonts complete.'
        }))
        .pipe(gulp.dest(dirs.dist + paths.fonts + 'roboto/'));

    // Copy resources
    gulp.src(dirs.src + paths.resources + '*')
        .pipe(logger({
            before:         'Copying resource files...',
            beforeEach:         '\t',
            after:          'Copying resource files complete.'
        }))
        .pipe(gulp.dest(dirs.dist + paths.resources));
});

/**
 * *** TASK: test ***
 *
 * Run Tests and Coverage.
 *
 * Defers to the NPM 'test' script in package.json.
 */
gulp.task('test', function(cb) {
    exec('echo Running Tests and Coverage! & npm test', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});
//     shell.task([
//     'echo Running Tests and Coverage!',
//     'npm test'
// ]));

/**
 * *** TASK: build ***
 * 
 * Build project sources into distribution.
 * 
 * Scripts and styles will be compiled and bundled, other files (images, fonts, etc.) will simply be copied.
 *
 * (* Ran during 'stage' step in SBT *)
 */
gulp.task('build', ['set-prod-node-env'], function() {
    console.log("Gulp is building!");
    buildProjectScripts(false);
    buildExternalScripts();
    gulp.start('sass');
    gulp.start('copy');
});

/**
 * *** TASK: watch ***
 * 
 * Watch for source changes and rebuild distribution when Paddington is running (in dev).
 * 
 * Carries out the same tasks as a build
 * (however, only rebuilds the type of source that changed, i.e scripts, styles, or other (images, fonts, etc.)).
 *
 * (* Ran during 'run' step in SBT *)
 */
gulp.task('watch', ['set-dev-node-env', 'sass', 'copy'], function() {
    console.log("Gulp is watching (you)!");
    // livereload.listen();
    
    buildProjectScripts(true);
    buildExternalScripts();

    gulp.watch([dirs.src + paths.styles + '*.scss'], ['sass']);
    
    console.log('Watching files: ' + dirs.src + paths.images + '*.*');
    gulp.watch([
        dirs.src + paths.images + '*.*',
        dirs.src + paths.resources + '*'
    ], ['copy']);
});

/**
 * *** TASK: clean ***
 * 
 * Clean distribution directory.
 * 
 * *( Ran during 'clean' step in SBT *)
 */
gulp.task('clean', function() {
    console.log("Gulp is cleaning!");
    del([dirs.dist + '**', '!' + dirs.dist.replace(/\/$/, '')]).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n '));
    });
});
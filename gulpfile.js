const { src, dest, series, parallel, watch } = require('gulp');
const del = require('del');
const browserSync = require('browser-sync').create();

//CSS
const less = require('gulp-less');
less.compiler = require('less');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

//JS
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

//Images
const imagemin = require('gulp-imagemin');

const origin = 'src';
const destination = 'dist';

//Clean Dist Directory
async function clean(cb) {
	await del(destination);
	cb();
}

// Copy Html Files to Dist Directory
function html(cb) {
	src(`${origin}/**/*.html`).pipe(dest(destination));
	cb();
}

// Copy and compile style sheets
function css(cb) {
	let plugins = [autoprefixer(), cssnano()];

	// Vendor CSS files
	src(`${origin}/styles/vendor/css/**/*.css`).pipe(
		dest(`${destination}/styles/vendor/css`)
	);

	// Project CSS and LESS files
	src(`${origin}/styles/project/css/**/*.css`)
		.pipe(postcss(plugins))
		.pipe(dest(`${destination}/styles/project/css/`));

	src(`${origin}/styles/project/less/index.less`)
		.pipe(less())
		.pipe(postcss(plugins))
		.pipe(dest(`${destination}/styles/project/css/`));

	cb();
}

// Optimize And Copy Images

function image(cb) {
	src(`${origin}/img/**/*`)
		.pipe(imagemin())
		.pipe(dest(`${destination}/img`));
	cb();
}

// Compile, minify, and copy JS files
function js(cb) {
	src(`${origin}/js/vendor/**/*.js`).pipe(dest(`${destination}/js/vendor`));

	src(`${origin}/js/project/**/*.js`)
		.pipe(
			babel({
				presets: ['@babel/env'],
			})
		)
		.pipe(uglify())
		.pipe(dest(`${destination}/js/project`));
	cb();
}

function watcher(cb) {
	watch(`${origin}/**/*.html`).on('change', series(html, browserSync.reload));
	watch(`${origin}/**/*.less`).on('change', series(css, browserSync.reload));
	watch(`${origin}/**/*.css`).on('change', series(css, browserSync.reload));
	watch(`${origin}/**/*.js`).on('change', series(js, browserSync.reload));
	watch(`${origin}/img/**/*`).on('change', series(js, browserSync.reload));
	cb();
}

function server(cb) {
	browserSync.init({
		notify: false,
		open: false,
		server: {
			baseDir: destination,
		},
	});
	cb();
}

exports.default = series(
	clean,
	parallel(html, css, js, image),
	server,
	watcher
);

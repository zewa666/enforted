import { build } from 'aurelia-cli';
import * as gulp from 'gulp';
import * as project from '../aurelia.json';
import * as sass from 'gulp-sass';

const sourcemaps = require('gulp-sourcemaps');

export default function processCSS() {
  return gulp.src(project.cssProcessor.source, { sourcemaps: true })
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(build.bundle());
}


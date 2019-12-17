import {build} from 'aurelia-cli';
import * as gulp from 'gulp';
import * as project from '../aurelia.json';
import * as sass from 'gulp-sass';

export default function processCSS() {
  return gulp.src(project.cssProcessor.source, {sourcemaps: true})
    .pipe(sass().on('error', sass.logError))
    .pipe(build.bundle());
}


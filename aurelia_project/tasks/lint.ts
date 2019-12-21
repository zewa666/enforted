import * as gulp from "gulp";
import * as gulpStylelint from "gulp-stylelint";
import tslint from "gulp-tslint";
import * as merge from "merge-stream";

import * as project from "../aurelia.json";

export default function lint() {
  const tsLinting = gulp.src(project.transpiler.source)
    .pipe(tslint({
      formatter: "stylish",
      tslint: require("tslint"),
    }))
    .pipe(tslint.report({ summarizeFailureOutput: true }));

  const scssLinting = gulp.src(project.cssProcessor.source)
    .pipe(gulpStylelint({
      reporters: [
        { formatter: "string", console: true }
      ]
    }));

  return merge(tsLinting, scssLinting);
}

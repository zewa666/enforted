import { CLIOptions, Project, ProjectItem, UI } from "aurelia-cli";
import { inject } from "aurelia-dependency-injection";
import { kebabCase } from "lodash";

@inject(Project, CLIOptions, UI)
export default class ElementGenerator {
  constructor(private project: Project, private options: CLIOptions, private ui: UI) { }

  public async execute() {
    const name = await this.ui.ensureAnswer(
      this.options.args[0],
      "What would you like to call the custom element?"
    );

    const fileName = this.project.makeFileName(name);
    const className = this.project.makeClassName(name);

    this.project.elements.add(
      ProjectItem.text(`${fileName}.ts`, this.generateJSSource(className)),
      ProjectItem.text(`${fileName}.html`, this.generateHTMLSource(className)),
      ProjectItem.text(`_${fileName}.scss`, `.${kebabCase(className)} {}`)
    );

    await this.project.commitChanges();
    await this.ui.log(`Created ${fileName}.`);
  }

  public generateJSSource(className) {
    return `import { autoinject } from "aurelia-framework";
import { Store } from "aurelia-store";

import { State } from "../store/state";

@autoinject()
export class ${className} {
  constructor(private store: Store<State>)
}
`;
  }

  public generateHTMLSource(className) {
    return `<template class="${kebabCase(className)}">

</template>
`;
  }
}

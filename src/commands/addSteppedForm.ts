import path from "path";
import * as vscode from "vscode";
import { Uri, window } from "vscode";
import { TemplateFileName, invalidFileNames } from "../utils/appFile";
import { generateFilesSync } from "../utils/fileTreeCreator";
import {
  createFileFromTemplate,
  formatTextDocument,
} from "../utils/templateUtils";
import { Command } from "./commands";

const runCommand = async (resource: Uri) => {
  const componentName = await window.showInputBox({
    placeHolder: "Please enter name",
  });

  if (componentName === undefined) {
    return;
  }

  if (invalidFileNames.test(componentName)) {
    return window.showErrorMessage("Invalid name");
  }

  generateFilesSync(
    {
      name: componentName,
      type: "directory",
      children: [
        {
          name: "index.ts",
          type: "file",
          fileContent: `
            export * from "./${componentName}";
            // export * from "./SteppedForm";
            // export * from "./WizardStepOneForm";
            // export * from "./schema";
          `,
        },
      ],
    },
    resource.path
  );

  const componentFilePath = path.join(resource.path, componentName);
  await formatTextDocument(Uri.file(path.join(componentFilePath, "index.ts")));

  // add main form component
  await createFileFromTemplate({
    name: componentName,
    nameWithExtension: `${componentName}.tsx`,
    templateFileName: TemplateFileName.steppedFormMainComponent,
    fileLocation: Uri.parse(componentFilePath),
  });

  // add parent of all stepped form components
  await createFileFromTemplate({
    name: "SteppedForm",
    nameWithExtension: `SteppedForm.tsx`,
    templateFileName: TemplateFileName.steppedFormParent,
    fileLocation: Uri.parse(componentFilePath),
  });

  // add stepOne form
  await createFileFromTemplate({
    name: "WizardStepOneForm",
    nameWithExtension: `WizardStepOneForm.tsx`,
    templateFileName: TemplateFileName.steppedFormOne,
    fileLocation: Uri.parse(componentFilePath),
  });

  // add SchemaTemplate
  await createFileFromTemplate({
    name: "schema",
    nameWithExtension: `schema.ts`,
    templateFileName: TemplateFileName.steppedFormSchema,
    fileLocation: Uri.parse(componentFilePath),
  });

  // reolad vscode to files sync/indexing
  await vscode.commands.executeCommand("workbench.action.reloadWindow");
};

export function addSteppedForm() {
  let disposable = vscode.commands.registerCommand(
    Command.addSteppedForm,
    (resource: Uri) => runCommand(resource)
  );

  return disposable;
}

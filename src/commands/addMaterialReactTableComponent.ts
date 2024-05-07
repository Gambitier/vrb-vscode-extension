import * as vscode from "vscode";
import { Uri, window } from "vscode";
import { TemplateFileName, invalidFileNames } from "../utils/appFile";
import { createFileFromTemplate } from "../utils/templateUtils";
import { Command } from "./commands";

const runCommand = async (resource: Uri, fileType: TemplateFileName) => {
  const componentName = await window.showInputBox({
    placeHolder: "Please enter name",
  });

  if (componentName === undefined) {
    return;
  }

  if (invalidFileNames.test(componentName)) {
    return window.showErrorMessage("Invalid name");
  }

  await createFileFromTemplate({
    name: componentName,
    templateFileName: fileType,
    fileLocation: resource,
    nameWithExtension: `${componentName}.ts`,
  });
};

export function addMaterialReactTableComponent() {
  let disposable = vscode.commands.registerCommand(
    Command.addMaterialReactTableComponent,
    (resource: Uri) =>
      runCommand(resource, TemplateFileName.materialReactTableComponent)
  );

  return disposable;
}

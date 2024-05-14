import * as vscode from "vscode";
import { Uri } from "vscode";
import { TemplateFileName, invalidFileNames } from "../utils/appFile";
import { createFileFromTemplate } from "../utils/templateUtils";
import { Command } from "./commands";

const runCommand = async (resource: Uri) => {
  const componentName = await vscode.window.showInputBox({
    placeHolder: "Please enter name",
  });

  if (componentName === undefined) {
    return;
  }

  if (invalidFileNames.test(componentName)) {
    return vscode.window.showErrorMessage("Invalid name");
  }

  await createFileFromTemplate({
    name: componentName,
    templateFileName: TemplateFileName.dataTableComponent,
    fileLocation: resource,
    nameWithExtension: `${componentName}List.ts`,
  });
};

export function addDataTableComponentCommand() {
  let disposable = vscode.commands.registerCommand(
    Command.addDataTableComponent,
    (resource: Uri) => runCommand(resource)
  );

  return disposable;
}

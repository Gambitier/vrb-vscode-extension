import * as vscode from "vscode";
import { Uri, window } from "vscode";
import { AppFileType } from "./appFile";
import { Command } from "./commands";
import { createFile } from "./file-helper";
import { generateNewComponentStructure } from "./generateNewComponentStructure";
import { invalidFileNames } from "./utils";

const runCommand = async (resource: Uri) => {
  const input = await window.showInputBox({
    placeHolder: "Please enter form name",
  });

  if (input === undefined) {
    return;
  }

  if (invalidFileNames.test(input)) {
    return window.showErrorMessage("Invalid name");
  }

  const componentUri = generateNewComponentStructure(input, resource);

  return createFile({
    name: input,
    type: AppFileType.formComponent,
    associatedArray: "imports",
    uri: componentUri,
    fullName: `${input}.tsx`,
  });
};

export function addFormComponent() {
  let disposable = vscode.commands.registerCommand(
    Command.addFormComponent,
    (resource: Uri) => runCommand(resource)
  );

  return disposable;
}

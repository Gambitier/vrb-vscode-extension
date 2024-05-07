import * as vscode from "vscode";
import { Uri, window } from "vscode";
import { TemplateFileName, invalidFileNames } from "../utils/appFile";
import { createNewComponent } from "../utils/createNewComponent";
import { Command } from "./commands";

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

  await createNewComponent(input, resource, TemplateFileName.formComponent);
};

export function addFormComponent() {
  let disposable = vscode.commands.registerCommand(
    Command.addFormComponent,
    (resource: Uri) => runCommand(resource)
  );

  return disposable;
}

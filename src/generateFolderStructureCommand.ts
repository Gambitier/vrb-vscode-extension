import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { Command } from "./commands";
import { Uri, window } from "vscode";
import { invalidFileNames } from "./utils";
import { createFile } from "./file-helper";
import { AppFileType } from "./appFile";

export function generateFolderStructureCommand() {
  let disposable = vscode.commands.registerCommand(
    Command.generateFolderStructureCommand,
    (resource: Uri) => runCommand(resource)
  );

  return disposable;
}

async function runCommand(resource: Uri) {
  const input = await window.showInputBox({
    placeHolder: "Please enter module name",
  });

  if (input === undefined) {
    return;
  }

  const structure = [
    { dirName: "", files: ["index.ts"] }, // for the root folder
    { dirName: "components", files: ["index.ts"] },
    { dirName: "api", files: ["index.ts"] },
    { dirName: "routes", files: ["index.ts"] },
  ];

  if (!invalidFileNames.test(input)) {
    return createFile({
      name: input,
      type: AppFileType.module,
      associatedArray: "imports",
      uri: resource,
      fullName: input.toLowerCase() + `.module.ts`,
    });
  } else {
    return window.showErrorMessage("Invalid filename");
  }
}

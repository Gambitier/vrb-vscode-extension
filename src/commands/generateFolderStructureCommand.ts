import * as vscode from "vscode";
import { Uri, window } from "vscode";
import { invalidFileNames } from "../utils/appFile";
import { FileNode, generateFilesSync } from "../utils/fileTreeCreator";
import { Command } from "./commands";

export function generateFolderStructureCommand() {
  let disposable = vscode.commands.registerCommand(
    Command.generateFolderStructure,
    (resource: Uri) => runCommand(resource),
  );

  return disposable;
}

async function runCommand(resource: Uri) {
  const input = await window.showInputBox({
    placeHolder: "Please enter feature name",
  });

  if (input === undefined) {
    return;
  }

  if (invalidFileNames.test(input)) {
    return window.showErrorMessage("Invalid feature name");
  }

  const json: FileNode = {
    name: input,
    type: "directory",
    children: [
      {
        // TODO: generate this file with template
        // export * from all directories created
        name: "index.ts",
        type: "file",
      },
      {
        name: "components",
        type: "directory",
        children: [
          {
            name: "index.ts",
            type: "file",
          },
        ],
      },
      {
        name: "routes",
        type: "directory",
        children: [
          {
            // TODO: generate this file with template
            name: "index.tsx",
            type: "file",
          },
        ],
      },
      {
        name: "api",
        type: "directory",
        children: [
          {
            name: "index.ts",
            type: "file",
          },
          {
            name: "types",
            type: "directory",
            children: [
              {
                name: "index.ts",
                type: "file",
              },
            ],
          },
        ],
      },
    ],
  };

  try {
    return generateFilesSync(json, resource.path);
  } catch (err) {
    return window.showErrorMessage("Error creating dir tree");
  }
}

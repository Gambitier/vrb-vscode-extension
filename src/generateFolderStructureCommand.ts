import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { Command } from "./commands";
import { Uri, window } from "vscode";
import { invalidFileNames } from "./utils";
import { createFile } from "./file-helper";
import { AppFileType } from "./nest";

export function generateFolderStructureCommand() {
  let disposable = vscode.commands.registerCommand(
    Command.generateFolderStructureCommand,
    (resource: Uri) => runCommand(resource)
  );

  return disposable;
}

async function runCommand(resource: Uri) {
  return window.showInputBox({
    placeHolder: "Please enter module name",
  })
    .then<any>((input) => {
      if (input === undefined) { return; }
      if (!invalidFileNames.test(input)) {
        return createFile({
          name: input,
          type: AppFileType.module,
          associatedArray: 'imports',
          uri: resource,
          fullName: input.toLowerCase() + `.module.ts`
        });
      }
      else {
        return window.showErrorMessage('Invalid filename');
      }
    });
}

// async function runCommand(resource: Uri) {
//   const input = await window.showInputBox({
//     placeHolder: "Please enter module name",
//   });

//   if (input === undefined) {
//     return;
//   }

//   if (invalidFileNames.test(input)) {
//     return window.showErrorMessage("Invalid filename");
//   }

//   let resp = null;

//   try {
//     resp = createFile({
//       name: input,
//       type: "module",
//       associatedArray: "imports",
//       uri: resource,
//       fullName: input.toLowerCase() + `.module.ts`,
//     });
//   } catch (err) {
//     console.log(err);
//   }

//   return resp;
// }

function generateFolderStructure(folderPath: string) {
  const structure = [
    { name: "components", files: ["index.ts"] },
    { name: "api", files: ["index.ts"] },
    { name: "routes", files: ["index.ts"] },
    { name: "", files: ["index.ts"] }, // for the root folder
  ];

  structure.forEach((item) => {
    const folderName = path.join(folderPath, item.name);
    fs.mkdirSync(folderName);
    item.files.forEach((fileName) => {
      fs.writeFileSync(path.join(folderName, fileName), "");
    });
  });

  vscode.window.showInformationMessage(
    "Folder structure generated successfully."
  );
}

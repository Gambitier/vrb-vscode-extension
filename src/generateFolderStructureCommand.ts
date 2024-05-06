import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { Command } from "./commands";

export function generateFolderStructureCommand() {
  let disposable = vscode.commands.registerCommand(
    Command.generateFolderStructureCommand,
    () => {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (workspaceFolders && workspaceFolders.length > 0) {
        const folderPath = workspaceFolders[0].uri.fsPath; // Assuming you want to generate structure in the first workspace root
        generateFolderStructure(folderPath);
      } else {
        vscode.window.showErrorMessage("No workspace folder found.");
      }
    }
  );

  return disposable;
}

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
